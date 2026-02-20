import { useState } from 'react';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { DataStateWrapper } from '@/components/wms/DataStateWrapper';
import { DeleteConfirmDialog } from '@/components/wms/DeleteConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpFromLine, Plus, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/wms/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import * as crud from '@/services/crudService';
import type { StockEntry } from '@/services/crudService';

export default function StockOut() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    // TODO: Open a form modal for creating stock-out entry
    try {
      const entry = await crud.createStockOut({
        product: '',
        sku: '',
        warehouse: '',
        qty: 0,
        date: new Date().toISOString().slice(0, 10),
        status: 'Active',
      });
      setEntries(prev => [...prev, entry]);
      toast({ title: 'Stock-out entry created' });
    } catch {
      toast({ title: 'Error creating entry', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await crud.deleteStockOut(deleteTarget.id);
      setEntries(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast({ title: 'Entry deleted' });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'Error deleting entry', variant: 'destructive' });
    }
    setIsDeleting(false);
  };

  return (
    <WMSLayout>
      <PageHeader
        title="Stock Out"
        subtitle="Record outbound shipments and inventory withdrawals."
        breadcrumb="Warehouse Management / Stock Out"
        action={
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            New Stock Out Entry
          </Button>
        }
      />
      <div className="px-8 pb-10">
        <Card className="shadow-none border-border">
          <CardContent className="p-0">
            <DataStateWrapper isLoading={isLoading} error={error} isEmpty={entries.length === 0} emptyTitle="No stock-out entries" emptyDescription="Record outbound shipments to see entries here.">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Reference', 'Product', 'SKU', 'Warehouse', 'Qty Shipped', 'Date', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map(r => (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-mono font-medium text-primary flex items-center gap-2">
                        <ArrowUpFromLine className="w-3.5 h-3.5 text-destructive" />{r.id.slice(0, 8)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">{r.product}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono">{r.sku}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.warehouse}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{r.qty} units</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.date}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setDeleteTarget(r)} className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataStateWrapper>
          </CardContent>
        </Card>
      </div>

      {deleteTarget && (
        <DeleteConfirmDialog
          title="Delete stock-out entry?"
          description={`This will permanently remove entry "${deleteTarget.id.slice(0, 8)}" from the records.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </WMSLayout>
  );
}
