
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection = 'up',
}: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          </div>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <p className="text-muted-foreground">{description}</p>
          {trend && (
            <div className={`ml-auto flex items-center ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trendDirection === 'up' ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
