
import { useState } from 'react';
import { Deal } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent, dealId: string) => void;
}

const DealCard = ({ deal, onDragStart }: DealCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card
      className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={deal.company.logo} alt={deal.company.name} />
              <AvatarFallback>{deal.company.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{deal.title}</h3>
              <p className="text-xs text-muted-foreground">{deal.company.name}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={isHovered ? 'opacity-100' : 'opacity-0'}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit Deal</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete Deal</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="font-semibold text-sm">{formatCurrency(deal.value)}</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            <span>{deal.assignedTo.name}</span>
          </div>
        </div>
        
        {deal.description && (
          <p className="mt-2 text-xs text-slate-600 line-clamp-2">{deal.description}</p>
        )}
        
        <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
          <span>Updated {formatDistanceToNow(new Date(deal.updatedAt), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
