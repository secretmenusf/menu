import { useMemo } from 'react';
import { Trash2, MapPin, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useOrderContext } from '@/contexts/OrderContext';
import { format, addDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Pricing constants
const DELIVERY_FEE_CENTS = 0; // Free delivery in SF
const TAX_RATE = 0.0875; // 8.75% SF sales tax

interface OrderSummaryProps {
  onBack?: () => void;
  onCheckout?: () => void;
  isProcessing?: boolean;
}

export function OrderSummary({ onBack, onCheckout, isProcessing }: OrderSummaryProps) {
  const {
    cart,
    removeItem,
    cartTotal,
    cartItemCount,
    setDeliveryDetails,
  } = useOrderContext();

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cartTotal;
    const tax = Math.round(subtotal * TAX_RATE);
    const delivery = DELIVERY_FEE_CENTS;
    const total = subtotal + tax + delivery;

    return {
      subtotal,
      tax,
      delivery,
      total,
      subtotalDollars: (subtotal / 100).toFixed(2),
      taxDollars: (tax / 100).toFixed(2),
      deliveryDollars: delivery === 0 ? 'Free' : `$${(delivery / 100).toFixed(2)}`,
      totalDollars: (total / 100).toFixed(2),
    };
  }, [cartTotal]);

  // Minimum date is day after tomorrow to allow prep time
  const minDate = addDays(new Date(), 2);

  const handleDateChange = (date: Date | undefined) => {
    setDeliveryDetails({ scheduledDate: date });
  };

  const handleTimeChange = (time: string) => {
    setDeliveryDetails({ scheduledTime: time });
  };

  const handleAddressChange = (address: string) => {
    setDeliveryDetails({ address });
  };

  const handleNotesChange = (notes: string) => {
    setDeliveryDetails({ notes });
  };

  // Group items by day for display
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof cart.items> = {};
    cart.items.forEach((item) => {
      const key = `Day ${item.dayIndex + 1}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [cart.items]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Items list */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-[0.15em] text-foreground">
            YOUR ORDER
          </h2>
          <span className="font-body text-muted-foreground">
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {Object.keys(groupedItems).length === 0 ? (
          <Card className="border-border/30 bg-card/30">
            <CardContent className="py-12 text-center">
              <p className="font-body text-muted-foreground">
                Your cart is empty. Add some meals to get started.
              </p>
              <Button variant="outline" onClick={onBack} className="mt-4">
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([day, items]) => (
              <Card key={day} className="border-border/30 bg-card/30">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm tracking-[0.2em] text-gold">
                    {day}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border/20">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                              {item.mealType}
                            </span>
                          </div>
                          <p className="font-body text-foreground mt-0.5">
                            {item.item.name}
                          </p>
                          {item.item.description && (
                            <p className="font-body text-sm text-muted-foreground italic">
                              {item.item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <p className="font-display text-sm tracking-wider">
                              ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                            </p>
                            <p className="font-body text-xs text-muted-foreground">
                              {item.quantity} x ${(item.unitPrice / 100).toFixed(0)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back button */}
        <Button variant="ghost" onClick={onBack} className="font-display tracking-wider">
          &larr; Edit Selections
        </Button>
      </div>

      {/* Sidebar - Delivery & Payment */}
      <div className="space-y-6">
        {/* Delivery Details */}
        <Card className="border-border/30 bg-card/30">
          <CardHeader>
            <CardTitle className="font-display text-sm tracking-[0.15em] flex items-center gap-2">
              <MapPin size={16} className="text-gold" />
              DELIVERY DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date */}
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider flex items-center gap-2">
                <CalendarIcon size={14} />
                DATE
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !cart.deliveryDetails.scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    {cart.deliveryDetails.scheduledDate
                      ? format(cart.deliveryDetails.scheduledDate, 'PPP')
                      : 'Select delivery date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={cart.deliveryDetails.scheduledDate}
                    onSelect={handleDateChange}
                    disabled={(date) => date < minDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider flex items-center gap-2">
                <Clock size={14} />
                TIME
              </Label>
              <Input
                type="time"
                value={cart.deliveryDetails.scheduledTime || '18:00'}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="bg-transparent"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider flex items-center gap-2">
                <MapPin size={14} />
                ADDRESS
              </Label>
              <Textarea
                value={cart.deliveryDetails.address || ''}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Enter your delivery address"
                className="bg-transparent resize-none"
                rows={2}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider flex items-center gap-2">
                <FileText size={14} />
                NOTES (optional)
              </Label>
              <Textarea
                value={cart.deliveryDetails.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Gate code, special instructions..."
                className="bg-transparent resize-none"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="border-border/30 bg-card/30">
          <CardHeader>
            <CardTitle className="font-display text-sm tracking-[0.15em]">
              ORDER SUMMARY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-body text-muted-foreground">Subtotal</span>
              <span className="font-display tracking-wider">${totals.subtotalDollars}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-body text-muted-foreground">Tax (8.75%)</span>
              <span className="font-display tracking-wider">${totals.taxDollars}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-body text-muted-foreground">Delivery</span>
              <span className="font-display tracking-wider text-green-600">
                {totals.deliveryDollars}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="font-display tracking-wider">TOTAL</span>
              <span className="font-display text-xl tracking-wider text-gold">
                ${totals.totalDollars}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={cartItemCount === 0 || isProcessing}
          className="w-full font-display tracking-[0.15em] py-6"
          size="lg"
        >
          {isProcessing ? 'PROCESSING...' : `CHECKOUT $${totals.totalDollars}`}
        </Button>

        <p className="font-body text-xs text-muted-foreground text-center">
          Free delivery within San Francisco. Orders require 48 hours advance notice.
        </p>
      </div>
    </div>
  );
}

export default OrderSummary;
