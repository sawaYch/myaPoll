'use client';
import { type PropsWithChildren, useRef } from 'react';
import { initStore, StoreContextProvider } from './store';
import { StoreApi } from 'zustand';
import { PollAppFullInterface } from '@/types/poll-app';

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
