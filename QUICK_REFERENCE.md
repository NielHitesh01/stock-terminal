#  Quick Reference Card - Stock Terminal

##  Available Commands

| Command | Usage      | Description                                     |
|---------|------------|-------------------------------------------------|
| **DES** | `AAPL DES` | Company description, overview, current price    |
| **GIP** | `AAPL GIP` | Historical price chart (30 days)                |
| **FA**  | `AAPL FA`  | Financial analysis (5-year statements & ratios) |
| **W**   | `W`        | View watchlist (no ticker needed)               |
| **N**   | `AAPL N`   | Latest news articles for ticker                 |
| **HELP**| `HELP`     | Command reference (no ticker needed)            |



##  Keyboard Shortcuts

| Shortcut          | Action                    |
|-------------------|---------------------------|
| `Ctrl + 1/2/3/4`  | Switch to Panel 1/2/3/4   |
| `Ctrl + F`        | **Toggle fullscreen mode** ⛶ |
| `Ctrl + H`        | Toggle command line       |
| `↑ / ↓`           | Navigate command history  |
| `Enter`           | Execute command           |
| `Esc`             | Clear input / Exit fullscreen |



##  Common Workflows

### **Research a Company**
```
Panel 1: AAPL DES    # Company overview
Panel 2: AAPL GIP    # Price trends
Panel 3: AAPL FA     # Financials
Panel 4: AAPL N      # Latest news
```

### **Monitor Portfolio**
```
Panel 1: W           # Watchlist
Panel 2: TSLA GIP    # Tesla chart
Panel 3: MSFT N      # Microsoft news
Panel 4: AAPL FA     # Apple fundamentals
```

### **Compare Companies**
```
Panel 1: AAPL FA     # Apple financials
Panel 2: MSFT FA     # Microsoft financials
Panel 3: GOOGL FA    # Google financials
Panel 4: W           # Watchlist overview
```

### **Deep Dive with Fullscreen** ⛶
```
Step 1: AAPL GIP           # Load chart in Panel 1
Step 2: Ctrl+F             # Enter fullscreen mode
Step 3: Toggle SMA/RSI     # Analyze indicators in detail
Step 4: ESC                # Exit fullscreen
Step 5: Ctrl+2, AAPL FA    # Switch to financials
Step 6: Ctrl+F             # Fullscreen financials
```



## 🎨 Color Legend

| Color       | Meaning                   |
|-------------|-------------------------- |
| 🟢 Green    | Positive change / gain    |
| 🔴 Red      | Negative change / loss    |
| 🔵 Cyan     | Active panel / highlight  |
| 🟡 Yellow   | Labels / categories       |



##  Pro Tips

1. **Use the Toolbar** - Click ticker search → select function buttons
2. **Watchlist Management** - Use W function, add/remove tickers with buttons
3. **News Click** - Click any news article to open in new tab
4. **Quote Bar** - Always visible at top of panels with ticker data
5. **Command History** - Press ↑/↓ to recall previous commands
6. **Multi-Panel** - Each panel is independent - analyze 4 stocks at once
7. **Cache** - Data is cached for 5 minutes for faster reloads



##  Quick Start

### First Time User:
1. Type `HELP` or click HELP button → Read command reference
2. Type `W` or click W button → View your watchlist
3. Try `AAPL DES` → See company overview
4. Click toolbar buttons for quick access

### Experienced User:
- Use command line for speed: `TICKER FUNCTION` + Enter
- Switch panels with `Ctrl+1/2/3/4`
- Build a workflow across 4 panels
- Add tickers to watchlist for monitoring



##  Features

###  What's Working:
- 6 core functions (DES, GIP, FA, W, N, HELP)
- 4-panel multi-window layout
- Command-line + GUI toolbar
- Real-time quote bars
- Watchlist with persistence
- News feed integration
- Keyboard shortcuts
- Command history
- Smart data caching

###  Demo Mode:
- Works without API keys
- Mock data for demonstration
- Real API integration available with keys



##  Troubleshooting

**No data showing?**
- Check ticker is valid (e.g., AAPL, MSFT)
- Wait a moment (may be loading)
- Try again (may hit rate limit)

**Command not working?**
- Check spelling (DES, not DESC)
- Use uppercase (case-insensitive but cleaner)
- W and HELP don't need tickers

**Slow loading?**
- First load takes longer
- Cached data loads instantly
- API rate limits may slow requests



##  Command Examples

```
AAPL DES          # Apple description
MSFT GIP          # Microsoft chart
GOOGL FA          # Google financials
TSLA N            # Tesla news
W                 # Watchlist
HELP              # Help reference
```


##  Learning Path

1. **Start**: `HELP` → Read all commands
2. **Basics**: `AAPL DES` → Company info
3. **Charts**: `AAPL GIP` → Price trends
4. **Financials**: `AAPL FA` → Deep analysis
5. **News**: `AAPL N` → Market context
6. **Portfolio**: `W` → Watchlist management
7. **Multi-Panel**: Use all 4 panels simultaneously



##  Data Sources

- **Prices**: Alpha Vantage API
- **Financials**: Alpha Vantage API
- **News**: NewsAPI.org
- **Watchlist**: Local file storage



##  Performance
- First load: 1-3 seconds
- Cached data: < 0.1 seconds
- Panel switch: Instant
- Command execution: < 0.2 seconds



**Version**: 1.0.0 (Phase 3 Complete)  
**Last Updated**: October 3, 2025  
**Status**: Production Ready ✅