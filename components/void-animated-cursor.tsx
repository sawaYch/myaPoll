'use client';
import { useEffect, useState } from 'react';
import AnimatedCursor from 'react-animated-cursor';
import { isMobile } from 'react-device-detect';

const VoidAnimatedCursor = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return undefined;

  return isMobile ? null : (
    <AnimatedCursor
      color='254,155,161'
      innerSize={10}
      outerSize={30}
      innerScale={1}
      outerScale={2}
      outerAlpha={1}
      innerStyle={{
        backgroundColor: 'rgb(255, 255, 255)',
        mixBlendMode: 'exclusion',
        zIndex: '999',
      }}
      outerStyle={{
        mixBlendMode: 'exclusion',
      }}
    />
  );
};
export default VoidAnimatedCursor;
