
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Bell, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleLogout = () => {
    logout();
  };

  // Get user initials or fallback
  const getUserInitial = () => {
    if (!user || !user.user_metadata || !user.user_metadata.name) {
      // Try to get from email if name is not available
      if (user?.email) {
        return user.email.charAt(0).toUpperCase();
      }
      return 'U'; // Default fallback
    }
    return user.user_metadata.name.charAt(0);
  };

  // Get user display name
  const getUserName = () => {
    if (!user) return 'User';
    
    if (user.user_metadata && user.user_metadata.name) {
      return user.user_metadata.name;
    }
    
    // Fallback to email or a default
    return user.email || 'User';
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || '';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">PulseCRM</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/deals"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Deals
            </Link>
            <Link
              to="/companies"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Companies
            </Link>
            <Link
              to="/customers"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Customers
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {showSearch ? (
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full md:w-[200px] pr-8"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={toggleSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserName()} />
                    <AvatarFallback>{getUserInitial()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {getUserEmail()}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-200">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/dashboard"
              className="block text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/deals"
              className="block text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Deals
            </Link>
            <Link
              to="/companies"
              className="block text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Companies
            </Link>
            <Link
              to="/customers"
              className="block text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Customers
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
