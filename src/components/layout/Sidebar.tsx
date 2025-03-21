
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  DollarSign, 
  Settings, 
  HelpCircle, 
  BarChart3,
  Mail,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Deals', icon: DollarSign, path: '/deals' },
    { name: 'Companies', icon: Building2, path: '/companies' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Email', icon: Mail, path: '/email' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
  ];

  const secondaryNavItems = [
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help & Support', icon: HelpCircle, path: '/help' },
  ];

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors',
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive(item.path)
                    ? 'text-indigo-600'
                    : 'text-slate-400 group-hover:text-indigo-600'
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <Separator className="my-4" />
        
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors',
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive(item.path)
                    ? 'text-indigo-600'
                    : 'text-slate-400 group-hover:text-indigo-600'
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-200">
        <Button className="w-full" variant="outline">
          <DollarSign className="mr-2 h-4 w-4" />
          Upgrade to Pro
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
