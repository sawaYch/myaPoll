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
import { Button } from '@/components/ui/button';
import { ArrowBigRightDashIcon } from 'lucide-react';

interface NewPollConfirmDialogProps {
  handleProceedNewPoll: () => void;
}

const NewPollConfirmDialog = ({
  handleProceedNewPoll,
}: NewPollConfirmDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='mt-8 flex w-32 self-end bg-gray-600'>
          Next Poll
          <ArrowBigRightDashIcon className='ml-1 w-8' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Creating next new poll will discard current poll records. This
            webapp will not keep the poll records and this action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleProceedNewPoll}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewPollConfirmDialog;
