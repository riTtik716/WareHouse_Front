import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Shelf, Rack } from '@/types/wms';

interface CreateShelfModalProps {
  onClose: () => void;
  onSave: (data: Partial<Shelf>) => void;
  initialData?: Shelf | null;
  isSaving?: boolean;
  racks?: Rack[];
}

export function CreateShelfModal({ onClose, onSave, initialData, isSaving, racks = [] }: CreateShelfModalProps) {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    rack: '', code: '', levelNumber: '1', pickSequence: '10',
    maxWeight: '500.00', maxVolume: '2.50', description: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm(f => ({
        ...f,
        rack: initialData.rackCode || '',
        code: initialData.code || '',
        levelNumber: String(initialData.levelNumber || 1),
        pickSequence: String(initialData.pickSequence || 10),
        maxWeight: String(initialData.maxWeight || 500),
      }));
    }
  }, [initialData]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave({
      rackCode: form.rack,
      code: form.code,
      levelNumber: Number(form.levelNumber),
      pickSequence: Number(form.pickSequence),
      maxWeight: Number(form.maxWeight),
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">{isEdit ? 'Edit Shelf' : 'Create New Shelf'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{isEdit ? 'Update shelf configuration.' : 'Configure a new shelf unit within an existing rack infrastructure.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Shelf Configuration</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Target Rack <span className="text-destructive">*</span></label>
                <select value={form.rack} onChange={e => set('rack', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select a Rack</option>
                  {racks.map(r => <option key={r.id} value={r.code}>{r.code}</option>)}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">Select the physical rack where this shelf is located.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Shelf Code <span className="text-destructive">*</span></label>
                <input value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. SH-01-A"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground mt-1">Unique identifier for this specific shelf.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Level Number</label>
                <input type="number" min="0" value={form.levelNumber} onChange={e => set('levelNumber', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground mt-1">Vertical level starting from floor (0 or above).</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Pick Sequence</label>
                <input type="number" value={form.pickSequence} onChange={e => set('pickSequence', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground mt-1">Routing order for picking efficiency (1–9999).</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Capacity & Physical Limits</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Max Weight Capacity (kg)</label>
                <input type="number" value={form.maxWeight} onChange={e => set('maxWeight', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Max Volume Capacity (m²)</label>
                <input type="number" value={form.maxVolume} onChange={e => set('maxVolume', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Shelf Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              placeholder="Enter any additional details about this shelf, such as specialized equipment or storage constraints."
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Naming Convention:</span> We recommend using <code className="bg-muted px-1 rounded text-[11px]">[RACK]-[LEVEL]-[POS]</code> for shelf codes to maintain consistency.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">Status: <span className="text-green-600 font-medium">Active upon creation</span></p>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Shelf' : 'Create Shelf'}
          </Button>
        </div>
      </div>
    </div>
  );
}
