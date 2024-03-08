'use client';
import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

const PassphraseInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className='relative'>
        <form>
          <input hidden type='text' autoComplete='username' />
          <Input
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            className={cn('pr-10', className)}
            ref={ref}
            {...props}
          />
          <Button
            type='button'
            size='sm'
            className='absolute right-0 top-0 h-full rounded-l-none px-3 py-2'
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
          >
            {showPassword ? (
              <EyeIcon className='h-4 w-4' aria-hidden='true' />
            ) : (
              <EyeOffIcon className='h-4 w-4' aria-hidden='true' />
            )}
          </Button>
        </form>
      </div>
    );
  }
);

PassphraseInput.displayName = 'PassphraseInput';

export default PassphraseInput;
