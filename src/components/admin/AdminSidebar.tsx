import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import SeedOfLife from '@/components/SeedOfLife';
import {
  LayoutDashboard,
  ShoppingCart,
  Building2,
  Users,
  Truck,
  UtensilsCrossed,
  CreditCard,
  Settings,
  Video,
  LogOut,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    href: '/admin/orders',
  },
  {
    title: 'Organizations',
    icon: Building2,
    href: '/admin/organizations',
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/admin/customers',
  },
  {
    title: 'Deliveries',
    icon: Truck,
    href: '/admin/deliveries',
  },
  {
    title: 'Menus',
    icon: UtensilsCrossed,
    href: '/admin/menus',
  },
  {
    title: 'Payments',
    icon: CreditCard,
    href: '/admin/payments',
  },
  {
    title: 'Testimonials',
    icon: Video,
    href: '/admin/testimonials',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/admin" className="flex items-center gap-3">
          <SeedOfLife size={28} className="text-sidebar-foreground" />
          <div>
            <span className="font-display text-xs tracking-[0.2em] text-sidebar-foreground block">
              SECRET MENU
            </span>
            <span className="text-[10px] text-sidebar-foreground/60 tracking-wider">
              ADMIN
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-display text-[10px] tracking-[0.2em]">
            MANAGEMENT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-body text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
                <span className="font-body text-sm">Exit Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
