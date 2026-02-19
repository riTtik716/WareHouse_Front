import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { shelves } from '@/data/mockData';

interface CreateBinModalProps {
  onClose: () => void;
}

export function CreateBinModal({ onClose }: CreateBinModalProps) {
  const [form, setForm] = useState({
    shelf: '', code: '', type: 'PICKING', pickOrder: '100',
    maxQty: '0', maxWeight: '0.00', maxVolume: '0.00',
    hazardous: false, equipmentRestriction: 'No Restriction', status: 'Active',
  });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-lg font-bold text-foreground">Create New Bin</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Define storage parameters and location for a new warehouse bin.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Location & Identification</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Shelf Selection <span className="text-destructive">*</span></label>
                <select value={form.shelf} onChange={e => set('shelf', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select a Shelf</option>
                  {shelves.map(s => <option key={s.id} value={s.code}>{s.code}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Bin Code</label>
                <input value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. BIN-A1-001"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground mt-1">Unique identifier for the bin</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Bin Type <span className="text-destructive">*</span></label>
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  {['PICKING', 'STORAGE', 'STAGING', 'QC'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Pick Order</label>
                <input type="number" value={form.pickOrder} onChange={e => set('pickOrder', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground mt-1">Order in which this bin appears on pick lists.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Capacity Configuration</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Max Quantity', key: 'maxQty', suffix: 'Units' },
                { label: 'Max Weight', key: 'maxWeight', suffix: 'KG' },
                { label: 'Max Volume', key: 'maxVolume', suffix: 'M²' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-foreground block mb-1.5">{f.label}</label>
                  <div className="relative">
                    <input type="number" value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}
                      className="w-full h-9 px-3 pr-10 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{f.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Attributes & Safety</h3>
            <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/40 transition-colors mb-3">
              <div>
                <p className="text-sm font-medium text-foreground">Hazardous Materials Allowed</p>
                <p className="text-xs text-muted-foreground">Enable this if the bin is compliant with HAZMAT storage regulations.</p>
              </div>
              <input type="checkbox" checked={form.hazardous} onChange={e => set('hazardous', e.target.checked)}
                className="w-4 h-4 accent-primary" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Equipment Restriction</label>
                <select value={form.equipmentRestriction} onChange={e => set('equipmentRestriction', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  {['No Restriction', 'Forklift Only', 'Manual Only', 'Crane Required'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  {['Active', 'Inactive', 'Maintenance'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Bin Naming Convention:</span> We recommend using <code className="bg-muted px-1 rounded text-[11px]">Zone-Rack-Shelf-Level</code> format (e.g., A-12-03-B).
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Reset Form</Button>
          <Button onClick={onClose}>Confirm and Create Bin</Button>
        </div>
      </div>
    </div>
  );
}
