import { useState } from 'react';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { DataStateWrapper } from '@/components/wms/DataStateWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/wms/StatusBadge';

interface StockInEntry {
  id: string;
  product: string;
  sku: string;
  warehouse: string;
  qty: number;
  date: string;
  status: 'Active' | 'Inactive';
}

export default function StockIn() {
  const [entries, setEntries] = useState<StockInEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <WMSLayout>
      <PageHeader
        title="Stock In"
        subtitle="Record incoming inventory into the warehouse."
        breadcrumb="Warehouse Management / Stock In"
        action={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Stock In Entry
          </Button>
        }
      />
      <div className="px-8 pb-10">
        <Card className="shadow-none border-border">
          <CardContent className="p-0">
            <DataStateWrapper isLoading={isLoading} error={error} isEmpty={entries.length === 0} emptyTitle="No stock-in entries" emptyDescription="Record incoming inventory to see entries here.">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Reference', 'Product', 'SKU', 'Warehouse', 'Qty Received', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map(r => (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-mono font-medium text-primary flex items-center gap-2">
                        <ArrowDownToLine className="w-3.5 h-3.5 text-green-500" />{r.id}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">{r.product}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono">{r.sku}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.warehouse}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{r.qty} units</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.date}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataStateWrapper>
          </CardContent>
        </Card>
      </div>
    </WMSLayout>
  );
}
