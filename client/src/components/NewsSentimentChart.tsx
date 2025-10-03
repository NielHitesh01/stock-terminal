import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 400px;
  background-color: #000;
  border: 1px solid #00ff00;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  color: #00ff00;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  font-family: 'Courier New', monospace;
`;

const ChartArea = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Timeline = styled.div`
  display: flex;
  height: 100%;
  position: relative;
  border-left: 2px solid #333;
  border-bottom: 2px solid #333;
  padding: 10px 0 30px 40px;
`;

const YAxisLabel = styled.div`
  position: absolute;
  left: 0;
  font-size: 10px;
  color: #666;
  font-family: 'Courier New', monospace;
  transform: translateY(-50%);
`;

const XAxisLabel = styled.div`
  position: absolute;
  bottom: 5px;
  font-size: 9px;
  color: #666;
  font-family: 'Courier New', monospace;
  transform: translateX(-50%);
`;

const DataPoint = styled.div<{ sentiment: 'positive' | 'negative' | 'neutral'; height: number; left: number }>`
  position: absolute;
  bottom: 30px;
  left: ${props => props.left}%;
  width: 3px;
  height: ${props => props.height}%;
  background-color: ${props => 
    props.sentiment === 'positive' ? '#00ff00' : 
    props.sentiment === 'negative' ? '#ff0000' : '#ffff00'
  };
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
    transform: scaleY(1.1);
  }
`;

const PriceLine = styled.svg`
  position: absolute;
  top: 0;
  left: 40px;
  width: calc(100% - 40px);
  height: calc(100% - 30px);
  pointer-events: none;
`;

const Tooltip = styled.div<{ show: boolean; x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background-color: #1a1a1a;
  border: 1px solid #00ff00;
  padding: 10px;
  border-radius: 4px;
  color: #00ff00;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s;
  z-index: 1000;
  min-width: 200px;
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #888;
  
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    background-color: ${props => props.color};
    display: inline-block;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const NewIndicator = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff0000;
  color: #fff;
  font-size: 8px;
  padding: 2px 4px;
  border-radius: 3px;
  animation: ${pulse} 2s infinite;
`;

interface NewsEvent {
  date: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number; // 0-100
  headline: string;
  priceChange: number;
  price: number;
}

interface NewsSentimentChartProps {
  ticker: string;
  data?: any;
}

const NewsSentimentChart = ({ ticker }: NewsSentimentChartProps) => {
  const [hoveredEvent, setHoveredEvent] = useState<NewsEvent | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate mock data for demonstration
  const generateMockData = (): NewsEvent[] => {
    const today = new Date();
    const events: NewsEvent[] = [];
    const basePrice = 150;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random number of events per day (0-3)
      const eventsToday = Math.floor(Math.random() * 4);
      
      for (let j = 0; j < eventsToday; j++) {
        const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        const impact = Math.random() * 80 + 20; // 20-100
        const priceChange = sentiment === 'positive' ? 
          Math.random() * 5 : 
          sentiment === 'negative' ? 
            -Math.random() * 5 : 
            (Math.random() - 0.5) * 2;
        
        const headlines = {
          positive: [
            `${ticker} reports record earnings`,
            `${ticker} announces new partnership`,
            `Analysts upgrade ${ticker} to Buy`,
            `${ticker} launches innovative product`,
            `${ticker} beats Q4 expectations`
          ],
          negative: [
            `${ticker} faces regulatory scrutiny`,
            `${ticker} misses earnings estimates`,
            `Analysts downgrade ${ticker} to Sell`,
            `${ticker} announces layoffs`,
            `${ticker} stock plunges on weak guidance`
          ],
          neutral: [
            `${ticker} holds annual meeting`,
            `${ticker} announces dividend`,
            `${ticker} updates corporate policy`,
            `${ticker} releases quarterly report`,
            `${ticker} appoints new board member`
          ]
        };
        
        events.push({
          date: date.toISOString().split('T')[0],
          time: `${9 + j * 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          sentiment,
          impact,
          headline: headlines[sentiment][Math.floor(Math.random() * headlines[sentiment].length)],
          priceChange,
          price: basePrice + priceChange
        });
      }
    }
    
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const [newsEvents] = useState<NewsEvent[]>(generateMockData());

  // Generate price line points
  const generatePriceLine = () => {
    if (newsEvents.length === 0) return '';
    
    const width = 100; // percentage
    const height = 100; // percentage
    let cumulativePrice = 150;
    
    const points = newsEvents.map((event, index) => {
      const x = (index / (newsEvents.length - 1)) * width;
      cumulativePrice += event.priceChange * 0.5; // Dampen the effect
      const y = height - ((cumulativePrice - 140) / 30 * height); // Normalize to 140-170 range
      return `${x},${y}`;
    }).join(' ');
    
    return points;
  };

  const handleMouseEnter = (event: NewsEvent, e: React.MouseEvent) => {
    setHoveredEvent(event);
    setTooltipPos({ x: e.clientX + 10, y: e.clientY - 50 });
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  return (
    <Container>
      <Title>📰 NEWS SENTIMENT IMPACT - {ticker}</Title>
      
      <ChartArea>
        <Timeline>
          {/* Y-Axis Labels */}
          <YAxisLabel style={{ top: '10%' }}>High Impact</YAxisLabel>
          <YAxisLabel style={{ top: '50%' }}>Medium</YAxisLabel>
          <YAxisLabel style={{ top: '90%' }}>Low Impact</YAxisLabel>
          
          {/* X-Axis Labels */}
          <XAxisLabel style={{ left: '10%' }}>-30 days</XAxisLabel>
          <XAxisLabel style={{ left: '50%' }}>-15 days</XAxisLabel>
          <XAxisLabel style={{ left: '90%' }}>Today</XAxisLabel>
          
          {/* Price Line */}
          <PriceLine viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={generatePriceLine()}
              fill="none"
              stroke="#00ffff"
              strokeWidth="0.5"
              opacity="0.6"
            />
          </PriceLine>
          
          {/* News Events as Bars */}
          {newsEvents.map((event, index) => {
            const left = (index / (newsEvents.length - 1)) * 90 + 5;
            const height = (event.impact / 100) * 80;
            const isRecent = new Date().getTime() - new Date(event.date).getTime() < 86400000 * 2;
            
            return (
              <DataPoint
                key={index}
                sentiment={event.sentiment}
                height={height}
                left={left}
                onMouseEnter={(e) => handleMouseEnter(event, e)}
                onMouseLeave={handleMouseLeave}
              >
                {isRecent && <NewIndicator>NEW</NewIndicator>}
              </DataPoint>
            );
          })}
        </Timeline>
        
        <Legend>
          <LegendItem color="#00ff00">● Positive News</LegendItem>
          <LegendItem color="#ff0000">● Negative News</LegendItem>
          <LegendItem color="#ffff00">● Neutral News</LegendItem>
          <LegendItem color="#00ffff">— Stock Price</LegendItem>
        </Legend>
      </ChartArea>
      
      <Tooltip show={!!hoveredEvent} x={tooltipPos.x} y={tooltipPos.y}>
        {hoveredEvent && (
          <>
            <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '5px' }}>
              {hoveredEvent.date} {hoveredEvent.time}
            </div>
            <div style={{ marginBottom: '5px' }}>
              {hoveredEvent.headline}
            </div>
            <div style={{ 
              color: hoveredEvent.sentiment === 'positive' ? '#00ff00' : 
                     hoveredEvent.sentiment === 'negative' ? '#ff0000' : '#ffff00',
              marginBottom: '3px'
            }}>
              Sentiment: {hoveredEvent.sentiment.toUpperCase()}
            </div>
            <div>Impact: {hoveredEvent.impact.toFixed(1)}%</div>
            <div style={{ 
              color: hoveredEvent.priceChange >= 0 ? '#00ff00' : '#ff0000' 
            }}>
              Price Change: {hoveredEvent.priceChange >= 0 ? '+' : ''}{hoveredEvent.priceChange.toFixed(2)}%
            </div>
          </>
        )}
      </Tooltip>
    </Container>
  );
};

export default NewsSentimentChart;
