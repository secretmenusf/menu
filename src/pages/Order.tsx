import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { weeklyMenu, WHATSAPP_NUMBER } from '@/lib/menuData';
import { PAYMENT_CONFIG } from '@/lib/wagmi';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Plus, Minus, MessageCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MealSelection {
  dayId: string;
  mealType: 'lunch' | 'dinner';
  mealName: string;
  tier: 'regular' | 'premium';
  quantity: number;
}

const Order = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  
  const [selections, setSelections] = useState<MealSelection[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [deliveryTime, setDeliveryTime] = useState('18:00');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const updateSelection = (
    dayId: string,
    mealType: 'lunch' | 'dinner',
    mealName: string,
    tier: 'regular' | 'premium',
    delta: number
  ) => {
    setSelections(prev => {
      const existingIndex = prev.findIndex(
        s => s.dayId === dayId && s.mealType === mealType && s.mealName === mealName && s.tier === tier
      );

      if (existingIndex >= 0) {
        const newSelections = [...prev];
        const newQty = newSelections[existingIndex].quantity + delta;
        if (newQty <= 0) {
          newSelections.splice(existingIndex, 1);
        } else {
          newSelections[existingIndex] = { ...newSelections[existingIndex], quantity: newQty };
        }
        return newSelections;
      } else if (delta > 0) {
        return [...prev, { dayId, mealType, mealName, tier, quantity: delta }];
      }
      return prev;
    });
  };

  const getQuantity = (dayId: string, mealType: 'lunch' | 'dinner', mealName: string, tier: 'regular' | 'premium') => {
    const selection = selections.find(
      s => s.dayId === dayId && s.mealType === mealType && s.mealName === mealName && s.tier === tier
    );
    return selection?.quantity || 0;
  };

  const { regularMeals, premiumMeals, totalUsd } = useMemo(() => {
    let regular = 0;
    let premium = 0;
    selections.forEach(s => {
      if (s.tier === 'regular') regular += s.quantity;
      else premium += s.quantity;
    });
    return {
      regularMeals: regular,
      premiumMeals: premium,
      totalUsd: regular * PAYMENT_CONFIG.regularMealPrice + premium * PAYMENT_CONFIG.premiumMealPrice
    };
  }, [selections]);

  const isMinimumMet = totalUsd >= PAYMENT_CONFIG.minimumOrder;

  const buildWhatsAppMessage = () => {
    const lines = ['🍽️ *SECRET MENU ORDER*\n'];
    
    selections.forEach(s => {
      lines.push(`• Day ${s.dayId} ${s.mealType}: ${s.mealName} (${s.tier}) x${s.quantity}`);
    });
    
    lines.push(`\n💰 *Total: $${totalUsd}*`);
    lines.push(`Regular meals: ${regularMeals} × $${PAYMENT_CONFIG.regularMealPrice}`);
    lines.push(`Premium meals: ${premiumMeals} × $${PAYMENT_CONFIG.premiumMealPrice}`);
    
    if (deliveryDate) {
      lines.push(`\n📅 *Delivery:* ${format(deliveryDate, 'EEEE, MMMM d, yyyy')} at ${deliveryTime}`);
    }
    if (deliveryAddress) {
      lines.push(`📍 *Address:* ${deliveryAddress}`);
    }
    if (deliveryNotes) {
      lines.push(`📝 *Notes:* ${deliveryNotes}`);
    }
    
    return encodeURIComponent(lines.join('\n'));
  };

  const handleCheckout = () => {
    if (!isMinimumMet) {
      toast({
        title: "Minimum order not met",
        description: `Please add at least $${PAYMENT_CONFIG.minimumOrder} worth of meals`,
        variant: "destructive",
      });
      return;
    }

    if (!deliveryDate) {
      toast({
        title: "Select delivery date",
        description: "Please choose when you'd like your meals delivered",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Enter delivery address",
        description: "Please provide your delivery address",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet to complete payment",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentModal(true);
  };

  const sendWhatsAppConfirmation = () => {
    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Minimum date is tomorrow
  const minDate = addDays(new Date(), 1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-foreground text-3xl mb-4 block">✦</span>
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
              PLACE YOUR ORDER
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Select your meals for the week • $50 regular / $80 premium • $200 minimum
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Menu Selection */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">SELECT MEALS</h2>
              
              {weeklyMenu.map((day) => (
                <div key={day.day} className="border border-border/30 rounded-lg p-6 bg-card/30">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-display text-xl tracking-[0.2em] text-mystical">DAY {day.day}</span>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>

                  {/* Lunch */}
                  <div className="mb-6">
                    <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-3">LUNCH</h4>
                    <MealRow
                      mealName={day.lunch.name}
                      description={day.lunch.description}
                      dayId={day.day}
                      mealType="lunch"
                      getQuantity={getQuantity}
                      updateSelection={updateSelection}
                    />
                  </div>

                  {/* Dinner */}
                  <div>
                    <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-3">DINNER</h4>
                    {day.dinner.map((item, idx) => (
                      <MealRow
                        key={idx}
                        mealName={item.name}
                        description={item.description}
                        dayId={day.day}
                        mealType="dinner"
                        getQuantity={getQuantity}
                        updateSelection={updateSelection}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar - Delivery & Summary */}
            <div className="space-y-6">
              {/* Delivery Scheduling */}
              <div className="border border-border/30 rounded-lg p-6 bg-card/30 sticky top-24">
                <h3 className="font-display text-sm tracking-[0.15em] text-foreground mb-4">DELIVERY DETAILS</h3>
                
                {/* Date Picker */}
                <div className="space-y-2 mb-4">
                  <Label className="font-display text-xs tracking-wider">DATE</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        disabled={(date) => date < minDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time */}
                <div className="space-y-2 mb-4">
                  <Label className="font-display text-xs tracking-wider">TIME</Label>
                  <Input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="bg-transparent"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 mb-4">
                  <Label className="font-display text-xs tracking-wider">ADDRESS</Label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter delivery address"
                    className="bg-transparent resize-none"
                    rows={2}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2 mb-6">
                  <Label className="font-display text-xs tracking-wider">NOTES (optional)</Label>
                  <Textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Gate code, special instructions..."
                    className="bg-transparent resize-none"
                    rows={2}
                  />
                </div>

                {/* Order Summary */}
                <div className="border-t border-border/50 pt-4 mb-4 space-y-2">
                  {regularMeals > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{regularMeals} regular × ${PAYMENT_CONFIG.regularMealPrice}</span>
                      <span>${regularMeals * PAYMENT_CONFIG.regularMealPrice}</span>
                    </div>
                  )}
                  {premiumMeals > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{premiumMeals} premium × ${PAYMENT_CONFIG.premiumMealPrice}</span>
                      <span>${premiumMeals * PAYMENT_CONFIG.premiumMealPrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display tracking-wider pt-2 border-t border-border/30">
                    <span>TOTAL</span>
                    <span>${totalUsd}</span>
                  </div>
                </div>

                {!isMinimumMet && totalUsd > 0 && (
                  <div className="flex items-center gap-2 text-destructive text-xs mb-4">
                    <AlertCircle size={14} />
                    <span>Minimum order: ${PAYMENT_CONFIG.minimumOrder}</span>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={selections.length === 0}
                  className="w-full font-display tracking-wider mb-3"
                >
                  CHECKOUT ${totalUsd}
                </Button>

                {/* WhatsApp confirmation */}
                {selections.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={sendWhatsAppConfirmation}
                    className="w-full font-display text-xs tracking-wider"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    CONFIRM VIA WHATSAPP
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          // After payment, send WhatsApp confirmation
          sendWhatsAppConfirmation();
        }}
        regularMeals={regularMeals}
        premiumMeals={premiumMeals}
        totalUsd={totalUsd}
      />
    </div>
  );
};

// Meal row component with quantity selectors for regular and premium
interface MealRowProps {
  mealName: string;
  description: string;
  dayId: string;
  mealType: 'lunch' | 'dinner';
  getQuantity: (dayId: string, mealType: 'lunch' | 'dinner', mealName: string, tier: 'regular' | 'premium') => number;
  updateSelection: (dayId: string, mealType: 'lunch' | 'dinner', mealName: string, tier: 'regular' | 'premium', delta: number) => void;
}

const MealRow = ({ mealName, description, dayId, mealType, getQuantity, updateSelection }: MealRowProps) => {
  const regularQty = getQuantity(dayId, mealType, mealName, 'regular');
  const premiumQty = getQuantity(dayId, mealType, mealName, 'premium');

  return (
    <div className="py-3 border-b border-border/20 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <p className="font-body text-foreground">{mealName}</p>
          {description && (
            <p className="font-body text-sm text-muted-foreground italic">{description}</p>
          )}
        </div>
        
        <div className="flex gap-4">
          {/* Regular */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-display tracking-wider">$50</span>
            <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-1">
              <button
                onClick={() => updateSelection(dayId, mealType, mealName, 'regular', -1)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                disabled={regularQty === 0}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-display">{regularQty}</span>
              <button
                onClick={() => updateSelection(dayId, mealType, mealName, 'regular', 1)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Premium */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-display tracking-wider">$80</span>
            <div className="flex items-center gap-1 bg-accent/50 rounded-full px-1">
              <button
                onClick={() => updateSelection(dayId, mealType, mealName, 'premium', -1)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                disabled={premiumQty === 0}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-display">{premiumQty}</span>
              <button
                onClick={() => updateSelection(dayId, mealType, mealName, 'premium', 1)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
