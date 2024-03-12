import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { usePollAppStore } from '@/stores/store';
import { useEffect, useMemo, useRef } from 'react';
import { isMobile } from 'react-device-detect';

const PollSummarySubCard = () => {
  const { pollAppState, numOfOptions, pollResultSummary } = usePollAppStore();
  const pollSummaryTop = useMemo(() => {
    return pollResultSummary.indexOf(Math.max(...pollResultSummary));
  }, [pollResultSummary]);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [cardRef]);

  return (
    <div id='summary-card' ref={cardRef}>
      <ScrollArea
        className={cn({ 'h-[calc(100dvh-21rem)] overflow-auto': !isMobile })}
      >
        <Table className='w-20'>
          <TableHeader>
            <TableRow className='sticky top-0'>
              <TableHead className='px-0 text-center invisible'>
                {'👑'}
              </TableHead>
              <TableHead className='px-1 text-center text-[#666666]'>
                Option
              </TableHead>
              <TableHead className='px-1 text-center text-[#666666]'>
                Count
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pollResultSummary.length === 0
              ? new Array(numOfOptions).fill(0).map((value, index) => {
                  return (
                    <TableRow key={index + 1}>
                      <TableCell className='p-0 m-0 text-center'>
                        {pollSummaryTop === index && pollAppState === 'stop'
                          ? '👑'
                          : ' '}
                      </TableCell>
                      <TableCell className='p-0 text-center'>
                        {index + 1}
                      </TableCell>
                      <TableCell className='p-0  text-center'>
                        {value ?? 0}
                      </TableCell>
                    </TableRow>
                  );
                })
              : pollResultSummary.map((value, index) => {
                  return (
                    <TableRow key={index + 1}>
                      <TableCell className='p-0 m-0 text-center'>
                        {pollSummaryTop === index && pollAppState === 'stop'
                          ? '👑'
                          : ' '}
                      </TableCell>
                      <TableCell className='p-0 text-center'>
                        {index + 1}
                      </TableCell>
                      <TableCell className='p-0  text-center'>
                        {value ?? 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default PollSummarySubCard;
