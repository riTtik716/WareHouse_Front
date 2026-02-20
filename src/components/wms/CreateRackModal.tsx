import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Rack, Zone } from '@/types/wms';

interface CreateRackModalProps {
  onClose: () => void;
  onSave: (data: Partial<Rack>) => void;
  initialData?: Rack | null;
  isSaving?: boolean;
  zones?: Zone[];
}

export function CreateRackModal({ onClose, onSave, initialData, isSaving, zones = [] }: CreateRackModalProps) {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    zone: '', code: '', type: 'STORAGE', aisle: '',
    pickSequence: '100', maxWeight: '5000', maxVolume: '12.5', description: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm(f => ({
        ...f,
        zone: initialData.zoneName || '',
        code: initialData.code || '',
        type: initialData.type || 'STORAGE',
        aisle: initialData.aisle || '',
        pickSequence: String(initialData.pickSequence || 100),
      }));
    }
  }, [initialData]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave({
      zoneName: form.zone,
      code: form.code,
      type: form.type,
      aisle: form.aisle,
      pickSequence: Number(form.pickSequence),
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">{isEdit ? 'Edit Rack' : 'Create New Rack'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{isEdit ? 'Update rack configuration.' : 'Define structural parameters for warehouse storage units.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Rack Identification & Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Warehouse Zone</label>
                <select value={form.zone} onChange={e => set('zone', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select a zone</option>
                  {zones.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Rack Code</label>
                <input value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. RK-A1-01"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Rack Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  {['STORAGE', 'PALLET', 'MOBILE', 'STATIC', 'DRIVE-IN'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Aisle Number</label>
                <input value={form.aisle} onChange={e => set('aisle', e.target.value)} placeholder="e.g. 05"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Logistics & Capacity</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Pick Sequence</label>
                <input type="number" value={form.pickSequence} onChange={e => set('pickSequence', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Max Weight (kg)</label>
                <input type="number" value={form.maxWeight} onChange={e => set('maxWeight', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Max Volume (m²)</label>
                <input type="number" value={form.maxVolume} onChange={e => set('maxVolume', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Used to optimize picking routes.</p>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Enter rack details, location specifics or handling instructions."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <div className="bg-muted/40 rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Configuration Preview</p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div><p className="text-muted-foreground">Rack Name</p><p className="font-medium text-foreground">{form.code || '—'}</p></div>
              <div><p className="text-muted-foreground">Zone Path</p><p className="font-medium text-foreground">{form.zone || '—'}</p></div>
              <div><p className="text-muted-foreground">Aisle</p><p className="font-medium text-foreground">{form.aisle || '—'}</p></div>
              <div><p className="text-muted-foreground">Capacity</p><p className="font-medium text-foreground">{form.maxVolume ? `${form.maxVolume}m²` : '—'}</p></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Rack' : 'Save Rack Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
}
