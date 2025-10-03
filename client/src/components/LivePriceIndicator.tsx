import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { usePriceStream } from '../hooks/useWebSocket';

interface LivePriceIndicatorProps {
  ticker: string;
  showRSI?: boolean;
  compact?: boolean;
}

const LivePriceIndicator: React.FC<LivePriceIndicatorProps> = ({ 
  ticker, 
  showRSI = false,
  compact = false 
}) => {
  const { priceData, isStreaming, error } = usePriceStream(ticker);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  // Trigger flash animation when price changes
  useEffect(() => {
    if (priceData?.direction && priceData.direction !== 'neutral') {
      setFlash(priceData.direction);
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    }
  }, [priceData]);

  if (error) {
    return (
      <Container>
        <ErrorText>⚠️ {error}</ErrorText>
      </Container>
    );
  }

  if (!priceData) {
    return (
      <Container>
        <LoadingText>
          {isStreaming ? '📡 Connecting...' : '⏸️ Not streaming'}
        </LoadingText>
      </Container>
    );
  }

  // Defensive null checks for all numeric values
  if (priceData.price === null || priceData.price === undefined) {
    return (
      <Container>
        <LoadingText>📊 Waiting for price data...</LoadingText>
      </Container>
    );
  }

  const isPositive = (priceData.change || 0) >= 0;

  if (compact) {
    return (
      <CompactContainer flash={flash}>
        <CompactPrice color={isPositive ? '#00ff00' : '#ff6b6b'}>
          ${priceData.price?.toFixed(2) || 'N/A'}
        </CompactPrice>
        <CompactChange color={isPositive ? '#00ff00' : '#ff6b6b'}>
          {isPositive ? '▲' : '▼'} {Math.abs(priceData.change || 0).toFixed(2)} ({Math.abs(priceData.changePercent || 0).toFixed(2)}%)
        </CompactChange>
      </CompactContainer>
    );
  }

  return (
    <Container flash={flash}>
      <Header>
        <Ticker>{ticker}</Ticker>
        <LiveBadge>
          <PulsingDot /> LIVE
        </LiveBadge>
      </Header>

      <PriceRow>
        <Price color={isPositive ? '#00ff00' : '#ff6b6b'}>
          ${priceData.price?.toFixed(2) || 'N/A'}
        </Price>
        <Change color={isPositive ? '#00ff00' : '#ff6b6b'}>
          {isPositive ? '▲' : '▼'} {Math.abs(priceData.change || 0).toFixed(2)} ({Math.abs(priceData.changePercent || 0).toFixed(2)}%)
        </Change>
      </PriceRow>

      {showRSI && priceData.rsi !== undefined && priceData.rsi !== null && (
        <RSIRow>
          <RSILabel>RSI:</RSILabel>
          <RSIValue color={priceData.rsi > 70 ? '#ff6b6b' : priceData.rsi < 30 ? '#00ff00' : '#ffff00'}>
            {priceData.rsi.toFixed(2)}
            {priceData.rsi > 70 && ' (Overbought)'}
            {priceData.rsi < 30 && ' (Oversold)'}
          </RSIValue>
        </RSIRow>
      )}

      <Timestamp>
        Updated: {priceData.timestamp ? new Date(priceData.timestamp).toLocaleTimeString() : 'N/A'}
      </Timestamp>
    </Container>
  );
};

// Animations
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const flashUp = keyframes`
  0% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(0, 255, 0, 0.2);
  }
  100% {
    background-color: transparent;
  }
`;

const flashDown = keyframes`
  0% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(255, 107, 107, 0.2);
  }
  100% {
    background-color: transparent;
  }
`;

// Styled Components
const Container = styled.div<{ flash?: 'up' | 'down' | null }>`
  background-color: #0a0a0a;
  border: 1px solid #00ff00;
  border-radius: 4px;
  padding: 15px;
  font-family: 'Courier New', monospace;
  animation: ${props => props.flash === 'up' ? flashUp : props.flash === 'down' ? flashDown : 'none'} 0.5s ease-out;
`;

const CompactContainer = styled.div<{ flash?: 'up' | 'down' | null }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  background-color: #0a0a0a;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  animation: ${props => props.flash === 'up' ? flashUp : props.flash === 'down' ? flashDown : 'none'} 0.5s ease-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Ticker = styled.div`
  color: #00ffff;
  font-size: 18px;
  font-weight: bold;
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ff6b6b;
  font-size: 10px;
  font-weight: bold;
`;

const PulsingDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #ff6b6b;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 10px;
`;

const Price = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 32px;
  font-weight: bold;
`;

const CompactPrice = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 16px;
  font-weight: bold;
`;

const Change = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 16px;
`;

const CompactChange = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 12px;
`;

const RSIRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #1a1a1a;
  border-radius: 4px;
`;

const RSILabel = styled.div`
  color: #00ff00;
  font-size: 14px;
`;

const RSIValue = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 14px;
  font-weight: bold;
`;

const Timestamp = styled.div`
  color: #666;
  font-size: 11px;
  text-align: right;
`;

const LoadingText = styled.div`
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 10px;
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
  padding: 10px;
`;

export default LivePriceIndicator;
