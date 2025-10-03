import axios from 'axios';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache with TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const FMP_KEY = process.env.FMP_API_KEY || '';
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';

interface CompanyData {
  name: string;
  ticker: string;
  description: string;
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  marketCap: number;
  employees: number;
  ceo: string;
  website: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface FinancialData {
  ticker: string;
  currency: string;
  incomeStatement: {
    fiscalYear: string;
    revenue: number;
    grossProfit: number;
    operatingIncome: number;
    netIncome: number;
    eps: number;
    ebitda: number;
  }[];
  balanceSheet: {
    fiscalYear: string;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    cashAndEquivalents: number;
    totalDebt: number;
    currentRatio: number;
  }[];
  keyRatios: {
    peRatio: number;
    pbRatio: number;
    roe: number;
    roa: number;
    debtToEquity: number;
    currentRatio: number;
    profitMargin: number;
  };
}

interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdate: string;
}

interface WatchlistData {
  name: string;
  items: WatchlistItem[];
  lastUpdate: string;
}

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
}

interface NewsData {
  ticker: string;
  articles: NewsArticle[];
  totalResults: number;
}

interface TechnicalIndicators {
  sma20?: number[];
  sma50?: number[];
  ema20?: number[];
  rsi?: number[];
  macd?: {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
}

/**
 * Calculate Simple Moving Average
 */
const calculateSMA = (data: number[], period: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  return result;
};

/**
 * Calculate Exponential Moving Average
 */
const calculateEMA = (data: number[], period: number): number[] => {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (data[i] - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  return result;
};

/**
 * Calculate Relative Strength Index (RSI)
 */
const calculateRSI = (data: number[], period: number = 14): number[] => {
  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  
  result.push(NaN); // First value has no RSI
  
  for (let i = 0; i < gains.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        result.push(rsi);
      }
    }
  }
  
  return result;
};

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
const calculateMACD = (data: number[]): { macd: number[]; signal: number[]; histogram: number[] } => {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  const macd: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (isNaN(ema12[i]) || isNaN(ema26[i])) {
      macd.push(NaN);
    } else {
      macd.push(ema12[i] - ema26[i]);
    }
  }
  
  const signal = calculateEMA(macd.filter(v => !isNaN(v)), 9);
  const fullSignal: number[] = [];
  let signalIndex = 0;
  
  for (let i = 0; i < macd.length; i++) {
    if (isNaN(macd[i]) || signalIndex >= signal.length || isNaN(signal[signalIndex])) {
      fullSignal.push(NaN);
    } else {
      fullSignal.push(signal[signalIndex]);
      signalIndex++;
    }
  }
  
  const histogram: number[] = [];
  for (let i = 0; i < macd.length; i++) {
    if (isNaN(macd[i]) || isNaN(fullSignal[i])) {
      histogram.push(NaN);
    } else {
      histogram.push(macd[i] - fullSignal[i]);
    }
  }
  
  return { macd, signal: fullSignal, histogram };
};

/**
 * Get company overview and description
 */
export const getCompanyOverview = async (ticker: string): Promise<CompanyData> => {
  const cacheKey = `overview_${ticker}`;
  const cached = cache.get<CompanyData>(cacheKey);
  
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  try {
    // Try Alpha Vantage first
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await axios.get(url);

    if (response.data.Note) {
      throw new Error('API rate limit reached. Please try again later.');
    }

    if (!response.data.Symbol) {
      throw new Error(`No data found for ticker: ${ticker}`);
    }

    const data: CompanyData = {
      name: response.data.Name || ticker,
      ticker: ticker.toUpperCase(),
      description: response.data.Description || 'No description available',
      exchange: response.data.Exchange || 'N/A',
      sector: response.data.Sector || 'N/A',
      industry: response.data.Industry || 'N/A',
      country: response.data.Country || 'N/A',
      marketCap: parseInt(response.data.MarketCapitalization) || 0,
      employees: parseInt(response.data.FullTimeEmployees) || 0,
      ceo: 'N/A',
      website: response.data.OfficialSite || 'N/A',
    };

    // Try to get current price
    try {
      const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
      const quoteResponse = await axios.get(quoteUrl);
      
      if (quoteResponse.data['Global Quote']) {
        const quote = quoteResponse.data['Global Quote'];
        data.price = parseFloat(quote['05. price']);
        data.change = parseFloat(quote['09. change']);
        data.changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
    }

    cache.set(cacheKey, data);
    return data;

  } catch (error: any) {
    console.error(`Error fetching overview for ${ticker}:`, error.message);
    
    // Check if it's a network error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('Network error detected, using mock data');
    }
    
    // Return mock data for demo purposes (with warning in console)
    console.log(`Returning mock data for ${ticker} (Demo Mode)`);
    return getMockCompanyData(ticker);
  }
};

/**
 * Get historical price data with technical indicators
 */
export const getHistoricalPrices = async (ticker: string, days: string = '30', includeIndicators: boolean = false): Promise<{ prices: PriceData[]; indicators?: TechnicalIndicators }> => {
  const cacheKey = `prices_${ticker}_${days}_${includeIndicators}`;
  const cached = cache.get<{ prices: PriceData[]; indicators?: TechnicalIndicators }>(cacheKey);
  
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await axios.get(url);

    if (response.data.Note) {
      throw new Error('API rate limit reached. Please try again later.');
    }

    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries) {
      throw new Error(`No price data found for ticker: ${ticker}`);
    }

    const prices: PriceData[] = Object.entries(timeSeries)
      .slice(0, parseInt(days))
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }))
      .reverse();

    const result: { prices: PriceData[]; indicators?: TechnicalIndicators } = { prices };

    // Calculate technical indicators if requested
    if (includeIndicators && prices.length > 0) {
      const closePrices = prices.map(p => p.close);
      
      result.indicators = {
        sma20: calculateSMA(closePrices, 20),
        sma50: calculateSMA(closePrices, 50),
        ema20: calculateEMA(closePrices, 20),
        rsi: calculateRSI(closePrices, 14),
        macd: calculateMACD(closePrices),
      };
    }

    cache.set(cacheKey, result);
    return result;

  } catch (error: any) {
    console.error(`Error fetching prices for ${ticker}:`, error.message);
    
    // Check if it's a network error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('Network error detected, using mock price data');
    }
    
    // Return mock data for demo purposes
    console.log(`Returning mock price data for ${ticker} (Demo Mode)`);
    return getMockPriceData(ticker, parseInt(days), includeIndicators);
  }
};

/**
 * Mock data generator for demo/testing
 */
const getMockCompanyData = (ticker: string): CompanyData => {
  const mockData: Record<string, Partial<CompanyData>> = {
    'AAPL': {
      name: 'Apple Inc.',
      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      marketCap: 3000000000000,
      employees: 164000,
      ceo: 'Tim Cook',
      price: 185.92,
      change: 2.34,
      changePercent: 1.27,
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
      sector: 'Technology',
      industry: 'Software',
      marketCap: 2800000000000,
      employees: 221000,
      ceo: 'Satya Nadella',
      price: 378.91,
      change: -1.23,
      changePercent: -0.32,
    },
    'TSLA': {
      name: 'Tesla, Inc.',
      description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers',
      marketCap: 700000000000,
      employees: 127855,
      ceo: 'Elon Musk',
      price: 242.84,
      change: 5.67,
      changePercent: 2.39,
    },
  };

  const base = mockData[ticker.toUpperCase()] || {};
  
  return {
    name: base.name || `${ticker.toUpperCase()} Corporation`,
    ticker: ticker.toUpperCase(),
    description: base.description || `Mock description for ${ticker}`,
    exchange: 'NASDAQ',
    sector: base.sector || 'Technology',
    industry: base.industry || 'Software',
    country: 'United States',
    marketCap: base.marketCap || 100000000000,
    employees: base.employees || 50000,
    ceo: base.ceo || 'John Doe',
    website: `https://www.${ticker.toLowerCase()}.com`,
    price: base.price || 100.00,
    change: base.change || 0,
    changePercent: base.changePercent || 0,
  };
};

const getMockPriceData = (ticker: string, days: number, includeIndicators: boolean = false): { prices: PriceData[]; indicators?: TechnicalIndicators } => {
  const prices: PriceData[] = [];
  const basePrice = 100;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const randomWalk = (Math.random() - 0.5) * 5;
    const price = basePrice + randomWalk + (Math.sin(i / 5) * 3);
    
    prices.push({
      date: date.toISOString().split('T')[0],
      open: price - Math.random(),
      high: price + Math.random() * 2,
      low: price - Math.random() * 2,
      close: price,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }

  const result: { prices: PriceData[]; indicators?: TechnicalIndicators } = { prices };

  // Calculate technical indicators if requested
  if (includeIndicators && prices.length > 0) {
    const closePrices = prices.map(p => p.close);
    
    result.indicators = {
      sma20: calculateSMA(closePrices, 20),
      sma50: calculateSMA(closePrices, 50),
      ema20: calculateEMA(closePrices, 20),
      rsi: calculateRSI(closePrices, 14),
      macd: calculateMACD(closePrices),
    };
  }

  return result;
};

/**
 * Get financial statements and key ratios
 */
export const getFinancialStatements = async (ticker: string): Promise<FinancialData> => {
  const cacheKey = `financials_${ticker}`;
  const cached = cache.get<FinancialData>(cacheKey);
  
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  try {
    // Fetch Income Statement
    const incomeUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const incomeResponse = await axios.get(incomeUrl);

    if (incomeResponse.data.Note) {
      throw new Error('API rate limit reached. Please try again later.');
    }

    if (!incomeResponse.data.symbol) {
      throw new Error(`No financial data found for ticker: ${ticker}`);
    }

    // Fetch Balance Sheet
    const balanceUrl = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const balanceResponse = await axios.get(balanceUrl);

    // Parse Income Statement (last 5 years)
    const incomeStatements = incomeResponse.data.annualReports?.slice(0, 5).map((report: any) => ({
      fiscalYear: report.fiscalDateEnding,
      revenue: parseInt(report.totalRevenue || '0'),
      grossProfit: parseInt(report.grossProfit || '0'),
      operatingIncome: parseInt(report.operatingIncome || '0'),
      netIncome: parseInt(report.netIncome || '0'),
      eps: parseFloat(report.eps || '0'),
      ebitda: parseInt(report.ebitda || '0'),
    })) || [];

    // Parse Balance Sheet (last 5 years)
    const balanceSheets = balanceResponse.data.annualReports?.slice(0, 5).map((report: any) => {
      const totalAssets = parseInt(report.totalAssets || '0');
      const totalLiabilities = parseInt(report.totalLiabilities || '0');
      const currentAssets = parseInt(report.totalCurrentAssets || '0');
      const currentLiabilities = parseInt(report.totalCurrentLiabilities || '0');
      
      return {
        fiscalYear: report.fiscalDateEnding,
        totalAssets,
        totalLiabilities,
        totalEquity: totalAssets - totalLiabilities,
        cashAndEquivalents: parseInt(report.cashAndCashEquivalentsAtCarryingValue || '0'),
        totalDebt: parseInt(report.shortLongTermDebtTotal || report.longTermDebt || '0'),
        currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
      };
    }) || [];

    // Calculate key ratios (from most recent data)
    const latestIncome = incomeStatements[0];
    const latestBalance = balanceSheets[0];
    
    // Get current price for P/E calculation
    let currentPrice = 100; // default
    try {
      const overview = await getCompanyOverview(ticker);
      currentPrice = overview.price || 100;
    } catch (e) {
      console.log('Could not fetch current price for ratios');
    }

    const keyRatios = {
      peRatio: latestIncome?.eps ? currentPrice / latestIncome.eps : 0,
      pbRatio: latestBalance?.totalEquity ? (currentPrice * 1000000000) / latestBalance.totalEquity : 0, // Approximate
      roe: latestBalance?.totalEquity && latestIncome?.netIncome 
        ? (latestIncome.netIncome / latestBalance.totalEquity) * 100 : 0,
      roa: latestBalance?.totalAssets && latestIncome?.netIncome
        ? (latestIncome.netIncome / latestBalance.totalAssets) * 100 : 0,
      debtToEquity: latestBalance?.totalEquity && latestBalance?.totalDebt
        ? (latestBalance.totalDebt / latestBalance.totalEquity) * 100 : 0,
      currentRatio: latestBalance?.currentRatio || 0,
      profitMargin: latestIncome?.revenue && latestIncome?.netIncome
        ? (latestIncome.netIncome / latestIncome.revenue) * 100 : 0,
    };

    const data: FinancialData = {
      ticker: ticker.toUpperCase(),
      currency: 'USD',
      incomeStatement: incomeStatements,
      balanceSheet: balanceSheets,
      keyRatios,
    };

    cache.set(cacheKey, data);
    return data;

  } catch (error: any) {
    console.error(`Error fetching financials for ${ticker}:`, error.message);
    
    // Check if it's a network error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('Network error detected, using mock financial data');
    }
    
    // Return mock data for demo purposes
    console.log(`Returning mock financial data for ${ticker} (Demo Mode)`);
    return getMockFinancialData(ticker);
  }
};

const getMockFinancialData = (ticker: string): FinancialData => {
  const currentYear = new Date().getFullYear();
  
  return {
    ticker: ticker.toUpperCase(),
    currency: 'USD',
    incomeStatement: [
      {
        fiscalYear: `${currentYear - 1}`,
        revenue: 394328000000,
        grossProfit: 169148000000,
        operatingIncome: 114301000000,
        netIncome: 96995000000,
        eps: 6.13,
        ebitda: 130541000000,
      },
      {
        fiscalYear: `${currentYear - 2}`,
        revenue: 365817000000,
        grossProfit: 152836000000,
        operatingIncome: 108949000000,
        netIncome: 94680000000,
        eps: 5.61,
        ebitda: 120233000000,
      },
      {
        fiscalYear: `${currentYear - 3}`,
        revenue: 274515000000,
        grossProfit: 104956000000,
        operatingIncome: 66288000000,
        netIncome: 57411000000,
        eps: 3.28,
        ebitda: 77344000000,
      },
      {
        fiscalYear: `${currentYear - 4}`,
        revenue: 260174000000,
        grossProfit: 98392000000,
        operatingIncome: 63930000000,
        netIncome: 55256000000,
        eps: 3.00,
        ebitda: 76477000000,
      },
      {
        fiscalYear: `${currentYear - 5}`,
        revenue: 229234000000,
        grossProfit: 88186000000,
        operatingIncome: 61344000000,
        netIncome: 48351000000,
        eps: 2.58,
        ebitda: 73365000000,
      },
    ],
    balanceSheet: [
      {
        fiscalYear: `${currentYear - 1}`,
        totalAssets: 352755000000,
        totalLiabilities: 290437000000,
        totalEquity: 62318000000,
        cashAndEquivalents: 29965000000,
        totalDebt: 111088000000,
        currentRatio: 0.98,
      },
      {
        fiscalYear: `${currentYear - 2}`,
        totalAssets: 323888000000,
        totalLiabilities: 258549000000,
        totalEquity: 65339000000,
        cashAndEquivalents: 48304000000,
        totalDebt: 120069000000,
        currentRatio: 1.04,
      },
      {
        fiscalYear: `${currentYear - 3}`,
        totalAssets: 338516000000,
        totalLiabilities: 258578000000,
        totalEquity: 79938000000,
        cashAndEquivalents: 38016000000,
        totalDebt: 112436000000,
        currentRatio: 1.36,
      },
      {
        fiscalYear: `${currentYear - 4}`,
        totalAssets: 365725000000,
        totalLiabilities: 258578000000,
        totalEquity: 107147000000,
        cashAndEquivalents: 25913000000,
        totalDebt: 91807000000,
        currentRatio: 1.54,
      },
      {
        fiscalYear: `${currentYear - 5}`,
        totalAssets: 375319000000,
        totalLiabilities: 241272000000,
        totalEquity: 134047000000,
        cashAndEquivalents: 20289000000,
        totalDebt: 87032000000,
        currentRatio: 1.35,
      },
    ],
    keyRatios: {
      peRatio: 30.34,
      pbRatio: 48.12,
      roe: 155.67,
      roa: 27.50,
      debtToEquity: 178.25,
      currentRatio: 0.98,
      profitMargin: 24.60,
    },
  };
};

/**
 * Watchlist Management
 */
const WATCHLIST_FILE = path.resolve(__dirname, '../../../data/watchlist.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(WATCHLIST_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load watchlist from file
const loadWatchlist = (): string[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(WATCHLIST_FILE)) {
      const data = fs.readFileSync(WATCHLIST_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading watchlist:', error);
  }
  return ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN']; // Default watchlist
};

// Save watchlist to file
const saveWatchlist = (tickers: string[]): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(WATCHLIST_FILE, JSON.stringify(tickers, null, 2));
  } catch (error) {
    console.error('Error saving watchlist:', error);
  }
};

export const getWatchlist = async (): Promise<WatchlistData> => {
  const tickers = loadWatchlist();
  const items: WatchlistItem[] = [];

  // Fetch current data for each ticker
  for (const ticker of tickers) {
    try {
      const overview = await getCompanyOverview(ticker);
      items.push({
        ticker: overview.ticker,
        name: overview.name,
        price: overview.price || 0,
        change: overview.change || 0,
        changePercent: overview.changePercent || 0,
        volume: 0, // Can be enhanced later
        lastUpdate: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Error fetching watchlist data for ${ticker}:`, error);
      // Add with mock data
      items.push({
        ticker: ticker,
        name: `${ticker} Corporation`,
        price: 100 + Math.random() * 100,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 10000000),
        lastUpdate: new Date().toISOString(),
      });
    }
  }

  return {
    name: 'My Watchlist',
    items,
    lastUpdate: new Date().toISOString(),
  };
};

export const addToWatchlist = async (ticker: string): Promise<{ success: boolean; message: string }> => {
  const tickers = loadWatchlist();
  const tickerUpper = ticker.toUpperCase();

  if (tickers.includes(tickerUpper)) {
    return { success: false, message: `${tickerUpper} is already in watchlist` };
  }

  tickers.push(tickerUpper);
  saveWatchlist(tickers);
  return { success: true, message: `${tickerUpper} added to watchlist` };
};

export const removeFromWatchlist = async (ticker: string): Promise<{ success: boolean; message: string }> => {
  const tickers = loadWatchlist();
  const tickerUpper = ticker.toUpperCase();
  const index = tickers.indexOf(tickerUpper);

  if (index === -1) {
    return { success: false, message: `${tickerUpper} not found in watchlist` };
  }

  tickers.splice(index, 1);
  saveWatchlist(tickers);
  return { success: true, message: `${tickerUpper} removed from watchlist` };
};

/**
 * News API Integration
 */
export const getNews = async (ticker: string): Promise<NewsData> => {
  const cacheKey = `news_${ticker}`;
  const cached = cache.get<NewsData>(cacheKey);
  
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  try {
    // Get company name for better search
    const overview = await getCompanyOverview(ticker);
    const companyName = overview.name;

    if (NEWS_API_KEY && NEWS_API_KEY !== '') {
      // Use NewsAPI if key is available
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(companyName)}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;
      const response = await axios.get(url);

      if (response.data.articles) {
        const articles: NewsArticle[] = response.data.articles.map((article: any) => ({
          title: article.title,
          description: article.description || '',
          source: article.source.name,
          url: article.url,
          publishedAt: article.publishedAt,
          imageUrl: article.urlToImage,
        }));

        const data: NewsData = {
          ticker: ticker.toUpperCase(),
          articles,
          totalResults: response.data.totalResults || articles.length,
        };

        cache.set(cacheKey, data);
        return data;
      }
    }

    // Fallback to mock news
    return getMockNews(ticker, companyName);

  } catch (error: any) {
    console.error(`Error fetching news for ${ticker}:`, error.message);
    const overview = await getCompanyOverview(ticker);
    return getMockNews(ticker, overview.name);
  }
};

const getMockNews = (ticker: string, companyName: string): NewsData => {
  const now = new Date();
  
  return {
    ticker: ticker.toUpperCase(),
    articles: [
      {
        title: `${companyName} Reports Strong Q3 Earnings, Beats Expectations`,
        description: `${companyName} announced quarterly results that exceeded analyst expectations, driven by strong revenue growth and operational efficiency.`,
        source: 'Financial Times',
        url: `https://example.com/news/${ticker.toLowerCase()}-earnings`,
        publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: `Analysts Upgrade ${companyName} Stock to 'Buy'`,
        description: `Major investment firms have upgraded their rating on ${companyName}, citing strong fundamentals and growth prospects.`,
        source: 'Bloomberg',
        url: `https://example.com/news/${ticker.toLowerCase()}-upgrade`,
        publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: `${companyName} Announces New Product Launch`,
        description: `The company unveiled its latest innovation, expected to drive significant revenue growth in the coming quarters.`,
        source: 'Reuters',
        url: `https://example.com/news/${ticker.toLowerCase()}-product`,
        publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: `${companyName} CEO Discusses Future Strategy`,
        description: `In a recent interview, the CEO outlined the company's vision for the next five years and key strategic initiatives.`,
        source: 'CNBC',
        url: `https://example.com/news/${ticker.toLowerCase()}-strategy`,
        publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: `Market Watch: ${companyName} Stock Analysis`,
        description: `Detailed technical and fundamental analysis of ${companyName}'s recent stock performance and future outlook.`,
        source: 'MarketWatch',
        url: `https://example.com/news/${ticker.toLowerCase()}-analysis`,
        publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    totalResults: 5,
  };
};

/**
 * Equity Screener Interfaces
 */
interface ScreenerFilters {
  minMarketCap?: number;
  maxMarketCap?: number;
  minPE?: number;
  maxPE?: number;
  sector?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

interface ScreenerResult {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  sector: string;
  volume: number;
}

interface ScreenerData {
  results: ScreenerResult[];
  totalResults: number;
  filters: ScreenerFilters;
}

/**
 * Equity Screener - Filter stocks by criteria
 */
export const screenEquities = async (filters: ScreenerFilters): Promise<ScreenerData> => {
  const cacheKey = `screener_${JSON.stringify(filters)}`;
  const cached = cache.get<ScreenerData>(cacheKey);
  
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  // For demo purposes, return mock data
  // In production, this would query a stock database or API
  const mockResults = getMockScreenerResults(filters);
  
  const result: ScreenerData = {
    results: mockResults,
    totalResults: mockResults.length,
    filters,
  };

  cache.set(cacheKey, result);
  return result;
};

const getMockScreenerResults = (filters: ScreenerFilters): ScreenerResult[] => {
  const stocks: ScreenerResult[] = [
    { ticker: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.34, changePercent: 1.27, marketCap: 3000000000000, peRatio: 31.5, sector: 'Technology', volume: 50000000 },
    { ticker: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: -1.20, changePercent: -0.32, marketCap: 2800000000000, peRatio: 35.2, sector: 'Technology', volume: 28000000 },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 142.50, change: 0.85, changePercent: 0.60, marketCap: 1800000000000, peRatio: 26.8, sector: 'Technology', volume: 22000000 },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 175.30, change: 3.10, changePercent: 1.80, marketCap: 1700000000000, peRatio: 65.4, sector: 'Consumer Cyclical', volume: 45000000 },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -5.40, changePercent: -2.17, marketCap: 770000000000, peRatio: 75.2, sector: 'Consumer Cyclical', volume: 95000000 },
    { ticker: 'META', name: 'Meta Platforms Inc.', price: 485.20, change: 8.50, changePercent: 1.78, marketCap: 1200000000000, peRatio: 28.4, sector: 'Technology', volume: 18000000 },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 495.22, change: 12.30, changePercent: 2.55, marketCap: 1200000000000, peRatio: 85.6, sector: 'Technology', volume: 42000000 },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', price: 158.75, change: -0.50, changePercent: -0.31, marketCap: 460000000000, peRatio: 11.2, sector: 'Financial Services', volume: 10000000 },
    { ticker: 'JNJ', name: 'Johnson & Johnson', price: 162.30, change: 1.20, changePercent: 0.74, marketCap: 390000000000, peRatio: 24.5, sector: 'Healthcare', volume: 8000000 },
    { ticker: 'V', name: 'Visa Inc.', price: 265.80, change: 2.10, changePercent: 0.80, marketCap: 540000000000, peRatio: 32.8, sector: 'Financial Services', volume: 7000000 },
    { ticker: 'WMT', name: 'Walmart Inc.', price: 168.50, change: 0.75, changePercent: 0.45, marketCap: 450000000000, peRatio: 28.9, sector: 'Consumer Defensive', volume: 9000000 },
    { ticker: 'PG', name: 'Procter & Gamble Co.', price: 156.40, change: -0.30, changePercent: -0.19, marketCap: 370000000000, peRatio: 25.3, sector: 'Consumer Defensive', volume: 6000000 },
    { ticker: 'DIS', name: 'Walt Disney Co.', price: 92.75, change: 1.85, changePercent: 2.04, marketCap: 170000000000, peRatio: 42.1, sector: 'Communication Services', volume: 12000000 },
    { ticker: 'NFLX', name: 'Netflix Inc.', price: 485.30, change: -3.20, changePercent: -0.66, marketCap: 210000000000, peRatio: 45.7, sector: 'Communication Services', volume: 8500000 },
    { ticker: 'BA', name: 'Boeing Co.', price: 186.25, change: 2.50, changePercent: 1.36, marketCap: 120000000000, peRatio: -15.2, sector: 'Industrials', volume: 11000000 },
  ];

  let filtered = stocks;

  // Apply filters
  if (filters.minMarketCap) {
    filtered = filtered.filter(s => s.marketCap >= filters.minMarketCap!);
  }
  if (filters.maxMarketCap) {
    filtered = filtered.filter(s => s.marketCap <= filters.maxMarketCap!);
  }
  if (filters.minPE) {
    filtered = filtered.filter(s => s.peRatio >= filters.minPE! && s.peRatio > 0);
  }
  if (filters.maxPE) {
    filtered = filtered.filter(s => s.peRatio <= filters.maxPE! && s.peRatio > 0);
  }
  if (filters.sector) {
    filtered = filtered.filter(s => s.sector === filters.sector);
  }
  if (filters.minPrice) {
    filtered = filtered.filter(s => s.price >= filters.minPrice!);
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(s => s.price <= filters.maxPrice!);
  }

  // Sort results
  if (filters.sortBy) {
    const sortKey = filters.sortBy as keyof ScreenerResult;
    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return filters.sortDirection === 'desc' 
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }
      
      const comparison = (aVal as number) - (bVal as number);
      return filters.sortDirection === 'desc' ? -comparison : comparison;
    });
  }

  return filtered;
};

/**
 * SEC Filings Interfaces
 */
interface SECFiling {
  type: string;
  date: string;
  description: string;
  url: string;
}

interface FilingsData {
  ticker: string;
  companyName: string;
  filings: SECFiling[];
  totalFilings: number;
}

/**
 * Get SEC filings for a company
 */
export const getSECFilings = async (ticker: string): Promise<FilingsData> => {
  const cacheKey = `filings_${ticker}`;
  const cached = cache.get<FilingsData>(cacheKey);
  
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  try {
    // In production, would query SEC EDGAR API
    // For now, return mock data
    const overview = await getCompanyOverview(ticker);
    const result = getMockFilings(ticker, overview.name);
    
    cache.set(cacheKey, result);
    return result;
  } catch (error: any) {
    console.error(`Error fetching filings for ${ticker}:`, error.message);
    return getMockFilings(ticker, ticker.toUpperCase());
  }
};

const getMockFilings = (ticker: string, companyName: string): FilingsData => {
  const now = new Date();
  
  return {
    ticker: ticker.toUpperCase(),
    companyName,
    filings: [
      {
        type: '10-K',
        date: new Date(now.getFullYear(), 2, 15).toISOString().split('T')[0],
        description: 'Annual Report',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=10-K`,
      },
      {
        type: '10-Q',
        date: new Date(now.getFullYear(), 10, 5).toISOString().split('T')[0],
        description: 'Quarterly Report (Q3)',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=10-Q`,
      },
      {
        type: '10-Q',
        date: new Date(now.getFullYear(), 7, 5).toISOString().split('T')[0],
        description: 'Quarterly Report (Q2)',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=10-Q`,
      },
      {
        type: '10-Q',
        date: new Date(now.getFullYear(), 4, 5).toISOString().split('T')[0],
        description: 'Quarterly Report (Q1)',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=10-Q`,
      },
      {
        type: '8-K',
        date: new Date(now.getFullYear(), 9, 20).toISOString().split('T')[0],
        description: 'Current Report - Material Event',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=8-K`,
      },
      {
        type: '8-K',
        date: new Date(now.getFullYear(), 8, 15).toISOString().split('T')[0],
        description: 'Current Report - Leadership Change',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=8-K`,
      },
      {
        type: 'DEF 14A',
        date: new Date(now.getFullYear(), 3, 1).toISOString().split('T')[0],
        description: 'Proxy Statement',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=DEF+14A`,
      },
      {
        type: '4',
        date: new Date(now.getFullYear(), 10, 12).toISOString().split('T')[0],
        description: 'Insider Trading - Form 4',
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=4`,
      },
    ],
    totalFilings: 8,
  };
};
