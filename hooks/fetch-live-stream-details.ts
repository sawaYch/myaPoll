'use server';

import { tokenMapper } from '@/lib/token-mapper';

export const fetchLiveStreamDetails = async (
  currentPassphrase: string,
  vid: string
) => {
  const apiToken = tokenMapper(currentPassphrase);
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${vid}&key=${apiToken}`,
    { cache: 'no-store' }
  );

  const data = await res.json();
  if (data.items == null || data.items.length === 0) {
    return {
      ok: false,
      error: { message: data?.error?.message ?? 'Livestream Unavailable' },
    };
  }
  if (res.ok) {
    return { ok: true, ...data };
  }
  return { ok: false, ...data };
};
