import { useState } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { exportPriceData } from '../../utils/exportUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #00ffff;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExportButton = styled.button`
  padding: 4px 10px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  background: #1a1a1a;
  color: #00ffff;
  border: 1px solid #00ffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #00ffff;
    color: #000000;
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  position: relative;
  min-height: 200px;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 11px;
  color: #00ff00;
  border-top: 1px solid #333333;
  padding-top: 10px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const StatLabel = styled.span`
  color: #666666;
  text-transform: uppercase;
`;

const StatValue = styled.span`
  color: #00ffff;
  font-weight: bold;
`;

const NoData = styled.div`
  color: #666666;
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

const IndicatorControls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const IndicatorButton = styled.button<{ active?: boolean }>`
  padding: 4px 10px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  background: ${props => props.active ? '#00ff00' : '#1a1a1a'};
  color: ${props => props.active ? '#000000' : '#00ff00'};
  border: 1px solid #00ff00;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const RSIContainer = styled.div`
  height: 60px;
  margin-top: 10px;
  border-top: 1px solid #333333;
  padding-top: 10px;
`;

const RSILabel = styled.div`
  font-size: 10px;
  color: #666666;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

interface GIPFunctionProps {
  ticker: string;
  data: any;
}

const GIPFunction = ({ ticker, data }: GIPFunctionProps) => {
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showEMA20, setShowEMA20] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);

  if (!data || !data.prices || data.prices.length === 0) {
    return <NoData>No price data available for {ticker}</NoData>;
  }

  const prices = data.prices.map((p: any) => p.close);
  const dates = data.prices.map((p: any) => new Date(p.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }));

  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[0];
  const change = currentPrice - previousPrice;
  const changePercent = ((change / previousPrice) * 100).toFixed(2);
  const high = Math.max(...prices);
  const low = Math.min(...prices);

  const indicators = data.indicators || {};

  // Build datasets based on active indicators
  const datasets: any[] = [
    {
      label: ticker,
      data: prices,
      borderColor: '#00ff00',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: '#00ff00',
      tension: 0.1,
      yAxisID: 'y',
    },
  ];

  if (showSMA20 && indicators.sma20) {
    datasets.push({
      label: 'SMA 20',
      data: indicators.sma20,
      borderColor: '#00ffff',
      borderWidth: 1.5,
      pointRadius: 0,
      borderDash: [5, 5],
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  if (showSMA50 && indicators.sma50) {
    datasets.push({
      label: 'SMA 50',
      data: indicators.sma50,
      borderColor: '#ff00ff',
      borderWidth: 1.5,
      pointRadius: 0,
      borderDash: [10, 5],
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  if (showEMA20 && indicators.ema20) {
    datasets.push({
      label: 'EMA 20',
      data: indicators.ema20,
      borderColor: '#ffff00',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.1,
      yAxisID: 'y',
    });
  }

  const chartData = {
    labels: dates,
    datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#000000',
        titleColor: '#00ffff',
        bodyColor: '#00ff00',
        borderColor: '#00ff00',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#1a1a1a',
        },
        ticks: {
          color: '#00ff00',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
            family: 'Courier New, monospace',
          },
        },
      },
      y: {
        grid: {
          color: '#1a1a1a',
        },
        ticks: {
          color: '#00ff00',
          callback: (value) => `$${value}`,
          font: {
            size: 10,
            family: 'Courier New, monospace',
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // Get current RSI value
  const currentRSI = indicators.rsi ? indicators.rsi[indicators.rsi.length - 1] : null;
  const rsiColor = currentRSI ? 
    (currentRSI > 70 ? '#ff0000' : currentRSI < 30 ? '#00ff00' : '#ffff00') : '#666666';

  const handleExport = () => {
    exportPriceData(data.prices, ticker);
  };

  return (
    <Container>
      <Header>
        <span>{ticker} - Historical Prices</span>
        <HeaderActions>
          <ExportButton onClick={handleExport}>
            EXPORT CSV
          </ExportButton>
          <span style={{ fontSize: '12px', color: change >= 0 ? '#00ff00' : '#ff0000' }}>
            {change >= 0 ? '▲' : '▼'} {change.toFixed(2)} ({changePercent}%)
          </span>
        </HeaderActions>
      </Header>

      <IndicatorControls>
        <IndicatorButton active={showSMA20} onClick={() => setShowSMA20(!showSMA20)}>
          SMA 20
        </IndicatorButton>
        <IndicatorButton active={showSMA50} onClick={() => setShowSMA50(!showSMA50)}>
          SMA 50
        </IndicatorButton>
        <IndicatorButton active={showEMA20} onClick={() => setShowEMA20(!showEMA20)}>
          EMA 20
        </IndicatorButton>
        <IndicatorButton active={showRSI} onClick={() => setShowRSI(!showRSI)}>
          RSI
        </IndicatorButton>
        <IndicatorButton active={showMACD} onClick={() => setShowMACD(!showMACD)}>
          MACD
        </IndicatorButton>
      </IndicatorControls>
      
      <ChartContainer>
        <Line data={chartData} options={options} />
      </ChartContainer>

      {showRSI && currentRSI && (
        <RSIContainer>
          <RSILabel>RSI (14): <span style={{ color: rsiColor, fontWeight: 'bold' }}>
            {currentRSI.toFixed(2)}
          </span> {currentRSI > 70 ? '(Overbought)' : currentRSI < 30 ? '(Oversold)' : '(Neutral)'}</RSILabel>
        </RSIContainer>
      )}

      <Stats>
        <StatItem>
          <StatLabel>Current</StatLabel>
          <StatValue>${currentPrice.toFixed(2)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>High</StatLabel>
          <StatValue>${high.toFixed(2)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Low</StatLabel>
          <StatValue>${low.toFixed(2)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Period</StatLabel>
          <StatValue>{data.prices.length} days</StatValue>
        </StatItem>
      </Stats>
    </Container>
  );
};

export default GIPFunction;
