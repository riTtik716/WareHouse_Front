import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Warehouse } from '@/types/wms';

interface CreateWarehouseModalProps {
  onClose: () => void;
  onSave: (data: Partial<Warehouse>) => void;
  initialData?: Warehouse | null;
  isSaving?: boolean;
}

export function CreateWarehouseModal({ onClose, onSave, initialData, isSaving }: CreateWarehouseModalProps) {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    code: '', name: '', type: '',
    contact: '', phone: '', email: '',
    qcRequired: false, binTracking: false, allowNegativeStock: false,
    hoursStart: '08:00', hoursEnd: '20:00',
    maxWeight: '10000', maxVolume: '5000',
    lat: '', lng: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm(f => ({
        ...f,
        code: initialData.code || '',
        name: initialData.name || '',
        type: initialData.type || '',
        contact: initialData.contact || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        maxWeight: String(initialData.capacity || '10000'),
        maxVolume: String(initialData.volume || '5000'),
      }));
    }
  }, [initialData]);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave({
      code: form.code,
      name: form.name,
      type: form.type,
      contact: form.contact,
      phone: form.phone,
      email: form.email,
      capacity: Number(form.maxWeight),
      volume: Number(form.maxVolume),
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-lg font-bold text-foreground">{isEdit ? 'Edit Warehouse' : 'Create New Warehouse'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{isEdit ? 'Update warehouse details.' : 'Register a new physical facility in the global network.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Basic Information</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Warehouse Code</label>
                <input value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. WH-USA-001"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Warehouse Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. California Central Hub"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Warehouse Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select Type</option>
                  {['Main Facility', 'Refrigerated', '3PL Partner', 'Processing', 'Satellite Facility'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact Details</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Contact Person</label>
                <input value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="Full name"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Phone Number</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Email Address</label>
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" type="email"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </section>

          {/* Operational Settings */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Operational Settings</h3>
            <div className="space-y-2">
              {[
                { key: 'qcRequired', label: 'Quality Control (QC) Required', desc: 'Enable mandatory check for incoming stock' },
                { key: 'binTracking', label: 'Bin Tracking', desc: 'Track items at the individual bin level' },
                { key: 'allowNegativeStock', label: 'Allow Negative Stock', desc: 'Allow sales if physical stock is unavailable' },
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

          {/* Capacity */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Capacity & Logistics</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Operating Hours (Start)', key: 'hoursStart', type: 'time' },
                { label: 'Operating Hours (End)', key: 'hoursEnd', type: 'time' },
                { label: 'Total Capacity Weight (kg)', key: 'maxWeight', placeholder: '10000' },
                { label: 'Latitude', key: 'lat', placeholder: '34.0522' },
                { label: 'Longitude', key: 'lng', placeholder: '-118.2437' },
                { label: 'Total Capacity Volume (m²)', key: 'maxVolume', placeholder: '5000' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-foreground block mb-1.5">{f.label}</label>
                  <input type={f.type || 'text'} value={(form as any)[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={(f as any).placeholder || ''}
                    className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Warehouse' : 'Save Warehouse'}
          </Button>
        </div>
      </div>
    </div>
  );
}
