
import { useState } from 'react';
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
import { Deal, Activity } from '@/types';
import PageLoader from '@/components/ui/page-loader';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  // Fetch dashboard stats
  const { 
    data: statsData, 
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

  // Map icons to stats data
  const stats = statsData ? [
    { ...statsData[0], icon: DollarSign },
    { ...statsData[1], icon: TrendingUp },
    { ...statsData[2], icon: Users },
    { ...statsData[3], icon: Building2 },
  ] : [];

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
              <p className="text-muted-foreground">
                There was a problem loading the dashboard data. Please try again later.
              </p>
              <button
                className="mt-2 rounded-md bg-primary px-4 py-2 text-white"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities && <ActivityFeed activities={activities} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
