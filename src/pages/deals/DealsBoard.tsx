
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DealColumn from '@/components/deals/DealColumn';
import { Deal } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { getDeals, updateDeal } from '@/services/dealService';
import { useToast } from '@/hooks/use-toast';

const DealsBoard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  // Fetch deals
  const { 
    data: deals, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['deals'],
    queryFn: getDeals
  });

  // Update deal mutation
  const updateDealMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => 
      updateDeal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Deal updated',
        description: 'The deal has been moved to a new stage',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating deal',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

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
    
    if (!draggedDealId || !deals) return;
    
    const draggedDeal = deals.find(deal => deal.id === draggedDealId);
    
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      updateDealMutation.mutate({
        id: draggedDealId,
        updates: { stage: targetStage }
      });
    }
    
    setDraggedDealId(null);
  };

  const getDealsForStage = (stage: Deal['stage']) => {
    return deals ? deals.filter((deal) => deal.stage === stage) : [];
  };

  const getStageValue = (stage: Deal['stage']) => {
    return getDealsForStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h3 className="font-semibold">Error loading deals</h3>
          <p>Please try refreshing the page.</p>
        </div>
      </DashboardLayout>
    );
  }

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

        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default DealsBoard;
