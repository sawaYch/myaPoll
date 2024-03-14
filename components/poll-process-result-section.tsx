import NewPollConfirmDialog from '@/components/new-poll-confirm-dialog';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChartConfig } from '@/hooks/use-chart-config';
import { useFetchLiveChat } from '@/hooks/use-fetch-livechat';
import { cn } from '@/lib/utils';
import { usePollAppStore } from '@/stores/store';
import { StopCircleIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import MotionContainer from './motion-container';
import PollSummarySubCard from './poll-summary-subcard';
import SuppressDefaultPropsWarning from './suppress-default-props-warning';

const PollProcessResultSection = () => {
  const {
    pollAppState,
    changePollAppState,
    newPollReset,
    pollResultSummary,
    numOfOptions,
  } = usePollAppStore();
  const { chartInitData } = useChartConfig();

  useFetchLiveChat();

  const handleProceedNewPoll = useCallback(() => {
    newPollReset();
    const divElement = document.getElementById('prepare-section-card');
    if (divElement) {
      divElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [newPollReset]);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [cardRef]);

  const enableRankedChartResult = useMemo(() => {
    return pollAppState === 'stop';
  }, [pollAppState]);

  const barChartData = useMemo(() => {
    if (pollResultSummary.length === 0) {
      return new Array(numOfOptions).fill(0).map((value, index) => {
        return {
          name: String(index + 1),
          color: chartInitData.datasets[0].backgroundColor[index],
          value,
        };
      });
    }

    if (enableRankedChartResult) {
      const rankedResult = pollResultSummary
        .map((value, index) => {
          return {
            name: String(index + 1),
            color: chartInitData.datasets[0].backgroundColor[index],
            value,
          };
        })
        .sort((a, b) => (a.value === b.value ? 0 : a.value > b.value ? -1 : 1));

      rankedResult[0].name = `👑${rankedResult[0].name}`;
      return rankedResult;
    }

    return pollResultSummary.map((value, index) => {
      return {
        name: String(index + 1),
        color: chartInitData.datasets[0].backgroundColor[index],
        value,
      };
    });
  }, [
    chartInitData.datasets,
    enableRankedChartResult,
    numOfOptions,
    pollResultSummary,
  ]);

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
      <Card ref={cardRef} className='h-full w-full' id='process-section-card'>
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
          <SuppressDefaultPropsWarning />
          <BrowserView>
            <div className='flex gap-8'>
              <PollSummarySubCard />
              <ResponsiveContainer width='100%' aspect={2.0}>
                <BarChart data={barChartData} layout='vertical'>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e11d48' />
                  <XAxis hide axisLine={false} type='number' />
                  <YAxis
                    yAxisId={0}
                    dataKey='name'
                    type='category'
                    axisLine={false}
                    tickLine={false}
                    tick={true}
                  />
                  <YAxis
                    orientation='right'
                    yAxisId={1}
                    dataKey='value'
                    type='category'
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    labelStyle={{ color: 'black' }}
                    contentStyle={{
                      border: 'transparent',
                      borderRadius: '8px',
                      background: 'lightgray',
                    }}
                  />
                  <Bar minPointSize={2} barSize={20} dataKey='value'>
                    {barChartData.map((d, _idx) => {
                      return <Cell key={d.name} fill={d.color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BrowserView>
          <MobileView>
            <ResponsiveContainer width='100%' aspect={0.5}>
              <BarChart data={barChartData} layout='vertical'>
                <CartesianGrid strokeDasharray='3 3' stroke='#e11d48' />
                <XAxis hide axisLine={false} type='number' />
                <YAxis
                  yAxisId={0}
                  dataKey='name'
                  type='category'
                  axisLine={false}
                  tickLine={false}
                  tick={true}
                />
                <YAxis
                  orientation='right'
                  yAxisId={1}
                  dataKey='value'
                  type='category'
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  labelStyle={{ color: 'black' }}
                  contentStyle={{
                    border: 'transparent',
                    borderRadius: '8px',
                    background: 'lightgray',
                  }}
                />
                <Bar minPointSize={2} barSize={20} dataKey='value'>
                  {barChartData.map((d, _idx) => {
                    return <Cell key={d.name} fill={d.color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className='flex items-center justify-center -ml-2'>
              <PollSummarySubCard />
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
