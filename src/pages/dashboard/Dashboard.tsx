
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { mockDashboardStats, mockActivities, mockDeals } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Building2, TrendingUp, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Prepare data for charts
  const dealsByStage = [
    { name: 'Lead', count: mockDeals.filter(d => d.stage === 'lead').length },
    { name: 'Contact', count: mockDeals.filter(d => d.stage === 'contact').length },
    { name: 'Proposal', count: mockDeals.filter(d => d.stage === 'proposal').length },
    { name: 'Negotiation', count: mockDeals.filter(d => d.stage === 'negotiation').length },
    { name: 'Won', count: mockDeals.filter(d => d.stage === 'won').length },
    { name: 'Lost', count: mockDeals.filter(d => d.stage === 'lost').length },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your sales pipeline and recent activity
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Deals"
                value={mockDashboardStats.totalDeals}
                icon={<DollarSign className="h-4 w-4" />}
                description="Active deals in your pipeline"
              />
              <StatCard
                title="Total Value"
                value={formatCurrency(mockDashboardStats.totalValue)}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Value of all deals"
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                title="Won Deals"
                value={mockDashboardStats.wonDeals}
                icon={<BarChart3 className="h-4 w-4" />}
                description={`Value: ${formatCurrency(mockDashboardStats.wonValue)}`}
              />
              <StatCard
                title="Conversion Rate"
                value={`${mockDashboardStats.conversionRate}%`}
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
              
              <ActivityFeed activities={mockActivities.slice(0, 5)} />
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
