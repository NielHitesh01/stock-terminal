import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

const Container = styled.div`
  height: 100px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #333333;
`;

const VolumeTitle = styled.div`
  font-size: 10px;
  color: #666666;
  margin-bottom: 5px;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
`;

const VolumeStats = styled.span`
  color: #00ffff;
  font-weight: bold;
`;

interface VolumeData {
  date: string;
  volume: number;
  close: number;
  open: number;
}

interface VolumeChartProps {
  data: VolumeData[];
}

const VolumeChart = ({ data }: VolumeChartProps) => {
  if (!data || data.length === 0) return null;

  const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }));

  const volumes = data.map(d => d.volume);
  const colors = data.map(d => d.close >= d.open ? 'rgba(0, 255, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)');
  
  const averageVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const maxVolume = Math.max(...volumes);
  const currentVolume = volumes[volumes.length - 1];

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Volume',
      data: volumes,
      backgroundColor: colors,
      borderColor: colors.map(c => c.replace('0.6', '1')),
      borderWidth: 1,
    }]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000000',
        titleColor: '#00ffff',
        bodyColor: '#00ff00',
        borderColor: '#00ff00',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const vol = context.parsed.y;
            return `Volume: ${vol.toLocaleString()}`;
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
          callback: (value) => {
            const val = value as number;
            if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
            return val.toString();
          },
          font: {
            size: 9,
            family: 'Courier New, monospace',
          },
        },
      },
    },
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1000000000) return `${(vol / 1000000000).toFixed(2)}B`;
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(2)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(2)}K`;
    return vol.toLocaleString();
  };

  return (
    <Container>
      <VolumeTitle>
        <span>Volume</span>
        <VolumeStats>
          Current: {formatVolume(currentVolume)} | Avg: {formatVolume(averageVolume)} | Max: {formatVolume(maxVolume)}
        </VolumeStats>
      </VolumeTitle>
      <div style={{ height: '70px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </Container>
  );
};

export default VolumeChart;
