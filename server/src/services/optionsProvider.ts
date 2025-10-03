/**
 * Options Chain Data Provider
 * 
 * Provides mock options chain data for supported tickers.
 * Generates realistic options contracts with prices and Greeks.
 */

import { OptionsChain, OptionContract } from '../../../shared/types.js';
import { 
  calculateGreeks, 
  calculateTimeToExpiration, 
  estimateImpliedVolatility,
  calculateBlackScholesPrice 
} from '../utils/greeksCalculator.js';

const RISK_FREE_RATE = 0.045; // 4.5% risk-free rate

/**
 * Generate expiration dates (monthly, next 4 months + quarterlies)
 */
function generateExpirationDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  
  // Next 6 monthly expirations (3rd Friday of each month)
  for (let i = 0; i < 6; i++) {
    const date = new Date(now);
    date.setMonth(now.getMonth() + i);
    
    // Find 3rd Friday
    date.setDate(1);
    const firstDay = date.getDay();
    const firstFriday = firstDay <= 5 ? 6 - firstDay : 13 - firstDay;
    date.setDate(firstFriday + 14); // 3rd Friday
    
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

/**
 * Generate strike prices around the current price
 */
function generateStrikePrices(currentPrice: number, count: number = 15): number[] {
  const strikes: number[] = [];
  
  // Determine strike interval based on price
  let interval: number;
  if (currentPrice < 50) interval = 2.5;
  else if (currentPrice < 100) interval = 5;
  else if (currentPrice < 200) interval = 10;
  else if (currentPrice < 500) interval = 25;
  else interval = 50;
  
  // Round current price to nearest strike
  const atmStrike = Math.round(currentPrice / interval) * interval;
  
  // Generate strikes around ATM
  const strikeCount = Math.floor(count / 2);
  for (let i = -strikeCount; i <= strikeCount; i++) {
    strikes.push(atmStrike + (i * interval));
  }
  
  return strikes.filter(s => s > 0).sort((a, b) => a - b);
}

/**
 * Generate realistic bid-ask spread
 */
function generateBidAskSpread(optionPrice: number, iv: number): { bid: number; ask: number } {
  // Spread increases with price and volatility
  const baseSpread = optionPrice * 0.02; // 2% base spread
  const ivSpread = iv * optionPrice * 0.05; // Additional spread for high IV
  const totalSpread = Math.max(0.05, baseSpread + ivSpread); // Minimum $0.05 spread
  
  const bid = Math.max(0.01, optionPrice - totalSpread / 2);
  const ask = optionPrice + totalSpread / 2;
  
  return {
    bid: Number(bid.toFixed(2)),
    ask: Number(ask.toFixed(2))
  };
}

/**
 * Generate realistic volume and open interest
 */
function generateVolumeAndOI(
  moneyness: number,
  timeToExpiration: number
): { volume: number; openInterest: number } {
  // ATM options have highest volume, decreases as we move ITM/OTM
  const moneynessMultiplier = Math.exp(-Math.pow(Math.log(moneyness), 2) / 0.1);
  
  // Nearer expirations have higher volume
  const timeMultiplier = Math.exp(-timeToExpiration * 2);
  
  const baseVolume = 1000;
  const volume = Math.floor(baseVolume * moneynessMultiplier * timeMultiplier * (0.5 + Math.random()));
  
  // OI is typically 2-5x volume
  const openInterest = Math.floor(volume * (2 + Math.random() * 3));
  
  return { volume, openInterest };
}

/**
 * Create an option contract with calculated Greeks
 */
function createOptionContract(
  strike: number,
  optionType: 'CALL' | 'PUT',
  expiration: string,
  spotPrice: number
): OptionContract {
  const timeToExpiration = calculateTimeToExpiration(expiration);
  const iv = estimateImpliedVolatility(spotPrice, strike, timeToExpiration);
  
  // Calculate theoretical price using Black-Scholes
  const theoreticalPrice = calculateBlackScholesPrice(
    spotPrice,
    strike,
    timeToExpiration,
    RISK_FREE_RATE,
    iv,
    optionType
  );
  
  // Add some randomness to price (±5%)
  const priceVariation = 1 + (Math.random() - 0.5) * 0.1;
  const last = Number((theoreticalPrice * priceVariation).toFixed(2));
  
  // Generate bid-ask spread
  const { bid, ask } = generateBidAskSpread(last, iv);
  
  // Calculate Greeks
  const greeks = calculateGreeks(
    spotPrice,
    strike,
    timeToExpiration,
    RISK_FREE_RATE,
    iv,
    optionType
  );
  
  // Generate volume and OI
  const moneyness = spotPrice / strike;
  const { volume, openInterest } = generateVolumeAndOI(moneyness, timeToExpiration);
  
  // Determine if in the money
  const inTheMoney = optionType === 'CALL' ? spotPrice > strike : spotPrice < strike;
  
  return {
    strike,
    type: optionType,
    expiration,
    bid,
    ask,
    last,
    volume,
    openInterest,
    impliedVolatility: Number((iv * 100).toFixed(2)), // Convert to percentage
    greeks,
    inTheMoney
  };
}

/**
 * Generate complete options chain for a ticker
 */
function generateOptionsChain(ticker: string, currentPrice: number): OptionsChain {
  const expirations = generateExpirationDates();
  const strikes = generateStrikePrices(currentPrice);
  
  const chains: OptionsChain['chains'] = {};
  
  // Generate contracts for each expiration
  for (const expiration of expirations) {
    const calls: OptionContract[] = [];
    const puts: OptionContract[] = [];
    
    for (const strike of strikes) {
      calls.push(createOptionContract(strike, 'CALL', expiration, currentPrice));
      puts.push(createOptionContract(strike, 'PUT', expiration, currentPrice));
    }
    
    chains[expiration] = { calls, puts };
  }
  
  return {
    ticker,
    underlyingPrice: currentPrice,
    timestamp: new Date().toISOString(),
    expirations,
    chains
  };
}

// Mock current prices for supported tickers
const TICKER_PRICES: Record<string, number> = {
  // Tech Giants
  'AAPL': 178.25,
  'MSFT': 372.80,
  'GOOGL': 138.75,
  'AMZN': 145.60,
  'META': 325.40,
  'NVDA': 485.30,
  'TSLA': 242.50,
  
  // Popular Tech
  'AMD': 108.75,
  'NFLX': 445.60,
  'INTC': 35.80,
  'ORCL': 115.25,
  'CRM': 265.90,
  
  // Finance
  'JPM': 152.40,
  'BAC': 31.65,
  'GS': 385.20,
  
  // ETFs
  'SPY': 445.20,
  'QQQ': 380.50,
  'IWM': 195.30,
  'DIA': 342.75,
  
  // Other Popular
  'COIN': 165.80
};

/**
 * Get options chain for a ticker
 * 
 * @param ticker - Stock ticker symbol
 * @returns Options chain data or null if ticker not supported
 */
export function getOptionsChain(ticker: string): OptionsChain | null {
  const upperTicker = ticker.toUpperCase();
  const currentPrice = TICKER_PRICES[upperTicker];
  
  if (!currentPrice) {
    return null;
  }
  
  return generateOptionsChain(upperTicker, currentPrice);
}

/**
 * Get options chain for specific expiration
 * 
 * @param ticker - Stock ticker symbol
 * @param expiration - Expiration date (YYYY-MM-DD)
 * @returns Options chain for that expiration or null
 */
export function getOptionsChainByExpiration(ticker: string, expiration: string): {
  ticker: string;
  underlyingPrice: number;
  expiration: string;
  calls: OptionContract[];
  puts: OptionContract[];
} | null {
  const chain = getOptionsChain(ticker);
  
  if (!chain || !chain.chains[expiration]) {
    return null;
  }
  
  return {
    ticker: chain.ticker,
    underlyingPrice: chain.underlyingPrice,
    expiration,
    calls: chain.chains[expiration].calls,
    puts: chain.chains[expiration].puts
  };
}

/**
 * Get list of supported tickers for options
 */
export function getSupportedTickers(): string[] {
  return Object.keys(TICKER_PRICES);
}
