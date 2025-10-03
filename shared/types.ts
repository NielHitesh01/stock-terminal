export interface Command {
  ticker: string;
  function: string;
  params?: Record<string, any>;
}

export interface PanelConfig {
  id: number;
  ticker: string;
  function: string;
  data: any;
  loading: boolean;
  error: string | null;
}

export interface Quote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface CompanyInfo {
  ticker: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  exchange: string;
  country: string;
  marketCap: number;
  employees: number;
  ceo: string;
  website: string;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
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

export interface PriceDataWithIndicators {
  prices: HistoricalPrice[];
  indicators?: TechnicalIndicators;
}

export const AVAILABLE_FUNCTIONS = {
  DES: 'Security Description - Company overview and fundamental data',
  GIP: 'Historical Price Chart - Price chart with technical indicators',
} as const;

export type FunctionMnemonic = keyof typeof AVAILABLE_FUNCTIONS;

// Alert System Types
export enum AlertType {
  PRICE_ABOVE = 'PRICE_ABOVE',
  PRICE_BELOW = 'PRICE_BELOW',
  RSI_ABOVE = 'RSI_ABOVE',
  RSI_BELOW = 'RSI_BELOW',
  VOLUME_SPIKE = 'VOLUME_SPIKE'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  TRIGGERED = 'TRIGGERED',
  DISABLED = 'DISABLED'
}

export interface Alert {
  id: string;
  ticker: string;
  type: AlertType;
  threshold: number;
  status: AlertStatus;
  createdAt: string;
  triggeredAt?: string;
  message?: string;
  notificationSent?: boolean;
}

export interface AlertCheckResult {
  alert: Alert;
  triggered: boolean;
  currentValue?: number;
  message?: string;
}

// Options Chain Types
export interface Greeks {
  delta: number;   // Price sensitivity (0-1 for calls, -1-0 for puts)
  gamma: number;   // Delta sensitivity
  theta: number;   // Time decay (daily)
  vega: number;    // Volatility sensitivity
  rho: number;     // Interest rate sensitivity
}

export interface OptionContract {
  strike: number;
  type: 'CALL' | 'PUT';
  expiration: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number; // IV as percentage (e.g., 0.35 = 35%)
  greeks: Greeks;
  inTheMoney: boolean;
}

export interface OptionsChain {
  ticker: string;
  underlyingPrice: number;
  timestamp: string;
  expirations: string[]; // Available expiration dates
  chains: {
    [expiration: string]: {
      calls: OptionContract[];
      puts: OptionContract[];
    };
  };
}
