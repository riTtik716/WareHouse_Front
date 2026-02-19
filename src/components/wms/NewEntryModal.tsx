import { useNavigate } from 'react-router-dom';
import { Package, Warehouse, Grid3x3, Archive } from 'lucide-react';

interface NewEntryModalProps {
  onClose: () => void;
}

const options = [
  {
    icon: Package,
    title: 'Add New Product',
    description: 'Register new items into the system with SKUs and specifications.',
    href: '/inventory/add',
  },
  {
    icon: Warehouse,
    title: 'Create Warehouse',
    description: 'Initialize a new physical or virtual storage facility location.',
    href: '/infrastructure?tab=warehouses&action=create',
  },
  {
    icon: Grid3x3,
    title: 'Define Zone',
    description: 'Organize warehouse floor space into logical staging or storage areas.',
    href: '/infrastructure?tab=zones&action=create',
  },
  {
    icon: Archive,
    title: 'Configure Bin/Rack',
    description: 'Set up individual bins and racks within your warehouse zones.',
    href: '/infrastructure?tab=racks&action=create',
  },
];

export function NewEntryModal({ onClose }: NewEntryModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">New Entry</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select an action to continue with warehouse setup or inventory management.
          </p>
        </div>
        <div className="p-4 space-y-2">
          {options.map((opt) => (
            <button
              key={opt.title}
              onClick={() => { navigate(opt.href); onClose(); }}
              className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-muted/60 text-left transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <opt.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{opt.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
