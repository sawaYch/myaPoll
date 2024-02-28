'use client';
import { forwardRef, useState } from 'react';
import { BanIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronRightIcon } from 'lucide-react';
import { Input, InputProps } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Spinner from './spinner';

interface UrlInputProps extends InputProps {
  isLoading: boolean;
  isReady: boolean;
  handleUrlSubmit: () => Promise<void>;
}

const UrlInput = forwardRef<HTMLInputElement, UrlInputProps>(
  ({ isLoading, isReady, handleUrlSubmit, className, ...props }, ref) => {
    return (
      <>
        {!isReady && (
          <Label htmlFor='yt-url' className='mb-2'>
            Enter Youtube Live url
          </Label>
        )}
        <div className='relative'>
          <Input
            type='url'
            id='yt-url'
            placeholder='for example: https://www.youtube.com/watch?v=YxdntrSbAcg'
            className={cn('pr-10', className)}
            ref={ref}
            disabled={isReady}
            {...props}
          />
          <Button
            type='button'
            size='sm'
            className='absolute right-0 top-0 h-full rounded-l-none px-3 py-2'
            onClick={handleUrlSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner />
            ) : isReady ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <BanIcon className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Terminate current process</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <ChevronRightIcon className='h-4 w-4' />
            )}
          </Button>
        </div>
      </>
    );
  }
);

UrlInput.displayName = 'UrlInput';

export default UrlInput;
