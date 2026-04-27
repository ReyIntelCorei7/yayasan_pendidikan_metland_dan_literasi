import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({ children, className, hoverable = false }: CardProps) {
  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -6, boxShadow: '0 20px 60px -10px rgba(0,0,0,0.12)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn('bg-white border border-gray-100 rounded-2xl relative overflow-hidden', className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn('bg-white border border-gray-100 rounded-2xl relative overflow-hidden', className)}>
      {children}
    </div>
  );
}
