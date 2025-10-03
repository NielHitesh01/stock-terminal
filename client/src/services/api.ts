import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface CommandResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const executeCommand = async (ticker: string, func: string): Promise<any> => {
  try {
    const response = await api.get(`/execute`, {
      params: { ticker, function: func },
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Unknown error');
    }
    
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to execute command');
  }
};

export const getQuote = async (ticker: string) => {
  try {
    const response = await api.get(`/quote/${ticker}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch quote');
  }
};

export const getHistoricalData = async (ticker: string, range: string = '1M') => {
  try {
    const response = await api.get(`/historical/${ticker}`, {
      params: { range },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch historical data');
  }
};

// ============================================
// ALERT API
// ============================================

export interface Alert {
  id: string;
  ticker: string;
  type: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'RSI_ABOVE' | 'RSI_BELOW' | 'VOLUME_SPIKE';
  threshold: number;
  status: 'ACTIVE' | 'TRIGGERED' | 'DISABLED';
  createdAt: string;
  triggeredAt?: string;
  message?: string;
  notificationSent?: boolean;
}

export const alertApi = {
  // Get all alerts
  getAll: async (): Promise<Alert[]> => {
    try {
      const response = await api.get('/alerts');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch alerts');
    }
  },

  // Get alerts by ticker
  getByTicker: async (ticker: string): Promise<Alert[]> => {
    try {
      const response = await api.get(`/alerts/ticker/${ticker}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch alerts');
    }
  },

  // Get active alerts
  getActive: async (): Promise<Alert[]> => {
    try {
      const response = await api.get('/alerts/active');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch active alerts');
    }
  },

  // Get triggered alerts
  getTriggered: async (): Promise<Alert[]> => {
    try {
      const response = await api.get('/alerts/triggered');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch triggered alerts');
    }
  },

  // Get statistics
  getStats: async (): Promise<{
    isRunning: boolean;
    totalAlerts: number;
    activeAlerts: number;
    triggeredAlerts: number;
    disabledAlerts: number;
  }> => {
    try {
      const response = await api.get('/alerts/stats');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch alert stats');
    }
  },

  // Create new alert
  create: async (alert: {
    ticker: string;
    type: Alert['type'];
    threshold: number;
    message?: string;
  }): Promise<Alert> => {
    try {
      const response = await api.post('/alerts', alert);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create alert');
    }
  },

  // Update alert
  update: async (id: string, updates: Partial<Alert>): Promise<Alert> => {
    try {
      const response = await api.put(`/alerts/${id}`, updates);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update alert');
    }
  },

  // Toggle alert
  toggle: async (id: string): Promise<Alert> => {
    try {
      const response = await api.patch(`/alerts/${id}/toggle`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to toggle alert');
    }
  },

  // Delete alert
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/alerts/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete alert');
    }
  },

  // Clear all triggered alerts
  clearTriggered: async (): Promise<{ count: number }> => {
    try {
      const response = await api.post('/alerts/clear-triggered');
      return { count: response.data.count };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clear triggered alerts');
    }
  }
};

export default api;
