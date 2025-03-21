
import { Deal } from '@/types';
import DealCard from './DealCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DealColumnProps {
  title: string;
  stage: Deal['stage'];
  deals: Deal[];
  onDragStart: (e: React.DragEvent, dealId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stage: Deal['stage']) => void;
  count: number;
  value: number;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
}

const DealColumn = ({
  title,
  stage,
  deals,
  onDragStart,
  onDragOver,
  onDrop,
  count,
  value,
  onEditDeal,
  onDeleteDeal,
}: DealColumnProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getColumnColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'lead':
        return 'bg-blue-50 border-blue-200';
      case 'contact':
        return 'bg-purple-50 border-purple-200';
      case 'proposal':
        return 'bg-yellow-50 border-yellow-200';
      case 'negotiation':
        return 'bg-orange-50 border-orange-200';
      case 'won':
        return 'bg-green-50 border-green-200';
      case 'lost':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getHeaderColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'lead':
        return 'text-blue-700 bg-blue-100';
      case 'contact':
        return 'text-purple-700 bg-purple-100';
      case 'proposal':
        return 'text-yellow-700 bg-yellow-100';
      case 'negotiation':
        return 'text-orange-700 bg-orange-100';
      case 'won':
        return 'text-green-700 bg-green-100';
      case 'lost':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div
      className={`flex-1 min-w-[280px] max-w-[280px] rounded-lg border ${getColumnColor(stage)} flex flex-col h-full`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage)}
    >
      <div className={`p-3 rounded-t-lg ${getHeaderColor(stage)}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <span className="text-sm font-medium rounded-full px-2 py-0.5 bg-white bg-opacity-50">
            {count}
          </span>
        </div>
        <div className="text-sm mt-1 font-medium">{formatCurrency(value)}</div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-13rem)]">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onDragStart={onDragStart}
            onEdit={onEditDeal}
            onDelete={onDeleteDeal}
          />
        ))}
      </div>
      
      <div className="p-2 border-t border-slate-200">
        <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
          <Plus className="h-4 w-4 mr-1" />
          Add Deal
        </Button>
      </div>
    </div>
  );
};

export default DealColumn;
