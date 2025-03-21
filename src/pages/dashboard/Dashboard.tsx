import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Building2, TrendingUp, BarChart3 } from 'lucide-react';
import { getDashboardStats } from '@/services/dashboardService';
import { getActivities } from '@/services/activityService';
import { getDeals } from '@/services/dealService';
import { Deal, Activity, DashboardStats } from '@/types';
import { useLoading } from '@/hooks/use-loading';
import PageLoader from '@/components/ui/page-loader';
import LoadingWrapper from '@/components/ui/loading-wrapper';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isLoading, withLoading } = useLoading(true);
  
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });
  
  // Fetch activities
  const { 
    data: activities, 
    isLoading: activitiesLoading,
    error: activitiesError
  } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(5)
  });
  
  // Fetch deals for chart
  const { 
    data: deals, 
    isLoading: dealsLoading,
    error: dealsError
  } = useQuery({
    queryKey: ['deals'],
    queryFn: getDeals
  });
  
  // Prepare data for charts
  const dealsByStage = deals ? [
    { name: 'Lead', count: deals.filter(d => d.stage === 'lead').length },
    { name: 'Contact', count: deals.filter(d => d.stage === 'contact').length },
    { name: 'Proposal', count: deals.filter(d => d.stage === 'proposal').length },
    { name: 'Negotiation', count: deals.filter(d => d.stage === 'negotiation').length },
    { name: 'Won', count: deals.filter(d => d.stage === 'won').length },
    { name: 'Lost', count: deals.filter(d => d.stage === 'lost').length },
  ] : [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const hasError = statsError || activitiesError || dealsError;

  if (isLoading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your sales performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingWrapper isLoading={isLoading}>
              <ActivityFeed activities={activities} />
            </LoadingWrapper>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LoadingWrapper isLoading={isLoading}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dealsByStage}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} deals`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </LoadingWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;