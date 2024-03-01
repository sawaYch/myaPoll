import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LiveMetadata } from '@/types/liveChat';

import Image from 'next/image';

interface LiveStreamMetadataCardProps {
  liveStreamMetaData: LiveMetadata;
}

const LiveStreamMetadataCard = ({
  liveStreamMetaData,
}: LiveStreamMetadataCardProps) => {
  return (
    <Card className='flex flex-col items-center justify-center'>
      <CardContent className='flex flex-col items-center justify-center gap-8'>
        <Image
          src={liveStreamMetaData.thumbnail}
          alt='metadata-yt-thumbnail'
          width={320}
          height={180}
        />
        <Label className='px-10'>
          {liveStreamMetaData.title ?? 'Live stream title not found.'}
        </Label>
      </CardContent>
    </Card>
  );
};

export default LiveStreamMetadataCard;
