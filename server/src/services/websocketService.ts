import { Server, Socket } from 'socket.io';
import { getCompanyOverview, getHistoricalPrices } from './dataProviders.js';

/**
 * WebSocket Service - Real-time price streaming
 * Broadcasts live price updates every 5 seconds
 */

interface TickerSubscription {
  ticker: string;
  clients: Set<string>;
}

interface PriceUpdate {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: string;
  rsi?: number;
}

class StreamingService {
  private subscriptions: Map<string, TickerSubscription> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private io: Server | null = null;
  private readonly UPDATE_INTERVAL_MS = 5000; // 5 seconds
  private lastPrices: Map<string, number> = new Map();

  constructor() {
    console.log('📊 Streaming Service initialized');
  }

  /**
   * Set Socket.IO server instance
   */
  setIO(io: Server): void {
    this.io = io;
  }

  /**
   * Subscribe a client to ticker updates
   */
  subscribe(socketId: string, ticker: string): void {
    const upperTicker = ticker.toUpperCase();
    
    if (!this.subscriptions.has(upperTicker)) {
      // Create new subscription
      this.subscriptions.set(upperTicker, {
        ticker: upperTicker,
        clients: new Set([socketId])
      });
      
      // Start streaming for this ticker
      this.startStreaming(upperTicker);
      console.log(`📈 Started streaming: ${upperTicker}`);
    } else {
      // Add client to existing subscription
      const sub = this.subscriptions.get(upperTicker)!;
      sub.clients.add(socketId);
      console.log(`➕ Client subscribed: ${upperTicker} (${sub.clients.size} clients)`);
    }
  }

  /**
   * Unsubscribe a client from ticker updates
   */
  unsubscribe(socketId: string, ticker: string): void {
    const upperTicker = ticker.toUpperCase();
    const sub = this.subscriptions.get(upperTicker);
    
    if (sub) {
      sub.clients.delete(socketId);
      console.log(`➖ Client unsubscribed: ${upperTicker} (${sub.clients.size} clients)`);
      
      // If no more clients, stop streaming
      if (sub.clients.size === 0) {
        this.stopStreaming(upperTicker);
        this.subscriptions.delete(upperTicker);
        console.log(`⏹️ Stopped streaming: ${upperTicker}`);
      }
    }
  }

  /**
   * Unsubscribe a client from all tickers
   */
  unsubscribeAll(socketId: string): void {
    const tickers = Array.from(this.subscriptions.keys());
    for (const ticker of tickers) {
      this.unsubscribe(socketId, ticker);
    }
    console.log(`🔌 Client disconnected: ${socketId}`);
  }

  /**
   * Start streaming price updates for a ticker
   */
  private startStreaming(ticker: string): void {
    // Immediately fetch and broadcast first update
    this.fetchAndBroadcast(ticker);
    
    // Set up interval for continuous updates
    const interval = setInterval(() => {
      this.fetchAndBroadcast(ticker);
    }, this.UPDATE_INTERVAL_MS);
    
    this.updateIntervals.set(ticker, interval);
  }

  /**
   * Stop streaming price updates for a ticker
   */
  private stopStreaming(ticker: string): void {
    const interval = this.updateIntervals.get(ticker);
    if (interval) {
      clearInterval(interval);
      this.updateIntervals.delete(ticker);
    }
    this.lastPrices.delete(ticker);
  }

  /**
   * Fetch latest price and broadcast to subscribers
   */
  private async fetchAndBroadcast(ticker: string): Promise<void> {
    try {
      // Fetch company overview for current price
      const overview = await getCompanyOverview(ticker);
      const currentPrice = overview?.price || 0;
      const change = overview?.change || 0;
      const changePercent = overview?.changePercent || 0;
      
      // Get last known price for direction indicator
      const lastPrice = this.lastPrices.get(ticker);
      const direction = lastPrice ? (currentPrice > lastPrice ? 'up' : currentPrice < lastPrice ? 'down' : 'neutral') : 'neutral';
      
      // Try to get RSI (optional, from historical data)
      let rsi: number | undefined;
      try {
        const historical = await getHistoricalPrices(ticker, '14', true);
        const rsiValues = historical?.indicators?.rsi;
        rsi = rsiValues && rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : undefined;
      } catch (error) {
        // RSI fetch failed, continue without it
      }
      
      // Create price update
      const update: PriceUpdate = {
        ticker,
        price: currentPrice,
        change,
        changePercent,
        timestamp: new Date().toISOString(),
        rsi,
        direction
      } as any;
      
      // Store current price for next comparison
      this.lastPrices.set(ticker, currentPrice);
      
      // Broadcast to all subscribed clients
      if (this.io) {
        this.io.to(`ticker:${ticker}`).emit('price-update', update);
        console.log(`📡 Broadcasted: ${ticker} $${currentPrice.toFixed(2)} (${direction})`);
      }
    } catch (error: any) {
      console.error(`❌ Failed to fetch price for ${ticker}:`, error.message);
      
      // Broadcast error to subscribers
      if (this.io) {
        this.io.to(`ticker:${ticker}`).emit('price-error', {
          ticker,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Get active subscriptions statistics
   */
  getStats(): {
    activeTickers: number;
    totalClients: number;
    subscriptions: { ticker: string; clients: number }[];
  } {
    const subscriptions = Array.from(this.subscriptions.values()).map(sub => ({
      ticker: sub.ticker,
      clients: sub.clients.size
    }));
    
    const totalClients = subscriptions.reduce((sum, sub) => sum + sub.clients, 0);
    
    return {
      activeTickers: this.subscriptions.size,
      totalClients,
      subscriptions
    };
  }
}

// Singleton instance
export const streamingService = new StreamingService();

/**
 * Setup WebSocket handlers
 */
export function setupWebSocket(io: Server): void {
  streamingService.setIO(io);
  
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Handle ticker subscription
    socket.on('subscribe', (ticker: string) => {
      if (!ticker || typeof ticker !== 'string') {
        socket.emit('error', { message: 'Invalid ticker' });
        return;
      }
      
      const upperTicker = ticker.toUpperCase();
      
      // Join room for this ticker
      socket.join(`ticker:${upperTicker}`);
      
      // Subscribe to updates
      streamingService.subscribe(socket.id, upperTicker);
      
      // Send confirmation
      socket.emit('subscribed', { ticker: upperTicker });
    });
    
    // Handle ticker unsubscription
    socket.on('unsubscribe', (ticker: string) => {
      if (!ticker || typeof ticker !== 'string') {
        return;
      }
      
      const upperTicker = ticker.toUpperCase();
      
      // Leave room
      socket.leave(`ticker:${upperTicker}`);
      
      // Unsubscribe from updates
      streamingService.unsubscribe(socket.id, upperTicker);
      
      // Send confirmation
      socket.emit('unsubscribed', { ticker: upperTicker });
    });
    
    // Handle get stats request
    socket.on('get-stats', () => {
      const stats = streamingService.getStats();
      socket.emit('stats', stats);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      streamingService.unsubscribeAll(socket.id);
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error (${socket.id}):`, error);
    });
  });
  
  console.log('✅ WebSocket handlers configured');
}
