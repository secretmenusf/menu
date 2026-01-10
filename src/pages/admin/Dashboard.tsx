import { StatCard } from '@/components/admin/StatCard';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { ShoppingCart, DollarSign, Users, Truck } from 'lucide-react';

export default function Dashboard() {
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
          value={12}
          description="from yesterday"
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="REVENUE TODAY"
          value="$4,250"
          description="from yesterday"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="ACTIVE SUBSCRIPTIONS"
          value={48}
          description="active members"
          icon={Users}
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard
          title="PENDING DELIVERIES"
          value={7}
          description="scheduled today"
          icon={Truck}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
