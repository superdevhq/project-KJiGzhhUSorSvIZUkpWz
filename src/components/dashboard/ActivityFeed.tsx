
import { Activity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'deal_created':
        return 'bg-green-100 text-green-600';
      case 'deal_updated':
        return 'bg-blue-100 text-blue-600';
      case 'deal_stage_changed':
        return 'bg-purple-100 text-purple-600';
      case 'contact_added':
        return 'bg-yellow-100 text-yellow-600';
      case 'company_added':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mr-4 flex flex-col items-center">
                <Avatar className="h-9 w-9 border-2 border-white">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="h-full w-px bg-slate-200 mt-2"></div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{activity.description}</p>
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${getActivityIcon(activity.type)}`}>
                  {activity.type.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
