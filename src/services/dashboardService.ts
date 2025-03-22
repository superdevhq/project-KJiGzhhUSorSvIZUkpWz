
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types';

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Get total deals count and value
  const { data: dealsData, error: dealsError } = await supabase
    .from('deals')
    .select('id, value, stage');

  if (dealsError) {
    console.error('Error fetching deals for dashboard stats:', dealsError);
    throw dealsError;
  }

  const totalDeals = dealsData.length;
  const totalValue = dealsData.reduce((sum, deal) => sum + Number(deal.value), 0);
  
  // Get won deals
  const wonDeals = dealsData.filter(deal => deal.stage === 'won').length;
  const wonValue = dealsData
    .filter(deal => deal.stage === 'won')
    .reduce((sum, deal) => sum + Number(deal.value), 0);
  
  // Get new leads
  const newLeads = dealsData.filter(deal => deal.stage === 'lead').length;
  
  // Calculate conversion rate
  const conversionRate = totalDeals > 0 
    ? Math.round((wonDeals / totalDeals) * 100) 
    : 0;

  return {
    totalDeals,
    totalValue,
    wonDeals,
    wonValue,
    newLeads,
    conversionRate,
  };
};
