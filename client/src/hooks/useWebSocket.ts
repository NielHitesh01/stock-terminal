import { useEffect, useState, useCallback } from 'react';
import { websocketService, PriceUpdate } from '../services/websocketService';

/**
 * Custom hook for subscribing to real-time price updates
 */
export function usePriceStream(ticker: string | null) {
  const [priceData, setPriceData] = useState<PriceUpdate | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) {
      setPriceData(null);
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);
    setError(null);

    // Subscribe to price updates
    const unsubscribe = websocketService.subscribe(ticker, (update) => {
      setPriceData(update);
      setError(null);
    });

    // Subscribe to errors
    const unsubscribeError = websocketService.onError((err) => {
      if (err.ticker.toUpperCase() === ticker.toUpperCase()) {
        setError(err.error);
      }
    });

    // Cleanup on unmount or ticker change
    return () => {
      unsubscribe();
      unsubscribeError();
      setIsStreaming(false);
    };
  }, [ticker]);

  return { priceData, isStreaming, error };
}

/**
 * Custom hook for WebSocket connection status
 */
export function useWebSocketConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = websocketService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    return unsubscribe;
  }, []);

  const connect = useCallback(() => {
    websocketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  return { isConnected, connect, disconnect };
}

/**
 * Custom hook for streaming statistics
 */
export function useStreamingStats() {
  const [stats, setStats] = useState<{
    activeTickers: number;
    totalClients: number;
    subscriptions: { ticker: string; clients: number }[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await websocketService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch streaming stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}
