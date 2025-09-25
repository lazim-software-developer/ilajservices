import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  UserCheck, 
  DollarSign, 
  Settings,
  TrendingUp,
  Calendar,
  Package,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Customer Management',
      items: [
        { name: 'All Customers', href: '/admin/customers', icon: Users },
        { name: 'B2C Customers', href: '/admin/customers/b2c', icon: Users },
        { name: 'Holiday Homes', href: '/admin/customers/holiday-homes', icon: Users },
        { name: 'Corporate', href: '/admin/customers/corporate', icon: Users }
      ]
    },
    {
      title: 'Booking & Operations',
      items: [
        { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Task Manager', href: '/admin/tasks', icon: FileText },
        { name: 'Scheduling', href: '/admin/scheduling', icon: Calendar }
      ]
    },
    {
      title: 'Services & Providers',
      items: [
        { name: 'Service Catalog', href: '/admin/services', icon: Package },
        { name: 'Vendors', href: '/admin/vendors', icon: UserCheck },
        { name: 'Workers', href: '/admin/workers', icon: UserCheck },
        { name: 'Pricing Rules', href: '/admin/pricing', icon: DollarSign }
      ]
    },
    {
      title: 'Finance & Accounting',
      items: [
        { name: 'Invoices', href: '/admin/invoices', icon: FileText },
        { name: 'Payments', href: '/admin/payments', icon: DollarSign },
        { name: 'Ledger', href: '/admin/ledger', icon: TrendingUp },
        { name: 'VAT Management', href: '/admin/vat', icon: FileText }
      ]
    },
    {
      title: 'Marketing & Analytics',
      items: [
        { name: 'Promotions', href: '/admin/promotions', icon: Package },
        { name: 'Reports', href: '/admin/reports', icon: TrendingUp },
        { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp }
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Notifications', href: '/admin/notifications', icon: Settings },
        { name: 'Integrations', href: '/admin/integrations', icon: Settings },
        { name: 'Settings', href: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-primary">ILAJ Admin</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3 pb-20 overflow-y-auto">
          <div className="space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`
                          flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${isActive(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/">
              <LogOut className="mr-3 h-4 w-4" />
              Back to Website
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">ILAJ Admin</h1>
          <div></div> {/* Placeholder for balance */}
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;