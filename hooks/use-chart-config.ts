import { randomRGBAColor } from '@/lib/random-rgba-color';
import { usePollAppStore } from '@/stores/store';
import { useCallback, useMemo } from 'react';

export type updateChartResultParam = {
  newArrayData: number[];
  newBarColor: string[];
  newBorderColor: string[];
  newArrayLabel: string[];
};

export const useChartConfig = () => {
  const { numOfOptions, pollData, setPollResultSummary } = usePollAppStore();

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

  const sortChartResult = useCallback(
    (updateChartResult: (param: updateChartResultParam) => void) => {
      const data = new Array(numOfOptions).fill(0);

      Object.values(pollData).forEach((v) => {
        if (v > 0 && v <= numOfOptions) {
          data[v - 1]++;
        }
      });

      const arrayOfObj = Array.from(Array(numOfOptions).keys())
        .map((i) => i + 1)
        .map((value, index) => {
          return {
            label: value,
            data: data[index] || 0,
            borderColor: chartColor.border[index],
            backgroundColor: chartColor.bar[index],
          };
        });

      const pollSummary = arrayOfObj.map((it) => it.data);
      setPollResultSummary(pollSummary);
      const sortedArrayOfObj = arrayOfObj.sort((a, b) =>
        a.data === b.data ? 0 : a.data > b.data ? -1 : 1
      );

      const newArrayLabel: string[] = [];
      const newArrayData: number[] = [];
      const newBarColor: string[] = [];
      const newBorderColor: string[] = [];
      sortedArrayOfObj.forEach(function (d, index) {
        if (index === 0) {
          const highestVoteLabel = `👑${d.label}`;
          newArrayLabel.push(highestVoteLabel);
        } else {
          newArrayLabel.push(`${d.label}`);
        }
        newArrayData.push(d.data);
        newBarColor.push(d.backgroundColor);
        newBorderColor.push(d.borderColor);
      });

      updateChartResult({
        newArrayData,
        newBarColor,
        newBorderColor,
        newArrayLabel,
      });
    },
    [chartColor, numOfOptions, pollData, setPollResultSummary]
  );

  return { chartOptions, chartInitData, sortChartResult };
};
