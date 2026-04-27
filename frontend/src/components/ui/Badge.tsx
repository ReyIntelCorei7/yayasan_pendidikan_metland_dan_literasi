import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'dark' | 'outline';
  className?: string;
}

export default function Badge({ children, variant = 'lime', className }: BadgeProps) {
  const variantStyles = {
    lime: 'bg-lime/20 text-lime border border-lime/30',
    dark: 'bg-charcoal text-white',
    outline: 'border border-gray-200 text-gray-600',
  };

  return (
    <span
      className={cn(
        'inline-block text-xs rounded-full px-3 py-1 font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
