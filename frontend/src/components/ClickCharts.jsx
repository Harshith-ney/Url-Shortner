import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Important for time scale!

// Register required components and scales
ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Title, Tooltip, Legend);

const ClickCharts = ({ clickLogs }) => {
  const data = {
    labels: clickLogs.map(log => new Date(log.timestamp).toISOString()),
    datasets: [
      {
        label: 'Clicks Over Time',
        data: clickLogs.map((_, index) => index + 1),
        borderColor: '#00aaff',
        tension: 0.2,
        pointRadius: 3,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Prevent canvas resizing issues
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute'
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative Clicks'
        }
      }
    }
  };

  return (
    <div style={{ marginTop: '2rem', height: '400px' }}>
      <h3>Click Analytics</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default ClickCharts;