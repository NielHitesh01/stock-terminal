# 📊 OPTIONS CHAIN FEATURE - COMPLETE GUIDE

## 🎯 Overview

The **Options Chain** feature provides professional-grade options analysis with real-time Greeks calculations, multiple expiration dates, and advanced filtering. Built using the Black-Scholes model for accurate pricing and risk metrics.

---

## 🚀 Quick Start

### Basic Usage

```
AAPL OPT
```

This opens a comprehensive options chain display for Apple with:
- All available expiration dates
- Calls and Puts side-by-side
- Greeks for every contract (Delta, Gamma, Theta, Vega, Rho)
- Implied Volatility (IV) color-coded
- Volume and Open Interest
- Moneyness indicators (ITM/ATM/OTM)

---

## 📋 What You See

### Header Section
```
OPTIONS CHAIN | AAPL | Underlying: $178.25
Updated: 3:45:23 PM
```

- **Ticker**: Stock symbol
- **Underlying Price**: Current stock price
- **Timestamp**: Last update time

### Controls Panel

**Expiration Selector:**
```
[10/18/2024 (15d) ▼]
```
- Dropdown with all available expiration dates
- Shows days to expiration (DTE)
- Click to switch between expirations

**Strike Filter:**
```
[All] [ITM] [ATM] [OTM]
```
- **All**: Show all strike prices
- **ITM**: In-the-Money options only
- **ATM**: At-the-Money (within 5% of spot)
- **OTM**: Out-of-the-Money options only

**Greeks Toggle:**
```
[✓ Show Greeks]
```
- Toggle to show/hide Greeks columns
- Useful for simplified view or detailed analysis

### Options Chain Display

**Two-Column Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│                        CALLS                                  │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬─────────────┤
│Strike│ Bid  │ Ask  │ Last │ Vol  │  OI  │  IV  │ Δ│Γ│Θ│V     │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────────────┤
│165.00│13.50 │13.75 │13.60 │ 1,234│ 5,678│35.2% │0.85│...     │
│170.00│ 9.25 │ 9.50 │ 9.35 │ 2,345│ 7,890│33.8% │0.72│...     │
│175.00│ 5.75 │ 6.00 │ 5.85 │ 3,456│ 9,012│32.1% │0.55│...     │
│180.00│ 3.15 │ 3.40 │ 3.25 │ 4,567│ 8,901│31.5% │0.38│...     │
│185.00│ 1.45 │ 1.70 │ 1.55 │ 2,345│ 6,789│32.8% │0.22│...     │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴─────────────┘

┌──────────────────────────────────────────────────────────────┐
│                        PUTS                                   │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬─────────────┤
│Strike│ Bid  │ Ask  │ Last │ Vol  │  OI  │  IV  │ Δ│Γ│Θ│V     │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────────────┤
│165.00│ 0.85 │ 1.10 │ 0.95 │   567│ 1,234│36.5% │-0.15│...    │
│170.00│ 1.75 │ 2.00 │ 1.85 │ 1,234│ 2,345│34.2% │-0.28│...    │
│175.00│ 3.25 │ 3.50 │ 3.35 │ 2,345│ 3,456│32.8% │-0.45│...    │
│180.00│ 5.75 │ 6.00 │ 5.85 │ 3,456│ 5,678│31.9% │-0.62│...    │
│185.00│ 9.25 │ 9.50 │ 9.35 │ 2,345│ 4,567│33.3% │-0.78│...    │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴─────────────┘
```

### Legend
```
🟢 Deep ITM | 🟢 ATM | ⚪ OTM

Δ = Delta | Γ = Gamma | Θ = Theta | V = Vega
Vol = Volume | OI = Open Interest | IV = Implied Volatility
```

---

## 📊 Column Definitions

### Price Columns

| Column | Description | Example |
|--------|-------------|---------|
| **Strike** | Strike price of the option | $175.00 |
| **Bid** | Highest price buyers will pay | $5.75 |
| **Ask** | Lowest price sellers will accept | $6.00 |
| **Last** | Last traded price | $5.85 |

### Volume & Interest

| Column | Description | Example |
|--------|-------------|---------|
| **Vol** | Number of contracts traded today | 3,456 |
| **OI** | Total open contracts | 9,012 |

**Higher volume = more liquid options**
**Higher OI = more market interest**

### Implied Volatility (IV)

| Color | IV Range | Interpretation |
|-------|----------|----------------|
| 🟢 Green | 0-25% | Low volatility |
| 🟡 Yellow | 25-40% | Normal volatility |
| 🟠 Orange | 40-60% | Elevated volatility |
| 🔴 Red | 60%+ | High volatility |

**Higher IV = More expensive options = Greater uncertainty**

---

## 🎓 Understanding the Greeks

The Greeks measure different dimensions of option risk. All calculated using the Black-Scholes model.

### Delta (Δ)

**What it measures:** Price sensitivity
**Range:** 
- Calls: 0 to 1.0
- Puts: -1.0 to 0

**Interpretation:**
- **Δ = 0.50**: Option gains $0.50 for every $1 stock move
- **Δ = 0.85**: Deep ITM call (moves almost 1:1 with stock)
- **Δ = 0.15**: Far OTM call (minimal price movement)

**Color Coding:**
- 🟢 Bright Green: |Δ| > 0.7 (Deep ITM)
- 🟢 Light Green: |Δ| > 0.4 (Near ATM)
- ⚪ Gray: |Δ| < 0.4 (OTM)

**Use Case:**
- **High Delta**: Stock substitute (behaves like owning stock)
- **Low Delta**: Lottery ticket (large potential, low probability)

### Gamma (Γ)

**What it measures:** Delta sensitivity (how fast Delta changes)
**Range:** 0 to ~0.1 (highest for ATM options)

**Interpretation:**
- **Γ = 0.0500**: Delta increases by 0.05 for every $1 stock move
- **High Gamma**: Delta changes rapidly (ATM options)
- **Low Gamma**: Delta changes slowly (ITM/OTM options)

**Use Case:**
- **High Gamma**: Position risk accelerates with stock movement
- **Low Gamma**: More stable Delta (ITM options)

### Theta (Θ)

**What it measures:** Time decay (daily value loss)
**Range:** Negative values (options lose value over time)

**Interpretation:**
- **Θ = -0.050**: Option loses $0.05 per day
- **Θ = -0.150**: Option loses $0.15 per day (faster decay)

**Color Coding:**
- 🔴 Red: Negative theta (options lose value)
- 🟢 Green: Positive theta (rare, for short positions)

**Use Case:**
- **High |Θ|**: ATM options near expiration (rapid decay)
- **Low |Θ|**: Long-dated or deep ITM/OTM options

**Trading Strategy:**
- **Buyers beware**: Theta works against you
- **Sellers benefit**: Collect time decay premium

### Vega (V)

**What it measures:** Volatility sensitivity
**Range:** 0 to ~1.0 (higher for longer-dated ATM options)

**Interpretation:**
- **V = 0.150**: Option gains $0.15 for every 1% increase in IV
- **High Vega**: Sensitive to volatility changes
- **Low Vega**: Insensitive to volatility (short-dated, ITM/OTM)

**Use Case:**
- **High Vega**: Buy before earnings (IV typically rises)
- **Low Vega**: Less exposed to "IV crush" after events

### Rho (ρ)

**What it measures:** Interest rate sensitivity
**Range:** -1.0 to 1.0
**Note:** Typically smallest Greek (least important for most traders)

**Interpretation:**
- **ρ = 0.050**: Option gains $0.05 for every 1% rate increase
- Generally negligible unless rates change dramatically

---

## 🎯 Options Moneyness

### In-The-Money (ITM)
**Calls:** Stock price > Strike price
**Puts:** Stock price < Strike price

**Example:** Stock at $178, Call with $175 strike = **$3 ITM**

**Characteristics:**
- High Delta (deep ITM: Δ ≈ 0.8-1.0)
- High premium (intrinsic value + time value)
- Lower risk, lower reward
- Good for stock substitutes

### At-The-Money (ATM)
**Both:** Strike price ≈ Stock price (within 5%)

**Example:** Stock at $178, Option with $180 strike = **ATM**

**Characteristics:**
- Delta around 0.50
- Highest Gamma (rapid Delta changes)
- Highest Theta (maximum time decay)
- Highest Vega (most IV sensitive)
- Popular for directional trading

### Out-of-The-Money (OTM)
**Calls:** Stock price < Strike price
**Puts:** Stock price > Strike price

**Example:** Stock at $178, Call with $185 strike = **$7 OTM**

**Characteristics:**
- Low Delta (far OTM: Δ ≈ 0.1-0.2)
- Low premium (only time value)
- High risk, high reward potential
- "Lottery tickets" - cheap but unlikely to profit

---

## 💡 Trading Strategies

### 1. Buying Calls (Bullish)
**When:** You expect stock to rise
**Greeks Focus:** Delta, Theta

```
Buy: AAPL $180 Call @ $3.25
- Delta: 0.55 (gains $0.55 per $1 stock rise)
- Theta: -0.08 (loses $0.08 per day)
- Break-even: $183.25 (strike + premium)
```

**Profit:** Stock price - Strike - Premium
**Max Loss:** Premium paid ($3.25)

### 2. Buying Puts (Bearish)
**When:** You expect stock to fall
**Greeks Focus:** Delta, Theta

```
Buy: AAPL $175 Put @ $2.85
- Delta: -0.45 (gains $0.45 per $1 stock drop)
- Theta: -0.07 (loses $0.07 per day)
- Break-even: $172.15 (strike - premium)
```

**Profit:** Strike - Stock price - Premium
**Max Loss:** Premium paid ($2.85)

### 3. Covered Call (Income)
**When:** You own stock, want income
**Greeks Focus:** Theta (collect time decay)

```
Own: 100 shares AAPL @ $178
Sell: 1x AAPL $185 Call @ $1.55
- Collect: $155 premium
- Cap gains at: $185 (if called away)
- Theta: +0.05 (time decay helps you)
```

**Max Profit:** (Strike - Stock Price) + Premium
**Max Loss:** Stock drops to $0 (minus premium collected)

### 4. Protective Put (Insurance)
**When:** You own stock, want downside protection
**Greeks Focus:** Delta (hedge ratio)

```
Own: 100 shares AAPL @ $178
Buy: 1x AAPL $170 Put @ $1.85
- Cost: $185 for protection
- Protected below: $170
- Delta: -0.28 (partial hedge)
```

**Max Loss:** Stock Price - Strike + Premium = $9.85 per share

### 5. Calendar Spread (Volatility)
**When:** Expect low near-term, high long-term volatility
**Greeks Focus:** Theta, Vega

```
Sell: Short-dated $180 Call @ $3.25 (high Theta)
Buy: Long-dated $180 Call @ $5.50 (high Vega)
Net Cost: $2.25
```

**Profit from:** Time decay of short option + IV increase in long option

---

## 🔍 Advanced Features

### Strike Price Filtering

**All Strikes:**
- Shows complete chain (typically 15-20 strikes)
- Best for: Full market view, unusual activity scanning

**ITM Filter:**
- Shows only profitable contracts if exercised today
- Best for: Stock substitutes, low-risk plays
- **Calls:** Strikes below current price
- **Puts:** Strikes above current price

**ATM Filter:**
- Shows strikes within 5% of stock price
- Best for: Directional trading, highest liquidity
- Typically 5-7 strikes around current price

**OTM Filter:**
- Shows only strikes with no intrinsic value
- Best for: Speculation, cheap hedges, high risk/reward
- **Calls:** Strikes above current price
- **Puts:** Strikes below current price

### Expiration Management

**Short-dated (0-30 days):**
- Highest Theta (rapid decay)
- Highest Gamma (Delta sensitivity)
- Lower cost
- Best for: Quick directional plays, earnings

**Medium-dated (30-90 days):**
- Balanced Greeks
- Moderate cost
- Best for: Standard directional trades

**Long-dated (90+ days, LEAPS):**
- Lower Theta (slow decay)
- Higher Vega (IV sensitivity)
- Higher cost
- Best for: Stock substitutes, long-term positions

### Greeks Analysis

**Show Greeks (Default):**
```
Full display with all 4 Greeks (Δ, Γ, Θ, V)
Best for: Advanced traders, risk management
```

**Hide Greeks:**
```
Simplified view (Strike, Bid, Ask, Last, Vol, OI, IV)
Best for: Simple price checking, beginners
```

---

## 📈 Supported Tickers

Options data available for **8 major tickers:**

| Ticker | Company | Current Price | Typical IV Range |
|--------|---------|---------------|------------------|
| **AAPL** | Apple Inc. | $178.25 | 25-35% |
| **TSLA** | Tesla Inc. | $242.50 | 45-65% (high vol) |
| **MSFT** | Microsoft | $372.80 | 22-32% |
| **AMZN** | Amazon | $145.60 | 28-38% |
| **GOOGL** | Alphabet | $138.75 | 24-34% |
| **NVDA** | NVIDIA | $485.30 | 35-50% (volatile) |
| **SPY** | S&P 500 ETF | $445.20 | 12-20% (benchmark) |
| **QQQ** | Nasdaq ETF | $380.50 | 18-28% |

---

## 🎨 Visual Design

### Color Coding System

**Delta Colors:**
- 🟢 Bright Green (#00ff00): Deep ITM (|Δ| > 0.7)
- 🟢 Light Green (#88ff88): Near ATM (|Δ| > 0.4)
- ⚪ Gray (#444444): OTM (|Δ| < 0.4)

**IV Colors:**
- 🟢 Green: 0-25% (low volatility)
- 🟡 Yellow: 25-40% (normal)
- 🟠 Orange: 40-60% (elevated)
- 🔴 Red: 60%+ (high volatility)

**Theta Colors:**
- 🔴 Red/Pink: Negative theta (buyers lose value)
- 🟢 Green: Positive theta (sellers gain value)

**Section Colors:**
- 🟢 Green Header: CALLS
- 🔴 Red Header: PUTS

**Moneyness Highlight:**
- ITM rows have subtle green background tint
- Helps identify profitable contracts at a glance

---

## 💻 Technical Implementation

### Black-Scholes Model

All Greeks calculated using industry-standard Black-Scholes:

```
Call Price = S₀N(d₁) - Ke⁻ʳᵗN(d₂)
Put Price = Ke⁻ʳᵗN(-d₂) - S₀N(-d₁)

Where:
d₁ = [ln(S₀/K) + (r + σ²/2)t] / (σ√t)
d₂ = d₁ - σ√t

S₀ = Current stock price
K = Strike price
r = Risk-free rate (4.5%)
t = Time to expiration (years)
σ = Implied volatility
N(x) = Standard normal CDF
```

### Greeks Formulas

**Delta (Δ):**
```
Call: N(d₁)
Put: N(d₁) - 1
```

**Gamma (Γ):**
```
Both: N'(d₁) / (S₀σ√t)
```

**Theta (Θ):**
```
Call: -[S₀N'(d₁)σ / (2√t)] - rKe⁻ʳᵗN(d₂)
Put: -[S₀N'(d₁)σ / (2√t)] + rKe⁻ʳᵗN(-d₂)
```

**Vega (V):**
```
Both: S₀N'(d₁)√t / 100
```

### Data Generation

**Expiration Dates:**
- 6 monthly expirations (3rd Friday each month)
- Automatically calculated from current date
- Shows days to expiration (DTE)

**Strike Prices:**
- 15 strikes centered around current price
- Interval based on stock price:
  - $0-50: $2.50 intervals
  - $50-100: $5 intervals
  - $100-200: $10 intervals
  - $200-500: $25 intervals
  - $500+: $50 intervals

**Option Pricing:**
- Theoretical price from Black-Scholes
- ±5% randomness for realism
- Bid-ask spread based on price and IV

---

## 📱 Usage Examples

### Example 1: Quick Check
```
AAPL OPT
```
→ Opens options chain with default expiration (nearest)
→ Shows all strikes with Greeks

### Example 2: Filter to ATM
```
1. AAPL OPT
2. Click [ATM] filter button
3. View only near-the-money options
```
→ Best for active trading decisions

### Example 3: Compare Expirations
```
1. TSLA OPT
2. Select "11/15/2024 (45d)" from dropdown
3. Note Delta values
4. Switch to "12/20/2024 (75d)"
5. Compare Delta for same strike
```
→ Longer-dated = lower Delta, higher Vega

### Example 4: Scan for High IV
```
1. Open multiple panels:
   - Panel 1: AAPL OPT
   - Panel 2: TSLA OPT
   - Panel 3: NVDA OPT
2. Compare IV colors across tickers
3. Red = high premium opportunity (selling)
4. Green = low premium (buying)
```

### Example 5: Greeks Analysis
```
1. NVDA OPT
2. Ensure [✓ Show Greeks] is enabled
3. Find ATM strike ($485)
4. Note:
   - Δ ≈ 0.50 (50% probability ITM)
   - Γ high (Delta will change rapidly)
   - Θ high (loses value quickly)
   - V high (sensitive to IV changes)
```

---

## 🎯 Best Practices

### For Beginners

1. **Start with SPY or QQQ**
   - Lower IV = cheaper options
   - High liquidity = tight spreads
   - Less volatile than individual stocks

2. **Focus on ATM options first**
   - Highest liquidity
   - Easier to understand pricing
   - Delta around 0.50 = 50/50 probability

3. **Hide Greeks initially**
   - Focus on price, volume, IV
   - Add Greeks complexity later

4. **Use ITM filter for safer plays**
   - Higher probability of profit
   - Lower percentage risk

### For Intermediate Traders

1. **Monitor Theta decay**
   - Avoid buying near expiration (high Θ)
   - Consider spreads to offset decay

2. **Compare IV across expirations**
   - Look for IV skew opportunities
   - Calendar spreads exploit IV differences

3. **Use OTM filter for hedges**
   - Cheap protective puts
   - Defined risk speculation

4. **Track Volume and OI**
   - Low volume = wide spreads
   - High OI = established market

### For Advanced Traders

1. **Analyze full Greeks profile**
   - Delta for directional exposure
   - Gamma for risk acceleration
   - Vega for IV plays
   - Theta for time decay strategy

2. **Identify arbitrage**
   - Compare calls vs puts (put-call parity)
   - Look for mispricing across strikes

3. **Build complex spreads**
   - View multiple strikes simultaneously
   - Calculate combined Greeks mentally

4. **Pre-earnings strategies**
   - IV typically rises before earnings
   - ATM options have highest Vega

---

## 🚨 Risk Warnings

### Options Trading Risks

⚠️ **Options can expire worthless**
- You can lose 100% of premium paid
- Time decay works against buyers
- Monitor expiration dates closely

⚠️ **Leverage amplifies losses**
- Small stock moves = large option moves
- High Gamma = rapid Delta changes
- Manage position size carefully

⚠️ **IV crush after events**
- Earnings, FDA approvals, etc.
- Options lose value even if stock moves as predicted
- High Vega = high IV crush risk

⚠️ **Liquidity risk**
- Low volume = wide bid-ask spreads
- Difficult to exit position at fair price
- Check Volume and OI before trading

⚠️ **Assignment risk (sellers)**
- ITM options may be exercised
- Must own stock (covered) or have margin (naked)
- Early assignment possible (especially dividends)

### Best Risk Management

✅ **Never risk more than you can afford to lose**
✅ **Use stop losses on options positions**
✅ **Diversify across tickers and expirations**
✅ **Understand max loss BEFORE entering**
✅ **Monitor Greeks daily for changing risk**
✅ **Close positions before expiration (avoid assignment)**
✅ **Paper trade first to learn mechanics**

---

## 🔧 Troubleshooting

### "Options data not available"
**Cause:** Ticker not in supported list
**Solution:** Use AAPL, TSLA, MSFT, AMZN, GOOGL, NVDA, SPY, or QQQ

### Greeks don't match expectations
**Cause:** Mock data with randomness
**Solution:** Greeks are theoretically correct using Black-Scholes, prices have ±5% variation

### No strikes showing after filter
**Cause:** Filter too restrictive (e.g., OTM filter when stock near lowest strike)
**Solution:** Switch to "All" filter or choose different expiration

### Slow loading
**Cause:** Calculating Greeks for all contracts
**Solution:** Be patient, calculations are CPU-intensive (Black-Scholes for 100+ contracts)

---

## 📚 Further Learning

### Recommended Resources

**Options Basics:**
- "Options as a Strategic Investment" by Lawrence McMillan
- CBOE Options Institute (free online courses)
- Investopedia Options Trading Guide

**Greeks Deep Dive:**
- "Option Volatility & Pricing" by Sheldon Natenberg
- TastyTrade Greeks Education Series
- Khan Academy Options Videos

**Black-Scholes Model:**
- Original 1973 Black-Scholes paper
- Hull's "Options, Futures, and Other Derivatives"
- MIT OpenCourseWare - Financial Engineering

**Strategy Development:**
- OptionAlpha.com (free strategy guides)
- OIC Options Strategies Quick Guide
- r/options Reddit community

---

## ✨ Summary

### What You Get

✅ **8 supported tickers** (AAPL, TSLA, MSFT, AMZN, GOOGL, NVDA, SPY, QQQ)
✅ **6 expiration dates** (monthly, ~6 months out)
✅ **15 strike prices** per expiration (ATM-centered)
✅ **All 5 Greeks** (Delta, Gamma, Theta, Vega, Rho)
✅ **Implied Volatility** color-coded
✅ **Volume and Open Interest** real-time
✅ **Advanced filtering** (ITM/ATM/OTM)
✅ **Professional display** Bloomberg-style
✅ **Real-time calculations** Black-Scholes model

### Key Commands

```
<TICKER> OPT        → Open options chain
[All/ITM/ATM/OTM]   → Filter strikes
[Expiration ▼]      → Change expiration
[✓ Show Greeks]     → Toggle Greeks display
```

### When to Use

- 📊 **Research**: Compare options across strikes and expirations
- 💹 **Trading**: Find optimal strike prices for strategies
- 🎯 **Greeks**: Analyze risk exposure and sensitivities
- 🔍 **IV Analysis**: Identify high/low volatility opportunities
- 📈 **Hedging**: Find protective puts or covered call strikes
- 💡 **Education**: Learn options mechanics visually

---

**Your Stock Terminal now has institutional-grade options analysis!** 🚀📊

Test it: `AAPL OPT` and explore the full power of options trading! ✨
