import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    sku: '',
    purchasePrice: '',
    salePrice: '',
    taxPct: '',
    barcode: '',
    category: '',
    brand: '',
    batchNumber: '',
    serialNumber: '',
    expiryDate: '',
  });

  const handleChange = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <WMSLayout>
      <div className="px-8 pt-7 pb-10 max-w-3xl">
        <button
          onClick={() => navigate('/inventory')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </button>

        <PageHeader title="Add New Product" subtitle="Register new items into the system with SKUs and specifications." />

        <div className="space-y-6 mt-2">
          {/* Image upload */}
          <Card className="shadow-none border-border">
            <CardContent className="pt-5 pb-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Product Image</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (MAX. 800×400px)</p>
              </div>
            </CardContent>
          </Card>

          {/* General Information */}
          <Card className="shadow-none border-border">
            <CardContent className="pt-5 pb-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">General Information</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Product Name', key: 'name', placeholder: 'e.g. Wireless Keyboard K10', span: 3 },
                  { label: 'Purchase Price ($)', key: 'purchasePrice', placeholder: '0.00', type: 'number', span: 1 },
                  { label: 'Sale Price ($)', key: 'salePrice', placeholder: '0.00', type: 'number', span: 1 },
                  { label: 'Tax Percentage (%)', key: 'taxPct', placeholder: '0%', span: 1 },
                  { label: 'SKU', key: 'sku', placeholder: 'WKK-001', span: 1 },
                  { label: 'Barcode (EAN/UPC)', key: 'barcode', placeholder: '123456789012', span: 2 },
                ].map(f => (
                  <div key={f.key} className={`col-span-${f.span}`}>
                    <label className="text-xs font-medium text-foreground block mb-1.5">{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={(form as any)[f.key]}
                      onChange={e => handleChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card className="shadow-none border-border">
            <CardContent className="pt-5 pb-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Tracking & Inventory</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Batch Number', key: 'batchNumber', placeholder: 'B-2024-001' },
                  { label: 'Serial Number', key: 'serialNumber', placeholder: 'SN-8829-XJ' },
                  { label: 'Expiry Date', key: 'expiryDate', placeholder: 'mm/dd/yyyy', type: 'date' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-foreground block mb-1.5">{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={(form as any)[f.key]}
                      onChange={e => handleChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/inventory')}>Cancel</Button>
            <Button>Save Product</Button>
          </div>
        </div>
      </div>
    </WMSLayout>
  );
}
