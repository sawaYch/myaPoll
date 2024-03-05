import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { usePollAppStore } from '@/stores/store';
import { PlayIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { useToast } from '@/components/ui/use-toast';

const PrepareSection = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    pollAppState,
    changePollAppState,
    numOfOptions,
    setNumOfOptions,
    setPollStartDateTime,
    allowUpdatePollChoice,
    setAllowUpdatePollChoice,
  } = usePollAppStore();
  const { toast } = useToast();

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
          onKeyUp={(e) => {
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
              setNumOfOptions(0);
              return;
            }
            setNumOfOptions(Math.abs(+event.target.value));
          }}
          disabled={pollAppState !== 'prepare'}
        />
        <div className='mt-4 flex flex-row items-center gap-2'>
          <Checkbox
            disabled={pollAppState != 'prepare'}
            id='checkbox-allow-change-options'
            checked={allowUpdatePollChoice}
            onCheckedChange={(checked) =>
              setAllowUpdatePollChoice(
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
          disabled={pollAppState !== 'prepare'}
          onClick={() => {
            // simple validation
            if (numOfOptions <= 0) {
              toast({
                title: '🚨 Oops...',
                description: 'Require to fill in valid number of options',
              });
              return;
            }
            changePollAppState('start');
            setPollStartDateTime(dayjs());
          }}
        >
          Start Poll
          <PlayIcon className='ml-1 w-4' />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrepareSection;