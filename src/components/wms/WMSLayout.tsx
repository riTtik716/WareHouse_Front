import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface WMSLayoutProps {
  children: ReactNode;
}

export function WMSLayout({ children }: WMSLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
