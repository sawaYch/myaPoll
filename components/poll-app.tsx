'use client';
import { useToast } from '@/components/ui/use-toast';
import { useCallback, useState } from 'react';

import { usePollAppStore } from '@/stores/store';
import { AuthForm } from './auth-form';
import PollAppCore from './poll-app-core';

const PollApp = () => {
  const [isAuth, setIsAuth] = useState(false);
  const { toast } = useToast();
  const { setCurrentPassphrase } = usePollAppStore();
  const handleAuth = useCallback(
    async (passphrase: string) => {
      const result = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ passphrase }),
      });
      if (result.status === 200) {
        toast({ title: '👋 Welcome!' });
        setIsAuth(true);
        setCurrentPassphrase(passphrase);
      } else {
        toast({ title: '❌ Wrong Secret Code' });
        setIsAuth(false);
      }
    },
    [setCurrentPassphrase, toast]
  );

  return (
    <div className='z-40 flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center'>
      {!isAuth ? <AuthForm onSubmit={handleAuth} /> : <PollAppCore />}
    </div>
  );
};

export default PollApp;
