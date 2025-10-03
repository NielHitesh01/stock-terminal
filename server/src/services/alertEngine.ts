import { getCompanyOverview, getHistoricalPrices } from './dataProviders.js';

// Define alert types locally to avoid import issues
export enum AlertType {
  PRICE_ABOVE = 'PRICE_ABOVE',
  PRICE_BELOW = 'PRICE_BELOW',
  RSI_ABOVE = 'RSI_ABOVE',
  RSI_BELOW = 'RSI_BELOW',
  VOLUME_SPIKE = 'VOLUME_SPIKE'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  TRIGGERED = 'TRIGGERED',
  DISABLED = 'DISABLED'
}

export interface Alert {
  id: string;
  ticker: string;
  type: AlertType;
  threshold: number;
  status: AlertStatus;
  createdAt: string;
  triggeredAt?: string;
  message?: string;
  notificationSent?: boolean;
}

export interface AlertCheckResult {
  alert: Alert;
  triggered: boolean;
  currentValue?: number;
  message?: string;
}

/**
 * Alert Engine - Monitors price/RSI thresholds and triggers notifications
 * Checks alerts every 30 seconds
 */
class AlertEngine {
  private alerts: Alert[] = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private readonly CHECK_INTERVAL_MS = 30000; // 30 seconds

  constructor() {
    console.log('🔔 Alert Engine initialized');
  }

  /**
   * Start the alert monitoring engine
   */
  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Alert Engine already running');
      return;
    }

    console.log('▶️ Starting Alert Engine...');
    this.isRunning = true;
    
    // Run initial check
    this.checkAllAlerts();
    
    // Set up interval
    this.checkInterval = setInterval(() => {
      this.checkAllAlerts();
    }, this.CHECK_INTERVAL_MS);

    console.log(`✅ Alert Engine started (checking every ${this.CHECK_INTERVAL_MS / 1000}s)`);
  }

  /**
   * Stop the alert monitoring engine
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Alert Engine stopped');
  }

  /**
   * Add a new alert
   */
  addAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'status'>): Alert {
    const newAlert: Alert = {
      ...alert,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      status: AlertStatus.ACTIVE,
      notificationSent: false
    };

    this.alerts.push(newAlert);
    console.log(`➕ Alert added: ${newAlert.ticker} ${newAlert.type} ${newAlert.threshold}`);
    
    return newAlert;
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): Alert[] {
    return [...this.alerts];
  }

  /**
   * Get alerts for a specific ticker
   */
  getAlertsByTicker(ticker: string): Alert[] {
    return this.alerts.filter(alert => 
      alert.ticker.toUpperCase() === ticker.toUpperCase()
    );
  }

  /**
   * Get active alerts only
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.status === AlertStatus.ACTIVE);
  }

  /**
   * Get triggered alerts
   */
  getTriggeredAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.status === AlertStatus.TRIGGERED);
  }

  /**
   * Update an alert
   */
  updateAlert(id: string, updates: Partial<Alert>): Alert | null {
    const index = this.alerts.findIndex(alert => alert.id === id);
    
    if (index === -1) {
      console.log(`⚠️ Alert not found: ${id}`);
      return null;
    }

    this.alerts[index] = {
      ...this.alerts[index],
      ...updates
    };

    console.log(`✏️ Alert updated: ${id}`);
    return this.alerts[index];
  }

  /**
   * Delete an alert
   */
  deleteAlert(id: string): boolean {
    const index = this.alerts.findIndex(alert => alert.id === id);
    
    if (index === -1) {
      console.log(`⚠️ Alert not found: ${id}`);
      return false;
    }

    const alert = this.alerts[index];
    this.alerts.splice(index, 1);
    console.log(`🗑️ Alert deleted: ${alert.ticker} ${alert.type}`);
    
    return true;
  }

  /**
   * Toggle alert status (ACTIVE <-> DISABLED)
   */
  toggleAlert(id: string): Alert | null {
    const alert = this.alerts.find(a => a.id === id);
    
    if (!alert) {
      return null;
    }

    if (alert.status === AlertStatus.TRIGGERED) {
      // Reset triggered alert to active
      alert.status = AlertStatus.ACTIVE;
      alert.triggeredAt = undefined;
      alert.message = undefined;
      alert.notificationSent = false;
    } else {
      // Toggle between ACTIVE and DISABLED
      alert.status = alert.status === AlertStatus.ACTIVE 
        ? AlertStatus.DISABLED 
        : AlertStatus.ACTIVE;
    }

    console.log(`🔄 Alert toggled: ${id} -> ${alert.status}`);
    return alert;
  }

  /**
   * Clear all triggered alerts
   */
  clearTriggered(): number {
    const triggeredCount = this.alerts.filter(
      a => a.status === AlertStatus.TRIGGERED
    ).length;
    
    this.alerts = this.alerts.filter(
      a => a.status !== AlertStatus.TRIGGERED
    );
    
    console.log(`🧹 Cleared ${triggeredCount} triggered alerts`);
    return triggeredCount;
  }

  /**
   * Check all active alerts
   */
  private async checkAllAlerts(): Promise<void> {
    const activeAlerts = this.getActiveAlerts();
    
    if (activeAlerts.length === 0) {
      return;
    }

    console.log(`🔍 Checking ${activeAlerts.length} active alerts...`);

    // Group alerts by ticker to minimize API calls
    const alertsByTicker = this.groupAlertsByTicker(activeAlerts);
    
    for (const [ticker, alerts] of Object.entries(alertsByTicker)) {
      await this.checkAlertsForTicker(ticker, alerts);
    }
  }

  /**
   * Check alerts for a specific ticker
   */
  private async checkAlertsForTicker(ticker: string, alerts: Alert[]): Promise<void> {
    try {
      // Fetch current price from company overview
      const overview = await getCompanyOverview(ticker);
      const currentPrice = overview?.price || 0;
      
      // Check if any alerts need RSI data
      const needsRSI = alerts.some(
        a => a.type === AlertType.RSI_ABOVE || a.type === AlertType.RSI_BELOW
      );
      
      let currentRSI: number | undefined;
      
      if (needsRSI) {
        try {
          // Fetch historical prices with indicators
          const priceData = await getHistoricalPrices(ticker, '50', true);
          const rsiValues = priceData?.indicators?.rsi;
          currentRSI = rsiValues && rsiValues.length > 0 
            ? rsiValues[rsiValues.length - 1] 
            : undefined;
        } catch (error) {
          console.error(`❌ Failed to fetch RSI for ${ticker}:`, error);
        }
      }

      // Check each alert
      for (const alert of alerts) {
        const result = this.checkAlert(alert, currentPrice, currentRSI);
        
        if (result.triggered) {
          this.triggerAlert(result);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to check alerts for ${ticker}:`, error);
    }
  }

  /**
   * Check a single alert
   */
  private checkAlert(
    alert: Alert, 
    currentPrice: number, 
    currentRSI?: number
  ): AlertCheckResult {
    let triggered = false;
    let currentValue: number | undefined;
    let message: string = '';

    switch (alert.type) {
      case AlertType.PRICE_ABOVE:
        currentValue = currentPrice;
        triggered = currentPrice > alert.threshold;
        if (triggered) {
          message = `${alert.ticker} price $${currentPrice.toFixed(2)} is above $${alert.threshold.toFixed(2)}`;
        }
        break;

      case AlertType.PRICE_BELOW:
        currentValue = currentPrice;
        triggered = currentPrice < alert.threshold;
        if (triggered) {
          message = `${alert.ticker} price $${currentPrice.toFixed(2)} is below $${alert.threshold.toFixed(2)}`;
        }
        break;

      case AlertType.RSI_ABOVE:
        if (currentRSI !== undefined) {
          currentValue = currentRSI;
          triggered = currentRSI > alert.threshold;
          if (triggered) {
            message = `${alert.ticker} RSI ${currentRSI.toFixed(2)} is above ${alert.threshold.toFixed(2)}`;
          }
        }
        break;

      case AlertType.RSI_BELOW:
        if (currentRSI !== undefined) {
          currentValue = currentRSI;
          triggered = currentRSI < alert.threshold;
          if (triggered) {
            message = `${alert.ticker} RSI ${currentRSI.toFixed(2)} is below ${alert.threshold.toFixed(2)}`;
          }
        }
        break;

      default:
        console.warn(`⚠️ Unknown alert type: ${alert.type}`);
    }

    return {
      alert,
      triggered,
      currentValue,
      message
    };
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(result: AlertCheckResult): void {
    const { alert, message, currentValue } = result;

    // Update alert status
    alert.status = AlertStatus.TRIGGERED;
    alert.triggeredAt = new Date().toISOString();
    alert.message = message;
    alert.notificationSent = true;

    console.log(`🚨 ALERT TRIGGERED: ${message}`);

    // Note: Browser notifications are handled on the frontend
    // This just marks the alert as triggered
  }

  /**
   * Group alerts by ticker
   */
  private groupAlertsByTicker(alerts: Alert[]): Record<string, Alert[]> {
    return alerts.reduce((acc, alert) => {
      const ticker = alert.ticker.toUpperCase();
      if (!acc[ticker]) {
        acc[ticker] = [];
      }
      acc[ticker].push(alert);
      return acc;
    }, {} as Record<string, Alert[]>);
  }

  /**
   * Generate unique alert ID
   */
  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get engine statistics
   */
  getStats(): {
    isRunning: boolean;
    totalAlerts: number;
    activeAlerts: number;
    triggeredAlerts: number;
    disabledAlerts: number;
  } {
    return {
      isRunning: this.isRunning,
      totalAlerts: this.alerts.length,
      activeAlerts: this.alerts.filter(a => a.status === AlertStatus.ACTIVE).length,
      triggeredAlerts: this.alerts.filter(a => a.status === AlertStatus.TRIGGERED).length,
      disabledAlerts: this.alerts.filter(a => a.status === AlertStatus.DISABLED).length
    };
  }
}

// Singleton instance
export const alertEngine = new AlertEngine();

// Auto-start the engine
alertEngine.start();
