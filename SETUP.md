# Financial Terminal - Setup Guide

## Quick Start

### 1. Install Dependencies

```powershell
# In the root directory
npm install

# This will install dependencies for both client and server
```

### 2. Configure Environment Variables

```powershell
# Copy the example environment file
Copy-Item .env.example .env

# Edit .env and add your API keys
notepad .env
```

Get your API keys:
- **Alpha Vantage**: https://www.alphavantage.co/support/#api-key (Free tier available)
- **Financial Modeling Prep** (optional): https://financialmodelingprep.com/developer/docs/

### 3. Start Development Servers

```powershell
# Start both client and server
npm run dev
```

This will start:
- **Client** on http://localhost:5173
- **Server** on http://localhost:3000

## Usage

### Command Format

All commands follow the Bloomberg Terminal model:

```
<TICKER> <FUNCTION> <GO>
```

Press `Enter` to execute (acts as `<GO>`)

### Available Functions (Phase 1)

| Mnemonic | Description | Example |
|----------|-------------|---------|
| `DES` | Security Description - Company overview | `AAPL DES` |
| `GIP` | Historical Price Chart | `MSFT GIP` |

### Keyboard Shortcuts

- `Enter` - Execute command
- `Ctrl+1/2/3/4` - Switch to panel 1/2/3/4
- `Ctrl+L` - Clear input
- `↑/↓` - Navigate command history

## Project Structure

```
financial-terminal/
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── Terminal.tsx       # Main terminal component
│   │   │   ├── PanelGrid.tsx      # 4-panel layout
│   │   │   ├── Panel.tsx          # Individual panel
│   │   │   ├── CommandInput.tsx   # Command line input
│   │   │   └── functions/         # Function implementations
│   │   │       ├── DESFunction.tsx
│   │   │       └── GIPFunction.tsx
│   │   ├── services/      # API client
│   │   │   └── api.ts
│   │   ├── styles/        # Global styles
│   │   │   └── GlobalStyles.ts
│   │   ├── App.tsx        # Root component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Node.js + Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   │   └── index.ts
│   │   ├── services/      # Business logic
│   │   │   ├── commandExecutor.ts    # Command routing
│   │   │   └── dataProviders.ts      # Data fetching
│   │   ├── utils/         # Utilities
│   │   │   └── errorHandler.ts
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                # Shared types
│   └── types.ts
│
├── package.json          # Root workspace config
├── README.md            # Project documentation
└── .env.example         # Environment template
```

## API Endpoints

### Execute Command
```
GET /api/execute?ticker=AAPL&function=DES
```

### Get Quote
```
GET /api/quote/:ticker
```

### Health Check
```
GET /health
```

## Features

### Phase 1 - Core Foundation ✅
- [x] High-contrast black theme
- [x] 4-panel multi-window layout
- [x] Bloomberg-style command input
- [x] DES (Security Description)
- [x] GIP (Historical Price Chart)
- [x] Centralized data service
- [x] Error handling & loading states
- [x] Command history
- [x] Keyboard shortcuts

### Phase 2 - Data Density (Planned)
- [ ] Real-time quotes (RTQ)
- [ ] Advanced charting with indicators
- [ ] Fundamental analysis (FA)
- [ ] Fixed income & macro data
- [ ] Risk metrics

### Phase 3 - Communication (Planned)
- [ ] News aggregation
- [ ] Instant messaging
- [ ] Comprehensive search
- [ ] Data export

### Phase 4 - Production (Planned)
- [ ] Workflow persistence
- [ ] Help system
- [ ] Speed optimization
- [ ] User authentication

## Development

### Run Individual Services

```powershell
# Client only
npm run dev:client

# Server only
npm run dev:server
```

### Build for Production

```powershell
npm run build
```

### Start Production Server

```powershell
npm start
```

## Troubleshooting

### API Rate Limits

The free Alpha Vantage API has rate limits (5 calls/minute, 500 calls/day). The server includes:
- Response caching (5-minute TTL)
- Mock data fallback for demos
- Clear error messages

### Port Conflicts

If ports 3000 or 5173 are in use, modify:
- Client: `client/vite.config.ts`
- Server: `.env` file

### CORS Issues

Ensure the server's `CORS_ORIGIN` matches your client URL in `.env`:
```
CORS_ORIGIN=http://localhost:5173
```

## Demo Mode

Without API keys, the terminal runs with mock data for:
- AAPL (Apple Inc.)
- MSFT (Microsoft Corporation)
- TSLA (Tesla, Inc.)

This allows you to test all features without external dependencies.

## Next Steps

1. **Get API Keys**: Sign up for Alpha Vantage (free)
2. **Explore Commands**: Try different tickers and functions
3. **Customize**: Modify colors, add new functions
4. **Phase 2**: Add real-time streaming and advanced analytics

## Support

For issues or questions, check:
- README.md for documentation
- .env.example for configuration
- Server logs for API errors
- Browser console for client errors

---

**Built with:** React, TypeScript, Vite, Express, Chart.js, Styled Components
