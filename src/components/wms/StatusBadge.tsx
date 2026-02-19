import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getClass = () => {
    switch (status.toLowerCase().replace(/\s/g, '-')) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'in-maintenance':
      case 'maintenance': return 'status-maintenance';
      case 'low-stock': return 'status-low';
      case 'healthy': return 'status-healthy';
      case 'full': return 'status-full';
      case 'blocked': return 'status-blocked';
      case 'available': return 'status-available';
      default: return 'status-inactive';
    }
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      getClass(),
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
