
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types';
import { DollarSign, Users, Building2, TrendingUp } from 'lucide-react';

// Get dashboard statistics
export const getDashboardStats = async () => {
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

  // Return formatted stats for the dashboard
  return [
    {
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(totalValue),
      icon: DollarSign,
      description: `${totalDeals} total deals`,
      trend: '+12.5%',
      trendDirection: 'up',
    },
    {
      title: 'Closed Deals',
      value: wonDeals.toString(),
      icon: TrendingUp,
      description: `${conversionRate}% conversion rate`,
      trend: '+5.2%',
      trendDirection: 'up',
    },
    {
      title: 'New Leads',
      value: newLeads.toString(),
      icon: Users,
      description: 'This month',
      trend: '+3.1%',
      trendDirection: 'up',
    },
    {
      title: 'Active Companies',
      value: '24',
      icon: Building2,
      description: '4 new this month',
      trend: '+2.5%',
      trendDirection: 'up',
    },
  ];
};
