'use client';
import { PollAppFullInterface } from '@/types/poll-app';
import { useRef, type PropsWithChildren } from 'react';
import { StoreApi } from 'zustand';
import { StoreContextProvider, initStore } from './store';

export default function StoreProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<StoreApi<PollAppFullInterface>>();

  if (!storeRef.current) {
    storeRef.current = initStore();
  }

  return (
    <StoreContextProvider value={storeRef.current}>
      {children}
    </StoreContextProvider>
  );
}
