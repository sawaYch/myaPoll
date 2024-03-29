import { useToast } from '@/components/ui/use-toast';
import { defaultBaseInterval, isNumeric } from '@/lib/utils';
import { usePollAppStore } from '@/stores/store';
import { MessageData } from '@/types/live-chat';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef } from 'react';
import { useLiveChat } from './use-livechat';

export const useFetchLiveChat = () => {
  const {
    setIsLoading,
    pollData,
    setPollData,
    liveChatId,
    pollStartDateTime,
    numOfOptions,
    allowUpdatePollChoice,
    isReady,
    pollAppState,
    currentPassphrase,
    setPollResultSummary,
  } = usePollAppStore();

  const { fetchLiveChatMessage, extractMessage } =
    useLiveChat(currentPassphrase);
  const { toast } = useToast();

  // use ref, prevent callback update during process
  const ready = useRef(isReady);
  ready.current = isReady;
  const currentAppState = useRef(pollAppState);
  currentAppState.current = pollAppState;

  const intervalLiveChatMessage = useCallback(
    async (chatId: string, nextToken?: string) => {
      if (!ready.current || currentAppState.current !== 'start') {
        Promise.resolve();
        return;
      }
      const d = await fetchLiveChatMessage(chatId, nextToken);
      // DEBUG dummy data
      // const d = {
      //   success: true,
      //   message: 'hello world',
      //   pollingIntervalMillis: 500,
      //   nextPageToken: 'bla',
      //   items: [],
      // };
      if (!d.success) {
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: '🚨 Oops...',
          description: d.message,
        });
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
      const latestData = newData.filter((it) => {
        return dayjs(it.time).isAfter(pollStartDateTime);
      });

      latestData.map((it) => {
        if (isNumeric(it.message)) {
          // within valid range?
          const value = +it.message;
          if (value > 0 && value <= numOfOptions) {
            if (allowUpdatePollChoice) {
              existedPollData[it.uid] = value;
            } else {
              if (
                existedPollData[it.uid] == null ||
                existedPollData[it.uid] == 0
              ) {
                existedPollData[it.uid] = value;
              }
            }
          }
        }
      });

      const data = new Array(numOfOptions).fill(0);
      Object.values(existedPollData).forEach((v) => {
        if (v > 0 && v <= numOfOptions) {
          data[v - 1]++;
        }
      });

      // update poll result summary (choice & count)
      setPollResultSummary(data);
      // update poll Data based on last existing poll data record (existedPollData[uid] = choice)
      setPollData(existedPollData);

      setTimeout(async () => {
        await intervalLiveChatMessage(chatId, nextPageToken);
      }, pollingMs);
    },
    [
      allowUpdatePollChoice,
      extractMessage,
      fetchLiveChatMessage,
      numOfOptions,
      pollData,
      pollStartDateTime,
      setIsLoading,
      setPollData,
      setPollResultSummary,
      toast,
    ]
  );

  // NOTE: start fetching message when poll start
  useEffect(() => {
    if (
      !ready.current ||
      liveChatId == null ||
      currentAppState.current !== 'start'
    )
      return;
    (async () => {
      await intervalLiveChatMessage(liveChatId);
    })();
  }, [
    liveChatId,
    extractMessage,
    fetchLiveChatMessage,
    intervalLiveChatMessage,
    isReady,
    pollAppState,
  ]);
};
