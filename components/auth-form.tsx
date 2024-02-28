import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { KeyRound } from 'lucide-react';
import PassphraseInput from './passphrase-input';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import Spinner from '@/components/spinner';

interface AuthFormProps {
  onSubmit: (passphrase: string) => void;
}

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

const SubmitButton = ({
  isLoading,
  className,
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      type='button'
      className={cn('h-12 w-12 rounded-full', className)}
      {...props}
    >
      {isLoading ? <Spinner /> : <KeyRound size={28} />}
    </Button>
  );
};

export const AuthForm = ({ onSubmit }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passphrase, setPassphrase] = useState('');

  const submitPassphrase = useCallback(async () => {
    setIsLoading(true);
    await onSubmit(passphrase);
    setIsLoading(false);
  }, [onSubmit, passphrase]);

  return (
    <Card className='flex flex-col items-center justify-center'>
      <CardHeader>
        <CardTitle className='flex flex-col items-center gap-y-4'>
          <Avatar className='h-16 w-16 ring-2 ring-pink-500 ring-offset-2 ring-offset-black'>
            <AvatarImage src='./greeting.webp' />
          </Avatar>
          <Label className='uppercase'>㊙️SECRET CODE㊙️</Label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PassphraseInput
          onChange={(event) => {
            setPassphrase(event.target.value);
          }}
        />
      </CardContent>
      <CardFooter>
        <SubmitButton onClick={submitPassphrase} isLoading={isLoading} />
      </CardFooter>
    </Card>
  );
};
