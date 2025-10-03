# 🧪 BROWSER TESTING GUIDE - QUICK EXECUTION

**URL**: http://localhost:5173  
**Server**: ✅ Running on port 3002  
**Status**: Ready for testing

---

## ⚡ QUICK TEST SEQUENCE (15 minutes)

### 📊 Phase 1: Core Functions (5 min)

**Test all 7 core functions in sequence:**

```
1. AAPL DES    → Company description, verify price displays
2. AAPL GIP    → Chart with indicators, hover tooltip
3. AAPL FA     → Financial statements
4. AAPL N      → News articles list
5. W           → Watchlist (should be empty or have saved tickers)
6. EQS         → Equity screener UI
7. AAPL FIL    → SEC filings
```

**✅ Success Criteria:**
- All 7 commands execute without errors
- Data displays in each panel
- No console errors
- UI responsive

---

### 🆕 Phase 2: New Features (5 min)

#### Test 2A: Supply Chain (SCH)

```
Command: AAPL SCH
```

**Check:**
- ✅ **OVERVIEW Tab** displays:
  - Company name, ticker, industry
  - Founded 1976, Cupertino headquarters
  - Revenue $383.3B, Market Cap $2.8T
  - 7 competitive advantages listed
  - Green "Market Leader" badge

- ✅ **SUPPLY CHAIN Tab** displays:
  - Pulsing Apple hub in center
  - 6 suppliers on RIGHT (TSMC, Samsung, Foxconn, etc.)
  - 5 customers on LEFT (Direct Consumers, Enterprise, Best Buy, etc.)
  - Hover effects on cards

- ✅ **ANALYSIS Tab** displays:
  - 5 recent developments (iPhone 16, Vision Pro, OpenAI, India expansion)
  - Future outlook summary
  - 6 trends (cyan color)
  - 6 opportunities (green color)
  - 6 risks (orange color)

**Try other tickers:** `TSLA SCH`, `MSFT SCH` (should show basic supply chain only)

---

#### Test 2B: Options Chain (OPT)

```
Command: AAPL OPT
```

**Check:**
- ✅ **Header Section**:
  - "OPTIONS CHAIN | AAPL"
  - Underlying Price: $178.25
  - Timestamp displays

- ✅ **Controls**:
  - Expiration dropdown shows 6 dates
  - First date format: "10/17/2025 (14d)"
  - Strike filter buttons: [All] [ITM] [ATM] [OTM]
  - [✓ Show Greeks] toggle

- ✅ **Options Tables**:
  - Left side: CALLS (green header)
  - Right side: PUTS (red header)
  - 15 strikes per side
  - Columns: Strike, Bid, Ask, Last, Vol, OI, IV, Δ, Γ, Θ, V

- ✅ **Data Validation**:
  - Strikes centered around $178 (e.g., 160, 165, 170, 175, 180, 185, 190)
  - Call Deltas: 0 to 1.0 (higher for lower strikes)
  - Put Deltas: -1.0 to 0 (negative values)
  - IV displayed as percentage (e.g., 35.2%)
  - Volume and OI are reasonable numbers

- ✅ **Color Coding**:
  - Deep ITM calls/puts: Bright green Delta
  - ATM options: Light green Delta
  - OTM options: Gray Delta
  - High IV (60%+): Red
  - Medium IV (40-60%): Orange
  - Normal IV (25-40%): Yellow
  - Low IV (0-25%): Green

- ✅ **Interactions**:
  - Click expiration dropdown → changes chain
  - Click [ITM] → filters to in-the-money only
  - Click [ATM] → filters to at-the-money (few strikes)
  - Click [OTM] → filters to out-of-the-money only
  - Toggle Greeks → columns hide/show
  - ITM rows have subtle green background

**Try other tickers:** `TSLA OPT`, `NVDA OPT`, `SPY OPT`

**Compare volatility:**
- AAPL: ~30-35% IV (stable tech)
- TSLA: ~45-65% IV (volatile)
- SPY: ~15-20% IV (broad market)

---

### 🌐 Phase 3: WebSocket Streaming (3 min)

**Test real-time price updates:**

```
1. Open: AAPL DES
2. Watch top-right corner (price quote bar)
3. Wait 5-10 seconds
4. Look for:
   - Price changes
   - Green flash (price up) or red flash (price down)
   - Smooth transitions
```

**Multi-ticker test:**
```
Panel 1: AAPL DES
Panel 2: TSLA DES  
Panel 3: MSFT DES
```

**Check:**
- ✅ All 3 panels update independently
- ✅ Each has different price
- ✅ Updates every ~5 seconds
- ✅ No lag or freezing

**Browser Console Check:**
- Should see WebSocket connection messages
- No errors related to Socket.IO
- Updates logging (optional)

---

### 📦 Phase 4: Multi-Panel Test (2 min)

**Open 6 panels simultaneously:**

```
Panel 1: AAPL DES
Panel 2: AAPL GIP
Panel 3: AAPL SCH
Panel 4: AAPL OPT
Panel 5: TSLA DES
Panel 6: NVDA OPT
```

**Check:**
- ✅ All 6 panels display correctly
- ✅ Each panel loads its data
- ✅ No performance issues
- ✅ Scrolling smooth
- ✅ Can interact with each panel
- ✅ Active panel highlights (green border)

**Performance:**
- Open Task Manager
- Check browser memory usage
- Should be < 500MB for 6 panels
- CPU should be < 25% (idle)

---

## 🎯 EXPECTED RESULTS SUMMARY

### API Tests (Already Completed ✅)

| Test | Endpoint | Status |
|------|----------|--------|
| 1.1 | Health Check | ✅ PASS |
| 1.2 | Options Tickers | ✅ PASS (8 tickers) |
| 1.3 | Options Chain | ✅ PASS (15 strikes, 6 expirations) |
| 1.5 | Supply Chain | ✅ PASS (Full AAPL analysis) |
| 1.6 | Alerts Stats | ✅ PASS (0 active alerts) |

### Browser Tests (To Execute)

| Feature | Expected | Status |
|---------|----------|--------|
| Core Functions (7) | All load data | ⏳ PENDING |
| SCH - AAPL | 3 tabs, full analysis | ⏳ PENDING |
| OPT - AAPL | Options chain, Greeks | ⏳ PENDING |
| WebSocket | Updates every 5s | ⏳ PENDING |
| Multi-Panel | 6 panels smooth | ⏳ PENDING |

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: "Cannot connect to server"
**Fix**: Verify server running:
```powershell
netstat -ano | findstr "3002"
```
Should see PID 3560 (or similar) listening.

### Issue 2: "Options data not available"
**Fix**: Only these tickers supported:
- AAPL, TSLA, MSFT, AMZN, GOOGL, NVDA, SPY, QQQ

### Issue 3: WebSocket not connecting
**Fix**: Check browser console for errors. Look for:
```
Socket.IO connection established
Subscribed to ticker: AAPL
```

### Issue 4: Page loads slowly
**Fix**: 
- Clear browser cache (Ctrl+Shift+Delete)
- Close other browser tabs
- Restart browser

### Issue 5: Data not displaying
**Fix**:
- Check browser console for errors
- Verify network requests in DevTools (F12)
- Try different ticker (AAPL is most reliable)

---

## 📋 TEST CHECKLIST

**Before starting:**
- [ ] Server running (port 3002)
- [ ] Browser open (http://localhost:5173)
- [ ] DevTools open (F12) - Console tab
- [ ] Task Manager open (optional, for performance monitoring)

**Core Functions:**
- [ ] AAPL DES - Company description
- [ ] AAPL GIP - Price chart
- [ ] AAPL FA - Financials
- [ ] AAPL N - News
- [ ] W - Watchlist
- [ ] EQS - Screener
- [ ] AAPL FIL - Filings

**New Features:**
- [ ] AAPL SCH - OVERVIEW tab
- [ ] AAPL SCH - SUPPLY CHAIN tab
- [ ] AAPL SCH - ANALYSIS tab
- [ ] AAPL OPT - Options chain loads
- [ ] AAPL OPT - Expiration selector works
- [ ] AAPL OPT - Strike filters work (ITM/ATM/OTM)
- [ ] AAPL OPT - Greeks toggle works
- [ ] AAPL OPT - Color coding correct

**Streaming:**
- [ ] WebSocket connects
- [ ] Prices update every 5s
- [ ] Flash indicators work
- [ ] Multiple tickers stream independently

**Multi-Panel:**
- [ ] 6 panels open simultaneously
- [ ] All display correctly
- [ ] Performance acceptable
- [ ] No memory leaks

**Error Handling:**
- [ ] Invalid ticker shows error
- [ ] Error messages user-friendly
- [ ] Can recover from errors

---

## ✅ SUCCESS CRITERIA

**All tests pass if:**

1. ✅ **All 7 core functions** load data without errors
2. ✅ **AAPL SCH** displays all 3 tabs with complete analysis
3. ✅ **AAPL OPT** shows options chain with Greeks
4. ✅ **Options filters** (ITM/ATM/OTM) work correctly
5. ✅ **WebSocket streaming** updates prices every 5 seconds
6. ✅ **6 panels** run smoothly without performance issues
7. ✅ **No console errors** (except expected warnings)
8. ✅ **Memory usage** < 500MB
9. ✅ **CPU usage** < 25% idle

**Optional bonus tests:**
- [ ] Test TSLA OPT (high volatility ticker)
- [ ] Test SPY OPT (ETF, low volatility)
- [ ] Create a price alert
- [ ] Save and load a layout
- [ ] Test with 10+ panels

---

## 📸 VISUAL VERIFICATION GUIDE

### What Good Looks Like:

**Options Chain (OPT):**
```
┌─────────────────────────────────────────────────────┐
│ OPTIONS CHAIN | AAPL | Underlying: $178.25         │
├─────────────────────────────────────────────────────┤
│ Exp: [10/17/2025 (14d) ▼] [All][ITM][ATM][OTM]    │
├──────────────────────┬──────────────────────────────┤
│       CALLS          │         PUTS                 │
├──────┬───┬───┬───┬───┼──────┬───┬───┬───┬──────────┤
│Strike│Bid│Ask│Vol│IV │Strike│Bid│Ask│Vol│IV        │
├──────┼───┼───┼───┼───┼──────┼───┼───┼───┼──────────┤
│ 165  │13 │14 │... │🟢│ 165  │0.9│1.1│...│🟢        │
│ 170  │ 9 │10 │... │🟢│ 170  │1.8│2.0│...│🟢        │
│ 175  │ 6 │ 7 │... │🟡│ 175  │3.3│3.5│...│🟡        │
│ 180  │ 3 │ 4 │... │🟡│ 180  │5.8│6.0│...│🟡        │ ← ATM
│ 185  │ 1 │ 2 │... │🟢│ 185  │9.3│9.5│...│🟢        │
└──────┴───┴───┴───┴───┴──────┴───┴───┴───┴──────────┘
```

**Supply Chain (SCH - SUPPLY CHAIN Tab):**
```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   SUPPLIERS     │   │  Apple Inc.     │   │   CUSTOMERS     │
│   (RIGHT)       │   │    (CENTER)     │   │   (LEFT)        │
├─────────────────┤   │   PULSING ⭕    │   ├─────────────────┤
│ TSMC           │───│                 │───│ Direct Consumers│
│ Samsung        │───│     AAPL        │───│ Enterprise      │
│ Foxconn        │───│                 │───│ Best Buy        │
│ Qualcomm       │───│                 │───│ Carrier Partners│
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## 🎉 COMPLETION

**When all tests pass:**

1. ✅ Mark all checkboxes above
2. ✅ Note any issues in INTEGRATION_TESTS.md
3. ✅ Take screenshot of 6-panel layout (optional)
4. ✅ Update TODO list to "completed"
5. ✅ Proceed to final documentation phase

**Estimated Time:** 15-20 minutes for full test suite

**Current Status:** ⏳ READY TO BEGIN

---

**🚀 BEGIN TESTING NOW!**

Open http://localhost:5173 and start with `AAPL DES`
