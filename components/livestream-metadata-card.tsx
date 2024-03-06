import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { usePollAppStore } from '@/stores/store';
import Image from 'next/image';
import { MobileView, BrowserView } from 'react-device-detect';

const LiveStreamMetadataCard = () => {
  const { liveMetadata } = usePollAppStore();
  return (
    <>
      <BrowserView>
        <Card className='flex flex-col items-center justify-center'>
          <CardContent className='flex flex-col items-center justify-center gap-8 p-4'>
            <Image
              src={liveMetadata?.thumbnail ?? ''}
              alt='metadata-yt-thumbnail'
              width={320}
              height={180}
            />
            <Label className='px-10'>
              {liveMetadata?.title ?? 'Live stream title not found.'}
            </Label>
          </CardContent>
        </Card>
      </BrowserView>
      <MobileView>
        <Card className='flex flex-col items-center justify-center'>
          <CardContent className='flex flex-col items-center justify-center gap-2 p-4'>
            <Image
              src={liveMetadata?.thumbnail ?? ''}
              alt='metadata-yt-thumbnail'
              width={160}
              height={90}
            />
            <Label className='px-10'>
              {liveMetadata?.title ?? 'Live stream title not found.'}
            </Label>
          </CardContent>
        </Card>
      </MobileView>
    </>
  );
};

export default LiveStreamMetadataCard;
