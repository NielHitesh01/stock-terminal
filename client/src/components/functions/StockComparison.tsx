import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ============================================================================
// INTERFACES
// ============================================================================

interface StockData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  pe: number;
  volume: number;
  high52Week: number;
  low52Week: number;
  historicalPrices: number[];
  color: string;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #000000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-bottom: 2px solid #00ff00;
`;

const HeaderTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #00ff00;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TickerInputSection = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  background: #000000;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  width: 80px;
  text-transform: uppercase;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }

  &::placeholder {
    color: #00ff00;
    opacity: 0.5;
  }
`;

const Button = styled.button`
  background: #00ff00;
  color: #000000;
  border: 2px solid #00ff00;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 15px;
  gap: 15px;
`;

const ChartSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;
`;

const ChartTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 15px;
  text-align: center;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }
`;

const StockCard = styled.div<{ $color: string }>`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid ${props => props.$color};
  border-radius: 8px;
  padding: 15px;
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
  transition: all 0.2s;

  &:hover {
    background: #ff0000;
    color: #000000;
  }
`;

const TickerTitle = styled.div<{ $color: string }>`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.$color};
  margin-bottom: 10px;
`;

const PriceInfo = styled.div`
  margin-bottom: 15px;
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #00ff00;
`;

const Change = styled.div<{ $positive: boolean }>`
  font-size: 14px;
  color: ${props => props.$positive ? '#00ff00' : '#ff0000'};
  margin-top: 5px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #333333;
  font-size: 12px;

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.div`
  color: #00ff00;
  opacity: 0.7;
`;

const MetricValue = styled.div`
  color: #00ff00;
  font-weight: bold;
`;

const CorrelationSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 20px;
`;

const CorrelationTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 15px;
  text-align: center;
`;

const CorrelationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
`;

const CorrelationItem = styled.div`
  background: #0a0a0a;
  border: 1px solid #00ff00;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
`;

const CorrelationPair = styled.div`
  font-size: 11px;
  color: #00ff00;
  opacity: 0.7;
  margin-bottom: 5px;
`;

const CorrelationValue = styled.div<{ $value: number }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => 
    props.$value > 0.7 ? '#00ff00' : 
    props.$value > 0.3 ? '#ffff00' : 
    props.$value > -0.3 ? '#ffffff' :
    props.$value > -0.7 ? '#ff8800' :
    '#ff0000'
  };
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #00ff00;
  opacity: 0.5;
  gap: 15px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
`;

const EmptyText = styled.div`
  font-size: 16px;
  text-align: center;
`;

// ============================================================================
// COMPONENT
// ============================================================================

const StockComparison: React.FC = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const COLORS = ['#00ff00', '#00ffff', '#ffff00', '#ff00ff', '#ff8800', '#00ff80'];

  // Generate mock data for demonstration
  const generateMockData = (ticker: string, colorIndex: number): StockData => {
    const basePrice = 100 + Math.random() * 400;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    // Generate 30 days of historical prices for normalization
    const historicalPrices: number[] = [];
    let price = basePrice - change;
    for (let i = 0; i < 30; i++) {
      price = price * (1 + (Math.random() - 0.5) * 0.03);
      historicalPrices.push(price);
    }

    return {
      ticker,
      price: basePrice,
      change,
      changePercent,
      marketCap: Math.random() * 1000000000000,
      pe: 10 + Math.random() * 40,
      volume: Math.random() * 100000000,
      high52Week: basePrice * (1 + Math.random() * 0.3),
      low52Week: basePrice * (1 - Math.random() * 0.3),
      historicalPrices,
      color: COLORS[colorIndex % COLORS.length]
    };
  };

  const handleAddTicker = () => {
    const ticker = inputValue.toUpperCase().trim();
    
    if (!ticker) return;
    
    if (tickers.includes(ticker)) {
      alert('Ticker already added!');
      return;
    }
    
    if (tickers.length >= 6) {
      alert('Maximum 6 tickers allowed!');
      return;
    }

    setTickers(prev => [...prev, ticker]);
    setInputValue('');
  };

  const handleRemoveTicker = (ticker: string) => {
    setTickers(prev => prev.filter(t => t !== ticker));
  };

  // Update stock data when tickers change
  useEffect(() => {
    const newData = tickers.map((ticker, index) => generateMockData(ticker, index));
    setStockData(newData);
  }, [tickers]);

  // Calculate correlation between two stocks
  const calculateCorrelation = (prices1: number[], prices2: number[]): number => {
    if (prices1.length !== prices2.length) return 0;

    const mean1 = prices1.reduce((a, b) => a + b, 0) / prices1.length;
    const mean2 = prices2.reduce((a, b) => a + b, 0) / prices2.length;

    let numerator = 0;
    let sum1 = 0;
    let sum2 = 0;

    for (let i = 0; i < prices1.length; i++) {
      const diff1 = prices1[i] - mean1;
      const diff2 = prices2[i] - mean2;
      numerator += diff1 * diff2;
      sum1 += diff1 * diff1;
      sum2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(sum1 * sum2);
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Prepare normalized chart data
  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: stockData.map(stock => {
      // Normalize to percentage change from day 1
      const normalizedPrices = stock.historicalPrices.map(
        (price, index) => ((price - stock.historicalPrices[0]) / stock.historicalPrices[0]) * 100
      );

      return {
        label: stock.ticker,
        data: normalizedPrices,
        borderColor: stock.color,
        backgroundColor: stock.color + '20',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.1
      };
    })
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#00ff00',
          font: {
            family: "'Courier New', monospace",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#000000',
        titleColor: '#00ff00',
        bodyColor: '#00ff00',
        borderColor: '#00ff00',
        borderWidth: 1,
        titleFont: {
          family: "'Courier New', monospace"
        },
        bodyFont: {
          family: "'Courier New', monospace"
        },
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y >= 0 ? '+' : ''}${context.parsed.y.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#00ff00',
          font: {
            family: "'Courier New', monospace",
            size: 10
          },
          maxRotation: 0
        },
        grid: {
          color: '#333333'
        }
      },
      y: {
        ticks: {
          color: '#00ff00',
          font: {
            family: "'Courier New', monospace",
            size: 10
          },
          callback: (value: any) => `${value >= 0 ? '+' : ''}${value}%`
        },
        grid: {
          color: '#333333'
        }
      }
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>
          📊 STOCK COMPARISON
        </HeaderTitle>
        <TickerInputSection>
          <Input
            type="text"
            placeholder="TICKER"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTicker()}
            maxLength={5}
          />
          <Button onClick={handleAddTicker} disabled={tickers.length >= 6}>
            ➕ ADD
          </Button>
          <div style={{ fontSize: '11px', color: '#00ff00', opacity: 0.7 }}>
            {tickers.length}/6
          </div>
        </TickerInputSection>
      </Header>

      <ContentArea>
        {tickers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <EmptyText>
              No stocks to compare yet.<br />
              Add 2-6 tickers to start comparing!
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <ChartSection>
              <ChartTitle>📈 Normalized Performance (% Change from Day 1)</ChartTitle>
              <div style={{ height: 'calc(100% - 40px)' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </ChartSection>

            <MetricsGrid>
              {stockData.map((stock, index) => (
                <StockCard key={stock.ticker} $color={stock.color}>
                  <RemoveButton onClick={() => handleRemoveTicker(stock.ticker)}>
                    ✕ REMOVE
                  </RemoveButton>
                  
                  <TickerTitle $color={stock.color}>{stock.ticker}</TickerTitle>
                  
                  <PriceInfo>
                    <Price>${stock.price.toFixed(2)}</Price>
                    <Change $positive={stock.change >= 0}>
                      {stock.change >= 0 ? '▲' : '▼'} 
                      ${Math.abs(stock.change).toFixed(2)} 
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </Change>
                  </PriceInfo>

                  <MetricRow>
                    <MetricLabel>Market Cap</MetricLabel>
                    <MetricValue>{formatNumber(stock.marketCap)}</MetricValue>
                  </MetricRow>

                  <MetricRow>
                    <MetricLabel>P/E Ratio</MetricLabel>
                    <MetricValue>{stock.pe.toFixed(2)}</MetricValue>
                  </MetricRow>

                  <MetricRow>
                    <MetricLabel>Volume</MetricLabel>
                    <MetricValue>{formatNumber(stock.volume)}</MetricValue>
                  </MetricRow>

                  <MetricRow>
                    <MetricLabel>52W High</MetricLabel>
                    <MetricValue>${stock.high52Week.toFixed(2)}</MetricValue>
                  </MetricRow>

                  <MetricRow>
                    <MetricLabel>52W Low</MetricLabel>
                    <MetricValue>${stock.low52Week.toFixed(2)}</MetricValue>
                  </MetricRow>
                </StockCard>
              ))}
            </MetricsGrid>

            {tickers.length >= 2 && (
              <CorrelationSection>
                <CorrelationTitle>📈 Price Correlation Matrix</CorrelationTitle>
                <CorrelationGrid>
                  {stockData.map((stock1, i) => 
                    stockData.slice(i + 1).map((stock2, j) => {
                      const correlation = calculateCorrelation(
                        stock1.historicalPrices,
                        stock2.historicalPrices
                      );
                      
                      return (
                        <CorrelationItem key={`${stock1.ticker}-${stock2.ticker}`}>
                          <CorrelationPair>
                            {stock1.ticker} vs {stock2.ticker}
                          </CorrelationPair>
                          <CorrelationValue $value={correlation}>
                            {correlation.toFixed(3)}
                          </CorrelationValue>
                          <div style={{ fontSize: '10px', color: '#00ff00', opacity: 0.7, marginTop: '5px' }}>
                            {correlation > 0.7 ? 'Strong Positive' :
                             correlation > 0.3 ? 'Moderate Positive' :
                             correlation > -0.3 ? 'Weak' :
                             correlation > -0.7 ? 'Moderate Negative' :
                             'Strong Negative'}
                          </div>
                        </CorrelationItem>
                      );
                    })
                  )}
                </CorrelationGrid>
              </CorrelationSection>
            )}
          </>
        )}
      </ContentArea>
    </Container>
  );
};

export default StockComparison;
