import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import UrlInput from './url-input';
import { vidParser } from '@/lib/vid-parser';
import { LiveMetadata, MessageData, PollUserData } from '@/types/liveChat';
import { useLiveChat } from '@/hooks/use-livechat';
import { useToast } from './ui/use-toast';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowBigRightDashIcon, PlayIcon, StopCircleIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { randomRGBAColor } from '@/lib/random-rgba-color';
import LiveStreamMetadataCard from './livestream-metadata-card';
import Spinner from './spinner';
import { defaultBaseInterval, isNumeric } from '@/lib/utils';
import dayjs from 'dayjs';

interface UrlInputSectionProps {
  currentPassphrase: string;
}

type PollStatusType = 'prepare' | 'start' | 'stop';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollSection = ({ currentPassphrase }: UrlInputSectionProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const readyRef = useRef(isReady);
  readyRef.current = isReady;
  const [urlInputValue, setUrlInputValue] = useState('');
  const [activeChatMessageId, setActiveChatMessageId] = useState<
    string | undefined
  >();

  const [liveMetadata, setLiveMetadata] = useState<LiveMetadata | undefined>();
  const [pollStatus, setPollStatus] = useState<PollStatusType>('prepare');
  const pollStatusRef = useRef(pollStatus);
  pollStatusRef.current = pollStatus;
  const barChartRef = useRef<ChartJS<'bar', number[], string>>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [numOfOptions, setNumOfOptions] = useState<number>(0);
  const [barColor, setBarColor] = useState<{
    bar: string[];
    border: string[];
  }>({ bar: [], border: [] });

  const handleTerminateProcess = useCallback(async () => {
    setIsReady(false);
  }, []);

  const [pollData, setPollData] = useState<PollUserData>({});
  const [pollStartDate, setPollStartDate] = useState<dayjs.Dayjs>();

  const { fetchLiveChatMessage, fetchLiveStreamingDetails, extractMessage } =
    useLiveChat(currentPassphrase);

  const handleUrlSubmit = useCallback(async () => {
    // start / stop
    if (isReady) {
      await handleTerminateProcess();
      return;
    }
    setIsLoading(true);
    // check live url vid
    const vid = vidParser(urlInputValue);
    if (vid == null || vid.length === 0) {
      toast({
        title: '🚨 Oops...',
        description: 'Invalid youtube live url format',
      });
      setIsLoading(false);
      return;
    }

    // check vid is correct
    const result = await fetchLiveStreamingDetails(vid);
    if (!result.success) {
      setIsLoading(false);
      toast({ title: '🚨 Oops...', description: result.message });
      return;
    }

    setActiveChatMessageId(result.activeLiveChatId);
    setLiveMetadata({ title: result.title, thumbnail: result.thumbnail });

    // all green, reset any error flag
    setIsReady(true);
    setIsLoading(false);
  }, [
    fetchLiveStreamingDetails,
    handleTerminateProcess,
    isReady,
    toast,
    urlInputValue,
  ]);

  const intervalLiveChatMessage = useCallback(
    async (chatId: string, nextToken?: string) => {
      if (!readyRef.current || pollStatusRef.current !== 'start') {
        Promise.resolve();
        return;
      }
      const d = await fetchLiveChatMessage(chatId, nextToken);
      if (!d.success) {
        setIsLoading(false);
        toast({ title: '🚨 Oops...', description: d.message });
        return;
      }

      const pollingMs = d.pollingIntervalMillis + defaultBaseInterval;
      const nextPageToken = d.nextPageToken;

      const newData: MessageData[] = d.items.map((it: any) => ({
        key: it.id,
        uid: it.authorDetails.channelId,
        name: it.authorDetails.displayName,
        pic: it.authorDetails.profileImageUrl,
        message: extractMessage(it),
        type: it.snippet.type,
        time: it.snippet.publishedAt,
        isChatOwner: it.authorDetails.isChatOwner,
        isChatSponsor: it.authorDetails.isChatSponsor,
        isChatModerator: it.authorDetails.isChatModerator,
      }));

      const existedPollData = pollData;
      // filter out old message
      const latestData = newData.filter((it) =>
        dayjs(it.time).isAfter(pollStartDate)
      );

      latestData.map((it) => {
        if (isNumeric(it.message)) {
          // within valid range?
          const value = +it.message;
          if (value > 0 && value <= numOfOptions) {
            existedPollData[it.uid] = value;
          }
        }
      });

      const data = new Array(numOfOptions).fill(0);
      Object.values(existedPollData).forEach((v) => {
        if (v > 0 && v <= numOfOptions) {
          data[v - 1]++;
        }
      });
      if (barChartRef.current) {
        barChartRef.current.data.datasets[0].data = data;
        barChartRef.current.update();
      }

      setPollData(existedPollData);

      setTimeout(async () => {
        await intervalLiveChatMessage(chatId, nextPageToken);
      }, pollingMs);
    },
    [
      extractMessage,
      fetchLiveChatMessage,
      numOfOptions,
      pollData,
      pollStartDate,
      toast,
    ]
  );

  // NOTE: start fetching message when poll start
  useEffect(() => {
    if (!isReady || activeChatMessageId == null || pollStatus !== 'start')
      return;
    (async () => {
      await intervalLiveChatMessage(activeChatMessageId);
    })();
  }, [
    activeChatMessageId,
    extractMessage,
    fetchLiveChatMessage,
    intervalLiveChatMessage,
    isReady,
    pollStatus,
  ]);

  const sortChartResult = useCallback(() => {
    const data = new Array(numOfOptions).fill(0);

    // MOCKData: {'Sawa': 5, 'userA': 5, 'Sam': 1, 'userB': 5, 'userC': 2}
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
          borderColor: barColor.border[index],
          backgroundColor: barColor.bar[index],
        };
      });

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
      newBarColor.push(d.backgroundColor); // seems buggy here
      newBorderColor.push(d.borderColor);
    });

    if (barChartRef.current) {
      barChartRef.current.data.datasets[0].data = newArrayData;
      barChartRef.current.data.datasets[0].backgroundColor = newBarColor;
      barChartRef.current.data.datasets[0].borderColor = newBorderColor;
      barChartRef.current.data.labels = newArrayLabel;
      barChartRef.current.update();
    }
  }, [barColor?.bar, barColor?.border, numOfOptions, pollData]);

  const chartInitData = useMemo(() => {
    const labels = Array.from(Array(numOfOptions).keys()).map(
      (i) => `${i + 1}`
    );
    const color = randomRGBAColor(numOfOptions);
    setBarColor(color);

    return {
      labels,
      datasets: [
        {
          label: 'Poll',
          data: [],
          backgroundColor: color.bar,
          borderColor: color.border,
          maxBarThickness: 24,
        },
      ],
    };
  }, [numOfOptions]);

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
    };
  }, []);

  return (
    <div className='flex w-dvw flex-col gap-2 p-20'>
      <UrlInput
        isLoading={isLoading}
        isReady={isReady}
        handleUrlSubmit={handleUrlSubmit}
        onChange={(event) => {
          setUrlInputValue(event.target.value);
        }}
      />
      {isReady && (
        <>
          <div className='flex flex-row space-x-2'>
            {liveMetadata && (
              <LiveStreamMetadataCard liveStreamMetaData={liveMetadata} />
            )}
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>1️⃣ Prepare</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-2'>
                <Label>Number of options (max: 100)</Label>
                <Input
                  ref={inputRef}
                  type='number'
                  min={1}
                  max={100}
                  step={1}
                  required
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onChange={(event) => {
                    // cap max options = 100
                    if (Math.abs(+event.target.value) >= 101) {
                      setNumOfOptions(0);
                      return;
                    }
                    setNumOfOptions(Math.abs(+event.target.value));
                  }}
                  disabled={pollStatus !== 'prepare'}
                />
                <Button
                  className='mt-8 flex w-32 self-end'
                  disabled={pollStatus !== 'prepare'}
                  onClick={() => {
                    // simple validation
                    if (numOfOptions <= 0) {
                      toast({
                        title: '🚨 Oops...',
                        description:
                          'Require to fill in valid number of options',
                      });
                      return;
                    }
                    setPollStatus('start');
                    setPollStartDate(dayjs());
                  }}
                >
                  Start Poll
                  <PlayIcon className='ml-1 w-4' />
                </Button>
              </CardContent>
            </Card>
          </div>
          {pollStatus !== 'prepare' && (
            <Card>
              <CardHeader>
                {pollStatus === 'start' && (
                  <CardTitle className='flex'>
                    2️⃣ Retrieving response <Spinner className='ml-2' />
                  </CardTitle>
                )}
                {pollStatus === 'stop' && <CardTitle>3️⃣ Result</CardTitle>}
              </CardHeader>
              <CardContent className='flex flex-col gap-2'>
                <Bar
                  ref={barChartRef}
                  options={chartOptions}
                  data={chartInitData}
                  redraw
                />
                {pollStatus === 'start' && (
                  <Button
                    className='mt-8 flex w-32 self-end'
                    onClick={() => {
                      setPollStatus('stop');
                      // sort result
                      sortChartResult();
                    }}
                  >
                    Stop
                    <StopCircleIcon className='ml-1 w-8' />
                  </Button>
                )}
                {pollStatus === 'stop' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className='mt-8 flex w-32 self-end bg-gray-400'>
                        Next Poll
                        <ArrowBigRightDashIcon className='ml-1 w-8' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Creating next new poll will discard current poll
                          records. This webapp will not keep the poll records
                          and this action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setPollStatus('prepare');
                            setPollData({});
                            setNumOfOptions(0);
                            if (inputRef.current) {
                              inputRef.current.value = '';
                            }
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PollSection;
