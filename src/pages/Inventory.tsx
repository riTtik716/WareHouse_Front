import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { StatusBadge } from '@/components/wms/StatusBadge';
import { DataStateWrapper } from '@/components/wms/DataStateWrapper';
import { DeleteConfirmDialog } from '@/components/wms/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, SlidersHorizontal, DollarSign, AlertTriangle, ArrowLeftRight, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '@/types/wms';
import { useToast } from '@/hooks/use-toast';
import * as crud from '@/services/crudService';

function getCategoryClass(category: string) {
  if (category === 'Electronics') return 'text-accent-foreground bg-accent';
  if (category === 'Furniture') return 'text-amber-600 bg-amber-50';
  return 'text-violet-600 bg-violet-50';
}

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Summary state — will come from API
  const [totalValue, setTotalValue] = useState<string>('—');
  const [totalValueChange, setTotalValueChange] = useState<string>('—');
  const [lowStockCount, setLowStockCount] = useState<string>('—');
  const [lowStockDetail, setLowStockDetail] = useState<string>('—');
  const [stockInOut, setStockInOut] = useState<string>('—');
  const [lastEntry, setLastEntry] = useState<string>('—');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    // TODO: Open edit modal or navigate to edit page
    console.log('[Inventory] Edit product', product.id);
    toast({ title: 'Edit mode not yet connected to backend' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await crud.deleteProduct(deleteTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      toast({ title: `${deleteTarget.name} deleted` });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'Error deleting product', variant: 'destructive' });
    }
    setIsDeleting(false);
  };

  return (
    <WMSLayout>
      <PageHeader
        title="Product Inventory"
        breadcrumb="Warehouse Management / Inventory"
        action={
          <Link to="/inventory/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        }
      />

      <div className="px-8 pb-10 space-y-4">
        {/* Filters bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, SKU..."
              className="w-full pl-9 pr-3 h-9 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {['Category', 'Brand', 'Location'].map(f => (
            <button key={f} className="flex items-center gap-2 h-9 px-3 text-sm border border-border rounded-md bg-background hover:bg-muted transition-colors text-muted-foreground">
              <SlidersHorizontal className="w-4 h-4" />
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card className="shadow-none border-border">
          <CardContent className="p-0">
            <DataStateWrapper isLoading={isLoading} error={error} isEmpty={filtered.length === 0} emptyTitle="No products found" emptyDescription="Add products to see them listed here.">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['SKU', 'Product Name', 'Category', 'Purchase Price', 'Sale Price', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5 first:pl-5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{p.sku}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">{p.name}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryClass(p.category)}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">${p.purchasePrice.toFixed(2)}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">${p.salePrice.toFixed(2)}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteTarget(p)} className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3.5 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Showing 1 to {filtered.length} of {filtered.length} products</p>
                <div className="flex items-center gap-1">
                  <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted disabled:opacity-40">Previous</button>
                  <button className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md">1</button>
                  <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted">Next</button>
                </div>
              </div>
            </DataStateWrapper>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-none border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalValue}</p>
                  <p className="text-xs text-muted-foreground mt-1">{totalValueChange}</p>
                </div>
                <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{lowStockCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lowStockDetail}</p>
                </div>
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock In/Out (Today)</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stockInOut}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lastEntry}</p>
                </div>
                <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmDialog
          title={`Delete ${deleteTarget.name}?`}
          description={`This will permanently remove "${deleteTarget.name}" (${deleteTarget.sku}) from inventory.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </WMSLayout>
  );
}
