/**
 * Greeks Calculator - Black-Scholes Model
 * 
 * Calculates option Greeks (Delta, Gamma, Theta, Vega, Rho) using the Black-Scholes model.
 * These metrics measure various risk exposures and sensitivities of option positions.
 */

import { Greeks } from '../../../shared/types.js';

/**
 * Standard normal cumulative distribution function (CDF)
 * Approximation using Abramowitz and Stegun formula
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return x > 0 ? 1 - probability : probability;
}

/**
 * Standard normal probability density function (PDF)
 */
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate d1 parameter for Black-Scholes model
 */
function calculateD1(
  spotPrice: number,
  strikePrice: number,
  timeToExpiration: number,
  riskFreeRate: number,
  volatility: number
): number {
  const numerator = Math.log(spotPrice / strikePrice) + 
                    (riskFreeRate + (volatility * volatility) / 2) * timeToExpiration;
  const denominator = volatility * Math.sqrt(timeToExpiration);
  return numerator / denominator;
}

/**
 * Calculate d2 parameter for Black-Scholes model
 */
function calculateD2(d1: number, volatility: number, timeToExpiration: number): number {
  return d1 - volatility * Math.sqrt(timeToExpiration);
}

/**
 * Calculate Greeks for an option
 * 
 * @param spotPrice - Current price of the underlying asset
 * @param strikePrice - Strike price of the option
 * @param timeToExpiration - Time to expiration in years
 * @param riskFreeRate - Risk-free interest rate (e.g., 0.05 = 5%)
 * @param volatility - Implied volatility (e.g., 0.30 = 30%)
 * @param optionType - 'CALL' or 'PUT'
 * @returns Greeks object with delta, gamma, theta, vega, rho
 */
export function calculateGreeks(
  spotPrice: number,
  strikePrice: number,
  timeToExpiration: number,
  riskFreeRate: number,
  volatility: number,
  optionType: 'CALL' | 'PUT'
): Greeks {
  // Prevent division by zero or invalid calculations
  if (timeToExpiration <= 0) {
    return {
      delta: optionType === 'CALL' ? (spotPrice >= strikePrice ? 1 : 0) : (spotPrice <= strikePrice ? -1 : 0),
      gamma: 0,
      theta: 0,
      vega: 0,
      rho: 0
    };
  }

  const d1 = calculateD1(spotPrice, strikePrice, timeToExpiration, riskFreeRate, volatility);
  const d2 = calculateD2(d1, volatility, timeToExpiration);
  
  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  const nd1 = normalPDF(d1);
  
  // Delta: Rate of change of option price with respect to underlying price
  // Call: N(d1), Put: N(d1) - 1
  let delta: number;
  if (optionType === 'CALL') {
    delta = Nd1;
  } else {
    delta = Nd1 - 1;
  }
  
  // Gamma: Rate of change of delta with respect to underlying price
  // Same for calls and puts
  const gamma = nd1 / (spotPrice * volatility * Math.sqrt(timeToExpiration));
  
  // Theta: Rate of change of option price with respect to time (daily decay)
  // Negative for both calls and puts (options lose value over time)
  let theta: number;
  const term1 = -(spotPrice * nd1 * volatility) / (2 * Math.sqrt(timeToExpiration));
  if (optionType === 'CALL') {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiration) * Nd2;
    theta = (term1 - term2) / 365; // Convert to daily
  } else {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(-d2);
    theta = (term1 + term2) / 365; // Convert to daily
  }
  
  // Vega: Rate of change of option price with respect to volatility
  // Same for calls and puts
  const vega = (spotPrice * nd1 * Math.sqrt(timeToExpiration)) / 100; // Per 1% change in volatility
  
  // Rho: Rate of change of option price with respect to interest rate
  // Positive for calls, negative for puts
  let rho: number;
  if (optionType === 'CALL') {
    rho = (strikePrice * timeToExpiration * Math.exp(-riskFreeRate * timeToExpiration) * Nd2) / 100;
  } else {
    rho = (-strikePrice * timeToExpiration * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(-d2)) / 100;
  }
  
  return {
    delta: Number(delta.toFixed(4)),
    gamma: Number(gamma.toFixed(4)),
    theta: Number(theta.toFixed(4)),
    vega: Number(vega.toFixed(4)),
    rho: Number(rho.toFixed(4))
  };
}

/**
 * Calculate time to expiration in years from expiration date string
 * 
 * @param expirationDate - Expiration date in YYYY-MM-DD format
 * @returns Time to expiration in years
 */
export function calculateTimeToExpiration(expirationDate: string): number {
  const expiration = new Date(expirationDate);
  const now = new Date();
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const timeToExpiration = (expiration.getTime() - now.getTime()) / millisecondsPerYear;
  
  // Return at least 1 day (prevents divide by zero)
  return Math.max(timeToExpiration, 1 / 365);
}

/**
 * Estimate implied volatility using simplified approach
 * In production, this would use Newton-Raphson or similar numerical method
 * 
 * @param spotPrice - Current price of underlying
 * @param strikePrice - Strike price
 * @param timeToExpiration - Time to expiration in years
 * @returns Estimated IV (e.g., 0.30 = 30%)
 */
export function estimateImpliedVolatility(
  spotPrice: number,
  strikePrice: number,
  timeToExpiration: number
): number {
  // Simplified IV estimation based on moneyness and time
  const moneyness = spotPrice / strikePrice;
  const baseIV = 0.30; // 30% base volatility
  
  // ATM options typically have lower IV, ITM/OTM have higher
  const moneynessAdjustment = Math.abs(1 - moneyness) * 0.5;
  
  // Shorter-dated options have higher IV
  const timeAdjustment = timeToExpiration < 0.25 ? 0.10 : 0;
  
  const iv = baseIV + moneynessAdjustment + timeAdjustment;
  
  // Clamp between 10% and 100%
  return Math.max(0.10, Math.min(1.00, iv));
}

/**
 * Calculate option price using Black-Scholes model
 * 
 * @param spotPrice - Current price of underlying
 * @param strikePrice - Strike price
 * @param timeToExpiration - Time to expiration in years
 * @param riskFreeRate - Risk-free rate
 * @param volatility - Implied volatility
 * @param optionType - 'CALL' or 'PUT'
 * @returns Option price
 */
export function calculateBlackScholesPrice(
  spotPrice: number,
  strikePrice: number,
  timeToExpiration: number,
  riskFreeRate: number,
  volatility: number,
  optionType: 'CALL' | 'PUT'
): number {
  if (timeToExpiration <= 0) {
    // At expiration, option is worth intrinsic value
    return Math.max(0, optionType === 'CALL' ? spotPrice - strikePrice : strikePrice - spotPrice);
  }

  const d1 = calculateD1(spotPrice, strikePrice, timeToExpiration, riskFreeRate, volatility);
  const d2 = calculateD2(d1, volatility, timeToExpiration);
  
  if (optionType === 'CALL') {
    const callPrice = spotPrice * normalCDF(d1) - 
                     strikePrice * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(d2);
    return Math.max(0, callPrice);
  } else {
    const putPrice = strikePrice * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(-d2) - 
                    spotPrice * normalCDF(-d1);
    return Math.max(0, putPrice);
  }
}
