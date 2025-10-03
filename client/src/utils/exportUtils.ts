/**
 * Utility functions for exporting data to CSV/Excel formats
 */

/**
 * Convert array of objects to CSV string
 */
export const arrayToCSV = (data: any[], headers?: string[]): string => {
  if (!data || data.length === 0) {
    return '';
  }

  // Get headers from first object if not provided
  const columnHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const csvHeaders = columnHeaders.join(',');
  
  // Create data rows
  const csvRows = data.map(row => {
    return columnHeaders.map(header => {
      const value = row[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export financial data to CSV
 */
export const exportFinancialData = (data: any, ticker: string): void => {
  if (!data) return;

  // Income Statement
  if (data.incomeStatement && data.incomeStatement.length > 0) {
    const incomeCSV = arrayToCSV(
      data.incomeStatement.map((item: any) => ({
        'Fiscal Year': item.fiscalYear,
        'Revenue': item.revenue,
        'Gross Profit': item.grossProfit,
        'Operating Income': item.operatingIncome,
        'Net Income': item.netIncome,
        'EPS': item.eps,
        'EBITDA': item.ebitda,
      }))
    );
    downloadCSV(incomeCSV, `${ticker}_income_statement.csv`);
  }

  // Balance Sheet (optional second export)
  if (data.balanceSheet && data.balanceSheet.length > 0) {
    setTimeout(() => {
      const balanceCSV = arrayToCSV(
        data.balanceSheet.map((item: any) => ({
          'Fiscal Year': item.fiscalYear,
          'Total Assets': item.totalAssets,
          'Total Liabilities': item.totalLiabilities,
          'Total Equity': item.totalEquity,
          'Cash': item.cashAndEquivalents,
          'Total Debt': item.totalDebt,
          'Current Ratio': item.currentRatio,
        }))
      );
      downloadCSV(balanceCSV, `${ticker}_balance_sheet.csv`);
    }, 500);
  }
};

/**
 * Export watchlist to CSV
 */
export const exportWatchlist = (items: any[]): void => {
  if (!items || items.length === 0) return;

  const csv = arrayToCSV(
    items.map(item => ({
      'Ticker': item.ticker,
      'Name': item.name,
      'Price': item.price,
      'Change': item.change,
      'Change %': item.changePercent,
      'Volume': item.volume,
      'Last Update': item.lastUpdate,
    }))
  );

  const date = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `watchlist_${date}.csv`);
};

/**
 * Export price data to CSV
 */
export const exportPriceData = (prices: any[], ticker: string): void => {
  if (!prices || prices.length === 0) return;

  const csv = arrayToCSV(
    prices.map(p => ({
      'Date': p.date,
      'Open': p.open,
      'High': p.high,
      'Low': p.low,
      'Close': p.close,
      'Volume': p.volume,
    }))
  );

  downloadCSV(csv, `${ticker}_prices.csv`);
};
