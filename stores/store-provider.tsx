import { type PropsWithChildren, useRef } from 'react';
import type { StoreInterface, StoreType } from './store';
import { initializeStore, StoreContextProvider } from './store';

export default function StoreProvider({
  children,
  ...props
}: PropsWithChildren) {
  const storeRef = useRef<StoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  }

  return (
    <StoreContextProvider value={storeRef.current}>
      {children}
    </StoreContextProvider>
  );
}
