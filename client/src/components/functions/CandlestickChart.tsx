import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Canvas = styled.canvas`
  width: 100% !important;
  height: 100% !important;
`;

interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  ticker: string;
}

const CandlestickChart = ({ data, ticker }: CandlestickChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Prepare data
    const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }));

    // Custom candlestick drawing
    const drawCandlestick = (ctx: CanvasRenderingContext2D, x: number, open: number, high: number, low: number, close: number, yScale: any, width: number) => {
      const isPositive = close >= open;
      const color = isPositive ? '#00ff00' : '#ff0000';
      
      // Scale prices to canvas coordinates
      const openY = yScale.getPixelForValue(open);
      const closeY = yScale.getPixelForValue(close);
      const highY = yScale.getPixelForValue(high);
      const lowY = yScale.getPixelForValue(low);
      
      // Draw wick (high-low line)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Draw body (open-close rectangle)
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      ctx.fillStyle = color;
      ctx.fillRect(x - width / 2, bodyY, width, bodyHeight || 1);
    };

    // Create custom chart type
    const customChart = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: ticker,
          data: data.map(d => d.close),
          backgroundColor: data.map(d => d.close >= d.open ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'),
          borderColor: data.map(d => d.close >= d.open ? '#00ff00' : '#ff0000'),
          borderWidth: 1,
        }]
      },
      options: {
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
                const index = context.dataIndex;
                const candle = data[index];
                return [
                  `Open: $${candle.open.toFixed(2)}`,
                  `High: $${candle.high.toFixed(2)}`,
                  `Low: $${candle.low.toFixed(2)}`,
                  `Close: $${candle.close.toFixed(2)}`,
                  candle.volume ? `Volume: ${candle.volume.toLocaleString()}` : ''
                ].filter(Boolean);
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
      },
      plugins: [{
        id: 'candlestick',
        afterDatasetsDraw: (chart) => {
          const ctx = chart.ctx;
          const xScale = chart.scales.x;
          const yScale = chart.scales.y;
          
          data.forEach((candle, index) => {
            const x = xScale.getPixelForValue(index);
            const barWidth = Math.min((xScale.width / data.length) * 0.8, 15);
            
            drawCandlestick(
              ctx,
              x,
              candle.open,
              candle.high,
              candle.low,
              candle.close,
              yScale,
              barWidth
            );
          });
        }
      }]
    });

    chartRef.current = customChart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, ticker]);

  return <Canvas ref={canvasRef} />;
};

export default CandlestickChart;
