'use client';

import React, { useEffect } from 'react';

/**
 * FIXME: This component is workaround for recharts warning
 * see: https://github.com/recharts/recharts/issues/3615
 */
const SuppressDefaultPropsWarning: React.FC = () => {
  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && /defaultProps/.test(args[0])) {
        return;
      }

      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
};

export default SuppressDefaultPropsWarning;
