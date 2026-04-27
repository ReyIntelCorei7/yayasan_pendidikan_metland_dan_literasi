import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useCountUp } from 'react-countup';

interface CountUpTriggerProps {
  end: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  separator?: string;
}

export default function CountUpTrigger({
  end,
  suffix = '',
  duration = 2.5,
  decimals = 0,
  className,
  separator = ',',
}: CountUpTriggerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [hasStarted, setHasStarted] = useState(false);

  const countUpRef = useRef<HTMLSpanElement>(null);

  const { start } = useCountUp({
    ref: countUpRef,
    end,
    duration,
    suffix,
    decimals,
    separator,
    startOnMount: false,
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      start();
    }
  }, [isInView, hasStarted, start]);

  return (
    <span ref={containerRef} className={className}>
      <span ref={countUpRef}>0</span>
    </span>
  );
}
