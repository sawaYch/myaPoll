'use client';
import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

import { AuthForm } from './auth-form';
import PollSection from './poll-section';

const PollApp = () => {
  const [isAuth, setIsAuth] = useState(false);
  const { toast } = useToast();
  const [currentPassphrase, setCurrentPassphrase] = useState<string>('');
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
    [toast]
  );

  return (
    <div className='flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center'>
      {!isAuth ? (
        <AuthForm onSubmit={handleAuth} />
      ) : (
        <PollSection currentPassphrase={currentPassphrase} />
      )}
    </div>
  );
};

export default PollApp;
