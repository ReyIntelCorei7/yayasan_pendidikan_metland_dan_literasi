import { useScroll, useTransform, type MotionValue } from 'framer-motion';

export function useScrollProgress(): { scrollYProgress: MotionValue<number> } {
  const { scrollYProgress } = useScroll();
  return { scrollYProgress };
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}
