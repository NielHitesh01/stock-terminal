# 📋 Layout Management Guide

**Version:** 2.1.0  
**Feature:** Save & Load Panel Layouts  
**Status:** ✅ Complete

---

## 🎯 Overview

The **Layout Management** feature allows you to save and load your panel configurations, including:
- Ticker symbols in each panel
- Function loaded (DES, GIP, FA, etc.)
- Panel data states
- Your complete workspace setup

**Benefits:**
- ✅ Save time - No need to manually load tickers every session
- ✅ Multiple workflows - Switch between different analysis setups instantly
- ✅ Share layouts - Export and share with colleagues
- ✅ Auto-load - Set a default layout to load on startup

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+S** | Open Layout Manager (Save focus) |
| **Ctrl+L** | Open Layout Manager (Load focus) |
| **ESC** | Close Layout Manager |

---

## 🚀 Quick Start

### Save Your First Layout

**Step 1:** Set up your panels
```
Panel 1: AAPL DES
Panel 2: AAPL GIP  
Panel 3: AAPL FA
Panel 4: W (with your watchlist)
```

**Step 2:** Open Layout Manager
- Press **Ctrl+S** OR
- Click **"📋 Layouts"** button in status bar

**Step 3:** Name and save
```
Enter name: "AAPL Analysis"
Click "Save" button
```

**Done!** Your layout is now saved to browser localStorage.

---

### Load a Saved Layout

**Step 1:** Open Layout Manager
- Press **Ctrl+L** OR
- Click **"📋 Layouts"** button in status bar

**Step 2:** Click on a saved layout
- Click the layout name OR
- Click the **"Load"** button

**Step 3:** Panels update automatically
- All tickers reload
- Functions re-execute
- Your workspace is restored!

---

## 📋 Layout Manager Interface

### Main Sections

**1. Save Current Layout**
- Text input for layout name
- **Save** button
- Enter key shortcut

**2. Saved Layouts List**
- All your saved layouts
- Shows:
  - Layout name
  - Number of active panels
  - Last updated date/time
- Click to load
- **Load** button (cyan)
- **Delete** button (red)

**3. Import / Export**
- **Export All Layouts** - Download JSON file
- **Import Layouts** - Upload JSON file
- Great for backup and sharing!

---

## 💡 Common Use Cases

### Use Case 1: Daily Routine

**Morning Routine:**
```
Layout: "Morning Check"
Panel 1: W (watchlist overview)
Panel 2: EQS (screener for opportunities)
Panel 3: Empty (for ad-hoc analysis)
Panel 4: N (latest news)
```

**Research Mode:**
```
Layout: "Deep Dive"
Panel 1: [TICKER] DES
Panel 2: [TICKER] GIP (chart)
Panel 3: [TICKER] FA (financials)
Panel 4: [TICKER] FIL (SEC filings)
```

**Quick Trade:**
```
Layout: "Quick Look"
Panel 1-4: GIP charts of 4 different tickers
All in fullscreen mode for rapid analysis
```

---

### Use Case 2: Multiple Workflows

**Fundamental Analysis Layout:**
```
Panel 1: DES (company overview)
Panel 2: FA (financials)
Panel 3: FIL (SEC filings)
Panel 4: N (news)
```

**Technical Trading Layout:**
```
Panel 1-3: GIP charts (different tickers)
Panel 4: W (watchlist with alerts)
```

**Sector Comparison Layout:**
```
Panel 1: AAPL FA (Technology)
Panel 2: JPM FA (Finance)
Panel 3: JNJ FA (Healthcare)
Panel 4: XOM FA (Energy)
```

---

### Use Case 3: Team Collaboration

**Export Your Layout:**
1. Create your perfect analysis setup
2. Click **Export All Layouts**
3. Share JSON file with colleagues
4. They click **Import Layouts**
5. Everyone has the same setup!

**Standardized Workflows:**
```
"Earnings Analysis" → Load before earnings calls
"Due Diligence" → Load for acquisition research
"Portfolio Review" → Load for weekly reviews
```

---

## 🔧 Advanced Features

### Auto-Load Default Layout

Currently, the terminal auto-loads the last layout you had open on refresh. To change this behavior:

**Future enhancement:** Right-click a layout and select "Set as Default"

### Layout Metadata

Each saved layout includes:
- **Name** - Your custom name
- **Panels** - All 4 panel states
- **Created At** - When first saved
- **Updated At** - When last modified
- **Active Panels** - Count of panels with data

### Storage Limits

**Browser localStorage limits:**
- Typically 5-10 MB
- Each layout: ~5-50 KB (depending on data)
- You can save 100+ layouts easily

**If storage is full:**
1. Delete old unused layouts
2. Export and save to files
3. Clear browser cache (keeps localStorage)

---

## 📤 Import / Export

### Export Layouts

**When to export:**
- Backup your layouts
- Share with team
- Move to another computer
- Keep version history

**How to export:**
1. Open Layout Manager (Ctrl+L)
2. Scroll to bottom
3. Click **"Export All Layouts"**
4. JSON file downloads: `stock-terminal-layouts-YYYY-MM-DD.json`

**File contents:**
```json
[
  {
    "name": "AAPL Analysis",
    "panels": [...],
    "createdAt": "2025-10-03T12:00:00.000Z",
    "updatedAt": "2025-10-03T14:30:00.000Z"
  }
]
```

---

### Import Layouts

**When to import:**
- Restore from backup
- Load colleague's layouts
- Move from another computer
- Merge layout collections

**How to import:**
1. Open Layout Manager (Ctrl+L)
2. Scroll to bottom
3. Click **"Import Layouts"**
4. Select JSON file
5. Layouts merge with existing (duplicates get " (imported)" suffix)

**Safe import:**
- Original layouts are preserved
- Imported layouts add to your collection
- No data loss!

---

## 🎯 Best Practices

### Naming Conventions

**Good names:**
- ✅ "AAPL Analysis"
- ✅ "Morning Routine"
- ✅ "Sector Comparison - Tech"
- ✅ "Earnings Check 2025-Q3"

**Avoid:**
- ❌ "Layout 1"
- ❌ "Test"
- ❌ "asdf"
- ❌ "Unnamed"

### Organization Tips

**Use prefixes:**
```
"Daily - Morning Check"
"Daily - EOD Review"
"Research - Deep Dive"
"Research - Quick Look"
"Trading - Tech Analysis"
"Trading - Multiple Charts"
```

**Date-specific layouts:**
```
"Earnings - AAPL 2025-Q3"
"Conference - JP Morgan 2025"
"Backup - 2025-10-03"
```

---

## 🐛 Troubleshooting

### Layout Not Loading

**Problem:** Click load but panels don't update

**Solutions:**
1. Check browser console for errors (F12)
2. Refresh page (F5)
3. Try deleting and re-saving layout
4. Clear browser cache
5. Export layout, clear all, re-import

---

### Layout Data Missing

**Problem:** Loaded layout shows empty panels

**Possible causes:**
- API keys expired/missing
- Network connection lost
- Ticker delisted/invalid

**Solutions:**
1. Check internet connection
2. Verify API keys in `.env`
3. Try loading individual tickers manually
4. Check browser console for API errors

---

### Storage Quota Exceeded

**Problem:** "Save" fails with storage error

**Solutions:**
```
1. Delete unused layouts
2. Export important layouts to files
3. Clear other site data (not this site!)
4. Check browser storage settings
```

**Check storage usage:**
```javascript
// Browser console:
JSON.stringify(localStorage).length / 1024 / 1024
// Returns MB used
```

---

### Import Failed

**Problem:** Import button shows error

**Solutions:**
1. Check JSON file format
2. Verify file is not corrupted
3. Try exporting a test layout first
4. Compare file structures

---

## ⚠️ Important Notes

### Data Persistence

**Where layouts are stored:**
- Browser localStorage (not server)
- Specific to this domain
- Cleared if you clear browsing data

**To preserve layouts:**
1. Export regularly
2. Keep backup JSON files
3. Don't clear "Site Data" in browser settings

### Privacy & Security

**What's saved:**
- Panel configurations
- Ticker symbols
- Function names
- Layout names

**NOT saved:**
- Actual price data
- API keys
- Personal information
- Session data

**Safe to share:**
✅ Exported JSON files contain only configuration  
✅ No sensitive data included  
✅ Safe to email or post online  

---

## 📊 Layout Examples

### Example 1: "Portfolio Monitor"

```
Panel 1: W (watchlist with 10 holdings)
Panel 2: AAPL GIP (biggest position chart)
Panel 3: AAPL N (news for biggest position)
Panel 4: EQS (screener for new opportunities)

Use Case: Daily morning check
Time Saved: 5 minutes per day
```

### Example 2: "Earnings Analysis"

```
Panel 1: AAPL DES (company overview)
Panel 2: AAPL FA (financials)
Panel 3: AAPL FIL (latest 10-Q)
Panel 4: AAPL N (earnings news)

Use Case: Pre-earnings research
Time Saved: 10 minutes per company
```

### Example 3: "Sector Rotation"

```
Panel 1: XLF FA (Financial sector)
Panel 2: XLK FA (Technology sector)
Panel 3: XLE FA (Energy sector)
Panel 4: XLV FA (Healthcare sector)

Use Case: Weekly sector analysis
Time Saved: 15 minutes per week
```

---

## 🎓 Tutorial: Your First Layout

**5-Minute Tutorial**

**Step 1: Setup (2 min)**
```
1. Start terminal: npm run dev
2. Load data in each panel:
   - Panel 1: AAPL DES
   - Panel 2: AAPL GIP
   - Panel 3: AAPL FA
   - Panel 4: W (add MSFT, GOOGL)
```

**Step 2: Save (1 min)**
```
1. Press Ctrl+S
2. Type name: "My First Layout"
3. Click Save
4. See success message
```

**Step 3: Test (1 min)**
```
1. Clear all panels (click X on each)
2. Press Ctrl+L
3. Click "My First Layout"
4. Watch panels reload!
```

**Step 4: Export (1 min)**
```
1. Press Ctrl+L
2. Scroll to bottom
3. Click "Export All Layouts"
4. Check Downloads folder
```

**Congratulations!** 🎉 You've mastered layouts!

---

## 🚀 Next Steps

**Now that you have layouts:**

1. **Create multiple workflows**
   - Morning routine
   - Deep dive analysis
   - Quick checks
   
2. **Share with team**
   - Export your best layouts
   - Share JSON files
   - Standardize workflows

3. **Automate your routine**
   - Set default layout
   - Load on startup
   - Save time every day

---

## 📝 Keyboard Shortcuts Summary

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save layout (open manager) |
| Ctrl+L | Load layout (open manager) |
| Ctrl+1/2/3/4 | Switch panels |
| Ctrl+F | Fullscreen |
| Ctrl+H | Toggle command line |
| ESC | Close manager / Exit fullscreen |

---

## ✅ Feature Checklist

**What You Can Do:**
- ✅ Save unlimited layouts
- ✅ Load layouts instantly
- ✅ Delete old layouts
- ✅ Export to JSON file
- ✅ Import from JSON file
- ✅ Auto-load last layout
- ✅ See layout metadata
- ✅ Share layouts with team

**Coming Soon:**
- ⏳ Set default layout
- ⏳ Layout categories
- ⏳ Cloud sync
- ⏳ Layout templates

---

**Version:** 2.1.0  
**Status:** ✅ Production Ready  
**Date:** October 3, 2025

**Enjoy your new layout management system!** 🚀
