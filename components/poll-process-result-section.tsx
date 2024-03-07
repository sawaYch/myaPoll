import { usePollAppStore } from '@/stores/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StopCircleIcon } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import Spinner from '@/components/spinner';
import NewPollConfirmDialog from '@/components/new-poll-confirm-dialog';
import PollSummarySubCard from '@/components/poll-summary-subcard';
import { useChartConfig } from '@/hooks/use-chart-config';
import { updateChartResultParam } from '@/hooks/use-chart-config';
import { useFetchLiveChat } from '@/hooks/use-fetch-livechat';
import Placeholder from '@/components/placeholder';
import { useCallback, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollProcessResultSection = () => {
  const { pollAppState, pollResultSummary, changePollAppState, newPollReset } =
    usePollAppStore();
  const { chartOptions, chartInitData, sortChartResult } = useChartConfig();
  const barChartRef = useRef<ChartJS<'bar', number[], string>>(null);

  const updateChartInPolling = useCallback((data: number[]) => {
    if (barChartRef.current) {
      barChartRef.current.data.datasets[0].data = data;
      barChartRef.current.update();
    }
  }, []);

  const updateChartPollResult = useCallback((param: updateChartResultParam) => {
    if (barChartRef.current) {
      barChartRef.current.data.datasets[0].data = param.newArrayData;
      barChartRef.current.data.datasets[0].backgroundColor = param.newBarColor;
      barChartRef.current.data.datasets[0].borderColor = param.newBorderColor;
      barChartRef.current.data.labels = param.newArrayLabel;
      barChartRef.current.update();
    }
  }, []);

  useFetchLiveChat({ updateChart: updateChartInPolling });

  const handleProceedNewPoll = useCallback(() => {
    newPollReset();
  }, [newPollReset]);

  return (
    <>
      {pollAppState !== 'prepare' && (
        <Card>
          <CardHeader>
            {pollAppState === 'start' && (
              <CardTitle className='flex font-extrabold uppercase text-primary'>
                2️⃣ Retrieving response <Spinner className='ml-2' />
              </CardTitle>
            )}
            {pollAppState === 'stop' && (
              <CardTitle className='font-extrabold uppercase text-primary'>
                3️⃣ Result
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Bar
              ref={barChartRef}
              options={chartOptions}
              data={chartInitData}
              redraw
            />
            {pollAppState === 'stop' && (
              <PollSummarySubCard pollSummary={pollResultSummary} />
            )}
            {pollAppState === 'start' && (
              <Button
                className='mt-8 flex w-32 self-end'
                onClick={() => {
                  changePollAppState('stop');
                  // sort result
                  sortChartResult(updateChartPollResult);
                }}
              >
                Stop
                <StopCircleIcon className='ml-1 w-8' />
              </Button>
            )}
            {pollAppState === 'stop' && (
              <NewPollConfirmDialog
                handleProceedNewPoll={handleProceedNewPoll}
              />
            )}
          </CardContent>
        </Card>
      )}
      <Placeholder />
    </>
  );
};

export default PollProcessResultSection;
