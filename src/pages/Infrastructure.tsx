import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { StatusBadge } from '@/components/wms/StatusBadge';
import { DataStateWrapper } from '@/components/wms/DataStateWrapper';
import { DeleteConfirmDialog } from '@/components/wms/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, SlidersHorizontal, Download, Pencil, Trash2, GitBranch, Sparkles, Activity } from 'lucide-react';
import type { Warehouse, Zone, Rack, Shelf, Bin } from '@/types/wms';
import { CreateWarehouseModal } from '@/components/wms/CreateWarehouseModal';
import { CreateZoneModal } from '@/components/wms/CreateZoneModal';
import { CreateRackModal } from '@/components/wms/CreateRackModal';
import { CreateShelfModal } from '@/components/wms/CreateShelfModal';
import { CreateBinModal } from '@/components/wms/CreateBinModal';
import * as crud from '@/services/crudService';
import { useToast } from '@/hooks/use-toast';

type InfraTab = 'warehouses' | 'zones' | 'racks' | 'shelves' | 'bins';

const tabs: { id: InfraTab; label: string }[] = [
  { id: 'warehouses', label: 'Warehouses' },
  { id: 'zones', label: 'Zones' },
  { id: 'racks', label: 'Racks' },
  { id: 'shelves', label: 'Shelves' },
  { id: 'bins', label: 'Bins' },
];

const features = [
  { icon: GitBranch, title: 'Hierarchical View', desc: 'Easily map your warehouse from global location down to individual picking bins.' },
  { icon: Sparkles, title: 'Smart Mapping', desc: 'Automatic rack numbering based on zone configuration saves time during setup.' },
  { icon: Activity, title: 'Capacity Tracking', desc: 'Monitor shelf load limits and bin volume utilization in real-time.' },
];

export default function Infrastructure() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<InfraTab>('warehouses');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  // Data states
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Edit state
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
  const [editingBin, setEditingBin] = useState<Bin | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ type: InfraTab; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') as InfraTab;
    if (tab && tabs.some(t => t.id === tab)) setActiveTab(tab);
    if (searchParams.get('action') === 'create') setShowCreate(true);
  }, [searchParams]);

  const handleTabChange = (tab: InfraTab) => {
    setActiveTab(tab);
    setShowCreate(false);
  };

  const closeModals = () => {
    setShowCreate(false);
    setEditingWarehouse(null);
    setEditingZone(null);
    setEditingRack(null);
    setEditingShelf(null);
    setEditingBin(null);
  };

  // ── CRUD Handlers ─────────────────────────────────────────────────

  const handleSaveWarehouse = async (data: Partial<Warehouse>) => {
    setIsSaving(true);
    try {
      if (editingWarehouse) {
        const updated = await crud.updateWarehouse(editingWarehouse.id, data);
        setWarehouses(prev => prev.map(w => w.id === updated.id ? updated : w));
        toast({ title: 'Warehouse updated' });
      } else {
        const created = await crud.createWarehouse(data);
        setWarehouses(prev => [...prev, created]);
        toast({ title: 'Warehouse created' });
      }
      closeModals();
    } catch { toast({ title: 'Error saving warehouse', variant: 'destructive' }); }
    setIsSaving(false);
  };

  const handleSaveZone = async (data: Partial<Zone>) => {
    setIsSaving(true);
    try {
      if (editingZone) {
        const updated = await crud.updateZone(editingZone.id, data);
        setZones(prev => prev.map(z => z.id === updated.id ? updated : z));
        toast({ title: 'Zone updated' });
      } else {
        const created = await crud.createZone(data);
        setZones(prev => [...prev, created]);
        toast({ title: 'Zone created' });
      }
      closeModals();
    } catch { toast({ title: 'Error saving zone', variant: 'destructive' }); }
    setIsSaving(false);
  };

  const handleSaveRack = async (data: Partial<Rack>) => {
    setIsSaving(true);
    try {
      if (editingRack) {
        const updated = await crud.updateRack(editingRack.id, data);
        setRacks(prev => prev.map(r => r.id === updated.id ? updated : r));
        toast({ title: 'Rack updated' });
      } else {
        const created = await crud.createRack(data);
        setRacks(prev => [...prev, created]);
        toast({ title: 'Rack created' });
      }
      closeModals();
    } catch { toast({ title: 'Error saving rack', variant: 'destructive' }); }
    setIsSaving(false);
  };

  const handleSaveShelf = async (data: Partial<Shelf>) => {
    setIsSaving(true);
    try {
      if (editingShelf) {
        const updated = await crud.updateShelf(editingShelf.id, data);
        setShelves(prev => prev.map(s => s.id === updated.id ? updated : s));
        toast({ title: 'Shelf updated' });
      } else {
        const created = await crud.createShelf(data);
        setShelves(prev => [...prev, created]);
        toast({ title: 'Shelf created' });
      }
      closeModals();
    } catch { toast({ title: 'Error saving shelf', variant: 'destructive' }); }
    setIsSaving(false);
  };

  const handleSaveBin = async (data: Partial<Bin>) => {
    setIsSaving(true);
    try {
      if (editingBin) {
        const updated = await crud.updateBin(editingBin.id, data);
        setBins(prev => prev.map(b => b.id === updated.id ? updated : b));
        toast({ title: 'Bin updated' });
      } else {
        const created = await crud.createBin(data);
        setBins(prev => [...prev, created]);
        toast({ title: 'Bin created' });
      }
      closeModals();
    } catch { toast({ title: 'Error saving bin', variant: 'destructive' }); }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const deleteFns: Record<InfraTab, (id: string) => Promise<void>> = {
        warehouses: crud.deleteWarehouse,
        zones: crud.deleteZone,
        racks: crud.deleteRack,
        shelves: crud.deleteShelf,
        bins: crud.deleteBin,
      };
      await deleteFns[deleteTarget.type](deleteTarget.id);

      if (deleteTarget.type === 'warehouses') setWarehouses(prev => prev.filter(w => w.id !== deleteTarget.id));
      if (deleteTarget.type === 'zones') setZones(prev => prev.filter(z => z.id !== deleteTarget.id));
      if (deleteTarget.type === 'racks') setRacks(prev => prev.filter(r => r.id !== deleteTarget.id));
      if (deleteTarget.type === 'shelves') setShelves(prev => prev.filter(s => s.id !== deleteTarget.id));
      if (deleteTarget.type === 'bins') setBins(prev => prev.filter(b => b.id !== deleteTarget.id));

      toast({ title: `${deleteTarget.name} deleted` });
      setDeleteTarget(null);
    } catch { toast({ title: 'Error deleting item', variant: 'destructive' }); }
    setIsDeleting(false);
  };

  const createLabel = {
    warehouses: 'Create Warehouse',
    zones: 'Create Zone',
    racks: 'Create Rack',
    shelves: 'Create Shelf',
    bins: 'Create Bin',
  }[activeTab];

  const showEditModal = editingWarehouse || editingZone || editingRack || editingShelf || editingBin;

  return (
    <WMSLayout>
      <PageHeader
        title="Warehouse Infrastructure Setup"
        subtitle="Configure and manage your physical warehouse structure, from buildings to individual bins."
        breadcrumb="Warehouse Management / Infrastructure Setup"
        action={
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4" />
            {createLabel}
          </Button>
        }
      />

      <div className="px-8 pb-10 space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & export */}
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-3 h-9 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 h-9 px-3 text-sm border border-border rounded-md bg-background hover:bg-muted transition-colors text-muted-foreground">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 h-9 px-3 text-sm border border-border rounded-md bg-background hover:bg-muted transition-colors text-muted-foreground">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <Card className="shadow-none border-border">
          <CardContent className="p-0">
            {activeTab === 'warehouses' && (
              <WarehousesTable data={warehouses} search={search} isLoading={isLoading} error={error}
                onEdit={setEditingWarehouse} onDelete={w => setDeleteTarget({ type: 'warehouses', id: w.id, name: w.code })} />
            )}
            {activeTab === 'zones' && (
              <ZonesTable data={zones} search={search} isLoading={isLoading} error={error}
                onEdit={setEditingZone} onDelete={z => setDeleteTarget({ type: 'zones', id: z.id, name: z.name })} />
            )}
            {activeTab === 'racks' && (
              <RacksTable data={racks} search={search} isLoading={isLoading} error={error}
                onEdit={setEditingRack} onDelete={r => setDeleteTarget({ type: 'racks', id: r.id, name: r.code })} />
            )}
            {activeTab === 'shelves' && (
              <ShelvesTable data={shelves} search={search} isLoading={isLoading} error={error}
                onEdit={setEditingShelf} onDelete={s => setDeleteTarget({ type: 'shelves', id: s.id, name: s.code })} />
            )}
            {activeTab === 'bins' && (
              <BinsTable data={bins} search={search} isLoading={isLoading} error={error}
                onEdit={setEditingBin} onDelete={b => setDeleteTarget({ type: 'bins', id: b.id, name: b.code })} />
            )}
          </CardContent>
        </Card>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4">
          {features.map(f => (
            <Card key={f.title} className="shadow-none border-border">
              <CardContent className="pt-4 pb-4 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Modals */}
      {showCreate && activeTab === 'warehouses' && <CreateWarehouseModal onClose={closeModals} onSave={handleSaveWarehouse} isSaving={isSaving} />}
      {showCreate && activeTab === 'zones' && <CreateZoneModal onClose={closeModals} onSave={handleSaveZone} isSaving={isSaving} warehouses={warehouses} />}
      {showCreate && activeTab === 'racks' && <CreateRackModal onClose={closeModals} onSave={handleSaveRack} isSaving={isSaving} zones={zones} />}
      {showCreate && activeTab === 'shelves' && <CreateShelfModal onClose={closeModals} onSave={handleSaveShelf} isSaving={isSaving} racks={racks} />}
      {showCreate && activeTab === 'bins' && <CreateBinModal onClose={closeModals} onSave={handleSaveBin} isSaving={isSaving} shelves={shelves} />}

      {/* Edit Modals */}
      {editingWarehouse && <CreateWarehouseModal onClose={closeModals} onSave={handleSaveWarehouse} initialData={editingWarehouse} isSaving={isSaving} />}
      {editingZone && <CreateZoneModal onClose={closeModals} onSave={handleSaveZone} initialData={editingZone} isSaving={isSaving} warehouses={warehouses} />}
      {editingRack && <CreateRackModal onClose={closeModals} onSave={handleSaveRack} initialData={editingRack} isSaving={isSaving} zones={zones} />}
      {editingShelf && <CreateShelfModal onClose={closeModals} onSave={handleSaveShelf} initialData={editingShelf} isSaving={isSaving} racks={racks} />}
      {editingBin && <CreateBinModal onClose={closeModals} onSave={handleSaveBin} initialData={editingBin} isSaving={isSaving} shelves={shelves} />}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmDialog
          title={`Delete ${deleteTarget.name}?`}
          description={`This action cannot be undone. This will permanently remove "${deleteTarget.name}" and all associated data.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </WMSLayout>
  );
}

// ── Table Components ────────────────────────────────────────────────

interface TableProps<T> {
  data: T[];
  search: string;
  isLoading: boolean;
  error: string | null;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

function WarehousesTable({ data: allData, search, isLoading, error, onEdit, onDelete }: TableProps<Warehouse>) {
  const data = allData.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.code.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <DataStateWrapper isLoading={isLoading} error={error} isEmpty={data.length === 0} emptyTitle="No warehouses" emptyDescription="Create your first warehouse to get started.">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Warehouse Code', 'Name', 'Type', 'Zones', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(w => (
            <tr key={w.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3.5 text-sm font-medium text-primary">{w.code}</td>
              <td className="px-5 py-3.5 text-sm font-medium text-foreground">{w.name}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{w.type}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{w.zonesCount} Zones</td>
              <td className="px-5 py-3.5"><StatusBadge status={w.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(w)} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(w)} className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={6} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Showing {data.length} warehouses</p>
                <Pagination />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </DataStateWrapper>
  );
}

function ZonesTable({ data: allData, search, isLoading, error, onEdit, onDelete }: TableProps<Zone>) {
  const data = allData.filter(z =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.warehouseCode.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <DataStateWrapper isLoading={isLoading} error={error} isEmpty={data.length === 0} emptyTitle="No zones" emptyDescription="Create zones within a warehouse to organize storage.">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Zone Name', 'Warehouse', 'Type', 'Pick Priority', 'Put Away', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(z => (
            <tr key={z.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3.5 text-sm font-mono font-medium text-primary">{z.name}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{z.warehouseCode}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{z.type}</td>
              <td className="px-5 py-3.5 text-sm text-foreground text-center">{z.pickPriority}</td>
              <td className="px-5 py-3.5 text-sm text-foreground text-center">{z.putAwayPriority}</td>
              <td className="px-5 py-3.5"><StatusBadge status={z.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(z)} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(z)} className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={7} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Showing {data.length} zones</p>
                <Pagination />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </DataStateWrapper>
  );
}

function RacksTable({ data: allData, search, isLoading, error, onEdit, onDelete }: TableProps<Rack>) {
  const data = allData.filter(r =>
    r.code.toLowerCase().includes(search.toLowerCase()) ||
    r.zoneName.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <DataStateWrapper isLoading={isLoading} error={error} isEmpty={data.length === 0} emptyTitle="No racks" emptyDescription="Add racks to zones to define storage locations.">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Rack Code', 'Zone Name', 'Rack Type', 'Aisle', 'Pick Sequence', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3.5 text-sm font-mono font-medium text-primary">{r.code}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">{r.zoneName}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.type}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.aisle}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">{r.pickSequence}</td>
              <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(r)} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(r)} className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={7} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Showing {data.length} racks</p>
                <Pagination />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </DataStateWrapper>
  );
}

function ShelvesTable({ data: allData, search, isLoading, error, onEdit, onDelete }: TableProps<Shelf>) {
  const data = allData.filter(s =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.rackCode.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <DataStateWrapper isLoading={isLoading} error={error} isEmpty={data.length === 0} emptyTitle="No shelves" emptyDescription="Add shelves to racks to define vertical storage levels.">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Shelf Code', 'Rack Code', 'Level', 'Pick Sequence', 'Max Weight', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(s => (
            <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3.5 text-sm font-mono font-medium text-primary">{s.code}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.rackCode}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">Level {s.levelNumber}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">{s.pickSequence}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">{s.maxWeight} kg</td>
              <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(s)} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(s)} className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={7} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Showing {data.length} shelves</p>
                <Pagination />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </DataStateWrapper>
  );
}

function BinsTable({ data: allData, search, isLoading, error, onEdit, onDelete }: TableProps<Bin>) {
  const data = allData.filter(b =>
    b.code.toLowerCase().includes(search.toLowerCase()) ||
    b.shelfCode.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <DataStateWrapper isLoading={isLoading} error={error} isEmpty={data.length === 0} emptyTitle="No bins" emptyDescription="Create bins on shelves to define individual storage slots.">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Bin Code', 'Shelf Code', 'Bin Type', 'Capacity', 'Availability', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(b => (
            <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3.5 text-sm font-mono font-medium text-primary">{b.code}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{b.shelfCode}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{b.type}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">{b.capacity} units</td>
              <td className="px-5 py-3.5"><StatusBadge status={b.qty} /></td>
              <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(b)} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(b)} className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={7} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Showing {data.length} bins</p>
                <Pagination />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </DataStateWrapper>
  );
}

function Pagination() {
  return (
    <div className="flex items-center gap-1">
      <button className="px-2.5 py-1.5 text-xs border border-border rounded-md hover:bg-muted disabled:opacity-40">‹</button>
      <button className="px-2.5 py-1.5 text-xs bg-primary text-primary-foreground rounded-md">1</button>
      <button className="px-2.5 py-1.5 text-xs border border-border rounded-md hover:bg-muted">›</button>
    </div>
  );
}
