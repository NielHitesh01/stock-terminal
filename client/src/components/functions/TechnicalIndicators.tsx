import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

const Container = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #333333;
`;

const IndicatorTitle = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: #00ffff;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ChartContainer = styled.div`
  height: 120px;
  margin-bottom: 15px;
`;

const MACDContainer = styled.div`
  height: 100px;
`;

const IndicatorStats = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 5px;
  font-size: 10px;
`;

const StatItem = styled.span<{ color?: string }>`
  color: ${props => props.color || '#00ff00'};
`;

interface IndicatorData {
  bollingerBands?: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
  macd?: {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
  rsi?: number[];
  stochastic?: {
    k: number[];
    d: number[];
  };
}

interface TechnicalIndicatorsProps {
  data: IndicatorData;
  dates: string[];
  showBollingerBands?: boolean;
  showMACD?: boolean;
}

const TechnicalIndicators = ({ 
  data, 
  dates,
  showBollingerBands = false,
  showMACD = false 
}: TechnicalIndicatorsProps) => {
  
  // Bollinger Bands Chart
  const renderBollingerBands = () => {
    if (!showBollingerBands || !data.bollingerBands) return null;

    const chartData = {
      labels: dates,
      datasets: [
        {
          label: 'Upper Band',
          data: data.bollingerBands.upper,
          borderColor: '#ff00ff',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [5, 5],
          fill: false,
        },
        {
          label: 'Middle Band (SMA 20)',
          data: data.bollingerBands.middle,
          borderColor: '#00ffff',
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Lower Band',
          data: data.bollingerBands.lower,
          borderColor: '#ff00ff',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [5, 5],
          fill: false,
        },
      ],
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
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          grid: {
            color: '#1a1a1a',
          },
          ticks: {
            color: '#00ff00',
            callback: (value) => `$${value}`,
            font: {
              size: 9,
              family: 'Courier New, monospace',
            },
          },
        },
      },
    };

    const currentUpper = data.bollingerBands.upper[data.bollingerBands.upper.length - 1];
    const currentMiddle = data.bollingerBands.middle[data.bollingerBands.middle.length - 1];
    const currentLower = data.bollingerBands.lower[data.bollingerBands.lower.length - 1];

    return (
      <Container>
        <IndicatorTitle>Bollinger Bands (20, 2)</IndicatorTitle>
        <ChartContainer>
          <Line data={chartData} options={options} />
        </ChartContainer>
        <IndicatorStats>
          <StatItem color="#ff00ff">Upper: ${currentUpper?.toFixed(2) || 'N/A'}</StatItem>
          <StatItem color="#00ffff">Middle: ${currentMiddle?.toFixed(2) || 'N/A'}</StatItem>
          <StatItem color="#ff00ff">Lower: ${currentLower?.toFixed(2) || 'N/A'}</StatItem>
        </IndicatorStats>
      </Container>
    );
  };

  // MACD Chart
  const renderMACD = () => {
    if (!showMACD || !data.macd) return null;

    const chartData: any = {
      labels: dates,
      datasets: [
        {
          label: 'MACD',
          data: data.macd.macd,
          borderColor: '#00ff00',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          yAxisID: 'y',
        },
        {
          label: 'Signal',
          data: data.macd.signal,
          borderColor: '#ff0000',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          yAxisID: 'y',
        },
        {
          label: 'Histogram',
          data: data.macd.histogram,
          backgroundColor: data.macd.histogram.map(val => val >= 0 ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'),
          borderColor: data.macd.histogram.map(val => val >= 0 ? '#00ff00' : '#ff0000'),
          borderWidth: 1,
          type: 'bar' as const,
          yAxisID: 'y',
        },
      ],
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
              return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          grid: {
            color: '#1a1a1a',
          },
          ticks: {
            color: '#00ff00',
            font: {
              size: 9,
              family: 'Courier New, monospace',
            },
          },
        },
      },
    };

    const currentMACD = data.macd.macd[data.macd.macd.length - 1];
    const currentSignal = data.macd.signal[data.macd.signal.length - 1];
    const currentHistogram = data.macd.histogram[data.macd.histogram.length - 1];
    const isBullish = currentMACD > currentSignal;

    return (
      <Container>
        <IndicatorTitle>MACD (12, 26, 9)</IndicatorTitle>
        <MACDContainer>
          <Line data={chartData} options={options} />
        </MACDContainer>
        <IndicatorStats>
          <StatItem color="#00ff00">MACD: {currentMACD?.toFixed(4) || 'N/A'}</StatItem>
          <StatItem color="#ff0000">Signal: {currentSignal?.toFixed(4) || 'N/A'}</StatItem>
          <StatItem color={currentHistogram >= 0 ? '#00ff00' : '#ff0000'}>
            Histogram: {currentHistogram?.toFixed(4) || 'N/A'}
          </StatItem>
          <StatItem color={isBullish ? '#00ff00' : '#ff0000'}>
            {isBullish ? '▲ BULLISH' : '▼ BEARISH'}
          </StatItem>
        </IndicatorStats>
      </Container>
    );
  };

  return (
    <>
      {renderBollingerBands()}
      {renderMACD()}
    </>
  );
};

export default TechnicalIndicators;
