# 🧪 Testing Guide - Phase 2 Features

## Quick Test Checklist

### 1. FA (Financial Analysis) Function

**Test Commands:**
```
AAPL FA
MSFT FA
GOOGL FA
TSLA FA
JPM FA
```

**What to Verify:**
- ✅ Income Statement table displays (5 years)
- ✅ Balance Sheet table displays (5 years)
- ✅ Key Ratios cards display
- ✅ Numbers formatted correctly (B/M/T suffixes)
- ✅ Color indicators work (green/red)
- ✅ All columns aligned properly
- ✅ Loading spinner appears briefly
- ✅ Data loads within 2-3 seconds

**Expected Results:**
- Revenue, Net Income, EPS for 5 fiscal years
- Assets, Liabilities, Equity for 5 fiscal years
- P/E, P/B, ROE, ROA, D/E ratios displayed
- Professional Bloomberg-style tables

---

### 2. HELP Function

**Test Command:**
```
HELP
```

**What to Verify:**
- ✅ All 4 commands listed (DES, GIP, FA, HELP)
- ✅ Descriptions clear and accurate
- ✅ Usage examples shown
- ✅ Feature lists display
- ✅ Keyboard shortcuts section present
- ✅ Tips section present
- ✅ Professional formatting

**Expected Results:**
- Clean, readable documentation
- Example commands clickable/visible
- Category badges shown
- Professional terminal theme

---

### 3. Error Handling

**Test Invalid Commands:**
```
INVALID FA          # Should show ticker validation error
AAPL BADCMD        # Should show unknown function error
123ABC DES         # Should show ticker format error
```

**What to Verify:**
- ✅ Error messages are user-friendly
- ✅ Red error box displays
- ✅ Helpful guidance provided
- ✅ No application crashes
- ✅ Status bar shows error message

---

### 4. Multi-Panel Testing

**Test Scenario:**
1. Panel 1: `AAPL DES`
2. Panel 2: `AAPL GIP`
3. Panel 3: `AAPL FA`
4. Panel 4: `HELP`

**What to Verify:**
- ✅ All panels load simultaneously
- ✅ No interference between panels
- ✅ Each panel maintains its own data
- ✅ Panel switching with Ctrl+1/2/3/4 works
- ✅ Command history per panel works

---

### 5. Integration Testing

**Full Research Workflow:**
```
Panel 1: MSFT DES   → Company overview
Panel 2: MSFT GIP   → Price trends
Panel 3: MSFT FA    → Financials
Panel 4: HELP       → Reference
```

**What to Verify:**
- ✅ Complete research workflow possible
- ✅ Data loads correctly in each panel
- ✅ Can switch between functions easily
- ✅ Status bar updates appropriately
- ✅ Performance remains smooth

---

## Browser Console Checks

Open Developer Tools (F12) and verify:

**Console Should Show:**
```
✅ "Cache hit" messages (data caching working)
✅ "Returning mock data" (demo mode working)
✅ No red error messages
✅ Clean API responses
```

**Network Tab Should Show:**
```
✅ API calls to /api/execute
✅ 200 status codes
✅ Response times < 2 seconds
```

---

## Performance Benchmarks

| Metric | Target | Status |
|--------|--------|--------|
| FA Function Load Time | < 3 seconds | ✅ |
| HELP Function Load Time | < 0.5 seconds | ✅ |
| Error Response Time | < 0.1 seconds | ✅ |
| Panel Switch Time | < 0.2 seconds | ✅ |
| Cached Data Load | < 0.1 seconds | ✅ |

---

## Known Limitations (Expected)

1. **API Rate Limits**: Alpha Vantage free tier = 5 calls/minute
2. **Mock Data**: Used when API unavailable or rate limited
3. **Historical Data**: Limited to available API data
4. **Real-Time**: Not yet implemented (Phase 3)

---

## Troubleshooting

### Issue: "No data available"
**Solution**: 
- Check if ticker is valid (e.g., AAPL, MSFT)
- Verify API key in .env file
- Check internet connection
- Try again (may be rate limited)

### Issue: Server not responding
**Solution**:
- Restart dev servers: `npm run dev`
- Check port 3002 not in use
- Verify server started successfully

### Issue: UI not updating
**Solution**:
- Hard refresh browser (Ctrl+F5)
- Clear cache
- Check browser console for errors

---

## Success Criteria

### ✅ Phase 2 is Complete When:
- [ ] FA function displays 5-year financials
- [ ] HELP function shows all commands
- [ ] Error handling is user-friendly
- [ ] Multi-panel workflow works smoothly
- [ ] No crashes or freezes
- [ ] Professional appearance maintained
- [ ] All test commands work

---

## Report Issues

If you encounter any problems:

1. **Note the exact command used**
2. **Screenshot the error (if any)**
3. **Check browser console (F12)**
4. **Note which panel (1-4)**
5. **Try in different panel**
6. **Restart if needed**

---

*Last Updated: October 3, 2025*
