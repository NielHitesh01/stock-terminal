import { useState } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CandlestickChart from './CandlestickChart';
import TechnicalIndicators from './TechnicalIndicators';
import VolumeChart from './VolumeChart';
import { exportPriceData } from '../../utils/exportUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 3px;
  }
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

const ActionButton = styled.button`
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

const ChartTypeSelector = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
`;

const ChartTypeButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  background: ${props => props.active ? '#00ff00' : '#1a1a1a'};
  color: ${props => props.active ? '#000000' : '#00ff00'};
  border: 1px solid #00ff00;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const TimeframeButton = styled.button<{ active?: boolean }>`
  padding: 4px 10px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  background: ${props => props.active ? '#00ffff' : '#1a1a1a'};
  color: ${props => props.active ? '#000000' : '#00ffff'};
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
  min-height: 300px;
  margin-bottom: 10px;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 11px;
  color: #00ff00;
  border-top: 1px solid #333333;
  padding-top: 10px;
  flex-wrap: wrap;
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
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #333333;
`;

const RSILabel = styled.div`
  font-size: 10px;
  color: #666666;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const RSIValue = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: bold;
  font-size: 12px;
`;

interface GIPFunctionProps {
  ticker: string;
  data: any;
}

type ChartType = 'line' | 'candlestick' | 'area';
type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

const GIPFunctionEnhanced = ({ ticker, data }: GIPFunctionProps) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showEMA20, setShowEMA20] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [showBollingerBands, setShowBollingerBands] = useState(false);
  const [showVolume, setShowVolume] = useState(true);

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
      borderColor: chartType === 'area' ? '#00ff00' : '#00ff00',
      backgroundColor: chartType === 'area' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(0, 255, 0, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: '#00ff00',
      tension: 0.1,
      fill: chartType === 'area',
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
      fill: false,
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
      fill: false,
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
      fill: false,
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
        display: true,
        position: 'top',
        labels: {
          color: '#00ff00',
          font: {
            size: 10,
            family: 'Courier New, monospace',
          },
          usePointStyle: true,
          padding: 15,
        },
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
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
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

  const renderChart = () => {
    if (chartType === 'candlestick') {
      return <CandlestickChart data={data.prices} ticker={ticker} />;
    }
    return <Line data={chartData} options={options} />;
  };

  return (
    <Container>
      <Header>
        <span>{ticker} - Historical Prices</span>
        <HeaderActions>
          <ActionButton onClick={handleExport}>
            📊 EXPORT CSV
          </ActionButton>
          <span style={{ fontSize: '12px', color: change >= 0 ? '#00ff00' : '#ff0000' }}>
            {change >= 0 ? '▲' : '▼'} {change.toFixed(2)} ({changePercent}%)
          </span>
        </HeaderActions>
      </Header>

      <ChartTypeSelector>
        <ChartTypeButton active={chartType === 'line'} onClick={() => setChartType('line')}>
          📈 LINE
        </ChartTypeButton>
        <ChartTypeButton active={chartType === 'candlestick'} onClick={() => setChartType('candlestick')}>
          📊 CANDLESTICK
        </ChartTypeButton>
        <ChartTypeButton active={chartType === 'area'} onClick={() => setChartType('area')}>
          🏔️ AREA
        </ChartTypeButton>
      </ChartTypeSelector>

      <TimeframeSelector>
        {(['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'] as Timeframe[]).map(tf => (
          <TimeframeButton 
            key={tf}
            active={timeframe === tf} 
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </TimeframeButton>
        ))}
      </TimeframeSelector>

      {chartType !== 'candlestick' && (
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
          <IndicatorButton active={showBollingerBands} onClick={() => setShowBollingerBands(!showBollingerBands)}>
            BB
          </IndicatorButton>
          <IndicatorButton active={showRSI} onClick={() => setShowRSI(!showRSI)}>
            RSI
          </IndicatorButton>
          <IndicatorButton active={showMACD} onClick={() => setShowMACD(!showMACD)}>
            MACD
          </IndicatorButton>
          <IndicatorButton active={showVolume} onClick={() => setShowVolume(!showVolume)}>
            VOL
          </IndicatorButton>
        </IndicatorControls>
      )}
      
      <ChartContainer>
        {renderChart()}
      </ChartContainer>

      {showVolume && data.prices && (
        <VolumeChart data={data.prices} />
      )}

      {showRSI && currentRSI && (
        <RSIContainer>
          <RSILabel>
            RSI (14): <RSIValue color={rsiColor}>
              {currentRSI.toFixed(2)}
            </RSIValue> {currentRSI > 70 ? '(Overbought)' : currentRSI < 30 ? '(Oversold)' : '(Neutral)'}
          </RSILabel>
        </RSIContainer>
      )}

      <TechnicalIndicators 
        data={indicators}
        dates={dates}
        showBollingerBands={showBollingerBands}
        showMACD={showMACD}
      />

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
        <StatItem>
          <StatLabel>Chart Type</StatLabel>
          <StatValue>{chartType.toUpperCase()}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Timeframe</StatLabel>
          <StatValue>{timeframe}</StatValue>
        </StatItem>
      </Stats>
    </Container>
  );
};

export default GIPFunctionEnhanced;
