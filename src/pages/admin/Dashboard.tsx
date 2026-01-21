import { StatCard } from '@/components/admin/StatCard';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { ShoppingCart, DollarSign, Building2, Truck } from 'lucide-react';
import { useAdminOrders } from '@/hooks/useAdminOrders';

export default function Dashboard() {
  const { orders, organizations, isLoading, getStats, getRecentOrders } = useAdminOrders();
  const stats = getStats();
  const recentOrders = getRecentOrders(5);

  // Transform orders for RecentOrders component
  const recentOrdersForDisplay = recentOrders.map((order) => ({
    id: order.id,
    customer: order.organization?.name || order.customer.name,
    email: order.customer.email,
    total: order.total,
    status: order.status as 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled',
    createdAt: order.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-[0.1em] mb-2">DASHBOARD</h1>
        <p className="text-muted-foreground font-body">
          Overview of your business metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ORDERS TODAY"
          value={isLoading ? '...' : stats.ordersToday}
          description="from yesterday"
          icon={ShoppingCart}
        />
        <StatCard
          title="REVENUE TODAY"
          value={isLoading ? '...' : `$${stats.revenueToday.toLocaleString()}`}
          description="from yesterday"
          icon={DollarSign}
        />
        <StatCard
          title="ACTIVE ORGANIZATIONS"
          value={isLoading ? '...' : stats.activeOrganizations}
          description="active clients"
          icon={Building2}
        />
        <StatCard
          title="PENDING DELIVERIES"
          value={isLoading ? '...' : stats.pendingDeliveries}
          description="scheduled"
          icon={Truck}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <RecentOrders orders={recentOrdersForDisplay} />
        </div>
      </div>
    </div>
  );
}
