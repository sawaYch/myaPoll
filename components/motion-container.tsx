import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { PropsWithChildren, forwardRef } from 'react';

const MotionContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<HTMLMotionProps<'div'>>
>(({ children, ...props }: PropsWithChildren<HTMLMotionProps<'div'>>, ref) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
        {...props}
        ref={ref}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

MotionContainer.displayName = 'MotionContainer';

export default MotionContainer;
