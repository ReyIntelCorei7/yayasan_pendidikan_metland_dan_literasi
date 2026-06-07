import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'dark' | 'outline';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary/20 text-primary border border-primary/30',
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
