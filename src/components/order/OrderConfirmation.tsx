import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Calendar, MapPin, Clock, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrderContext, Order } from '@/contexts/OrderContext';
import { format } from 'date-fns';
import SeedOfLife from '@/components/SeedOfLife';

interface OrderConfirmationProps {
  order: Order;
  onViewOrders?: () => void;
  onNewOrder?: () => void;
}

export function OrderConfirmation({
  order,
  onViewOrders,
  onNewOrder,
}: OrderConfirmationProps) {
  const navigate = useNavigate();
  const { clearCart } = useOrderContext();
  const [copied, setCopied] = useState(false);

  // Clear cart on confirmation
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const copyOrderId = () => {
    if (order.id) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOrders = () => {
    if (onViewOrders) {
      onViewOrders();
    } else {
      navigate('/orders');
    }
  };

  const handleNewOrder = () => {
    if (onNewOrder) {
      onNewOrder();
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Success animation area */}
      <div className="relative py-12">
        {/* Decorative circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-gold/20 animate-pulse-glow" />
          <div className="absolute w-36 h-36 rounded-full border border-gold/30" />
          <div className="absolute w-24 h-24 rounded-full border border-gold/40" />
        </div>

        {/* Center icon */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Confirmation message */}
      <div className="space-y-4">
        <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-foreground">
          ORDER CONFIRMED
        </h1>
        <p className="font-body text-lg text-muted-foreground">
          Your culinary journey awaits. We're preparing something special for you.
        </p>
      </div>

      {/* Order ID */}
      {order.id && (
        <div className="flex items-center justify-center gap-2">
          <span className="font-body text-sm text-muted-foreground">Order #</span>
          <code className="font-mono text-sm bg-secondary/50 px-3 py-1 rounded">
            {order.id.slice(0, 8).toUpperCase()}
          </code>
          <button
            onClick={copyOrderId}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy order ID"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      )}

      {/* Order details card */}
      <Card className="border-border/30 bg-card/30 text-left">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.15em] text-gold">
            ORDER DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Delivery info */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Date & Time */}
            {order.deliveryDetails.scheduledDate && (
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-xs tracking-wider text-muted-foreground">
                    DELIVERY DATE
                  </p>
                  <p className="font-body text-foreground">
                    {format(order.deliveryDetails.scheduledDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {order.deliveryDetails.scheduledTime && (
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-xs tracking-wider text-muted-foreground">
                    DELIVERY TIME
                  </p>
                  <p className="font-body text-foreground">
                    {order.deliveryDetails.scheduledTime}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          {order.deliveryDetails.address && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-xs tracking-wider text-muted-foreground">
                  DELIVERY ADDRESS
                </p>
                <p className="font-body text-foreground">
                  {order.deliveryDetails.address}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Items summary */}
          <div>
            <p className="font-display text-xs tracking-wider text-muted-foreground mb-2">
              ITEMS ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span className="font-body text-foreground">
                    {item.quantity}x {item.item.name}
                  </span>
                  <span className="font-display tracking-wider text-muted-foreground">
                    ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-display tracking-wider">TOTAL PAID</span>
            <span className="font-display text-xl tracking-wider text-gold">
              ${(order.totalCents / 100).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* What's next */}
      <Card className="border-border/30 bg-card/30 text-left">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.15em]">
            WHAT'S NEXT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-sm font-display">
                1
              </span>
              <div>
                <p className="font-body font-medium text-foreground">
                  Confirmation Email
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  You'll receive a confirmation with all order details shortly.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center text-sm font-display">
                2
              </span>
              <div>
                <p className="font-body font-medium text-foreground">
                  Preparation
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Our chef will prepare your meals fresh on the delivery day.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center text-sm font-display">
                3
              </span>
              <div>
                <p className="font-body font-medium text-foreground">
                  Delivery
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Track your order in real-time when it's out for delivery.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          variant="outline"
          onClick={handleViewOrders}
          className="font-display tracking-wider"
        >
          VIEW ORDER STATUS
          <ArrowRight size={16} className="ml-2" />
        </Button>
        <Button
          onClick={handleNewOrder}
          className="font-display tracking-wider"
        >
          ORDER AGAIN
        </Button>
      </div>

      {/* Support note */}
      <p className="font-body text-sm text-muted-foreground pt-4">
        Questions? Contact us at{' '}
        <a href="mailto:hello@secretmenu.sf" className="text-foreground hover:underline">
          hello@secretmenu.sf
        </a>
      </p>
    </div>
  );
}

export default OrderConfirmation;
