import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife from '@/components/SeedOfLife';
import { OrderHistory } from '@/components/order';
import { useOrders } from '@/hooks/useOrders';
import { useOrderContext, Order } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Clock, CheckCircle2 } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { orderHistory } = useOrderContext();

  const {
    orders,
    isLoadingOrders,
    getActiveOrders,
    getOrdersByStatus,
  } = useOrders({ userId: address });

  // Redirect to connect wallet if not connected
  useEffect(() => {
    if (!isConnected) {
      // You might want to show a connect wallet prompt instead
      // For now, we'll just show the empty state
    }
  }, [isConnected]);

  const handleOrderClick = (order: Order) => {
    if (order.id) {
      navigate(`/orders/${order.id}`);
    }
  };

  const activeOrders = getActiveOrders();
  const deliveredOrders = getOrdersByStatus('delivered');
  const cancelledOrders = getOrdersByStatus('cancelled');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Page header */}
          <div className="text-center mb-12">
            <SeedOfLife size={48} className="text-foreground mx-auto mb-6" />
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-foreground mb-4">
              YOUR ORDERS
            </h1>
            <p className="font-body text-muted-foreground">
              Track and manage your meal deliveries
            </p>
          </div>

          {/* Not connected state */}
          {!isConnected ? (
            <div className="text-center py-16 border border-border/30 rounded-lg bg-card/30">
              <Package size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-xl tracking-wider text-foreground mb-2">
                Connect Your Wallet
              </h2>
              <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your wallet to view your order history and track deliveries.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="font-display tracking-wider"
              >
                GO TO HOME
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
                <TabsTrigger
                  value="all"
                  className="font-display text-xs tracking-wider data-[state=active]:bg-background"
                >
                  <Package size={14} className="mr-2" />
                  ALL
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="font-display text-xs tracking-wider data-[state=active]:bg-background"
                >
                  <Clock size={14} className="mr-2" />
                  ACTIVE ({activeOrders.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="font-display text-xs tracking-wider data-[state=active]:bg-background"
                >
                  <CheckCircle2 size={14} className="mr-2" />
                  COMPLETED ({deliveredOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <OrderHistory
                  orders={orders}
                  isLoading={isLoadingOrders}
                  onOrderClick={handleOrderClick}
                  emptyMessage="You haven't placed any orders yet. Browse our menu to get started!"
                />
              </TabsContent>

              <TabsContent value="active" className="space-y-6">
                <OrderHistory
                  orders={activeOrders}
                  isLoading={isLoadingOrders}
                  onOrderClick={handleOrderClick}
                  emptyMessage="No active orders. Your confirmed and in-progress orders will appear here."
                />
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <OrderHistory
                  orders={deliveredOrders}
                  isLoading={isLoadingOrders}
                  onOrderClick={handleOrderClick}
                  emptyMessage="No completed orders yet."
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Quick action */}
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/menu')}
              className="font-display tracking-wider"
            >
              BROWSE THIS WEEK'S MENU
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
