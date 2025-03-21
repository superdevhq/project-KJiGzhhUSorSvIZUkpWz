
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
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

  const isLoading = statsLoading || activitiesLoading || dealsLoading;
  const hasError = statsError || activitiesError || dealsError;

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h3 className="font-semibold">Error loading dashboard data</h3>
          <p>Please try refreshing the page.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your sales pipeline and recent activity
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Deals"
                value={isLoading ? '...' : stats?.totalDeals.toString() || '0'}
                icon={<DollarSign className="h-4 w-4" />}
                description="Active deals in your pipeline"
              />
              <StatCard
                title="Total Value"
                value={isLoading ? '...' : formatCurrency(stats?.totalValue || 0)}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Value of all deals"
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                title="Won Deals"
                value={isLoading ? '...' : stats?.wonDeals.toString() || '0'}
                icon={<BarChart3 className="h-4 w-4" />}
                description={isLoading ? '...' : `Value: ${formatCurrency(stats?.wonValue || 0)}`}
              />
              <StatCard
                title="Conversion Rate"
                value={isLoading ? '...' : `${stats?.conversionRate || 0}%`}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Deals won vs. total deals"
                trend={{ value: 5, positive: true }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Deals by Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
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
                  )}
                </CardContent>
              </Card>
              
              {isLoading ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                  </CardContent>
                </Card>
              ) : (
                <ActivityFeed activities={activities || []} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <p className="text-center text-muted-foreground py-8">
                    Detailed analytics will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
