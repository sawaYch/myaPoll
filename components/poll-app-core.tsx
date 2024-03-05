import { useCallback, useState } from 'react';
import { vidParser } from '@/lib/vid-parser';
import { useLiveChat } from '@/hooks/use-livechat';
import { useToast } from '@/components/ui/use-toast';
import LiveStreamMetadataCard from '@/components/livestream-metadata-card';
import UrlInput from '@/components/url-input';
import { usePollAppStore } from '@/stores/store';
import PrepareSection from '@/components/prepare-section';
import PollProcessResultSection from '@/components/poll-process-result-section';

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
            <LiveStreamMetadataCard />
            <PrepareSection />
          </div>
          <PollProcessResultSection />
        </>
      )}
    </div>
  );
};

export default PollAppCore;
