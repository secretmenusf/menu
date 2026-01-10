import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_cents: number;
  created_at: string;
  delivery_notes: string | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  preparing: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              YOUR ORDERS
            </h1>
            <p className="font-body text-muted-foreground">
              A chronicle of your culinary journey
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 border border-border/30 rounded-lg bg-card/30">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-2">
                NO ORDERS YET
              </h2>
              <p className="font-body text-muted-foreground mb-6">
                Your journey has yet to begin
              </p>
              <Link to="/order">
                <Button className="font-display tracking-wider">
                  PLACE YOUR FIRST ORDER
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-border/30 rounded-lg p-6 bg-card/30 hover:border-border/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <code className="font-mono text-sm text-muted-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </code>
                        <Badge
                          variant="outline"
                          className={`font-display text-[10px] tracking-wider ${statusColors[order.status]}`}
                        >
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{format(new Date(order.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard size={14} />
                          <span className="capitalize">{order.payment_method}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl text-foreground">
                        {formatCurrency(order.total_cents)}
                      </span>
                      <ChevronRight className="text-muted-foreground" size={20} />
                    </div>
                  </div>

                  {order.delivery_notes && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <p className="font-body text-sm text-muted-foreground italic">
                        "{order.delivery_notes}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {orders.length > 0 && (
            <div className="mt-12 text-center">
              <Link to="/order">
                <Button className="font-display tracking-wider">
                  PLACE NEW ORDER
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
