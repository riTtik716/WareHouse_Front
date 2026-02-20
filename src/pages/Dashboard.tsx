import { useState } from 'react';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { StatusBadge } from '@/components/wms/StatusBadge';
import { DataStateWrapper } from '@/components/wms/DataStateWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  Warehouse,
  DollarSign,
  TrendingUp,
  Minus,
  CheckCircle,
  RotateCcw,
  ArrowUpRight,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { NewEntryModal } from '@/components/wms/NewEntryModal';
import type { Product } from '@/types/wms';

interface KPI {
  label: string;
  value: string;
  change: string;
  positive: boolean | null;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

interface CapacityItem {
  name: string;
  pct: number;
  color: string;
}

interface ActivityItem {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  sub: string;
}

export default function Dashboard() {
  const [showNewEntry, setShowNewEntry] = useState(false);

  // Data states — ready for API integration
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [capacityData, setCapacityData] = useState<CapacityItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [demandProducts, setDemandProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Summary placeholders — will come from API
  const [availableSpace, setAvailableSpace] = useState<string>('—');
  const [inboundUnits, setInboundUnits] = useState<string>('—');

  return (
    <WMSLayout>
      <PageHeader
        title="Warehouse Dashboard"
        subtitle="Welcome to the Warehouse Management Module."
        action={
          <Button onClick={() => setShowNewEntry(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        }
      />

      <div className="px-8 space-y-6 pb-10">
        {/* KPI Row */}
        <DataStateWrapper isLoading={isLoading} error={error} isEmpty={kpis.length === 0} emptyTitle="No KPIs available" emptyDescription="Dashboard metrics will appear here once data is connected.">
          <div className="grid grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="shadow-none border-border">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                      <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
                    </div>
                    <span className={`text-xs font-medium flex items-center gap-1 ${
                      kpi.positive === true ? 'text-green-600' :
                      kpi.positive === false ? 'text-red-500' :
                      'text-muted-foreground'
                    }`}>
                      {kpi.positive === true && <TrendingUp className="w-3 h-3" />}
                      {kpi.positive === null && <Minus className="w-3 h-3" />}
                      {kpi.change}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-0.5">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DataStateWrapper>

        {/* Middle Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Capacity */}
          <Card className="col-span-2 shadow-none border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-foreground">Storage Capacity Utilization</h3>
                <button className="text-xs text-primary hover:underline font-medium">View Details</button>
              </div>
              <DataStateWrapper isLoading={isLoading} error={null} isEmpty={capacityData.length === 0} emptyTitle="No capacity data" emptyDescription="Warehouse capacity metrics will appear here.">
                <div className="space-y-4">
                  {capacityData.map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-foreground font-medium">{item.name}</span>
                        <span className="text-muted-foreground">{item.pct}% Full</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </DataStateWrapper>
              <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Available Space</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{availableSpace}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Inbound (Next 24h)</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{inboundUnits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-none border-border">
            <CardContent className="pt-5 pb-5">
              <h3 className="font-semibold text-sm text-foreground mb-4">Recent Activity</h3>
              <DataStateWrapper isLoading={isLoading} error={null} isEmpty={recentActivity.length === 0} emptyTitle="No recent activity" emptyDescription="Activity will show here once operations begin.">
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-7 h-7 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground leading-snug">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DataStateWrapper>
              <button className="mt-4 w-full text-xs text-center text-muted-foreground border border-border rounded-md py-2 hover:bg-muted transition-colors">
                See All Activity
              </button>
            </CardContent>
          </Card>
        </div>

        {/* In-Demand Items */}
        <Card className="shadow-none border-border">
          <CardContent className="pt-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-foreground">In-Demand Items</h3>
              <input
                placeholder="Search products..."
                className="h-8 text-xs border border-border rounded-md px-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring w-48"
              />
            </div>
            <DataStateWrapper isLoading={isLoading} error={null} isEmpty={demandProducts.length === 0} emptyTitle="No in-demand items" emptyDescription="Products will appear here once inventory data is available.">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-3">Product Name</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-3">SKU</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-3">Current Stock</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-3">Status</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-3">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {demandProducts.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-sm font-medium text-foreground">{p.name}</td>
                      <td className="py-3 text-sm text-muted-foreground">{p.sku}</td>
                      <td className="py-3 text-sm text-foreground">{p.currentStock?.toLocaleString()} Units</td>
                      <td className="py-3"><StatusBadge status={p.stockStatus || 'Healthy'} /></td>
                      <td className="py-3 text-sm text-muted-foreground">{p.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataStateWrapper>
          </CardContent>
        </Card>
      </div>

      {showNewEntry && <NewEntryModal onClose={() => setShowNewEntry(false)} />}
    </WMSLayout>
  );
}
