# 🚀 Financial Terminal - Quick Start Guide

## Welcome to Your Bloomberg-Style Terminal

This guide will get you up and running in **5 minutes**.

---

## Step 1: Install Dependencies

Open PowerShell in the `financial-terminal` directory:

```powershell
npm install
```

This installs all dependencies for both client and server.

---

## Step 2: Configure Environment (Optional)

For real financial data, get a free API key:

1. Visit: https://www.alphavantage.co/support/#api-key
2. Copy `.env.example` to `.env`
3. Add your key: `ALPHA_VANTAGE_API_KEY=your_key_here`

**Note:** The terminal works without API keys using demo data!

---

## Step 3: Start the Terminal

```powershell
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

Open your browser to http://localhost:5173

---

## Using the Terminal

### Command Format

Type commands in any panel using the Bloomberg format:

```
TICKER FUNCTION
```

Then press **Enter** to execute.

### Try These Commands

1. **AAPL DES** - View Apple Inc. company description
2. **MSFT GIP** - Display Microsoft price chart
3. **TSLA DES** - Tesla company overview
4. **GOOGL GIP** - Google historical prices

### Keyboard Shortcuts

- **Enter** - Execute command (GO)
- **Ctrl+1** - Focus Panel 1
- **Ctrl+2** - Focus Panel 2
- **Ctrl+3** - Focus Panel 3
- **Ctrl+4** - Focus Panel 4
- **Ctrl+L** - Clear input
- **↑/↓** - Navigate command history

### Available Functions

| Code | Function | Description |
|------|----------|-------------|
| DES | Security Description | Company overview, sector, market cap |
| GIP | Historical Price Chart | Interactive price chart (30 days) |

---

## Understanding the Interface

```
┌─────────────────────────────────────────────┐
│  TERMINAL-A          NYSE: 14:30:00 EST     │
├──────────────┬──────────────────────────────┤
│  PANEL 1     │  PANEL 2                     │
│  > AAPL DES  │  > MSFT GIP                  │
│              │                               │
│  [Content]   │  [Content]                   │
│              │                               │
├──────────────┼──────────────────────────────┤
│  PANEL 3     │  PANEL 4                     │
│  > _         │  > TSLA DES                  │
│              │                               │
│  [Content]   │  [Content]                   │
│              │                               │
├──────────────┴──────────────────────────────┤
│  Status: Ready    │  Active Panel: 3        │
└─────────────────────────────────────────────┘
```

Each panel:
- Has its own command input
- Runs independently
- Maintains its own data
- Can display different functions

---

## Demo Mode

Without API keys, try these demo tickers:
- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **TSLA** - Tesla, Inc.

All other tickers will generate mock data.

---

## Common Issues

### Port Already in Use

If port 5173 or 3000 is busy:

**Client Port:**
Edit `client/vite.config.ts`:
```typescript
server: { port: 5174 }
```

**Server Port:**
Edit `.env`:
```
PORT=3001
```

### API Rate Limit

Free Alpha Vantage: 5 calls/min, 500/day

The server caches responses for 5 minutes to minimize API calls.

### Can't See Changes

Clear browser cache or do a hard refresh:
- **Windows**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R

---

## What's Next?

### Phase 2 Features (Coming Soon)
- Real-time streaming quotes
- Technical indicators (RSI, MACD, Bollinger Bands)
- Fundamental analysis (Income Statements, Balance Sheet)
- Multi-security comparison charts

### Phase 3 Features (Planned)
- News aggregation
- Internal messaging system
- Comprehensive search
- Data export to Excel

### Phase 4 Features (Planned)
- Session persistence
- Context-aware help system
- Performance optimization
- User authentication

---

## Architecture

```
┌─────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │   Client    │
│             │         │  (React)    │
└─────────────┘         └──────┬──────┘
                               │ HTTP
                        ┌──────▼──────┐
                        │   Server    │
                        │  (Express)  │
                        └──────┬──────┘
                               │
                    ┌──────────┼──────────┐
                    │                     │
              ┌─────▼─────┐      ┌───────▼────────┐
              │   Cache   │      │  External APIs │
              │  (5 min)  │      │ Alpha Vantage  │
              └───────────┘      └────────────────┘
```

---

## Development Commands

```powershell
# Start both servers
npm run dev

# Client only
npm run dev:client

# Server only  
npm run dev:server

# Build for production
npm run build

# Start production
npm start
```

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Styled Components, Chart.js
- **Backend**: Node.js, Express, TypeScript
- **Data**: Alpha Vantage API, Financial Modeling Prep (optional)

---

## Need Help?

1. Check `SETUP.md` for detailed documentation
2. Check `README.md` for project overview
3. View browser console for client errors
4. View terminal/PowerShell for server errors

---

## Tips for Bloomberg-Like Experience

1. **Use Multiple Panels**: Load different analyses simultaneously
2. **Learn Mnemonics**: Type commands quickly without mouse
3. **Command History**: Use arrow keys to repeat commands
4. **Stay Focused**: Use Ctrl+1/2/3/4 to switch panels fast

---

**Enjoy your professional financial terminal! 📈**
