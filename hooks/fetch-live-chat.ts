'use server';

import { tokenMapper } from '@/lib/token-mapper';

export const fetchLiveChat = async (
  currentPassphrase: string,
  liveChatId: string,
  nextToken?: string
) => {
  const apiToken = tokenMapper(currentPassphrase);
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&maxResults=2000&${
      nextToken ? `pageToken=${nextToken}&` : ''
    }key=${apiToken}`,
    { cache: 'no-store' }
  );
  const data = await res.json();
  if (res.ok) {
    return { ok: true, ...data };
  }
  return { ok: false, ...data };
};
