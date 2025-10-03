import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWebSocketConnection } from '../hooks/useWebSocket';

interface ConnectionStatusIndicatorProps {
  showLabel?: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ 
  showLabel = true 
}) => {
  const { isConnected } = useWebSocketConnection();

  return (
    <Container>
      <StatusDot connected={isConnected} />
      {showLabel && (
        <StatusText connected={isConnected}>
          {isConnected ? 'Live Streaming' : 'Not Connected'}
        </StatusText>
      )}
    </Container>
  );
};

// Animation for pulsing dot
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.connected ? '#00ff00' : '#666666'};
  animation: ${props => props.connected ? pulse : 'none'} 1.5s infinite;
`;

const StatusText = styled.span<{ connected: boolean }>`
  color: ${props => props.connected ? '#00ff00' : '#666666'};
  font-size: 11px;
  font-family: 'Courier New', monospace;
  font-weight: ${props => props.connected ? 'bold' : 'normal'};
`;

export default ConnectionStatusIndicator;
