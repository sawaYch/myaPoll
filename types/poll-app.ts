import dayjs from 'dayjs';
import { LiveMetadata } from './live-chat';

export type PollUserData = Record<string, number>;

export type PollAppStatusType = 'prepare' | 'start' | 'stop';

export type BarColor = {
  bar: string[];
  border: string[];
};

export interface PollAppInterface {
  isLoading: boolean; // application busy state
  isReady: boolean; // application init done, ready for use
  liveChatId: string | undefined; // youtube liveChatId
  liveMetadata: LiveMetadata | undefined; // youtube live metadata
  pollAppState: PollAppStatusType;
  numOfOptions: number; // app param: Number of poll options
  allowUpdatePollChoice: boolean; // app param: Allow audience to update his choice using latest comments
  pollData: PollUserData;
  pollStartDateTime: dayjs.Dayjs;
  pollResultSummary: number[];
  currentPassphrase: string;
  newPollWarningChecked: boolean;
}

export interface PollAppActionsInterface {
  setIsLoading: (state: boolean) => void;
  setIsReady: (state: boolean) => void;
  setLiveChatId: (liveChatId: string) => void;
  setLiveMetaData: (data: LiveMetadata) => void;
  changePollAppState: (state: PollAppStatusType) => void;
  setNumOfOptions: (numOfOptions: number) => void;
  setAllowUpdatePollChoice: (enable: boolean) => void;
  setPollData: (data: PollUserData) => void;
  setPollStartDateTime: (dateTime: dayjs.Dayjs) => void;
  setPollResultSummary: (resultSummary: number[]) => void;
  newPollReset: () => void;
  setCurrentPassphrase: (currentPassphrase: string) => void;
  setNewPollWarningChecked: (checked: boolean) => void;
}

export type PollAppFullInterface = PollAppInterface & PollAppActionsInterface;
