import { randomRGBAColor } from '@/lib/random-rgba-color';
import { usePollAppStore } from '@/stores/store';
import { useMemo } from 'react';

export type updateChartResultParam = {
  newArrayData: number[];
  newBarColor: string[];
  newBorderColor: string[];
  newArrayLabel: string[];
};

export const useChartConfig = () => {
  const { numOfOptions } = usePollAppStore();

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

  return { chartInitData };
};
