import { cn } from '../../lib/utils';

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  color?: 'primary' | 'gray' | 'white';
}

export default function Divider({ className, orientation = 'horizontal', color = 'gray' }: DividerProps) {
  const colorStyles = {
    primary: 'bg-primary',
    gray: 'bg-gray-200',
    white: 'bg-white/10',
  };

  return (
    <div
      className={cn(
        colorStyles[color],
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
}
