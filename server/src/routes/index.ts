import express from 'express';
import { executeFunction } from '../services/commandExecutor.js';
import { getCompanyOverview } from '../services/dataProviders.js';
import { alertEngine, AlertType, AlertStatus } from '../services/alertEngine.js';
import { getSupplyChainData } from '../services/supplyChainProvider.js';
import { getOptionsChain, getOptionsChainByExpiration, getSupportedTickers } from '../services/optionsProvider.js';

const router = express.Router();

// Execute command - main endpoint
router.get('/execute', async (req, res, next) => {
  try {
    const { ticker, function: func } = req.query;

    if (!ticker || !func) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: ticker and function'
      });
    }

    const data = await executeFunction(ticker as string, func as string);

    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    next(error);
  }
});

// Get real-time quote
router.get('/quote/:ticker', async (req, res, next) => {
  try {
    const { ticker } = req.params;
    const data = await getCompanyOverview(ticker);
    
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    next(error);
  }
});

// Get historical data
router.get('/historical/:ticker', async (req, res, next) => {
  try {
    const { ticker } = req.params;
    const { range = '1M' } = req.query;
    
    // This will be implemented in dataProviders
    res.json({
      success: true,
      data: { message: 'Historical data endpoint' }
    });
  } catch (error: any) {
    next(error);
  }
});

// ============================================
// ALERT ROUTES
// ============================================

// Get all alerts
router.get('/alerts', async (req, res, next) => {
  try {
    const alerts = alertEngine.getAllAlerts();
    res.json({
      success: true,
      data: alerts
    });
  } catch (error: any) {
    next(error);
  }
});

// Get alerts by ticker
router.get('/alerts/ticker/:ticker', async (req, res, next) => {
  try {
    const { ticker } = req.params;
    const alerts = alertEngine.getAlertsByTicker(ticker);
    res.json({
      success: true,
      data: alerts
    });
  } catch (error: any) {
    next(error);
  }
});

// Get active alerts
router.get('/alerts/active', async (req, res, next) => {
  try {
    const alerts = alertEngine.getActiveAlerts();
    res.json({
      success: true,
      data: alerts
    });
  } catch (error: any) {
    next(error);
  }
});

// Get triggered alerts
router.get('/alerts/triggered', async (req, res, next) => {
  try {
    const alerts = alertEngine.getTriggeredAlerts();
    res.json({
      success: true,
      data: alerts
    });
  } catch (error: any) {
    next(error);
  }
});

// Get alert statistics
router.get('/alerts/stats', async (req, res, next) => {
  try {
    const stats = alertEngine.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    next(error);
  }
});

// Create new alert
router.post('/alerts', async (req, res, next) => {
  try {
    const { ticker, type, threshold, message } = req.body;

    if (!ticker || !type || threshold === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: ticker, type, and threshold'
      });
    }

    // Validate alert type
    if (!Object.values(AlertType).includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid alert type. Must be one of: ${Object.values(AlertType).join(', ')}`
      });
    }

    const alert = alertEngine.addAlert({
      ticker: ticker.toUpperCase(),
      type,
      threshold: parseFloat(threshold),
      message
    });

    res.json({
      success: true,
      data: alert
    });
  } catch (error: any) {
    next(error);
  }
});

// Update alert
router.put('/alerts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const alert = alertEngine.updateAlert(id, updates);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error: any) {
    next(error);
  }
});

// Toggle alert (ACTIVE <-> DISABLED)
router.patch('/alerts/:id/toggle', async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = alertEngine.toggleAlert(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error: any) {
    next(error);
  }
});

// Delete alert
router.delete('/alerts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = alertEngine.deleteAlert(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted'
    });
  } catch (error: any) {
    next(error);
  }
});

// Clear all triggered alerts
router.post('/alerts/clear-triggered', async (req, res, next) => {
  try {
    const count = alertEngine.clearTriggered();
    res.json({
      success: true,
      message: `Cleared ${count} triggered alerts`,
      count
    });
  } catch (error: any) {
    next(error);
  }
});

// Supply Chain Diagram endpoint
router.get('/supply-chain/:ticker', async (req, res, next) => {
  try {
    const { ticker } = req.params;
    
    if (!ticker) {
      return res.status(400).json({
        success: false,
        error: 'Missing ticker parameter'
      });
    }

    const data = await getSupplyChainData(ticker);
    
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// Options Chain endpoints

// Get complete options chain for a ticker
router.get('/options/:ticker', async (req, res, next) => {
  try {
    const { ticker } = req.params;
    
    if (!ticker) {
      return res.status(400).json({
        success: false,
        error: 'Missing ticker parameter'
      });
    }

    const data = getOptionsChain(ticker);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: `Options data not available for ${ticker.toUpperCase()}. Supported tickers: ${getSupportedTickers().join(', ')}`
      });
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    next(error);
  }
});

// Get options chain for specific expiration
router.get('/options/:ticker/:expiration', async (req, res, next) => {
  try {
    const { ticker, expiration } = req.params;
    
    if (!ticker || !expiration) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: ticker and expiration'
      });
    }

    const data = getOptionsChainByExpiration(ticker, expiration);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: `Options data not available for ${ticker.toUpperCase()} with expiration ${expiration}`
      });
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    next(error);
  }
});

// Get list of supported tickers for options
router.get('/options', async (req, res, next) => {
  try {
    const tickers = getSupportedTickers();
    
    res.json({
      success: true,
      data: {
        tickers,
        count: tickers.length
      }
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;
