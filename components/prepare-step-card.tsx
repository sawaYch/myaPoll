import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { PlayIcon } from 'lucide-react';
import { PollStatusType } from '@/types/liveChat';

export type PrepareStepCardHandle = {
  clearInput: () => void;
};

interface PrepareStepCardProps {
  updateNumOfOptions: (num: number) => void;
  pollStatus: PollStatusType
}

const PrepareStepCard = forwardRef<PrepareStepCardHandle, PrepareStepCardProps>(
  ({updateNumOfOptions, pollStatus}: PrepareStepCardProps, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      clearInput() {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
    }));

    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='font-extrabold uppercase text-primary'>
            1️⃣ Prepare
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <Label>Number of options (max: 100)</Label>
          <Input
            ref={inputRef}
            type='number'
            min={1}
            max={100}
            step={1}
            required
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              return false;
            }}
            onChange={(event) => {
              // cap max options = 100
              if (Math.abs(+event.target.value) >= 101) {
                updateNumOfOptions(0);
                return;
              }
              updateNumOfOptions(Math.abs(+event.target.value));
            }}
            disabled={pollStatus !== 'prepare'}
          />
          <div className='mt-4 flex flex-row items-center gap-2'>
            <Checkbox
              disabled={pollStatus != 'prepare'}
              id='checkbox-allow-change-options'
              checked={allowUpdatePollOptions}
              onCheckedChange={(checked) =>
                setAllowUpdatePollOptions(
                  checked === 'indeterminate' ? true : checked
                )
              }
            />
            <Label htmlFor='checkbox-allow-change-options'>
              Allow audience to update his choice using latest comments
            </Label>
          </div>
          <pre className='pl-6 text-sm text-muted-foreground'>
            {'For example:\n'}
            {'userA: 2\n'}
            {'userB: 1\n'}
            {'userA: 3\n'}
            {'...\n'}
            {'userA is updated his choice from "2" to "3".\n'}
          </pre>
          <Button
            className='mt-8 flex w-32 self-end'
            disabled={pollStatus !== 'prepare'}
            onClick={() => {
              // simple validation
              if (numOfOptions <= 0) {
                toast({
                  title: '🚨 Oops...',
                  description: 'Require to fill in valid number of options',
                });
                return;
              }
              setPollStatus('start');
              setPollStartDate(dayjs());
            }}
          >
            Start Poll
            <PlayIcon className='ml-1 w-4' />
          </Button>
        </CardContent>
      </Card>
    );
  }
);

PrepareStepCard.displayName = 'PrepareStepCard';

export default PrepareStepCard;
