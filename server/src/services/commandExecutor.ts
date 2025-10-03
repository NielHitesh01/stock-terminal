import { getCompanyOverview, getHistoricalPrices, getFinancialStatements, getWatchlist, getNews, addToWatchlist, removeFromWatchlist, screenEquities, getSECFilings } from './dataProviders.js';

export interface FunctionHandler {
  (ticker: string, params?: any): Promise<any>;
}

const functions: Record<string, FunctionHandler> = {
  DES: async (ticker: string) => {
    return await getCompanyOverview(ticker);
  },

  GIP: async (ticker: string, params?: any) => {
    // Check if user wants technical indicators
    const includeIndicators = params?.indicators !== false; // Default to true
    return await getHistoricalPrices(ticker, '90', includeIndicators);
  },

  FA: async (ticker: string) => {
    return await getFinancialStatements(ticker);
  },

  W: async () => {
    return await getWatchlist();
  },

  N: async (ticker: string) => {
    return await getNews(ticker);
  },

  HELP: async () => {
    return getHelpData();
  },

  EQS: async (_ticker: string, params?: any) => {
    // Equity screener doesn't require a ticker
    const filters = params || {};
    return await screenEquities(filters);
  },

  FIL: async (ticker: string) => {
    return await getSECFilings(ticker);
  },

  SCH: async (ticker: string) => {
    // Supply Chain - handled by separate endpoint
    // This is a placeholder that returns instruction to use the SCH panel
    return {
      message: 'Supply Chain Diagram',
      ticker: ticker,
      note: 'This function displays a visual supply chain diagram'
    };
  },

  OPT: async (ticker: string) => {
    // Options Chain - handled by separate endpoint
    // This is a placeholder that returns instruction to use the OPT panel
    return {
      message: 'Options Chain',
      ticker: ticker,
      note: 'This function displays options chain with Greeks calculations'
    };
  },
};

function getHelpData() {
  return {
    title: 'TERMINAL-A Command Reference',
    version: '1.0.0',
    commands: [
      {
        mnemonic: 'DES',
        name: 'Description',
        description: 'Display comprehensive company description and overview',
        usage: '<TICKER> DES',
        examples: ['AAPL DES', 'MSFT DES', 'TSLA DES'],
        category: 'Company Analysis',
        features: [
          'Company name and description',
          'Sector and industry classification',
          'Market capitalization',
          'Current price and daily change',
          'Employee count and CEO information',
          'Exchange and website'
        ]
      },
      {
        mnemonic: 'GIP',
        name: 'Graph/Historical Prices',
        description: 'Display interactive historical price chart with technical indicators',
        usage: '<TICKER> GIP',
        examples: ['AAPL GIP', 'GOOGL GIP', 'AMZN GIP'],
        category: 'Price Analysis',
        features: [
          '90-day price history',
          'Technical indicators (SMA 20/50, EMA 20)',
          'RSI (Relative Strength Index)',
          'MACD (Moving Average Convergence Divergence)',
          'Interactive hover tooltips',
          'High, low, and current price',
          'Export price data to CSV'
        ]
      },
      {
        mnemonic: 'FA',
        name: 'Financial Analysis',
        description: 'Display comprehensive financial statements and key ratios',
        usage: '<TICKER> FA',
        examples: ['AAPL FA', 'MSFT FA', 'JPM FA'],
        category: 'Financial Analysis',
        features: [
          'Income Statement (5-year)',
          'Balance Sheet (5-year)',
          'Key financial ratios',
          'P/E, P/B, ROE, ROA metrics',
          'Debt and liquidity ratios',
          'Profit margins'
        ]
      },
      {
        mnemonic: 'W',
        name: 'Watchlist',
        description: 'Display and manage custom watchlist with real-time prices',
        usage: 'W',
        examples: ['W'],
        category: 'Market Monitoring',
        features: [
          'View all watchlist tickers',
          'Current prices and daily changes',
          'Color-coded gains/losses',
          'Add/remove tickers',
          'Persistent storage',
          'Quick-load to other panels'
        ]
      },
      {
        mnemonic: 'N',
        name: 'News Sentiment Analysis',
        description: 'Display news articles with AI-powered sentiment analysis and price impact tracking',
        usage: '<TICKER> N',
        examples: ['AAPL N', 'TSLA N', 'NVDA N', 'GOOGL N'],
        category: 'Market Monitoring',
        features: [
          'Real-time news feed with sentiment scores',
          'Positive/Negative/Neutral classification',
          'Impact score (0-100) for each article',
          'Price impact tracking ($ and % change)',
          'Source credibility ratings',
          'Filter by sentiment (Positive/Negative/Neutral)',
          'Category badges (Earnings, Analyst, Regulatory, Product, Market)',
          'Keyword tags for quick scanning',
          'Timeframe filtering (1h, 24h, 7d, 30d)',
          'Summary statistics (total articles, avg sentiment, avg impact)',
          'Color-coded cards (green=positive, red=negative, yellow=neutral)',
          'Click to read full article'
        ]
      },
      {
        mnemonic: 'EQS',
        name: 'Equity Screener',
        description: 'Screen and filter stocks by financial criteria',
        usage: 'EQS',
        examples: ['EQS'],
        category: 'Market Analysis',
        features: [
          'Filter by market cap, P/E, sector',
          'Price range filtering',
          'Sortable columns',
          'Export results to CSV',
          '15+ stocks in database',
          'Real-time screening'
        ]
      },
      {
        mnemonic: 'FIL',
        name: 'SEC Filings',
        description: 'Access SEC regulatory filings and documents',
        usage: '<TICKER> FIL',
        examples: ['AAPL FIL', 'MSFT FIL', 'TSLA FIL'],
        category: 'Compliance',
        features: [
          'View 10-K annual reports',
          'View 10-Q quarterly reports',
          'View 8-K current reports',
          'Access proxy statements (DEF 14A)',
          'Insider trading forms (Form 4)',
          'Direct links to SEC.gov'
        ]
      },
      {
        mnemonic: 'PORT',
        name: 'Portfolio Tracker',
        description: 'Track your stock holdings with real-time P/L calculations',
        usage: 'PORT',
        examples: ['PORT'],
        category: 'Portfolio Management',
        features: [
          'Add/edit/delete holdings',
          'Real-time price updates',
          'Profit/Loss tracking ($ and %)',
          'Day change tracking',
          'Portfolio allocation pie chart',
          'Summary statistics (total value, cost, gain/loss)',
          'Export to CSV',
          'LocalStorage persistence',
          'Cost basis tracking',
          'Purchase date tracking'
        ]
      },
      {
        mnemonic: 'COMP',
        name: 'Stock Comparison',
        description: 'Compare multiple stocks side-by-side with normalized charts and correlation analysis',
        usage: 'COMP',
        examples: ['COMP'],
        category: 'Market Analysis',
        features: [
          'Compare up to 6 stocks simultaneously',
          'Normalized performance chart (% change)',
          'Side-by-side metrics comparison',
          'Price correlation matrix',
          'Real-time price updates',
          'Market cap, P/E, volume comparison',
          '52-week high/low tracking',
          'Color-coded stock cards',
          'Easy add/remove tickers',
          'Correlation strength indicators (strong/moderate/weak)'
        ]
      },
      {
        mnemonic: 'CAL',
        name: 'Economic Calendar',
        description: 'Track upcoming earnings, Fed meetings, and economic data releases with countdown timers',
        usage: 'CAL',
        examples: ['CAL'],
        category: 'Market Monitoring',
        features: [
          'Monthly calendar view',
          'Upcoming earnings with countdown timers',
          'Federal Reserve FOMC meetings',
          'Economic data releases (CPI, NFP, GDP, etc.)',
          'Filter by importance (high/medium/low)',
          'Filter by type (earnings/fed/economic)',
          'List and calendar view modes',
          'Event details (estimate vs previous)',
          'Time until event display',
          'Color-coded importance indicators',
          'Navigate months (prev/next/today)',
          'Event descriptions and context'
        ]
      },
      {
        mnemonic: 'HEAT',
        name: 'Sector Heatmap',
        description: 'Visual heatmap of all market sectors with color-coded performance',
        usage: 'HEAT',
        examples: ['HEAT'],
        category: 'Market Monitoring',
        features: [
          '11 market sectors (Technology, Healthcare, Financial, etc.)',
          'Color-coded performance (green = positive, red = negative)',
          'Performance gradient (dark red to dark green)',
          'Market cap weighting',
          'Heatmap and list view modes',
          'Sort by performance, market cap, or volume',
          'Drill-down to sector holdings',
          'Top 5 stocks per sector',
          'Real-time sector performance',
          'Day change tracking',
          'Sector statistics (avg performance, positive count)',
          'Hover for detailed metrics',
          'Click to view sector breakdown'
        ]
      },
      {
        mnemonic: 'ALERT',
        name: 'Alert Manager',
        description: 'Create price, volume, and technical alerts with sound and browser notifications',
        usage: 'ALERT',
        examples: ['ALERT'],
        category: 'Trading Tools',
        features: [
          'Multiple alert conditions (price, percent change, volume, RSI)',
          'Price above/below threshold alerts',
          'Percent change alerts (absolute)',
          'Volume spike detection',
          'RSI overbought/oversold alerts',
          'Sound notifications (4 sound types: beep, chime, bell, alert)',
          'Browser push notifications',
          'Real-time monitoring (10-second intervals)',
          'Alert history log (last 100 triggers)',
          'Enable/disable individual alerts',
          'Toggle sound per alert',
          'Toggle browser notifications per alert',
          'Trigger count tracking',
          'Last triggered timestamp',
          'localStorage persistence',
          'Test sounds before creating alerts'
        ]
      },
      {
        mnemonic: 'HELP',
        name: 'Help & Documentation',
        description: 'Display this help reference guide',
        usage: 'HELP',
        examples: ['HELP'],
        category: 'System',
        features: [
          'Complete command reference',
          'Usage examples',
          'Feature descriptions',
          'Keyboard shortcuts'
        ]
      }
    ],
    shortcuts: [
      { keys: 'Ctrl+1/2/3/4', description: 'Switch to Panel 1/2/3/4' },
      { keys: 'Ctrl+H', description: 'Toggle command line input' },
      { keys: '↑/↓ Arrow', description: 'Navigate command history' },
      { keys: 'Enter', description: 'Execute command (<GO>)' },
      { keys: 'Esc', description: 'Clear current input' }
    ],
    tips: [
      'Use the search bar to find tickers quickly',
      'Click quick access buttons for common tickers',
      'Each panel operates independently',
      'Commands are case-insensitive',
      'Data is cached for 5 minutes to optimize API usage'
    ]
  };
}

// Validate ticker format
const validateTicker = (ticker: string): boolean => {
  // Allow special case for system commands
  if (ticker === 'SYSTEM') return true;
  
  // Ticker should be 1-5 uppercase letters
  return /^[A-Z]{1,5}$/.test(ticker);
};

export const executeFunction = async (ticker: string, func: string, params?: any): Promise<any> => {
  const functionKey = func.toUpperCase();
  const tickerUpper = ticker.toUpperCase();
  
  // System commands that don't require tickers
  const systemCommands = ['HELP', 'W', 'EQS'];
  
  // Validate ticker format (except for system commands)
  if (!systemCommands.includes(functionKey) && !validateTicker(tickerUpper)) {
    throw new Error(`Invalid ticker format: "${ticker}". Ticker must be 1-5 uppercase letters (e.g., AAPL, MSFT).`);
  }

  const handler = functions[functionKey];

  if (!handler) {
    const availableFunctions = Object.keys(functions).join(', ');
    throw new Error(`Unknown function: "${func}". Available functions: ${availableFunctions}`);
  }

  try {
    const data = await handler(tickerUpper, params);
    return data;
  } catch (error: any) {
    console.error(`Error executing ${func} for ${ticker}:`, error.message);
    
    // Provide user-friendly error messages
    if (error.message.includes('rate limit')) {
      throw new Error('API rate limit reached. Please wait a moment and try again.');
    } else if (error.message.includes('No data found') || error.message.includes('No financial data')) {
      throw new Error(`No data available for ticker "${tickerUpper}". Please verify the ticker symbol.`);
    } else if (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error(error.message || `Unable to execute ${func} for ${tickerUpper}. Please try again.`);
    }
  }
};

export const getAvailableFunctions = (): string[] => {
  return Object.keys(functions);
};
