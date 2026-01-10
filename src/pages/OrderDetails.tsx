import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Package,
  Copy,
  Check,
  MessageCircle,
  XCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife from '@/components/SeedOfLife';
import {
  OrderTracker,
  DeliveryMap,
  DeliveryETA,
} from '@/components/order';
import { useOrders } from '@/hooks/useOrders';
import { useDeliveryTracking } from '@/hooks/useDeliveryTracking';
import { Order } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// WhatsApp number from menuData
const WHATSAPP_NUMBER = '+14159001234';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { fetchOrder, cancelOrder, isUpdating } = useOrders({ userId: address });
  const { tracking, formatETA, formatDistance } = useDeliveryTracking({
    orderId: orderId || '',
    enabled: !!orderId && !!order,
  });

  // Fetch order on mount
  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      fetchOrder(orderId).then((fetchedOrder) => {
        setOrder(fetchedOrder);
        setIsLoading(false);
      });
    }
  }, [orderId, fetchOrder]);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCancelOrder = async () => {
    if (orderId) {
      try {
        await cancelOrder(orderId);
        toast({
          title: 'Order cancelled',
          description: 'Your order has been cancelled successfully.',
        });
        // Refresh order data
        const updated = await fetchOrder(orderId);
        setOrder(updated);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to cancel order. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I have a question about my order #${orderId?.slice(0, 8).toUpperCase()}`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${message}`,
      '_blank'
    );
  };

  // Can cancel if order is confirmed or preparing (not out for delivery)
  const canCancel =
    order?.status === 'confirmed' || order?.status === 'preparing';

  // Show tracking components for active orders
  const showTracking =
    order?.status === 'confirmed' ||
    order?.status === 'preparing' ||
    order?.status === 'out_for_delivery';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/orders')}
            className="mb-6 font-display tracking-wider"
          >
            <ArrowLeft size={16} className="mr-2" />
            ALL ORDERS
          </Button>

          {isLoading ? (
            <OrderDetailsSkeleton />
          ) : order ? (
            <div className="space-y-8">
              {/* Order header */}
              <div className="text-center">
                <SeedOfLife size={36} className="text-foreground mx-auto mb-4" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl tracking-[0.2em] text-foreground">
                    ORDER #{orderId?.slice(0, 8).toUpperCase()}
                  </h1>
                  <button
                    onClick={copyOrderId}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copy order ID"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {order.createdAt && (
                  <p className="font-body text-muted-foreground">
                    Placed on {format(order.createdAt, 'MMMM d, yyyy')} at{' '}
                    {format(order.createdAt, 'h:mm a')}
                  </p>
                )}
              </div>

              {/* Order status tracker */}
              {showTracking && orderId && (
                <OrderTracker orderId={orderId} />
              )}

              {/* Delivery tracking for out_for_delivery */}
              {order.status === 'out_for_delivery' && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <DeliveryMap
                    driverLocation={tracking.driverLocation}
                    destinationAddress={order.deliveryDetails.address}
                  />
                  <DeliveryETA
                    estimatedArrival={tracking.estimatedArrival}
                    driverLocation={tracking.driverLocation}
                    distanceRemaining={tracking.distanceRemaining}
                    isLive={tracking.isLive}
                  />
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Order items */}
                <div className="lg:col-span-2">
                  <Card className="border-border/30 bg-card/30">
                    <CardHeader>
                      <CardTitle className="font-display text-sm tracking-[0.15em] flex items-center gap-2">
                        <Package size={16} className="text-gold" />
                        ORDER ITEMS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {order.items.length > 0 ? (
                        <div className="divide-y divide-border/30">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between py-4 first:pt-0 last:pb-0"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                                    Day {item.dayIndex + 1} - {item.mealType}
                                  </span>
                                </div>
                                <p className="font-body text-foreground mt-1">
                                  {item.item.name}
                                </p>
                                {item.item.description && (
                                  <p className="font-body text-sm text-muted-foreground italic">
                                    {item.item.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <p className="font-display tracking-wider">
                                  ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                                </p>
                                <p className="font-body text-xs text-muted-foreground">
                                  {item.quantity} x ${(item.unitPrice / 100).toFixed(0)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-body text-muted-foreground text-center py-8">
                          Order items will be displayed here
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - Details & Actions */}
                <div className="space-y-6">
                  {/* Delivery details */}
                  <Card className="border-border/30 bg-card/30">
                    <CardHeader>
                      <CardTitle className="font-display text-sm tracking-[0.15em]">
                        DELIVERY DETAILS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {order.deliveryDetails.scheduledDate && (
                        <div className="flex items-start gap-3">
                          <Calendar size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-display text-xs tracking-wider text-muted-foreground">
                              DATE
                            </p>
                            <p className="font-body text-foreground">
                              {format(order.deliveryDetails.scheduledDate, 'EEEE, MMMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.deliveryDetails.scheduledTime && (
                        <div className="flex items-start gap-3">
                          <Clock size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-display text-xs tracking-wider text-muted-foreground">
                              TIME
                            </p>
                            <p className="font-body text-foreground">
                              {order.deliveryDetails.scheduledTime}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.deliveryDetails.address && (
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-display text-xs tracking-wider text-muted-foreground">
                              ADDRESS
                            </p>
                            <p className="font-body text-foreground">
                              {order.deliveryDetails.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.deliveryDetails.notes && (
                        <div className="pt-2 border-t border-border/30">
                          <p className="font-display text-xs tracking-wider text-muted-foreground mb-1">
                            NOTES
                          </p>
                          <p className="font-body text-sm text-muted-foreground italic">
                            {order.deliveryDetails.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order total */}
                  <Card className="border-border/30 bg-card/30">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <span className="font-display tracking-wider">TOTAL</span>
                        <span className="font-display text-2xl tracking-wider text-gold">
                          ${(order.totalCents / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-2">
                        Payment: {order.paymentMethod === 'stripe' ? 'Card' : 'Crypto'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={openWhatsApp}
                      className="w-full font-display text-xs tracking-wider"
                    >
                      <MessageCircle size={14} className="mr-2" />
                      CONTACT SUPPORT
                    </Button>

                    {canCancel && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full font-display text-xs tracking-wider text-destructive hover:text-destructive"
                          >
                            <XCircle size={14} className="mr-2" />
                            CANCEL ORDER
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-display tracking-wider">
                              Cancel Order?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-body">
                              Are you sure you want to cancel this order? This action cannot be
                              undone and you will receive a refund to your original payment
                              method.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-display tracking-wider">
                              Keep Order
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancelOrder}
                              className="font-display tracking-wider bg-destructive hover:bg-destructive/90"
                              disabled={isUpdating}
                            >
                              {isUpdating ? 'Cancelling...' : 'Cancel Order'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border border-border/30 rounded-lg bg-card/30">
              <Package size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-xl tracking-wider text-foreground mb-2">
                Order Not Found
              </h2>
              <p className="font-body text-muted-foreground mb-6">
                We couldn't find an order with this ID.
              </p>
              <Button
                onClick={() => navigate('/orders')}
                className="font-display tracking-wider"
              >
                VIEW ALL ORDERS
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Loading skeleton
function OrderDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="w-12 h-12 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      <Skeleton className="h-48 w-full rounded-lg" />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
