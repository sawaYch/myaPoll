import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { usePollAppStore } from '@/stores/store';
import { ArrowBigRightDashIcon } from 'lucide-react';
import { useState } from 'react';
interface NewPollConfirmDialogProps {
  handleProceedNewPoll: () => void;
}

const NewPollButton = (
  props: ButtonProps & React.RefAttributes<HTMLButtonElement>
) => (
  <Button {...props} className='mt-8 flex w-32 self-end'>
    Next Poll
    <ArrowBigRightDashIcon className='ml-1 w-8' />
  </Button>
);

const NewPollConfirmDialog = ({
  handleProceedNewPoll,
}: NewPollConfirmDialogProps) => {
  const { newPollWarningChecked, setNewPollWarningChecked, pollAppState } =
    usePollAppStore();

  const [isCheck, setIsCheck] = useState<boolean>(newPollWarningChecked);

  return !newPollWarningChecked ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <NewPollButton disabled={pollAppState !== 'stop'} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              Creating next new poll will discard current poll records. This
              webapp will not keep the poll records and this action cannot be
              undone.
              <div className='mt-8 mb-2 flex flex-row items-center gap-2'>
                <Checkbox
                  id='checkbox-remember'
                  checked={isCheck}
                  onCheckedChange={(checked) => {
                    const checkedBool: boolean =
                      checked === 'indeterminate' ? true : checked;
                    setIsCheck(checkedBool);
                  }}
                />
                <Label htmlFor='checkbox-allow-change-options'>
                  Do not show this message again
                </Label>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleProceedNewPoll();
              setNewPollWarningChecked(isCheck);
              if (typeof window !== 'undefined') {
                localStorage.setItem(
                  'not-show-new-poll-warning',
                  String(isCheck)
                );
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <NewPollButton
      onClick={handleProceedNewPoll}
      disabled={pollAppState !== 'stop'}
    />
  );
};

export default NewPollConfirmDialog;
