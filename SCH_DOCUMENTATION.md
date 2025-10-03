# 📊 Supply Chain Diagram (SCH) - Documentation

## Overview

The **SCH (Supply Chain)** function displays a visual diagram showing the complete supply chain relationships for a company. It presents:
- **Suppliers** (right side): Companies that provide raw materials, components, and services
- **Company Hub** (center): The target company as the central connector
- **Customers** (left side): Buyers, distribution channels, and end consumers

---

## Command Syntax

```
<TICKER> SCH
```

**Examples:**
```
AAPL SCH    - Apple's supply chain
TSLA SCH    - Tesla's supply chain
MSFT SCH    - Microsoft's supply chain
AMZN SCH    - Amazon's supply chain
GOOGL SCH   - Google's supply chain
NVDA SCH    - NVIDIA's supply chain
```

---

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SUPPLY CHAIN DIAGRAM                             │
│                    Company Name (TICKER)                             │
│                         Industry                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│    SUPPLIERS ←              HUB              → CUSTOMERS             │
│                                                                       │
│  ┌──────────────┐      ┌──────────┐      ┌──────────────┐          │
│  │ Supplier 1   │◄─────┤          ├─────►│  Customer 1  │          │
│  │ (Category)   │      │ COMPANY  │      │  (Category)  │          │
│  └──────────────┘      │  TICKER  │      └──────────────┘          │
│                        │   HUB    │                                  │
│  ┌──────────────┐      └──────────┘      ┌──────────────┐          │
│  │ Supplier 2   │◄─────────┼─────────────►│  Customer 2  │          │
│  │ (Category)   │                         │  (Category)  │          │
│  └──────────────┘                         └──────────────┘          │
│                                                                       │
│  ← Input Flow                              Output Flow →             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Features

### 🎯 Interactive Design
- **Hover Effects**: Cards light up and shift when you hover over them
- **Pulsing Hub**: Central company circle pulses to emphasize its role
- **Connection Lines**: Visual lines show flow direction
- **Color Coding**: Green terminal theme with gradient effects

### 📋 Information Displayed

**For Each Supplier:**
- Company name and ticker (if public)
- Category (e.g., "Chip Manufacturing", "Battery Cells")
- Detailed description of what they provide

**For Each Customer:**
- Customer name and ticker (if public)
- Category (e.g., "Retail Distribution", "Enterprise Segment")
- Description of the relationship

### 🔄 Data Flow Indicators
- **← Arrow**: Suppliers provide inputs (raw materials, components, services)
- **→ Arrow**: Products/services flow to customers (output)

---

## Supported Companies

### Pre-Loaded Supply Chain Data:

#### **AAPL** (Apple Inc.)
- **Suppliers**: TSMC (chips), Samsung (displays), Foxconn (assembly), Qualcomm, Broadcom, Sony
- **Customers**: Direct consumers, Enterprise, Best Buy, Carriers, Amazon

#### **TSLA** (Tesla Inc.)
- **Suppliers**: Panasonic (batteries), CATL, LG Energy, NVIDIA, Glencore, Albemarle
- **Customers**: Direct consumers, Fleet customers, Hertz, Utilities, International markets

#### **MSFT** (Microsoft Corporation)
- **Suppliers**: Intel, AMD, NVIDIA, Dell, OpenAI, Samsung
- **Customers**: Enterprise, Consumers, Game developers, Azure customers, Education

#### **AMZN** (Amazon.com Inc.)
- **Suppliers**: Third-party sellers, Intel, AMD, UPS, FedEx, P&G
- **Customers**: Online shoppers, Prime members, AWS customers, Netflix, Small businesses

#### **GOOGL** (Alphabet Inc.)
- **Suppliers**: Broadcom, Intel, NVIDIA, Samsung, LG Display, Equinix
- **Customers**: Advertisers, Internet users, Cloud customers, App developers, Hardware buyers

#### **NVDA** (NVIDIA Corporation)
- **Suppliers**: TSMC, Samsung, SK Hynix, ASML, Synopsys
- **Customers**: Microsoft, Meta, AWS, Google Cloud, Tesla, Gaming community

---

## Use Cases

### 1. **Investment Research**
```
Analyze vertical integration and supply chain dependencies
Example: AAPL SCH shows reliance on TSMC for chips
```

### 2. **Risk Assessment**
```
Identify single points of failure in supply chains
Example: TSLA SCH reveals battery supplier concentration
```

### 3. **Opportunity Discovery**
```
Find related companies in the ecosystem
Example: NVDA SCH shows major cloud customers (MSFT, AMZN, GOOGL)
```

### 4. **Competitive Analysis**
```
Compare supply chains across competitors
Example: Compare AAPL vs MSFT supplier networks
```

### 5. **Industry Mapping**
```
Understand relationships in tech, automotive, or other sectors
Example: TSLA SCH maps EV supply chain relationships
```

---

## Technical Details

### Backend
- **Endpoint**: `/api/supply-chain/:ticker`
- **Data Source**: Curated supply chain database
- **Response Format**: JSON with suppliers and customers arrays
- **Fallback**: Generic template for tickers without specific data

### Frontend
- **Component**: `SupplyChainFunction.tsx`
- **Styling**: Styled-components with terminal theme
- **Layout**: CSS Grid (3 columns: suppliers | hub | customers)
- **Animations**: Keyframe pulse for hub, hover transitions

### Data Structure
```typescript
interface SupplyChainEntity {
  name: string;           // Company or entity name
  ticker?: string;        // Stock ticker if public
  category: string;       // Relationship category
  description: string;    // Details about the relationship
}

interface CompanySupplyChain {
  company: string;        // Company name
  ticker: string;         // Stock ticker
  industry: string;       // Industry sector
  suppliers: SupplyChainEntity[];
  customers: SupplyChainEntity[];
}
```

---

## UI Components

### Center Hub
```tsx
<CenterCompany>
  <CenterCompanyName>{company}</CenterCompanyName>
  <CenterTicker>{ticker}</CenterTicker>
  <CenterLabel>HUB</CenterLabel>
</CenterCompany>
```

### Entity Cards (Suppliers/Customers)
```tsx
<EntityCard>
  <EntityName>{name}</EntityName>
  <EntityTicker>({ticker})</EntityTicker>
  <EntityCategory>{category}</EntityCategory>
  <EntityDescription>{description}</EntityDescription>
</EntityCard>
```

---

## Examples in Action

### Example 1: Apple's Chip Supply
```
Command: AAPL SCH

Shows:
- TSMC as primary chip manufacturer
- Samsung for displays and memory
- Qualcomm for 5G modems
- Broadcom for wireless chips
```

### Example 2: Tesla's Battery Network
```
Command: TSLA SCH

Shows:
- Panasonic as primary battery partner
- CATL for LFP batteries
- LG Energy for energy storage
- Albemarle for lithium supply
```

### Example 3: NVIDIA's AI Ecosystem
```
Command: NVDA SCH

Shows:
- TSMC as exclusive manufacturer
- SK Hynix for HBM3 memory
- Microsoft, Meta, Amazon as major GPU buyers
- Cloud providers as customers
```

---

## Integration with Other Features

### 🔗 Works With Layouts
```
Save supply chain diagrams in panel layouts
Example: 4-panel layout with AAPL DES, AAPL SCH, TSM DES, QCOM DES
```

### 🔗 Complementary Functions
- **DES**: Company overview → then SCH for supply chain
- **GIP**: Price chart → then SCH to see supplier stock relationships
- **N**: News about company → SCH to understand affected suppliers/customers

### 🔗 Research Workflow
```
1. AAPL DES    - Get company overview
2. AAPL SCH    - See supply chain
3. TSMC DES    - Research key supplier
4. TSM GIP     - Check supplier stock performance
```

---

## Tips & Best Practices

### 💡 Research Tips
1. **Start with the center** - Understand the company first
2. **Follow the arrows** - Trace material flow (suppliers) and product flow (customers)
3. **Check ticker symbols** - Hover to see investable supplier/customer companies
4. **Compare chains** - Load multiple companies to compare supply networks

### 💡 Layout Ideas
```
Panel 1: NVDA SCH     (See NVIDIA's customers)
Panel 2: MSFT DES     (Microsoft buys NVIDIA GPUs)
Panel 3: AMZN DES     (AWS buys NVIDIA GPUs)
Panel 4: NVDA GIP     (NVIDIA stock performance)

Insight: Track how customer demand affects NVIDIA
```

### 💡 Risk Analysis
```
Panel 1: AAPL SCH     (See TSMC dependency)
Panel 2: TSM GIP      (TSMC stock chart)
Panel 3: AAPL GIP     (Apple stock chart)
Panel 4: AAPL N       (News about supply chain)

Insight: Monitor supply chain risks
```

---

## Keyboard Shortcuts

```
Ctrl+1/2/3/4   - Switch panels
<Ticker> SCH   - Load supply chain
ESC            - Clear panel
Ctrl+S         - Save layout with supply chain diagrams
```

---

## Future Enhancements

### Planned Features
- [ ] Interactive node clicking (click supplier → load their DES)
- [ ] Historical supply chain changes (track over time)
- [ ] Real-time price tickers for public suppliers/customers
- [ ] Export supply chain as image
- [ ] Detailed relationship metrics (revenue % from customer)
- [ ] Supply chain alerts (when key relationships change)

### Data Expansion
- [ ] Add more companies (Fortune 500)
- [ ] Industry-specific templates (automotive, pharma, retail)
- [ ] Dynamic data from SEC filings
- [ ] Partnership announcements integration

---

## Troubleshooting

### No data for ticker?
```
Generic template will display with placeholder suppliers/customers
Data available for: AAPL, TSLA, MSFT, AMZN, GOOGL, NVDA
More companies being added regularly
```

### Cards not displaying correctly?
```
- Check browser console for errors
- Try refreshing the panel
- Ensure server is running (check /api/supply-chain/:ticker endpoint)
```

### Hover effects not working?
```
- Browser compatibility issue (use Chrome/Edge)
- Check if animations are enabled in browser settings
```

---

## API Reference

### Endpoint
```
GET /api/supply-chain/:ticker
```

### Response Format
```json
{
  "company": "Apple Inc.",
  "ticker": "AAPL",
  "industry": "Consumer Electronics & Technology",
  "suppliers": [
    {
      "name": "Taiwan Semiconductor (TSMC)",
      "ticker": "TSM",
      "category": "Chip Manufacturing",
      "description": "Primary manufacturer of Apple Silicon chips"
    }
  ],
  "customers": [
    {
      "name": "Direct Consumers",
      "category": "Retail Customers",
      "description": "Individual buyers through Apple Stores"
    }
  ]
}
```

---

## Credits

**Data Sources:**
- Company annual reports (10-K filings)
- Investor relations disclosures
- Industry research reports
- Public partnership announcements

**Design:**
- Terminal-style UI consistent with Stock Terminal theme
- Inspired by Bloomberg supply chain analysis tools
- Interactive diagrams for better understanding

---

## Quick Reference

| Action | Command | Description |
|--------|---------|-------------|
| Load Supply Chain | `<TICKER> SCH` | Display full supply chain diagram |
| Example: Apple | `AAPL SCH` | Show Apple's suppliers and customers |
| Example: Tesla | `TSLA SCH` | Show Tesla's supply chain |
| Example: NVIDIA | `NVDA SCH` | Show NVIDIA's ecosystem |

---

**Version**: 1.0.0  
**Last Updated**: October 3, 2025  
**Status**: ✅ Production Ready

---

🎯 **Try it now**: Type `AAPL SCH` in any panel to see Apple's supply chain ecosystem!
