import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables, zoomPlugin);

interface DataPoint {
  timestamp: string;
  value: number;
}

interface ChartComponentProps {
  jsonData: DataPoint[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ jsonData }) => {
  const [timeUnit, setTimeUnit] = useState<'day' | 'week' | 'month'>('day');

  const chartData = {
    labels: jsonData.map(data => data.timestamp),
    datasets: [
      {
        label: 'Values',
        data: jsonData.map(data => data.value),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeUnit(e.target.value as 'day' | 'week' | 'month');
  };

  const customTooltip = (tooltipModel: any) => {
    // Custom tooltip implementation
    let tooltipEl = document.getElementById('chartjs-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.classList.add('custom-tooltip');
      document.body.appendChild(tooltipEl);
    }

    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    if (tooltipModel.body) {
      const { label, value } = tooltipModel.dataPoints[0];
      tooltipEl.innerHTML = `<div>${label}: ${value}</div>`;
    }

    const { offsetLeft: positionX, offsetTop: positionY } = tooltipModel.chart.canvas;
    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = `${positionX + tooltipModel.caretX}px`;
    tooltipEl.style.top = `${positionY + tooltipModel.caretY - 30}px`;
  };

  return (
    <div>
      <div className="timeframe-selector">
        <label htmlFor="timeframe">Timeframe: </label>
        <select id="timeframe" value={timeUnit} onChange={handleTimeframeChange}>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              enabled: false,
              external: customTooltip,
              mode: 'index',
              intersect: false,
            },
            zoom: { pan: { enabled: true, mode: 'x' }, zoom: { wheel: { enabled: true }, mode: 'x' } },
          },
          scales: {
            x: { type: 'time', time: { unit: timeUnit } },
            y: { beginAtZero: true },
          },
          animation: { duration: 1000, easing: 'easeInOutQuart' },
        }}
      />
    </div>
  );
};

export default ChartComponent;
