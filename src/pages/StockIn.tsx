import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/wms/StatusBadge';

const stockInData = [
  { id: 'SI-0881', product: 'MacBook Pro M3 14"', sku: '#PRO-9921', warehouse: 'WH-MAIN-01', qty: 50, date: '2026-02-19', status: 'Active' as const },
  { id: 'SI-0880', product: 'Sony WH-1000XM5', sku: '#PRO-4452', warehouse: 'WH-MAIN-01', qty: 200, date: '2026-02-18', status: 'Active' as const },
  { id: 'SI-0879', product: 'Smart Watch Series 9', sku: '#PRO-5561', warehouse: 'WH-COLD-02', qty: 75, date: '2026-02-17', status: 'Active' as const },
  { id: 'SI-0878', product: 'Nespresso Vertuo', sku: '#PRO-8812', warehouse: 'WH-RTRN-04', qty: 30, date: '2026-02-16', status: 'Inactive' as const },
];

export default function StockIn() {
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Reference', 'Product', 'SKU', 'Warehouse', 'Qty Received', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockInData.map(r => (
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
          </CardContent>
        </Card>
      </div>
    </WMSLayout>
  );
}
