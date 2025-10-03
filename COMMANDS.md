# Financial Terminal - Command Reference

## Command Syntax

All commands follow the Bloomberg Terminal format:

```
<TICKER> <FUNCTION> [PARAMETERS] <GO>
```

- **TICKER**: Stock symbol (e.g., AAPL, MSFT, TSLA)
- **FUNCTION**: Mnemonic code (e.g., DES, GIP)
- **PARAMETERS**: Optional parameters (future feature)
- **GO**: Press Enter to execute

---

## Phase 1 Functions (Available Now)

### DES - Security Description

**Description**: Display comprehensive company information including description, sector, market data, and current price.

**Syntax**: `<TICKER> DES`

**Examples**:
- `AAPL DES` - Apple Inc. company overview
- `MSFT DES` - Microsoft Corporation details
- `GOOGL DES` - Alphabet Inc. information

**Output Includes**:
- Company name and description
- Exchange and sector classification
- Industry category
- Country of origin
- Market capitalization
- Number of employees
- CEO name
- Website
- Current stock price
- Daily change and change percentage

**Use Cases**:
- Quick company research
- Understanding business model
- Checking market cap and valuation
- Verifying company information

---

### GIP - Historical Price Chart

**Description**: Display interactive historical price chart with statistics.

**Syntax**: `<TICKER> GIP`

**Examples**:
- `AAPL GIP` - Apple stock price chart
- `TSLA GIP` - Tesla historical prices
- `NVDA GIP` - NVIDIA price trends

**Output Includes**:
- Interactive line chart (30-day history)
- Current price
- Period high and low
- Total change and percentage
- Price statistics
- Hover tooltips with exact values

**Chart Features**:
- Dark theme with green line
- Responsive to panel size
- Hover for detailed data points
- Optimized for quick visual analysis

**Use Cases**:
- Identifying price trends
- Spotting support/resistance levels
- Quick performance check
- Visual comparison when using multiple panels

---

## Phase 2 Functions (Coming Soon)

### RTQ - Real-Time Quote

**Description**: Live streaming quote with bid/ask spreads.

**Planned Syntax**: `<TICKER> RTQ`

**Will Include**:
- Live price updates
- Bid/Ask prices and sizes
- Real-time volume
- Intraday high/low
- Last trade information

---

### GP - Advanced Chart

**Description**: Enhanced charting with technical indicators.

**Planned Syntax**: `<TICKER> GP [TIMEFRAME] [INDICATORS]`

**Planned Features**:
- Multiple timeframes (1D, 5D, 1M, 3M, 1Y, 5Y)
- Technical indicators:
  - Moving Averages (MA, EMA)
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
  - Volume overlay
- Candlestick charts
- Drawing tools
- Compare multiple securities

---

### FA - Fundamental Analysis

**Description**: Detailed financial statements and ratios.

**Planned Syntax**: `<TICKER> FA [STATEMENT] [PERIOD]`

**Will Include**:
- Income Statement
- Balance Sheet
- Cash Flow Statement
- Key financial ratios
- Quarterly and annual data
- Historical trends
- Peer comparison

---

### NEWS - News Feed

**Description**: Real-time and historical news for a security.

**Planned Syntax**: `<TICKER> NEWS`

**Will Include**:
- Latest headlines
- News sentiment analysis
- Source attribution
- Time filtering
- Search functionality
- Related news

---

### FX - Currency Exchange

**Description**: Foreign exchange rates and conversions.

**Planned Syntax**: `<CURRENCY1> <CURRENCY2> FX`

**Examples**:
- `USD EUR FX` - Dollar to Euro
- `GBP JPY FX` - Pound to Yen

---

### RISK - Risk Metrics

**Description**: Portfolio and security risk analysis.

**Planned Syntax**: `<TICKER> RISK`

**Will Include**:
- Beta (market correlation)
- Volatility (standard deviation)
- Sharpe Ratio
- Value at Risk (VaR)
- Correlation matrix
- Drawdown analysis

---

## Phase 3 Functions (Planned)

### HELP - Help System

**Description**: Context-aware help and function discovery.

**Syntax**: `HELP [FUNCTION]`

**Examples**:
- `HELP` - List all functions
- `HELP DES` - Detailed DES documentation
- `HELP CHART` - Charting help

---

### SEARCH - Universal Search

**Description**: Search across securities, functions, and news.

**Syntax**: `SEARCH <QUERY>`

**Examples**:
- `SEARCH APPLE` - Find Apple-related securities
- `SEARCH TECH` - Technology sector companies

---

### MSG - Messaging

**Description**: Send messages to other terminal users.

**Planned Syntax**: `MSG <USER> <MESSAGE>`

---

### EXPORT - Data Export

**Description**: Export current panel data to file.

**Planned Syntax**: `EXPORT [FORMAT]`

**Formats**:
- CSV
- Excel
- JSON
- PDF

---

## Keyboard Shortcuts

### Navigation
- `Ctrl+1` - Switch to Panel 1
- `Ctrl+2` - Switch to Panel 2
- `Ctrl+3` - Switch to Panel 3
- `Ctrl+4` - Switch to Panel 4

### Command Input
- `Enter` - Execute command (GO)
- `Ctrl+L` - Clear input field
- `↑` (Up Arrow) - Previous command
- `↓` (Down Arrow) - Next command
- `Esc` - Clear current input

### Coming Soon
- `Ctrl+C` - Copy data to clipboard
- `Ctrl+E` - Export current panel
- `Ctrl+H` - Show help
- `Ctrl+S` - Save workspace
- `F1` - Quick reference

---

## Best Practices

### Efficient Workflow

1. **Use Multiple Panels**: Load different views simultaneously
   - Panel 1: Company overview (DES)
   - Panel 2: Price chart (GIP)
   - Panel 3: News feed (NEWS)
   - Panel 4: Fundamentals (FA)

2. **Learn Mnemonics**: Type commands quickly
   - Memorize common functions
   - Use command history (↑/↓)
   - Leverage auto-complete (coming soon)

3. **Keyboard First**: Minimize mouse usage
   - Switch panels with Ctrl+1/2/3/4
   - Navigate with keyboard shortcuts
   - Use command history

### Common Patterns

#### Quick Company Research
```
Panel 1: AAPL DES   (Company overview)
Panel 2: AAPL GIP   (Price chart)
Panel 3: AAPL NEWS  (Latest news - coming soon)
Panel 4: AAPL FA    (Financials - coming soon)
```

#### Sector Comparison
```
Panel 1: AAPL GIP   (Apple chart)
Panel 2: MSFT GIP   (Microsoft chart)
Panel 3: GOOGL GIP  (Google chart)
Panel 4: META GIP   (Meta chart)
```

#### Market Overview
```
Panel 1: SPY GIP    (S&P 500 ETF)
Panel 2: QQQ GIP    (NASDAQ ETF)
Panel 3: DIA GIP    (DOW ETF)
Panel 4: NEWS       (Market news - coming soon)
```

---

## Error Messages

### Common Errors

**"Invalid command format"**
- Ensure format: `TICKER FUNCTION`
- Example: `AAPL DES`

**"Unknown function: XYZ"**
- Check available functions in this guide
- Use `HELP` command (coming soon)

**"No data found for ticker: XYZ"**
- Verify ticker symbol is correct
- Check if security is publicly traded
- Some securities may not be available

**"API rate limit reached"**
- Free API has limits
- Server caches responses (5 min)
- Wait before trying again
- Consider upgrading API plan

**"Failed to fetch data"**
- Check internet connection
- Verify API keys in `.env`
- Check server is running
- View server logs for details

---

## Tips & Tricks

### Speed Tips
1. Use command history to avoid retyping
2. Keep common tickers in multiple panels
3. Learn 5-10 key mnemonics by heart
4. Use Ctrl+L to quickly clear and start fresh

### Analysis Tips
1. Compare charts side-by-side using multiple panels
2. Check DES before investing (company overview)
3. Use GIP to identify trends
4. Cross-reference multiple data sources

### Productivity Tips
1. Set up panel layouts for specific workflows
2. Use keyboard exclusively for speed
3. Keep server running in background
4. Bookmark common ticker combinations

---

## Function Roadmap

### Q1 2025 (Phase 1) ✅
- [x] DES - Security Description
- [x] GIP - Historical Charts

### Q2 2025 (Phase 2)
- [ ] RTQ - Real-Time Quotes
- [ ] GP - Advanced Charts
- [ ] FA - Fundamentals
- [ ] FX - Currencies
- [ ] RISK - Risk Analysis

### Q3 2025 (Phase 3)
- [ ] NEWS - News Feed
- [ ] SEARCH - Universal Search
- [ ] MSG - Messaging
- [ ] EXPORT - Data Export

### Q4 2025 (Phase 4)
- [ ] HELP - Context Help
- [ ] PORT - Portfolio Manager
- [ ] ALERT - Price Alerts
- [ ] SCREEN - Stock Screener

---

## Additional Resources

- **SETUP.md** - Installation and configuration
- **QUICKSTART.md** - 5-minute getting started guide
- **README.md** - Project overview and architecture
- **API Documentation** - Coming soon

---

**Last Updated**: Phase 1 - October 2025
