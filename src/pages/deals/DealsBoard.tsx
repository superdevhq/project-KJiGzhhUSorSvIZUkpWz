
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DealColumn from '@/components/deals/DealColumn';
import DealForm from '@/components/deals/DealForm';
import DeleteDealDialog from '@/components/deals/DeleteDealDialog';
import { Deal } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { getDeals, createDeal, updateDeal, deleteDeal } from '@/services/dealService';
import { useToast } from '@/hooks/use-toast';

const DealsBoard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  
  // State for managing dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Fetch deals
  const { 
    data: deals, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['deals'],
    queryFn: getDeals
  });

  // Create deal mutation
  const createDealMutation = useMutation({
    mutationFn: (dealData: {
      title: string;
      value: number;
      company_id: string;
      stage: Deal['stage'];
      description?: string;
      assigned_to?: string | null;
    }) => createDeal(dealData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Deal created',
        description: 'The deal has been successfully created',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating deal',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Update deal mutation
  const updateDealMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => 
      updateDeal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Deal updated',
        description: 'The deal has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating deal',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Delete deal mutation
  const deleteDealMutation = useMutation({
    mutationFn: (id: string) => deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Deal deleted',
        description: 'The deal has been successfully deleted',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting deal',
        description: error.message || 'An error occurred',
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

  // Handle add deal
  const handleAddDeal = async (data: any) => {
    // Ensure we're passing the correct data structure to createDeal
    const dealData = {
      title: data.title,
      value: data.value,
      company_id: data.company_id,
      stage: data.stage,
      description: data.description || undefined,
      assigned_to: data.assigned_to || null,
    };
    
    await createDealMutation.mutateAsync(dealData);
  };

  // Handle edit deal
  const handleEditDeal = async (data: any) => {
    if (selectedDeal) {
      // Ensure we're passing the correct data structure to updateDeal
      const updates = {
        title: data.title,
        value: data.value,
        company_id: data.company_id,
        stage: data.stage,
        description: data.description || undefined,
        assigned_to: data.assigned_to || null,
      };
      
      await updateDealMutation.mutateAsync({
        id: selectedDeal.id,
        updates
      });
    }
  };

  // Handle delete deal
  const handleDeleteDeal = async () => {
    if (selectedDeal) {
      await deleteDealMutation.mutateAsync(selectedDeal.id);
    }
  };

  // Open edit dialog
  const openEditDialog = (deal: Deal) => {
    setSelectedDeal(deal);
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (deal: Deal) => {
    setSelectedDeal(deal);
    setDeleteDialogOpen(true);
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
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
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
                onEditDeal={openEditDialog}
                onDeleteDeal={openDeleteDialog}
              />
            ))}
          </div>
        )}

        {/* Add Deal Dialog */}
        <DealForm
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSubmit={handleAddDeal}
          title="Add Deal"
          description="Add a new deal to your pipeline"
        />

        {/* Edit Deal Dialog */}
        {selectedDeal && (
          <DealForm
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSubmit={handleEditDeal}
            deal={selectedDeal}
            title="Edit Deal"
            description="Update deal information"
          />
        )}

        {/* Delete Deal Dialog */}
        <DeleteDealDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteDeal}
          deal={selectedDeal}
          isDeleting={deleteDealMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default DealsBoard;
