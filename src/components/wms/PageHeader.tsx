import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between px-8 pt-7 pb-5">
      <div>
        {breadcrumb && (
          <p className="text-xs text-muted-foreground mb-1">{breadcrumb}</p>
        )}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
