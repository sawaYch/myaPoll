import NewPollConfirmDialog from '@/components/new-poll-confirm-dialog';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  updateChartResultParam,
  useChartConfig,
} from '@/hooks/use-chart-config';
import { useFetchLiveChat } from '@/hooks/use-fetch-livechat';
import { cn } from '@/lib/utils';
import { usePollAppStore } from '@/stores/store';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { StopCircleIcon } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import MotionContainer from './motion-container';
import PollSummarySubCard from './poll-summary-subcard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollProcessResultSection = () => {
  const {
    pollAppState,
    changePollAppState,
    newPollReset,
    pollResultSummary,
    setPollResultSummary,
  } = usePollAppStore();
  const { chartOptions, chartInitData, sortChartResult } = useChartConfig();
  const barChartRef = useRef<ChartJS<'bar', number[], string>>(null);

  const updateChartInPolling = useCallback(
    (data: number[]) => {
      if (barChartRef.current) {
        barChartRef.current.data.datasets[0].data = data;
        barChartRef.current.update();
        setPollResultSummary(data);
      }
    },
    [setPollResultSummary]
  );

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

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [cardRef]);

  return (
    <MotionContainer
      whileInView='onscreen'
      layout='position'
      viewport={{ once: false }}
      className={cn('w-full', {
        grayscale: pollAppState === 'prepare',
        'h-[calc(100dvh-10rem)]': !isMobile,
        'h-full': isMobile,
      })}
    >
      <Card ref={cardRef} className='h-full w-full'>
        <CardHeader>
          {pollAppState === 'stop' ? (
            <CardTitle className='font-extrabold uppercase text-primary'>
              3️⃣ Result
            </CardTitle>
          ) : (
            <CardTitle className='flex font-extrabold uppercase text-primary'>
              2️⃣ Retrieving response
              {pollAppState === 'start' && <Spinner className='ml-2' />}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <BrowserView>
            <div className='flex gap-8'>
              <PollSummarySubCard pollSummary={pollResultSummary} />
              <div className={cn('w-full h-full mt-4')}>
                <Bar
                  ref={barChartRef}
                  options={chartOptions}
                  data={chartInitData}
                  height='100%'
                  redraw
                />
              </div>
            </div>
          </BrowserView>
          <MobileView>
            {/* <div className={cn('w-full h-full')}>
              <Bar
                ref={barChartRef}
                options={chartOptions}
                data={chartInitData}
                height='300px'
                redraw
              />
            </div> FIXME: responsive here sucks!!!*/}
            <div className='flex items-center justify-center -ml-2'>
              <PollSummarySubCard pollSummary={pollResultSummary} />
            </div>
          </MobileView>
          {pollAppState === 'stop' ? (
            <NewPollConfirmDialog handleProceedNewPoll={handleProceedNewPoll} />
          ) : (
            <Button
              disabled={pollAppState !== 'start'}
              className='mt-8 flex w-32 self-end'
              onClick={() => {
                changePollAppState('stop');
                sortChartResult(updateChartPollResult);
              }}
            >
              Stop
              <StopCircleIcon className='ml-1 w-8' />
            </Button>
          )}
        </CardContent>
      </Card>
    </MotionContainer>
  );
};

export default PollProcessResultSection;
