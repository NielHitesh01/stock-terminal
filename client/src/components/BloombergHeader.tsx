import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ThemeToggle from './ThemeToggle';

interface MarketData {
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

const BloombergHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketData] = useState<MarketData[]>([
    { symbol: 'S&P 500', value: 4783.45, change: 23.45, changePercent: 0.49 },
    { symbol: 'DOW', value: 37440.34, change: -45.23, changePercent: -0.12 },
    { symbol: 'NASDAQ', value: 15043.97, change: 112.34, changePercent: 0.75 },
    { symbol: 'VIX', value: 12.34, change: -0.45, changePercent: -3.52 },
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <HeaderContainer>
      <TopBar>
        <LeftSection>
          <Logo>
            <LogoSquare>
              <LogoText>ST</LogoText>
            </LogoSquare>
            <BrandName>STOCK TERMINAL</BrandName>
          </Logo>
          <Separator />
          <LocationInfo>
            <LocationIcon>📍</LocationIcon>
            <LocationText>NEW YORK</LocationText>
          </LocationInfo>
        </LeftSection>

        <CenterSection>
          <MarketStatus>
            <StatusDot $isOpen={true} />
            <StatusText>MARKET OPEN</StatusText>
          </MarketStatus>
        </CenterSection>

        <RightSection>
          <ThemeToggle />
          <Separator />
          <TimeDisplay>
            <TimeValue>{formatTime(currentTime)}</TimeValue>
            <TimeLabel>EST</TimeLabel>
          </TimeDisplay>
          <Separator />
          <DateDisplay>{formatDate(currentTime)}</DateDisplay>
        </RightSection>
      </TopBar>

      <MarketBar>
        {marketData.map((market, index) => (
          <MarketItem key={index}>
            <MarketSymbol>{market.symbol}</MarketSymbol>
            <MarketValue>{market.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</MarketValue>
            <MarketChange $isPositive={market.change >= 0}>
              {market.change >= 0 ? '▲' : '▼'} {Math.abs(market.change).toFixed(2)} ({market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
            </MarketChange>
          </MarketItem>
        ))}
        
        <MarketItem>
          <MarketSymbol>GOLD</MarketSymbol>
          <MarketValue>2,043.50</MarketValue>
          <MarketChange $isPositive={true}>▲ 8.30 (+0.41%)</MarketChange>
        </MarketItem>

        <MarketItem>
          <MarketSymbol>OIL</MarketSymbol>
          <MarketValue>73.82</MarketValue>
          <MarketChange $isPositive={false}>▼ 0.92 (-1.23%)</MarketChange>
        </MarketItem>

        <MarketItem>
          <MarketSymbol>BTC</MarketSymbol>
          <MarketValue>43,567.23</MarketValue>
          <MarketChange $isPositive={true}>▲ 1,234.56 (+2.92%)</MarketChange>
        </MarketItem>

        <ScrollingNews>
          <NewsText>
            📰 FED HOLDS RATES STEADY • APPLE ANNOUNCES Q4 EARNINGS BEAT • TESLA DELIVERIES EXCEED EXPECTATIONS • NVIDIA AI CHIPS DEMAND SURGES • OIL PRICES DECLINE ON SUPPLY CONCERNS • GOLD HITS NEW HIGH ON SAFE-HAVEN DEMAND • BITCOIN RALLIES ON ETF APPROVAL NEWS • 
          </NewsText>
        </ScrollingNews>
      </MarketBar>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.div`
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  border-bottom: 3px solid #ff6600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #0a0a0a;
  border-bottom: 1px solid #333;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoSquare = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #ff6600 0%, #ff9900 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(255, 102, 0, 0.4);
`;

const LogoText = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  letter-spacing: -1px;
`;

const BrandName = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #ff6600;
  letter-spacing: 2px;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LocationIcon = styled.span`
  font-size: 14px;
`;

const LocationText = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #888;
  letter-spacing: 1px;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
`;

const MarketStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 4px;
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
`;

const StatusDot = styled.div<{ $isOpen: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isOpen ? '#00ff00' : '#ff0000'};
  animation: ${pulse} 2s infinite;
  box-shadow: 0 0 10px ${props => props.$isOpen ? '#00ff00' : '#ff0000'};
`;

const StatusText = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  color: #00ff00;
  letter-spacing: 1px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const TimeValue = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: bold;
  color: #ff6600;
  letter-spacing: 1px;
`;

const TimeLabel = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #888;
`;

const DateDisplay = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #888;
  letter-spacing: 1px;
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: #333;
`;

const MarketBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 24px;
  background: #0a0a0a;
  gap: 24px;
  overflow-x: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }
`;

const MarketItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
  padding: 4px 0;
  border-right: 1px solid #222;
  
  &:last-child {
    border-right: none;
  }
`;

const MarketSymbol = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #666;
  letter-spacing: 1px;
  font-weight: bold;
`;

const MarketValue = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
`;

const MarketChange = styled.div<{ $isPositive: boolean }>`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: ${props => props.$isPositive ? '#00ff00' : '#ff0000'};
  font-weight: bold;
`;

const scroll = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const ScrollingNews = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  margin-left: auto;
  max-width: 600px;
  background: rgba(255, 102, 0, 0.05);
  border-left: 2px solid #ff6600;
  padding-left: 12px;
`;

const NewsText = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #ff6600;
  white-space: nowrap;
  animation: ${scroll} 60s linear infinite;
  display: inline-block;
  padding-left: 100%;
`;

export default BloombergHeader;
