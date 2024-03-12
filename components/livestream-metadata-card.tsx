import MotionContainer from '@/components/motion-container';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { usePollAppStore } from '@/stores/store';
import Image from 'next/image';
import { BrowserView, MobileView } from 'react-device-detect';

const LiveStreamMetadataCard = () => {
  const { liveMetadata } = usePollAppStore();
  return (
    <>
      <BrowserView>
        <MotionContainer className='flex w-full h-full'>
          <Card className='flex h-full flex-col items-center justify-center'>
            <CardContent className='flex flex-col items-center justify-center gap-4 p-4'>
              <Image
                src={liveMetadata?.thumbnail ?? ''}
                alt='metadata-yt-thumbnail'
                width={320}
                height={180}
              />
              <Label className='px-10 line-clamp-4'>
                {liveMetadata?.title ?? 'Live stream title not found.'}
              </Label>
            </CardContent>
          </Card>
        </MotionContainer>
      </BrowserView>
      <MobileView>
        <MotionContainer className='flex'>
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
        </MotionContainer>
      </MobileView>
    </>
  );
};

export default LiveStreamMetadataCard;
