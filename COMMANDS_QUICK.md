# 🚀 QUICK COMMANDS - Stock Terminal v2.0

## Start the Application

```powershell
npm run dev
```

Then open browser to: **http://localhost:5175**

---

## All 8 Functions

| Command | Function | Description |
|---------|----------|-------------|
| `AAPL DES` | Description | Company overview, sector, market cap |
| `AAPL GIP` | Chart | 90-day price chart + technical indicators |
| `AAPL FA` | Financials | 5-year income statement, balance sheet, ratios |
| `W` | Watchlist | Your portfolio with live prices |
| `AAPL N` | News | Latest company-specific news |
| `EQS` | Screener | Filter stocks by P/E, market cap, sector |
| `AAPL FIL` | Filings | SEC documents (10-K, 10-Q, 8-K) |
| `HELP` | Help | Full command reference |

---

## Technical Indicators (GIP)

After running `AAPL GIP`:
- Click **SMA 20** - Show 20-day simple moving average
- Click **SMA 50** - Show 50-day simple moving average
- Click **EMA 20** - Show 20-day exponential moving average
- Click **RSI** - Show Relative Strength Index
- Click **EXPORT CSV** - Download price data

---

## Export Data (CSV)

### Financial Analysis
1. Run: `AAPL FA`
2. Click: **EXPORT CSV**
3. Downloads: `AAPL_income_statement.csv` + `AAPL_balance_sheet.csv`

### Watchlist
1. Run: `W`
2. Click: **EXPORT CSV**
3. Downloads: `watchlist_YYYY-MM-DD.csv`

### Price Data
1. Run: `AAPL GIP`
2. Click: **EXPORT CSV**
3. Downloads: `AAPL_prices.csv` (OHLCV data)

---

## Equity Screener

1. Run: `EQS`
2. Set filters (optional):
   - **Min Market Cap**: `1000000000000` (for $1T+ companies)
   - **Max P/E**: `30` (reasonable valuations)
   - **Sector**: Select `Technology`
3. Click: **APPLY FILTERS**
4. Click column headers to sort
5. Click: **EXPORT CSV** to download results

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+1` | Focus Panel 1 |
| `Ctrl+2` | Focus Panel 2 |
| `Ctrl+3` | Focus Panel 3 |
| `Ctrl+4` | Focus Panel 4 |
| `Ctrl+H` | Toggle command input |
| `↑` | Previous command (history) |
| `↓` | Next command (history) |
| `Enter` | Execute command (GO) |
| `Esc` | Clear input |

---

## Multi-Panel Workflow

### Research Setup
- **Panel 1**: `AAPL DES` (company overview)
- **Panel 2**: `AAPL GIP` (chart with indicators)
- **Panel 3**: `AAPL FA` (financials)
- **Panel 4**: `AAPL N` (news)

### Screening Setup
- **Panel 1**: `EQS` (screener with filters)
- **Panel 2**: `AAPL DES` (selected stock)
- **Panel 3**: `AAPL GIP` (chart)
- **Panel 4**: `W` (watchlist)

### Compliance Setup
- **Panel 1**: `AAPL FIL` (SEC filings)
- **Panel 2**: `AAPL FA` (financials)
- **Panel 3**: `AAPL DES` (overview)
- **Panel 4**: `AAPL N` (news)

---

## Popular Tickers

Quick commands to try:

```
AAPL DES    # Apple
MSFT GIP    # Microsoft chart
GOOGL FA    # Alphabet financials
TSLA N      # Tesla news
META GIP    # Meta chart
NVDA FA     # NVIDIA financials
```

---

## Tips & Tricks

1. **Use toolbar search** - Type 3 letters, select from autocomplete
2. **Click toolbar buttons** - Quick function access (DES, GIP, FA, N, W, EQS, FIL, HELP)
3. **Command history** - Use ↑/↓ arrows to recall previous commands
4. **Export everything** - All major functions have CSV export
5. **Toggle indicators** - Show/hide SMA, EMA, RSI in charts
6. **Filter in screener** - Use EQS to find stocks by criteria
7. **Click watchlist tickers** - Quick-load to active panel

---

## Troubleshooting

### No data showing?
- Check console for API rate limit messages
- Demo mode uses mock data if API unavailable

### Port already in use?
- Server: Kill process on port 3002
- Client: Port 5175 should be available

### Commands not working?
- Format: `TICKER FUNCTION` (e.g., `AAPL DES`)
- System commands: `W`, `EQS`, `HELP` (no ticker needed)

---

## Documentation

- **Quick Start**: `QUICKSTART.md`
- **Complete Guide**: `QUICK_REFERENCE.md`
- **Phase Details**: `PHASE2_COMPLETE.md`, `PHASE3_COMPLETE.md`, `PHASE4_COMPLETE.md`
- **Final Report**: `FINAL_REPORT.md`
- **Testing**: `TESTING_GUIDE.md`

---

## Version Info

**Version**: 2.0.0  
**Status**: 100% Complete  
**Functions**: 8 core  
**Features**: Technical indicators, CSV export, equity screening, SEC filings  
**Completion Date**: October 3, 2025

---

**🎉 You now have a professional financial terminal! 🎉**

Start with: `AAPL DES` or `HELP`
