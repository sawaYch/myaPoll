import LiveStreamMetadataCard from '@/components/livestream-metadata-card';
import PollProcessResultSection from '@/components/poll-process-result-section';
import PrepareSection from '@/components/prepare-section';
import { useToast } from '@/components/ui/use-toast';
import UrlInput from '@/components/url-input';
import { useLiveChat } from '@/hooks/use-livechat';
import { cn } from '@/lib/utils';
import { vidParser } from '@/lib/vid-parser';
import { usePollAppStore } from '@/stores/store';
import { useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';
import MotionContainer from './motion-container';

const PollAppCore = () => {
  const { toast } = useToast();
  const {
    isLoading,
    setIsLoading,
    isReady,
    setIsReady,
    setLiveChatId,
    setLiveMetaData,
    changePollAppState,
    currentPassphrase,
    pollAppState,
  } = usePollAppStore();

  const [urlInputValue, setUrlInputValue] = useState('');

  const { fetchLiveStreamingDetails } = useLiveChat(currentPassphrase);

  const handleTerminateProcess = useCallback(async () => {
    setIsReady(false);
    changePollAppState('prepare');
  }, [changePollAppState, setIsReady]);

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
        variant: 'destructive',
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
      toast({
        variant: 'destructive',
        title: '🚨 Oops...',
        description: result.message,
      });
      return;
    }

    setLiveChatId(result.activeLiveChatId);
    setLiveMetaData({ title: result.title, thumbnail: result.thumbnail });

    // all green, reset any error flag
    setIsReady(true);
    setIsLoading(false);
  }, [
    fetchLiveStreamingDetails,
    handleTerminateProcess,
    isReady,
    setIsLoading,
    setIsReady,
    setLiveChatId,
    setLiveMetaData,
    toast,
    urlInputValue,
  ]);

  return (
    <MotionContainer className='flex w-[calc(100dvw-5rem)] flex-col gap-2 sm:w-dvw sm:p-20'>
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
          <div
            className={cn('flex', {
              'space-x-2': !isMobile,
              'flex-col space-y-2': isMobile,
            })}
          >
            <LiveStreamMetadataCard />
            <PrepareSection />
          </div>
          {pollAppState !== 'prepare' && <PollProcessResultSection />}
        </>
      )}
    </MotionContainer>
  );
};

export default PollAppCore;
