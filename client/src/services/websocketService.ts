import { io, Socket } from 'socket.io-client';

/**
 * WebSocket Service for real-time price streaming
 */

export interface PriceUpdate {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: string;
  rsi?: number;
  direction?: 'up' | 'down' | 'neutral';
}

export interface StreamStats {
  activeTickers: number;
  totalClients: number;
  subscriptions: { ticker: string; clients: number }[];
}

type PriceUpdateCallback = (update: PriceUpdate) => void;
type ErrorCallback = (error: { ticker: string; error: string; timestamp: string }) => void;
type ConnectionCallback = (connected: boolean) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private subscriptions: Map<string, Set<PriceUpdateCallback>> = new Map();
  private errorCallbacks: Set<ErrorCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('✅ Already connected to WebSocket');
      return;
    }

    const serverUrl = (import.meta as any).env?.VITE_WS_URL || 'http://localhost:3002';
    
    console.log(`🔌 Connecting to WebSocket: ${serverUrl}`);
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay
    });

    this.setupEventHandlers();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting from WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.notifyConnectionChange(false);
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection established
    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
      this.reconnectAttempts = 0;
      this.notifyConnectionChange(true);
      
      // Re-subscribe to all tickers after reconnection
      this.resubscribeAll();
    });

    // Connection lost
    this.socket.on('disconnect', (reason) => {
      console.log(`🔌 Disconnected from WebSocket: ${reason}`);
      this.notifyConnectionChange(false);
    });

    // Connection error
    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
      }
    });

    // Reconnection attempt
    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}/${this.maxReconnectAttempts}`);
    });

    // Reconnection success
    this.socket.on('reconnect', (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempts`);
      this.reconnectAttempts = 0;
    });

    // Price update received
    this.socket.on('price-update', (update: PriceUpdate) => {
      this.handlePriceUpdate(update);
    });

    // Error received
    this.socket.on('price-error', (error: { ticker: string; error: string; timestamp: string }) => {
      console.error(`❌ Price error for ${error.ticker}:`, error.error);
      this.notifyError(error);
    });

    // Subscription confirmed
    this.socket.on('subscribed', (data: { ticker: string }) => {
      console.log(`✅ Subscribed to ${data.ticker}`);
    });

    // Unsubscription confirmed
    this.socket.on('unsubscribed', (data: { ticker: string }) => {
      console.log(`✅ Unsubscribed from ${data.ticker}`);
    });

    // Generic error
    this.socket.on('error', (error: { message: string }) => {
      console.error('❌ WebSocket error:', error.message);
    });
  }

  /**
   * Subscribe to price updates for a ticker
   */
  subscribe(ticker: string, callback: PriceUpdateCallback): () => void {
    if (!this.socket) {
      console.error('❌ Not connected to WebSocket');
      return () => {};
    }

    const upperTicker = ticker.toUpperCase();

    // Add callback to subscriptions
    if (!this.subscriptions.has(upperTicker)) {
      this.subscriptions.set(upperTicker, new Set());
    }
    this.subscriptions.get(upperTicker)!.add(callback);

    // Send subscription request to server
    this.socket.emit('subscribe', upperTicker);

    console.log(`📈 Subscribed to ${upperTicker}`);

    // Return unsubscribe function
    return () => this.unsubscribe(upperTicker, callback);
  }

  /**
   * Unsubscribe from price updates for a ticker
   */
  unsubscribe(ticker: string, callback: PriceUpdateCallback): void {
    const upperTicker = ticker.toUpperCase();
    const callbacks = this.subscriptions.get(upperTicker);

    if (callbacks) {
      callbacks.delete(callback);

      // If no more callbacks, unsubscribe from server
      if (callbacks.size === 0) {
        this.subscriptions.delete(upperTicker);
        
        if (this.socket?.connected) {
          this.socket.emit('unsubscribe', upperTicker);
          console.log(`📉 Unsubscribed from ${upperTicker}`);
        }
      }
    }
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.add(callback);
    
    // Immediately notify current status
    callback(this.isConnected());

    // Return unsubscribe function
    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to errors
   */
  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.errorCallbacks.delete(callback);
    };
  }

  /**
   * Get streaming statistics
   */
  async getStats(): Promise<StreamStats | null> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve(null);
        return;
      }

      const timeout = setTimeout(() => {
        resolve(null);
      }, 5000);

      this.socket.once('stats', (stats: StreamStats) => {
        clearTimeout(timeout);
        resolve(stats);
      });

      this.socket.emit('get-stats');
    });
  }

  /**
   * Handle incoming price update
   */
  private handlePriceUpdate(update: PriceUpdate): void {
    const callbacks = this.subscriptions.get(update.ticker);
    
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(update);
        } catch (error) {
          console.error('❌ Error in price update callback:', error);
        }
      });
    }
  }

  /**
   * Notify error callbacks
   */
  private notifyError(error: { ticker: string; error: string; timestamp: string }): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        console.error('❌ Error in error callback:', err);
      }
    });
  }

  /**
   * Notify connection status change
   */
  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('❌ Error in connection callback:', error);
      }
    });
  }

  /**
   * Re-subscribe to all tickers after reconnection
   */
  private resubscribeAll(): void {
    if (!this.socket?.connected) return;

    const tickers = Array.from(this.subscriptions.keys());
    
    if (tickers.length > 0) {
      console.log(`🔄 Re-subscribing to ${tickers.length} tickers...`);
      
      tickers.forEach(ticker => {
        this.socket!.emit('subscribe', ticker);
      });
    }
  }
}

// Singleton instance
export const websocketService = new WebSocketService();

// Auto-connect on module load
if (typeof window !== 'undefined') {
  websocketService.connect();
}

export default websocketService;
