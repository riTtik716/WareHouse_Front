import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  LogOut,
  ChevronLeft,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Inventory', icon: Package, href: '/inventory' },
  { label: 'Infrastructure', icon: Warehouse, href: '/infrastructure' },
  { label: 'Stock In', icon: ArrowDownToLine, href: '/stock-in' },
  { label: 'Stock Out', icon: ArrowUpFromLine, href: '/stock-out' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">Company Hub</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Back to Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Warehouse Management
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-primary' : '')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-sidebar-foreground hover:bg-muted transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
