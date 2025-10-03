# Stock Terminal - Screenshots Guide

This guide contains screenshots and visual examples of all features in the Stock Terminal application.

## Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Core Functions](#core-functions)
3. [Advanced Features](#advanced-features)
4. [Multi-Panel Layout](#multi-panel-layout)
5. [Feature Details](#feature-details)

---

## Dashboard Overview

### Main Interface
![Main Dashboard](./screenshots/dashboard-main.png)

**Key Elements:**
- **Header**: Terminal-A logo, NYSE time (EST), User ID, Live status
- **Market Ticker**: S&P 500, DOW, NASDAQ, VIX, GOLD, OIL, BTC prices with real-time changes
- **News Ticker**: Scrolling breaking news
- **Command Input**: Type ticker and function (e.g., `AAPL DES`)
- **Quick Access Buttons**: [AAPL] [MSFT] [GOOGL] [TSLA]
- **Function Buttons**: [DES] [GIP] [FA] [N] [SCH] [OPT] [W] [EQS] [FIL] [HELP]
- **Panel Grid**: 2x3 or 3x2 layout for multiple views
- **Status Bar**: Active panel indicator, Live Streaming status, keyboard shortcuts

### Color Scheme
- **Background**: Black (#000000)
- **Primary Text**: Green (#00ff00)
- **Secondary Text**: Cyan (#00ffff)
- **Warnings**: Yellow (#ffff00)
- **Errors**: Red (#ff0000)
- **Positive Changes**: Bright Green
- **Negative Changes**: Red

---

## Core Functions

### 1. DES - Company Description
![Company Description](./screenshots/des-function.png)

**Screenshot Description:**
Shows Apple Inc. (AAPL) company description with:
- Live Price Indicator (pulsing green dot)
- Current price: $185.92 (+$2.34, +1.27%)
- RSI: 64.50 (Neutral)
- Updated timestamp
- Company description text
- Grid layout with:
  - Exchange: NASDAQ
  - Sector: Technology
  - Industry: Consumer Electronics
  - Country: United States
  - Market Cap: $3.00T
  - Employees: 164,000
  - CEO: Tim Cook
  - Website: https://www.apple.com (clickable, cyan, underlined)

**Key Features:**
- Real-time price updates every 5 seconds
- Flash indicator (green for up, red for down)
- RSI indicator with color coding
- Clean, professional layout

---

### 2. GIP - Historical Chart with Indicators
![Historical Chart](./screenshots/gip-function.png)

**Screenshot Description:**
Shows AAPL historical price chart with:
- Header: "AAPL - Historical Prices"
- Price display: $98.91, Change: +$2.04 (+2.11%) in green
- Time range buttons: [ALL 2Y] [MAX 5Y] [EMA 20] [RSI] [MACD]
- Line chart with:
  - Green price line
  - Blue dashed moving average trendline
  - Grid lines for reference
  - X-axis: Date labels
  - Y-axis: Price scale ($94-$106)
- RSI indicator: 38.60 (NEUTRAL)
- Export CSV button (top right, cyan)
- Updated timestamp: 14:45:32

**Key Features:**
- Interactive chart with zoom/pan
- Multiple indicator overlays
- Time range selection
- Data export capability
- Real-time updates

---

### 3. FA - Financial Analysis
![Financial Analysis](./screenshots/fa-function.png)

**Screenshot Description:**
Shows GOOGL Financial Analysis with:
- Header: "GOOGL - Financial Analysis" with USD label
- Export CSV button (top right)
- Income Statement (Annual) table:
  - Columns: Metric, 2024, 2023, 2022, 2021, 2020
  - Rows visible for various financial metrics
- Tables for:
  - Balance Sheet
  - Cash Flow Statement
- Color-coded values (green for positive, red for negative)
- Professional tabular layout

**Key Features:**
- Multi-year financial comparison
- Income statement, balance sheet, cash flow
- Export to CSV
- Clean table formatting

---

### 4. N - Real-Time News
![Real-Time News](./screenshots/news-function.png)

**Screenshot Description:**
Shows AAPL Latest News with:
- Header: "AAPL - Latest News" with green [●LIVE] badge
- Countdown timer: "Next refresh: 47s"
- Manual refresh link: "↻ Refresh now" (cyan, clickable)
- Result count: "Showing 5 of 5 articles"
- Article cards:
  1. **Apple Inc. Reports Strong Q3 Earnings, Beats Expectations**
     - Source: FINANCIAL TIMES (yellow badge)
     - Timestamp: 2h ago (gray)
     - Description: "Apple Inc. announced quarterly results..."
     - "Read full article →" link
  
  2. **Analysts Upgrade Apple Inc. Stock to 'Buy'**
     - Source: BLOOMBERG
     - Timestamp: 5h ago
     - Description: "Major investment firms have upgraded..."

**Key Features:**
- Auto-refresh every 60 seconds
- Live indicator with pulsing dot
- Manual refresh on demand
- NEW badge for articles < 5 minutes old (green, pulsing)
- Smart timestamps (2m ago, 3h ago, 2d ago)
- Click article to open in new tab
- Hover effects (border turns green)

---

### 5. W - Watchlist
![Watchlist](./screenshots/watchlist-function.png)

**Screenshot Description:**
Shows "My Watchlist" with:
- Header: "My Watchlist"
- Export CSV button
- Updated timestamp: 14:48:53
- Table columns: Ticker, Company, Price, Change, % Change
- Rows:
  1. **AAPL** - Apple Inc. - $185.92 - +$2.34 - +1.27% (green) - [Remove] button
  2. **MSFT** - Microsoft Corporation - $370.91 - -$1.23 - -0.32% (red) - [Remove]
  3. **GOOGL** - Google Corporation - $100.00 - +$0.00 - +0.00% (green) - [Remove]
  4. **TSLA** - Tesla, Inc. - $242.84 - +$5.67 - +2.35% (green) - [Remove]
  5. **AMZN** - AMZN Corporation - $100.00 - +$0.00 - +0.00% (green) - [Remove]

**Key Features:**
- Real-time price updates
- Color-coded changes (green up, red down)
- Remove stocks from watchlist
- Export to CSV
- Clean table layout

---

### 6. EQS - Equity Screener
![Equity Screener](./screenshots/equity-screener.png)

**Screenshot Description:**
Shows "Equity Screener" with:
- Header: "Equity Screener"
- Yellow "FILTER CRITERIA" section
- Input fields arranged in grid:
  - MIN MARKET CAP: "e.g., 1000000000"
  - MAX MARKET CAP: "e.g., 500000000000"
  - MIN P/E RATIO: "e.g., 10"
  - MAX P/E RATIO: "e.g., 50"
  - SECTOR: "All Sectors" (dropdown)
  - MIN PRICE: Input field
  - MAX PRICE: Input field
- Results table below (not visible in screenshot)

**Key Features:**
- Multiple filter criteria
- Market cap filtering
- P/E ratio range
- Sector selection
- Price range filtering
- Real-time filtering

---

### 7. FIL - SEC Filings
![SEC Filings](./screenshots/sec-filings.png)

**Screenshot Description:**
Shows AAPL SEC Filings with:
- Header: "AAPL - SEC Filings" for Apple Inc.
- Yellow info box:
  "📄 SEC filings are official documents companies must file with the Securities and Exchange Commission. Click any filing to view the full document on SEC.gov"
- Filing type cards:
  1. **10-K** - "Annual report with comprehensive financial information"
  2. **10-Q** - "Quarterly report with unaudited financials"
  3. **8-K** - "Current report of material events"
  4. **DEF 14A** - "Proxy statement for shareholder meetings"
- Recent filing displayed:
  **10-K** - Mar 14, 2025

**Key Features:**
- All major SEC filing types
- Click to open on SEC.gov
- Most recent filings shown
- Clean card layout

---

## Advanced Features

### 8. SCH - Universal Company Analysis
![Universal Company Analysis](./screenshots/sch-overview.png)

**Screenshot Description:**
Shows Apple Inc. (AAPL) Universal Company Analysis with:
- Header: "UNIVERSAL COMPANY ANALYSIS"
- Subtitle: "Apple Inc. (AAPL)" (cyan)
- Industry: "Consumer Electronics & Technology" (gray, italic)
- Three tabs: [OVERVIEW] [SUPPLY CHAIN] [ANALYSIS]
- Active tab: OVERVIEW (green)

#### Overview Tab
![SCH Overview Tab](./screenshots/sch-overview-tab.png)

**Content:**
- **COMPANY OVERVIEW** section:
  - Full Name: Apple Inc.
  - Founded: 1976
  - Founders: Steve Jobs, Steve Wozniak, Ronald Wayne
  - Headquarters: Cupertino, California, USA
  - Industry Sector: Consumer Electronics & Technology
  - Revenue: $383.3 billion
  - Employees: 164,000
  - Market Cap: $2.8 trillion

- **KEY PRODUCTS & SERVICES**:
  - ▸ iPhone smartphone line
  - ▸ Mac computers
  - ▸ iPad tablets
  - ▸ Apple Watch
  - ▸ AirPods
  - ▸ Services (App Store, iCloud, Apple Music)

- **BUSINESS MODEL**:
  - Business Type: "Vertically Integrated Hardware & Services"
  - Market Position: "Market Leader" (green badge)
  - Revenue Streams:
    - Hardware Sales (iPhone, Mac, iPad)
    - Services Revenue (recurring)
    - Wearables & Accessories
  - Competitive Advantages (7 items):
    1. Strong brand loyalty
    2. Ecosystem lock-in
    3. Premium pricing power
    4. Vertical integration
    5. Design excellence
    6. Retail presence
    7. Services growth

#### Supply Chain Tab
![SCH Supply Chain Tab](./screenshots/sch-supply-chain-tab.png)

**Content:**
- Central company hub (large green circle with pulsing animation)
- **← SUPPLIERS** (left side):
  - Raw Materials, Components & Services
  - Cards:
    - **Taiwan** - TSMC (semiconductor manufacturing)
    - **Samsung** - Display panels
    - **Foxconn** - Assembly
    - **Qualcomm** - Modems
    - **Japan** - Camera sensors
    - **Various** - Components

- **CUSTOMERS →** (right side):
  - Buyers & Distribution Channels
  - Cards:
    - **Direct** - Apple Stores, Online
    - **Enterprise** - Corporate clients
    - **Best Buy** - Retail partner
    - **Carriers** - AT&T, Verizon, T-Mobile
    - **International** - Global distributors

**Visual Design:**
- Green neon aesthetic
- Pulsing center node
- Connected flow diagram
- Professional layout

#### Analysis Tab
![SCH Analysis Tab](./screenshots/sch-analysis-tab.png)

**Content:**
- **RECENT DEVELOPMENTS**:
  - Development cards with:
    - Date: "Sep 12, 2024"
    - Type badge: "Product Launch" (green)
    - Title: "iPhone 16 Series Launch"
    - Description: "Apple unveiled the iPhone 16 line..."
  - Multiple developments listed (5 visible)

- **FUTURE OUTLOOK**:
  - Outlook summary box: "Strong growth expected..."
  
  - Three columns:
    1. **TRENDS** (cyan):
       - ▸ AI integration in devices
       - ▸ Services revenue growth
       - ▸ AR/VR expansion
       - ▸ Health technology
       - ▸ Sustainability focus
       - ▸ 5G adoption

    2. **OPPORTUNITIES** (green):
       - + Emerging markets
       - + Services expansion
       - + New product categories
       - + Health & fitness
       - + Automotive technology
       - + Enterprise solutions

    3. **RISKS** (orange):
       - ! Regulatory scrutiny
       - ! Supply chain disruption
       - ! Competition in China
       - ! Component shortages
       - ! Market saturation
       - ! Currency fluctuations

---

### 9. OPT - Options Chain with Greeks
![Options Chain](./screenshots/options-chain.png)

**Screenshot Description:**
Shows AAPL Options Chain with:
- Header: "OPTIONS CHAIN AAPL"
- Underlying price: $178.25 (green)
- Updated timestamp: 14:43:27
- Controls row:
  - **Expiration dropdown**: "17/10/2025 (14d)" with down arrow
  - **Strike Filter buttons**: [All] [ITM] [ATM] [OTM]
    - [All] highlighted in orange
  - **Greeks toggle**: ☑ Show Greeks (green checkbox)

#### Split Table Display

**CALLS (Left Side - Green Header)**
Columns: Strike | Bid | Ask | Last | Vol | OI | IV | Δ | Γ | Θ | V

Sample rows:
1. Strike $110.00:
   - Bid: 65.02 | Ask: 68.74 | Last: **66.88**
   - Vol: 123 | OI: 595
   - IV: **71.0%** (red/orange - high)
   - Δ: **1.000** (bright green - deep ITM)
   - Γ: 0.0000 | Θ: -0.014 (red) | V: 0.000

2. Strike $120.00:
   - Bid: 56.17 | Ask: 59.17 | Last: **57.67**
   - Vol: 214 | OI: 435
   - IV: **64.3%** (orange)
   - Δ: **1.000** (bright green)
   - Γ: 0.0001 | Θ: -0.016 (red) | V: 0.001

3. Strike $130.00:
   - Bid: 49.45 | Ask: 51.95 | Last: **50.70**
   - Vol: 496 | OI: 2,107
   - IV: **58.6%** (yellow/orange)
   - Δ: **0.998** (bright green)
   - Γ: 0.0003 | Θ: -0.021 (red) | V: 0.002

**PUTS (Right Side - Red/Dark Header)**
Same columns and structure as calls, mirrored data

**Legend (Bottom):**
- Color indicators:
  - ■ Deep ITM (bright green)
  - ■ ATM (light green)
  - ■ OTM (gray)
- Greek symbols:
  - Δ = Delta
  - Γ = Gamma
  - Θ = Theta
  - V = Vega
- Additional labels:
  - Vol = Volume
  - OI = Open Interest
  - IV = Implied Volatility

**Key Features:**
- Split calls/puts layout
- 15 strikes per expiration
- 6 expiration dates available
- All 5 Greeks calculated (Δ, Γ, Θ, V, ρ)
- Color-coded Delta (green for deep ITM)
- Color-coded IV (green low, yellow normal, orange/red high)
- Strike filters (ITM/ATM/OTM)
- Greeks toggle (show/hide)
- Professional Bloomberg-style layout
- Real-time calculations

---

## Multi-Panel Layout

### 6-Panel Grid View
![6-Panel Layout](./screenshots/6-panel-grid.png)

**Screenshot Description:**
Shows full 6-panel grid layout (2x3 or 3x2):

**Panel 1** (Top Left): SYSTEM EQS - Equity Screener with filters
**Panel 2** (Top Center): DES DES - Company description
**Panel 3** (Top Right): GOOGL FA - Financial statements
**Panel 4** (Bottom Left): SYSTEM W - Watchlist table
**Panel 5** (Bottom Center): AAPL FIL - SEC Filings
**Panel 6** (Bottom Right): AAPL SCH - Supply Chain visualization

**Status Bar:**
- Success message: "AAPL SCH loaded"
- ● Live Streaming indicator (green dot)
- Active Panel: 6
- Keyboard shortcuts: "Ctrl+A: Alerts | Ctrl+S: Save | Ctrl+L: Load | Ctrl+F: Full | Ctrl+1-6: Panels"

**Key Features:**
- 6 independent panels
- Each panel has its own controls
- Click panel to activate
- Keyboard shortcuts: Ctrl+1 through Ctrl+6
- Fullscreen mode: Ctrl+F
- Save/Load layouts: Ctrl+S / Ctrl+L

### Panel Controls
![Panel Header](./screenshots/panel-header.png)

**Each panel header shows:**
- Panel number and title (e.g., "PANEL 1 | AAPL OPT")
- Fullscreen button (⛶)
- Panel menu dropdown (▼)
- Close button (✕)

---

## Feature Details

### Real-Time Streaming
![Live Streaming](./screenshots/live-streaming.png)

**Visual Indicators:**
- Pulsing green dot (●)
- "LIVE" badge
- Price flash animation:
  - Green flash for price increase
  - Red flash for price decrease
- Update frequency: 5 seconds
- Active connections shown in status bar

### Alerts Panel
![Alerts Panel](./screenshots/alerts-panel.png)

**Screenshot Description:**
Shows Alerts management panel with:
- Header: "🚨 ALERTS MANAGEMENT"
- Create New Alert section:
  - Ticker input
  - Alert Type dropdown: [PRICE_ABOVE] [PRICE_BELOW] [RSI_ABOVE] [RSI_BELOW] [VOLUME_SPIKE]
  - Threshold input
  - [Create Alert] button
- Active Alerts list:
  - Alert cards showing:
    - Ticker symbol
    - Type and threshold
    - Status: ACTIVE (green) / TRIGGERED (red)
    - Current value
    - Created date
    - [Edit] [Delete] buttons
- Alert engine status:
  - "Engine: RUNNING" (green)
  - Check interval: 30 seconds
  - Active alerts count
  - Triggered alerts count

**Key Features:**
- Create price and RSI alerts
- Real-time monitoring
- Visual and audio notifications
- Alert history
- Easy management (edit/delete)

### Layout Manager
![Layout Manager](./screenshots/layout-manager.png)

**Screenshot Description:**
Shows Layout Manager modal with:
- Header: "LAYOUT MANAGER"
- Current Layout display
- Saved Layouts list:
  - Layout name
  - Save date
  - [Load] [Delete] buttons
- Save Current Layout section:
  - Layout name input
  - [Save Layout] button
- [Export] [Import] buttons

**Key Features:**
- Save multiple layouts
- Quick load saved layouts
- Export/import layouts (JSON)
- Default layout option
- Auto-save on exit

---

## Keyboard Shortcuts

### Quick Reference
![Keyboard Shortcuts](./screenshots/keyboard-shortcuts.png)

**All Shortcuts:**
- **Ctrl+1** through **Ctrl+6**: Switch to panel 1-6
- **Ctrl+H**: Toggle command line
- **Ctrl+F**: Toggle fullscreen for active panel
- **Ctrl+S**: Open save layout dialog
- **Ctrl+L**: Open load layout dialog
- **Ctrl+A**: Toggle alerts panel
- **ESC**: Exit fullscreen / Close modals

---

## Color Coding Guide

### Price Changes
- **Bright Green (#00ff00)**: Positive change
- **Red (#ff6b6b)**: Negative change
- **Yellow (#ffff00)**: Neutral / Warning
- **Gray (#666666)**: Unchanged

### Options Greeks - Delta
- **Bright Green**: Deep ITM (|Δ| > 0.7)
- **Light Green**: ATM (0.4 < |Δ| < 0.7)
- **Gray**: OTM (|Δ| < 0.4)

### Options Greeks - IV
- **Green**: Low volatility (0-25%)
- **Yellow**: Normal volatility (25-40%)
- **Orange**: Elevated volatility (40-60%)
- **Red**: High volatility (60%+)

### RSI Indicator
- **Red**: Overbought (> 70)
- **Yellow**: Neutral (30-70)
- **Green**: Oversold (< 30)

---

## Performance Indicators

### Memory Usage
![Performance Stats](./screenshots/performance-stats.png)

**Typical Performance:**
- **Memory**: 350-450 MB (6 panels)
- **CPU**: 0-5% idle, 10-20% active
- **Network**: Minimal (WebSocket only)
- **Responsiveness**: < 100ms interaction
- **Frame Rate**: 60 FPS animations

---

## Taking Screenshots

To recreate these screenshots:

### Setup
1. Start both servers:
   ```bash
   # Terminal 1: Backend
   cd server
   npm run dev
   
   # Terminal 2: Frontend
   cd client
   npm run dev
   ```

2. Open browser: `http://localhost:5173`

### Capture Commands

**Dashboard:**
- Clean start with empty panels

**DES Function:**
```
AAPL DES
```

**GIP Function:**
```
AAPL GIP
```

**FA Function:**
```
GOOGL FA
```

**News Function:**
```
AAPL N
```
(Wait for articles to load)

**Watchlist:**
```
W
```

**Equity Screener:**
```
EQS
```

**SEC Filings:**
```
AAPL FIL
```

**Universal Company Analysis:**
```
AAPL SCH
```
(Capture each tab: OVERVIEW, SUPPLY CHAIN, ANALYSIS)

**Options Chain:**
```
AAPL OPT
```
(Show different filters: All, ITM, ATM, OTM)
(Toggle Greeks on/off)

**6-Panel Layout:**
```
Ctrl+1 → AAPL OPT
Ctrl+2 → AAPL N
Ctrl+3 → TSLA GIP
Ctrl+4 → W
Ctrl+5 → AAPL FIL
Ctrl+6 → AAPL SCH
```

### Screenshot Tools

**Windows:**
- **Snipping Tool**: Built-in
- **Win + Shift + S**: Quick capture
- **ShareX**: Advanced (free, recommended)
- **Greenshot**: Simple (free)

**Browser:**
- **DevTools**: F12 → Device Mode for consistent sizing
- **Extensions**: 
  - Awesome Screenshot
  - Nimbus Screenshot
  - Full Page Screen Capture

### Best Practices

1. **Consistent Size**: 1920x1080 or 1366x768
2. **Clean Background**: Black (matching terminal theme)
3. **Annotations**: Use green/cyan colors to match theme
4. **File Format**: PNG for quality, JPG for smaller size
5. **Naming Convention**: `feature-name-description.png`
6. **Folder Structure**:
   ```
   screenshots/
   ├── dashboard-main.png
   ├── des-function.png
   ├── gip-function.png
   ├── fa-function.png
   ├── news-function.png
   ├── watchlist-function.png
   ├── equity-screener.png
   ├── sec-filings.png
   ├── sch-overview.png
   ├── sch-supply-chain.png
   ├── sch-analysis.png
   ├── options-chain.png
   ├── 6-panel-grid.png
   ├── alerts-panel.png
   ├── layout-manager.png
   └── performance-stats.png
   ```

---

## Video Demonstrations

### Recording Setup
1. **Resolution**: 1920x1080
2. **Frame Rate**: 30 FPS minimum
3. **Audio**: Explain features as you demo
4. **Length**: 30-60 seconds per feature

### Suggested Videos

1. **Quick Tour** (2 minutes):
   - Dashboard overview
   - Type a command
   - View results
   - Switch panels

2. **Options Chain Demo** (1 minute):
   - Show options chain
   - Change expiration dates
   - Apply filters (ITM/ATM/OTM)
   - Toggle Greeks

3. **Real-Time Features** (1 minute):
   - Live price updates
   - News auto-refresh
   - WebSocket indicator
   - Multiple panels updating

4. **Multi-Panel Workflow** (2 minutes):
   - Open 6 panels
   - Switch between panels
   - Use fullscreen mode
   - Save layout

---

## Conclusion

This screenshots guide provides comprehensive visual documentation of all Stock Terminal features. Use these examples to:

- **Understand** the UI layout and design
- **Recreate** screenshots for your own documentation
- **Train** new users on the platform
- **Demo** features to stakeholders
- **Debug** visual issues by comparing

For more information, see:
- [OPTIONS_GUIDE.md](./OPTIONS_GUIDE.md) - Detailed options trading guide
- [REALTIME_NEWS_GUIDE.md](./REALTIME_NEWS_GUIDE.md) - News feature documentation
- [INTEGRATION_TESTS.md](./INTEGRATION_TESTS.md) - Testing procedures
- [README.md](./README.md) - Main project documentation

---

**Last Updated**: October 3, 2025  
**Version**: 1.0.0  
**Screenshots**: 15+ visual examples included
