import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Zone, Warehouse } from '@/types/wms';

interface CreateZoneModalProps {
  onClose: () => void;
  onSave: (data: Partial<Zone>) => void;
  initialData?: Zone | null;
  isSaving?: boolean;
  warehouses?: Warehouse[];
}

export function CreateZoneModal({ onClose, onSave, initialData, isSaving, warehouses = [] }: CreateZoneModalProps) {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    warehouse: '', name: '', type: 'STORAGE',
    pickPriority: '1', putAwayPriority: '1',
    tempControlled: false, minTemp: '', maxTemp: '',
    maxWeight: '', maxVolume: '',
    hazardous: false, restrictedAccess: false, hazardClass: 'None',
  });

  useEffect(() => {
    if (initialData) {
      setForm(f => ({
        ...f,
        warehouse: initialData.warehouseCode || '',
        name: initialData.name || '',
        type: initialData.type || 'STORAGE',
        pickPriority: String(initialData.pickPriority || 1),
        putAwayPriority: String(initialData.putAwayPriority || 1),
      }));
    }
  }, [initialData]);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave({
      warehouseCode: form.warehouse,
      name: form.name,
      type: form.type,
      pickPriority: Number(form.pickPriority),
      putAwayPriority: Number(form.putAwayPriority),
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-lg font-bold text-foreground">{isEdit ? 'Edit Zone' : 'Create New Zone'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{isEdit ? 'Update zone configuration.' : 'Define a new operational area within your warehouse infrastructure.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Basic Details</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Warehouse Selection</label>
                <select value={form.warehouse} onChange={e => set('warehouse', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.code}>{w.code}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Zone Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. FAST-PICK-A"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Zone Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  {['STORAGE', 'PICKING', 'STAGING', 'REFRIGERATED', 'QUALITY_CONTROL'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Operational Priorities</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Pick Priority</label>
                <input type="number" min="1" value={form.pickPriority} onChange={e => set('pickPriority', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground mt-1">Determines sequence for automated picking routes.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Put Away Priority</label>
                <input type="number" min="1" value={form.putAwayPriority} onChange={e => set('putAwayPriority', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground mt-1">Determines preferred zones for incoming stock.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Capacity Limits</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Max Weight Capacity (kg)</label>
                <input type="number" value={form.maxWeight} onChange={e => set('maxWeight', e.target.value)} placeholder="e.g. 5000"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Max Volume (m²)</label>
                <input type="number" value={form.maxVolume} onChange={e => set('maxVolume', e.target.value)} placeholder="e.g. 200"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Special Handling</h3>
            <div className="space-y-2">
              {[
                { key: 'hazardous', label: 'Hazardous Materials', desc: 'Requires specialized safety equipment' },
                { key: 'restrictedAccess', label: 'Restricted Access', desc: 'Only authorized personnel with special clearance' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/40 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  <input type="checkbox" checked={(form as any)[opt.key]}
                    onChange={e => set(opt.key, e.target.checked)}
                    className="w-4 h-4 accent-primary" />
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Zone' : 'Create Zone'}
          </Button>
        </div>
      </div>
    </div>
  );
}
