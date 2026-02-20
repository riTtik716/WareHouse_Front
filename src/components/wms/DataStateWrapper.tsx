import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

interface DataStateWrapperProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: React.ReactNode;
}

export function DataStateWrapper({
  isLoading,
  error,
  isEmpty,
  emptyTitle = 'No data yet',
  emptyDescription = 'Data will appear here once available.',
  children,
}: DataStateWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mb-3" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-destructive">
        <AlertTriangle className="w-6 h-6 mb-3" />
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Inbox className="w-6 h-6 mb-3" />
        <p className="text-sm font-medium">{emptyTitle}</p>
        <p className="text-xs mt-1">{emptyDescription}</p>
      </div>
    );
  }

  return <>{children}</>;
}
