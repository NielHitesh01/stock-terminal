# 🧪 Quick Test Script - Panel Resizing & Fullscreen

## ✅ Quick 5-Minute Test

### Test 1: Automatic Panel Resizing (2 minutes)

**Steps:**
1. Start the terminal: `npm run dev`
2. Load data in all 4 panels:
   ```
   Panel 1: AAPL DES
   Panel 2: AAPL GIP
   Panel 3: AAPL FA
   Panel 4: W
   ```
3. **Resize browser window** - Drag corner smaller
4. **Verify:** All 4 panels shrink proportionally ✅
5. **Resize browser window** - Drag corner larger
6. **Verify:** All 4 panels expand proportionally ✅
7. **Maximize window** (F11)
8. **Verify:** Panels fill entire screen ✅

**Expected Result:**
- ✅ No horizontal scrollbar
- ✅ No vertical scrollbar on grid
- ✅ All panels remain visible
- ✅ Content scrolls within panels
- ✅ Smooth transitions

---

### Test 2: Fullscreen Mode - Keyboard (1 minute)

**Steps:**
1. Click Panel 1 (green border = active)
2. Press **Ctrl+F**
3. **Verify:** Panel 1 fills entire area ✅
4. **Verify:** Panels 2, 3, 4 are hidden ✅
5. **Verify:** Panel header shows "⛶ FULLSCREEN" in yellow ✅
6. **Verify:** Status bar shows "⛶ FULLSCREEN MODE - Panel 1" ✅
7. Press **ESC**
8. **Verify:** Back to 4-panel view ✅

**Expected Result:**
- ✅ Instant transition (< 100ms)
- ✅ No content reload
- ✅ Data preserved
- ✅ Active panel stays active

---

### Test 3: Fullscreen Mode - Buttons (1 minute)

**Steps:**
1. Click Panel 2 (make it active)
2. Click **⛶** button in Panel 2 header
3. **Verify:** Panel 2 in fullscreen ✅
4. Click **"Exit ⛶"** button in status bar
5. **Verify:** Back to 4-panel view ✅
6. Click Panel 3 (make it active)
7. Click **"Full ⛶"** button in status bar
8. **Verify:** Panel 3 in fullscreen ✅
9. Click **⛶** button in Panel 3 header
10. **Verify:** Back to 4-panel view ✅

**Expected Result:**
- ✅ Multiple entry/exit methods work
- ✅ Visual indicators update correctly
- ✅ Button text changes (Full → Exit)

---

### Test 4: Fullscreen with Commands (1 minute)

**Steps:**
1. Panel 1: `TSLA GIP` (load chart)
2. Press **Ctrl+F** (fullscreen)
3. **Verify:** Chart rendered correctly ✅
4. Toggle **SMA 20** button
5. **Verify:** Indicator displays ✅
6. Toggle **RSI** button
7. **Verify:** RSI bar shows below chart ✅
8. Press **ESC** (exit fullscreen)
9. Switch to Panel 2 (**Ctrl+2**)
10. Type: `TSLA FA` and press **Enter**
11. Press **Ctrl+F** (fullscreen)
12. **Verify:** Financial tables display ✅
13. Click **EXPORT CSV** button
14. **Verify:** 2 CSV files download ✅

**Expected Result:**
- ✅ All functions work in fullscreen
- ✅ Charts render properly
- ✅ Tables scroll correctly
- ✅ Buttons remain functional
- ✅ Export works

---

## 🔍 Detailed Component Testing

### Test Suite A: All Functions in Fullscreen

**Test each function:**

**DES Function:**
```
1. AAPL DES
2. Ctrl+F
3. Verify: Company info displayed clearly
4. ESC
```

**GIP Function:**
```
1. MSFT GIP
2. Ctrl+F
3. Verify: Chart fills screen
4. Toggle SMA 20, SMA 50, RSI
5. Verify: All indicators visible
6. ESC
```

**FA Function:**
```
1. GOOGL FA
2. Ctrl+F
3. Verify: Income statement readable
4. Scroll down
5. Verify: Balance sheet readable
6. ESC
```

**W Function:**
```
1. W
2. Add 3-4 tickers
3. Ctrl+F
4. Verify: All watchlist items visible
5. ESC
```

**N Function:**
```
1. TSLA N
2. Ctrl+F
3. Verify: News articles display
4. Click article link
5. Verify: Opens in new tab
6. ESC
```

**EQS Function:**
```
1. EQS
2. Set filters (Tech sector, P/E < 30)
3. Ctrl+F
4. Verify: Results table fills screen
5. Click column headers to sort
6. Verify: Sorting works
7. ESC
```

**FIL Function:**
```
1. AAPL FIL
2. Ctrl+F
3. Verify: Filing cards displayed
4. Click 10-K link
5. Verify: SEC.gov opens
6. ESC
```

**HELP Function:**
```
1. HELP
2. Ctrl+F
3. Verify: Documentation readable
4. Scroll through sections
5. ESC
```

---

### Test Suite B: Keyboard Shortcuts

**Test all shortcuts:**

| Shortcut | Action | Expected |
|----------|--------|----------|
| Ctrl+1 | Switch to Panel 1 | Green border on Panel 1 |
| Ctrl+2 | Switch to Panel 2 | Green border on Panel 2 |
| Ctrl+3 | Switch to Panel 3 | Green border on Panel 3 |
| Ctrl+4 | Switch to Panel 4 | Green border on Panel 4 |
| Ctrl+F | Toggle fullscreen | Active panel goes fullscreen |
| ESC | Exit fullscreen | Back to 4-panel view |
| Ctrl+H | Toggle command line | Input shows/hides |

---

### Test Suite C: Edge Cases

**Test 1: Rapid Panel Switching**
```
1. Ctrl+1 → Ctrl+F (Panel 1 fullscreen)
2. Ctrl+2 (Panel 2 becomes active and fullscreen)
3. Ctrl+3 (Panel 3 becomes active and fullscreen)
4. ESC (exit)
5. Verify: No errors, smooth transitions
```

**Test 2: Fullscreen with Empty Panel**
```
1. Click empty Panel 4
2. Ctrl+F
3. Verify: Panel 4 in fullscreen (shows empty state)
4. ESC
5. Verify: Back to 4-panel view
```

**Test 3: Multiple Entry/Exit Methods**
```
1. Ctrl+F (enter)
2. ESC (exit)
3. Click status bar "Full ⛶" (enter)
4. Click status bar "Exit ⛶" (exit)
5. Click panel header ⛶ (enter)
6. Click panel header ⛶ (exit)
7. Verify: All methods work
```

**Test 4: Window Resize in Fullscreen**
```
1. AAPL GIP
2. Ctrl+F (fullscreen)
3. Resize browser window
4. Verify: Chart resizes correctly
5. ESC
6. Verify: 4-panel view restored
```

**Test 5: Command Execution in Fullscreen**
```
1. Panel 1: AAPL DES
2. Ctrl+F (fullscreen)
3. Type in command line: "MSFT DES"
4. Press Enter
5. Verify: Data updates in fullscreen
6. ESC
```

---

## 🐛 Common Issues & Solutions

### Issue: Panels not resizing

**Check:**
- Browser zoom at 100%? (Ctrl+0)
- Developer console open? (F12 toggle)
- Browser window not at minimum size?

**Solution:**
```
1. Reset zoom: Ctrl+0
2. Close DevTools: F12
3. Refresh: F5
4. Try resizing again
```

### Issue: Fullscreen not activating

**Check:**
- Is panel active? (green border)
- Keyboard shortcuts enabled?
- Browser window focused?

**Solution:**
```
1. Click panel to activate
2. Verify green border
3. Try Ctrl+F again
4. Or use ⛶ button in header
```

### Issue: Can't exit fullscreen

**Try all methods:**
```
1. Press ESC
2. Press Ctrl+F
3. Click "Exit ⛶" in status bar
4. Click ⛶ in panel header
5. Refresh page (F5) as last resort
```

---

## ✅ Test Results Template

Copy and fill in:

```
## Test Results - [Your Name] - [Date]

### Test 1: Automatic Resizing
- [ ] Panels shrink with window
- [ ] Panels expand with window
- [ ] No overflow scrollbars
- [ ] Smooth transitions

### Test 2: Fullscreen Keyboard
- [ ] Ctrl+F enters fullscreen
- [ ] ESC exits fullscreen
- [ ] Visual indicators appear
- [ ] Status bar updates

### Test 3: Fullscreen Buttons
- [ ] Header ⛶ button works
- [ ] Status bar "Full" works
- [ ] Status bar "Exit" works
- [ ] All methods consistent

### Test 4: Fullscreen Commands
- [ ] GIP chart renders
- [ ] FA tables display
- [ ] Commands execute
- [ ] Export works

### Test Suite A: All Functions
- [ ] DES in fullscreen
- [ ] GIP in fullscreen
- [ ] FA in fullscreen
- [ ] W in fullscreen
- [ ] N in fullscreen
- [ ] EQS in fullscreen
- [ ] FIL in fullscreen
- [ ] HELP in fullscreen

### Test Suite B: Keyboard Shortcuts
- [ ] Ctrl+1/2/3/4 works
- [ ] Ctrl+F works
- [ ] ESC works
- [ ] Ctrl+H works

### Test Suite C: Edge Cases
- [ ] Rapid panel switching
- [ ] Empty panel fullscreen
- [ ] Multiple entry/exit
- [ ] Resize in fullscreen
- [ ] Commands in fullscreen

### Browser Tested:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

### Issues Found:
(List any bugs or unexpected behavior)

### Overall Rating:
- [ ] ⭐⭐⭐⭐⭐ Perfect
- [ ] ⭐⭐⭐⭐ Good
- [ ] ⭐⭐⭐ Acceptable
- [ ] ⭐⭐ Needs work
- [ ] ⭐ Critical issues

### Notes:
(Additional comments)
```

---

## 🚀 Quick Commands for Testing

**Copy and paste these into panels:**

```bash
# Panel 1
AAPL DES

# Panel 2
AAPL GIP

# Panel 3
AAPL FA

# Panel 4
W

# Add to watchlist
W ADD MSFT
W ADD GOOGL
W ADD TSLA

# Equity screener
EQS

# SEC filings
AAPL FIL

# News
TSLA N

# Help
HELP
```

---

## ⏱️ Estimated Testing Time

| Test Suite | Duration | Priority |
|------------|----------|----------|
| Quick 5-Minute Test | 5 min | HIGH |
| All Functions (Suite A) | 10 min | HIGH |
| Keyboard Shortcuts (Suite B) | 5 min | MEDIUM |
| Edge Cases (Suite C) | 10 min | LOW |
| **TOTAL** | **30 min** | - |

---

## 📝 Summary

**Minimum Testing:** Run Quick 5-Minute Test (critical functionality)  
**Recommended Testing:** Add Suite A (all functions)  
**Thorough Testing:** Complete all suites (30 minutes)

**Success Criteria:**
- ✅ All panels resize automatically
- ✅ Fullscreen enters/exits correctly
- ✅ Visual indicators work
- ✅ All functions display in fullscreen
- ✅ No errors in browser console
- ✅ Smooth performance (60 FPS)

**Ready to test?** Start with the Quick 5-Minute Test! 🚀
