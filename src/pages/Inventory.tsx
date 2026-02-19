import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { StatusBadge } from '@/components/wms/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, SlidersHorizontal, DollarSign, AlertTriangle, ArrowLeftRight } from 'lucide-react';
import { products } from '@/data/mockData';

function getCategoryClass(category: string) {
  if (category === 'Electronics') return 'text-accent-foreground bg-accent';
  if (category === 'Furniture') return 'text-amber-600 bg-amber-50';
  return 'text-violet-600 bg-violet-50';
}

export default function Inventory() {
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['SKU', 'Product Name', 'Category', 'Purchase Price', 'Sale Price', 'Status'].map(h => (
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
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3.5 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Showing 1 to {filtered.length} of {filtered.length} products</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted disabled:opacity-40">Previous</button>
                <button className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md">1</button>
                <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted">2</button>
                <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted">3</button>
                <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted">Next</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-none border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-foreground mt-1">$142,480.00</p>
                  <p className="text-xs text-green-600 mt-1">↑ +12.5% from last month</p>
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
                  <p className="text-2xl font-bold text-foreground mt-1">14 Items</p>
                  <p className="text-xs text-muted-foreground mt-1">Across 3 categories</p>
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
                  <p className="text-2xl font-bold text-foreground mt-1">
                    28 <span className="text-muted-foreground font-normal text-base">/ 12</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Last entry: 4 mins ago</p>
                </div>
                <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WMSLayout>
  );
}
