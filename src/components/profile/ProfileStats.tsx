import { useState, useEffect } from 'react';
import { Package, CreditCard, Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

interface Stats {
  ordersPlaced: number;
  subscriptionStatus: 'active' | 'inactive' | 'none';
  rewardsEarned: number;
}

export function ProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch orders count
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch subscription status
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        // Calculate rewards (simple: 10 points per order)
        const rewardsEarned = (ordersCount || 0) * 10;

        setStats({
          ordersPlaced: ordersCount || 0,
          subscriptionStatus: subscription ? 'active' : 'none',
          rewardsEarned,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          ordersPlaced: 0,
          subscriptionStatus: 'none',
          rewardsEarned: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card border-border animate-pulse">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[100px]">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      icon: Package,
      value: stats?.ordersPlaced || 0,
      label: 'ORDERS',
      sublabel: 'placed',
    },
    {
      icon: CreditCard,
      value: stats?.subscriptionStatus === 'active' ? 'Active' : 'None',
      label: 'SUBSCRIPTION',
      sublabel: stats?.subscriptionStatus === 'active' ? 'weekly' : 'not enrolled',
    },
    {
      icon: Star,
      value: stats?.rewardsEarned || 0,
      label: 'POINTS',
      sublabel: 'earned',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="bg-card border-border overflow-hidden group">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center relative">
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <item.icon className="h-5 w-5 text-muted-foreground mb-2" />
            <div className="font-display text-lg sm:text-2xl tracking-[0.1em] text-foreground">
              {item.value}
            </div>
            <div className="font-display text-[10px] tracking-[0.15em] text-muted-foreground mt-1">
              {item.label}
            </div>
            <div className="text-[10px] text-muted-foreground/70">
              {item.sublabel}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
