import { useCallback } from 'react';
import { fetchLiveChat } from './fetch-live-chat';
import { fetchLiveStreamDetails } from './fetch-live-stream-details';

interface APIError {
  error: {
    code: number;
    message: string;
  };
}

export const useLiveChat = (currentPassphrase?: string) => {
  const fetchLiveChatMessage = useCallback(
    async (liveChatId: string, nextToken?: string) => {
      try {
        if (currentPassphrase == null) {
          return {
            success: false,
            message:
              'Fail to get stream information: Invalid Passphrase / API Token',
          };
        }
        const data = await fetchLiveChat(
          currentPassphrase,
          liveChatId,
          nextToken
        );
        if (data.ok) {
          return { success: true, ...data };
        } else {
          throw data;
        }
      } catch (err) {
        return {
          success: false,
          message: `Fail to get chat message: ${(
            err as APIError
          ).error.message.replace(/(<([^>]+)>)/gi, '')}`,
        };
      }
    },
    [currentPassphrase]
  );

  const fetchLiveStreamingDetails = useCallback(
    async (vid: string) => {
      try {
        if (currentPassphrase == null) {
          return {
            success: false,
            message:
              'Fail to get stream information: Invalid Passphrase / API Token',
          };
        }
        const data = await fetchLiveStreamDetails(currentPassphrase, vid);
        if (data.ok) {
          const activeLiveChatId =
            data.items[0].liveStreamingDetails?.activeLiveChatId;
          const title = data.items[0].snippet?.title;
          const thumbnail = data.items[0].snippet?.thumbnails?.medium?.url;
          const channelId = data.items[0].snippet?.channelId;
          if (activeLiveChatId == null) {
            return {
              success: false,
              message: 'Url source is not an active live',
            };
          }
          return {
            success: true,
            activeLiveChatId,
            title,
            thumbnail,
            channelId,
          };
        } else {
          throw data;
        }
      } catch (err) {
        return {
          success: false,
          message: `Fail to get stream information: ${(
            err as APIError
          ).error.message.replace(/(<([^>]+)>)/gi, '')}`,
        };
      }
    },
    [currentPassphrase]
  );

  const extractMessage = useCallback(
    (messageObject: {
      snippet: {
        type: string;
        hasDisplayContent: boolean;
        displayMessage: string;
      };
    }) => {
      return messageObject.snippet.hasDisplayContent
        ? messageObject.snippet?.displayMessage
        : 'No superchat message';
    },
    []
  );

  return { fetchLiveChatMessage, fetchLiveStreamingDetails, extractMessage };
};
