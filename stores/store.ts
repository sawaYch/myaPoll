import { LiveMetadata } from '@/types/live-chat';
import {
  PollAppFullInterface,
  PollAppInterface,
  PollAppStatusType,
  PollUserData,
} from '@/types/poll-app';
import dayjs from 'dayjs';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const getNewPollWarningCheckedFromLocalStorage: () => boolean = () => {
  if (typeof window == 'undefined') {
    return false;
  }
  return localStorage.getItem('not-show-new-poll-warning') === 'true'
    ? true
    : false;
};

const getDefaultInitialState: () => PollAppInterface = () => ({
  isLoading: false,
  isReady: false,
  liveChatId: undefined,
  liveMetadata: undefined,
  pollAppState: 'prepare',
  numOfOptions: 0,
  allowUpdatePollChoice: true,
  pollData: {},
  pollStartDateTime: dayjs(),
  pollResultSummary: [] as number[],
  currentPassphrase: '',
  newPollWarningChecked: getNewPollWarningCheckedFromLocalStorage(),
});

const storeContext = createContext<ReturnType<typeof initStore> | null>(null);
export const StoreContextProvider = storeContext.Provider;

function useStore<T>(selector: (state: PollAppFullInterface) => T) {
  const store = useContext(storeContext);
  if (!store) throw new Error('Store is missing the provider');
  return useZustandStore(store, selector);
}

export const usePollAppStore = () => {
  return useStore(
    useShallow((store) => ({
      isLoading: store.isLoading,
      isReady: store.isReady,
      liveChatId: store.liveChatId,
      liveMetadata: store.liveMetadata,
      pollAppState: store.pollAppState,
      numOfOptions: store.numOfOptions,
      allowUpdatePollChoice: store.allowUpdatePollChoice,
      pollData: store.pollData,
      pollStartDateTime: store.pollStartDateTime,
      pollResultSummary: store.pollResultSummary,
      currentPassphrase: store.currentPassphrase,
      newPollWarningChecked: store.newPollWarningChecked,
      setIsLoading: store.setIsLoading,
      setIsReady: store.setIsReady,
      setLiveChatId: store.setLiveChatId,
      setLiveMetaData: store.setLiveMetaData,
      changePollAppState: store.changePollAppState,
      setNumOfOptions: store.setNumOfOptions,
      setAllowUpdatePollChoice: store.setAllowUpdatePollChoice,
      setPollData: store.setPollData,
      setPollStartDateTime: store.setPollStartDateTime,
      setPollResultSummary: store.setPollResultSummary,
      setCurrentPassphrase: store.setCurrentPassphrase,
      newPollReset: store.newPollReset,
      setNewPollWarningChecked: store.setNewPollWarningChecked,
    }))
  );
};

export const initStore = () => {
  return createStore<PollAppFullInterface>((set, _get) => ({
    ...getDefaultInitialState(),
    setIsLoading: (isLoading: boolean) => {
      set((_state) => {
        return { isLoading };
      });
    },
    setIsReady: (isReady: boolean) => {
      set((_state) => {
        return { isReady };
      });
    },
    setLiveChatId: (liveChatId: string) => {
      set((_state) => {
        return { liveChatId };
      });
    },
    setLiveMetaData: (data: LiveMetadata) => {
      set((_state) => {
        return { liveMetadata: data };
      });
    },
    changePollAppState: (state: PollAppStatusType) => {
      set((_state) => {
        return { pollAppState: state };
      });
    },
    setNumOfOptions: (numOfOptions: number) => {
      set((_state) => {
        return { numOfOptions };
      });
    },
    setAllowUpdatePollChoice: (enable: boolean) => {
      set((_state) => {
        return { allowUpdatePollChoice: enable };
      });
    },
    setPollData: (data: PollUserData) => {
      set((_state) => {
        return { pollData: data };
      });
    },
    setPollStartDateTime: (dateTime: dayjs.Dayjs) => {
      set((_state) => {
        return { pollStartDateTime: dateTime };
      });
    },
    setPollResultSummary: (resultSummary: number[]) => {
      set((_state) => {
        return { pollResultSummary: resultSummary };
      });
    },
    setCurrentPassphrase: (currentPassphrase: string) => {
      set((_state) => {
        return { currentPassphrase };
      });
    },
    newPollReset: () => {
      const {
        isLoading,
        pollAppState,
        pollData,
        pollStartDateTime,
        pollResultSummary,
      } = getDefaultInitialState();
      set({
        isLoading,
        pollAppState,
        pollData,
        pollStartDateTime,
        pollResultSummary,
      });
    },
    setNewPollWarningChecked: (checked) => {
      set({
        newPollWarningChecked: checked,
      });
    },
  }));
};
