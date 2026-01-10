import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Package,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Order, OrderStatus } from '@/contexts/OrderContext';
import { format } from 'date-fns';

// Status configuration
const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  draft: {
    label: 'Draft',
    icon: Clock,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  preparing: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  out_for_delivery: {
    label: 'On the Way',
    icon: Truck,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  delivered: {
    label: 'Delivered',
    icon: Package,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};

interface OrderHistoryProps {
  orders: Order[];
  isLoading?: boolean;
  onOrderClick?: (order: Order) => void;
  emptyMessage?: string;
}

// Single order card
function OrderCard({
  order,
  onClick,
}: {
  order: Order;
  onClick?: () => void;
}) {
  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;

  // Count total items
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card
      className="border-border/30 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Status icon */}
          <div className={`p-3 rounded-full ${config.bgColor} shrink-0`}>
            <StatusIcon size={20} className={config.color} />
          </div>

          {/* Order info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-sm tracking-wider text-foreground">
                    Order #{order.id?.slice(0, 8).toUpperCase() || 'PENDING'}
                  </span>
                  <Badge variant="outline" className={`${config.color} border-current`}>
                    {config.label}
                  </Badge>
                </div>
                {order.createdAt && (
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    {format(order.createdAt, 'MMM d, yyyy')} at{' '}
                    {format(order.createdAt, 'h:mm a')}
                  </p>
                )}
              </div>
              <ChevronRight
                size={20}
                className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
              />
            </div>

            {/* Items preview */}
            <div className="mt-3">
              <p className="font-body text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {order.items.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="font-body text-xs bg-secondary/50 px-2 py-0.5 rounded"
                  >
                    {item.item.name}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="font-body text-xs text-muted-foreground px-2 py-0.5">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Delivery info */}
            {order.deliveryDetails.scheduledDate && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Delivery: </span>
                  <span className="text-foreground">
                    {format(order.deliveryDetails.scheduledDate, 'EEE, MMM d')}
                    {order.deliveryDetails.scheduledTime && (
                      <> at {order.deliveryDetails.scheduledTime}</>
                    )}
                  </span>
                </p>
              </div>
            )}

            {/* Total */}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display text-lg tracking-wider text-gold">
                ${(order.totalCents / 100).toFixed(2)}
              </span>
              {order.status === 'out_for_delivery' && (
                <Button variant="ghost" size="sm" className="font-display text-xs tracking-wider">
                  TRACK ORDER
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function OrderSkeleton() {
  return (
    <Card className="border-border/30 bg-card/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-11 h-11 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-32" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderHistory({
  orders,
  isLoading,
  onOrderClick,
  emptyMessage = "You haven't placed any orders yet.",
}: OrderHistoryProps) {
  const navigate = useNavigate();

  // Group orders by status for filtering
  const groupedOrders = useMemo(() => {
    const active = orders.filter(
      (o) => o.status !== 'delivered' && o.status !== 'cancelled'
    );
    const completed = orders.filter(
      (o) => o.status === 'delivered' || o.status === 'cancelled'
    );
    return { active, completed, all: orders };
  }, [orders]);

  const handleOrderClick = (order: Order) => {
    if (onOrderClick) {
      onOrderClick(order);
    } else if (order.id) {
      navigate(`/orders/${order.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="border-border/30 bg-card/30">
        <CardContent className="py-16 text-center">
          <Package size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="font-body text-muted-foreground mb-4">{emptyMessage}</p>
          <Button
            onClick={() => navigate('/menu')}
            className="font-display tracking-wider"
          >
            BROWSE MENU
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active orders */}
      {groupedOrders.active.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-sm tracking-[0.2em] text-muted-foreground">
            ACTIVE ORDERS
          </h3>
          <div className="space-y-3">
            {groupedOrders.active.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past orders */}
      {groupedOrders.completed.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-sm tracking-[0.2em] text-muted-foreground">
            PAST ORDERS
          </h3>
          <div className="space-y-3">
            {groupedOrders.completed.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
