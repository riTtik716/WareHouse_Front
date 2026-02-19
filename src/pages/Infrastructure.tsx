import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WMSLayout } from '@/components/wms/WMSLayout';
import { PageHeader } from '@/components/wms/PageHeader';
import { StatusBadge } from '@/components/wms/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, SlidersHorizontal, Download, Pencil, Trash2, GitBranch, Sparkles, Activity } from 'lucide-react';
import { warehouses, zones, racks, shelves, bins } from '@/data/mockData';
import { CreateWarehouseModal } from '@/components/wms/CreateWarehouseModal';
import { CreateZoneModal } from '@/components/wms/CreateZoneModal';
import { CreateRackModal } from '@/components/wms/CreateRackModal';
import { CreateShelfModal } from '@/components/wms/CreateShelfModal';
import { CreateBinModal } from '@/components/wms/CreateBinModal';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<InfraTab>('warehouses');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab') as InfraTab;
    if (tab && tabs.some(t => t.id === tab)) setActiveTab(tab);
    if (searchParams.get('action') === 'create') setShowCreate(true);
  }, [searchParams]);

  const handleTabChange = (tab: InfraTab) => {
    setActiveTab(tab);
    setShowCreate(false);
  };

  const createLabel = {
    warehouses: 'Create Warehouse',
    zones: 'Create Zone',
    racks: 'Create Rack',
    shelves: 'Create Shelf',
    bins: 'Create Bin',
  }[activeTab];

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
              <WarehousesTable search={search} />
            )}
            {activeTab === 'zones' && <ZonesTable search={search} />}
            {activeTab === 'racks' && <RacksTable search={search} />}
            {activeTab === 'shelves' && <ShelvesTable search={search} />}
            {activeTab === 'bins' && <BinsTable search={search} />}
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

      {showCreate && activeTab === 'warehouses' && <CreateWarehouseModal onClose={() => setShowCreate(false)} />}
      {showCreate && activeTab === 'zones' && <CreateZoneModal onClose={() => setShowCreate(false)} />}
      {showCreate && activeTab === 'racks' && <CreateRackModal onClose={() => setShowCreate(false)} />}
      {showCreate && activeTab === 'shelves' && <CreateShelfModal onClose={() => setShowCreate(false)} />}
      {showCreate && activeTab === 'bins' && <CreateBinModal onClose={() => setShowCreate(false)} />}
    </WMSLayout>
  );
}

function WarehousesTable({ search }: { search: string }) {
  const data = warehouses.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.code.toLowerCase().includes(search.toLowerCase())
  );
  return (
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
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-border">
          <td colSpan={6} className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Showing 1 to {data.length} of 24 warehouses</p>
              <Pagination />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function ZonesTable({ search }: { search: string }) {
  const data = zones.filter(z =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.warehouseCode.toLowerCase().includes(search.toLowerCase())
  );
  return (
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
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-border">
          <td colSpan={7} className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Showing 1 to {data.length} of 12 zones</p>
              <Pagination />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function RacksTable({ search }: { search: string }) {
  const data = racks.filter(r =>
    r.code.toLowerCase().includes(search.toLowerCase()) ||
    r.zoneName.toLowerCase().includes(search.toLowerCase())
  );
  return (
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
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-border">
          <td colSpan={7} className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Showing 1 to {data.length} of 128 racks</p>
              <Pagination />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function ShelvesTable({ search }: { search: string }) {
  const data = shelves.filter(s =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.rackCode.toLowerCase().includes(search.toLowerCase())
  );
  return (
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
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-border">
          <td colSpan={7} className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Showing 1 to {data.length} of 24 shelves</p>
              <Pagination />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function BinsTable({ search }: { search: string }) {
  const data = bins.filter(b =>
    b.code.toLowerCase().includes(search.toLowerCase()) ||
    b.shelfCode.toLowerCase().includes(search.toLowerCase())
  );
  return (
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
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-border">
          <td colSpan={7} className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Showing 1 to {data.length} of 142 bins</p>
              <Pagination />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function Pagination() {
  return (
    <div className="flex items-center gap-1">
      <button className="px-2.5 py-1.5 text-xs border border-border rounded-md hover:bg-muted disabled:opacity-40">‹</button>
      <button className="px-2.5 py-1.5 text-xs bg-primary text-primary-foreground rounded-md">1</button>
      <button className="px-2.5 py-1.5 text-xs border border-border rounded-md hover:bg-muted">2</button>
      <button className="px-2.5 py-1.5 text-xs border border-border rounded-md hover:bg-muted">3</button>
      <button className="px-2.5 py-1.5 text-xs border border-border rounded-md hover:bg-muted">›</button>
    </div>
  );
}
