
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DealColumn from '@/components/deals/DealColumn';
import { mockDeals } from '@/lib/mockData';
import { Deal } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

const DealsBoard = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const stages: { id: Deal['stage']; title: string }[] = [
    { id: 'lead', title: 'Lead' },
    { id: 'contact', title: 'Contact Made' },
    { id: 'proposal', title: 'Proposal' },
    { id: 'negotiation', title: 'Negotiation' },
    { id: 'won', title: 'Won' },
    { id: 'lost', title: 'Lost' },
  ];

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: Deal['stage']) => {
    e.preventDefault();
    
    if (!draggedDealId) return;
    
    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.id === draggedDealId
          ? { ...deal, stage: targetStage, updatedAt: new Date().toISOString() }
          : deal
      )
    );
    
    setDraggedDealId(null);
  };

  const getDealsForStage = (stage: Deal['stage']) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageValue = (stage: Deal['stage']) => {
    return getDealsForStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">
              Manage and track your sales pipeline
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 h-[calc(100vh-12rem)]">
          {stages.map((stage) => (
            <DealColumn
              key={stage.id}
              title={stage.title}
              stage={stage.id}
              deals={getDealsForStage(stage.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              count={getDealsForStage(stage.id).length}
              value={getStageValue(stage.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DealsBoard;
