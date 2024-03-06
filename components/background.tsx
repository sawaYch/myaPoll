import Image from 'next/image';
import { PropsWithChildren } from 'react';

const DotPattern = ({ children }: PropsWithChildren) => (
  <div
    id='dot-pattern-animation'
    className='dot-pattern fixed z-[0] h-dvh w-dvw rounded-xl border transition-all'
  >
    {children}
  </div>
);

const CenterContainer = ({ children }: PropsWithChildren) => (
  <div
    id='bg-center-container'
    className='pointer-events-none fixed flex h-dvh w-dvw select-none items-center justify-center break-all opacity-[0.05] transition-all'
  >
    {children}
  </div>
);

const Background = () => (
  <CenterContainer>
    <DotPattern>
      <Image
        className='pointer-events-none z-[1] select-none rounded-xl object-cover grayscale'
        src='/mya-bg.png'
        alt='bg image'
        fill
        priority
      />
    </DotPattern>
  </CenterContainer>
);

export default Background;
