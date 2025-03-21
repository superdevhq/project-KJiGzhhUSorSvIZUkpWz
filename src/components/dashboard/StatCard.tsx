
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, description, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            {icon}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.positive ? "text-green-600" : "text-red-600"
                )}
              >
                <span
                  className={cn(
                    "inline-block mr-1 h-0 w-0 border-x-4 border-x-transparent",
                    trend.positive
                      ? "border-b-4 border-b-green-600"
                      : "border-t-4 border-t-red-600"
                  )}
                ></span>
                {trend.value}%
                <span className="ml-1 text-muted-foreground">
                  {trend.positive ? "increase" : "decrease"}
                </span>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
