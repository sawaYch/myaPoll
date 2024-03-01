import { randomRGBAColor } from '@/lib/random-rgba-color';
import { useMemo } from 'react';

export const useChartConfig = (numOfOptions: number) => {
  const chartOptions = useMemo(() => {
    return {
      indexAxis: 'y' as const,
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Option🎫',
            color: '#dddddd',
          },
          ticks: {
            color: '#dddddd',
          },
          grid: {
            color: '#81112a',
            lineWidth: 0.5,
          },
        },
        x: {
          title: {
            display: true,
            color: '#dddddd',
            text: 'Count',
          },
          ticks: {
            color: '#dddddd',
            stepSize: 1,
          },
          grid: {
            color: '#cd1b42',
            lineWidth: 1,
          },
        },
      },
    };
  }, []);

  const chartColor = useMemo(() => {
    return randomRGBAColor(numOfOptions);
  }, [numOfOptions]);

  const chartInitData = useMemo(() => {
    const labels = Array.from(Array(numOfOptions).keys()).map(
      (i) => `${i + 1}`
    );

    return {
      labels,
      datasets: [
        {
          label: 'Poll',
          data: [],
          backgroundColor: chartColor.bar,
          borderColor: chartColor.border,
          maxBarThickness: 24,
        },
      ],
    };
  }, [chartColor.bar, chartColor.border, numOfOptions]);

  return { chartOptions, chartInitData, chartColor };
};
