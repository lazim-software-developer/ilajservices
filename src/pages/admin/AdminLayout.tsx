import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
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
  LogOut
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const { open, setOpen } = useSidebar();

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
        { name: 'Finance Management', href: '/admin/finance', icon: DollarSign },
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

  const getNavClass = (path: string) => {
    return isActive(path) ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";
  };

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center h-16 px-6 border-b">
        <h1 className="text-xl font-bold text-primary">ILAJ Admin</h1>
      </div>

      <SidebarContent>
        {navigationSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <Link to={item.href} className={getNavClass(item.href)}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/">
            <LogOut className="h-4 w-4 mr-2" />
            Back to Website
          </Link>
        </Button>
      </div>
    </Sidebar>
  );
};

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b px-4">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">Admin Dashboard</h1>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;