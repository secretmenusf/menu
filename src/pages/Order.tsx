import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { subscriptionPlans, type SubscriptionPlan } from '@/data/plans';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Plus, Minus, MessageCircle, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MealSelection {
  dayId: string;
  mealType: 'lunch' | 'dinner';
  mealName: string;
  tier: 'regular' | 'premium';
  quantity: number;
}

interface UpsellSelection {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
}

const upsellItems = [
  { id: 'sourdough', name: 'Homemade Sourdough', description: 'Kansas City starter, baked fresh', price: 20 },
  { id: 'chilicrunch', name: 'Chili Crunch', description: 'House-made spicy condiment', price: 18 },
  { id: 'hummus-redpepper', name: 'Roasted Red Bell Pepper Hummus', description: 'Pint size', price: 35, variant: 'roasted red bell pepper' },
  { id: 'hummus-lemon', name: 'Lemony Hummus', description: 'Pint size', price: 35, variant: 'lemony' },
  { id: 'hummus-beet', name: 'Beetroot Hummus', description: 'Pint size', price: 35, variant: 'beetroot' },
];

const Order = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isConnected } = useAccount();
  const { toast } = useToast();

  // Get plan from URL params or default to standard
  const initialPlanId = searchParams.get('plan') || 'standard';
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    subscriptionPlans.find(p => p.id === initialPlanId) || subscriptionPlans[1]
  );

  const [selections, setSelections] = useState<MealSelection[]>([]);
  const [upsells, setUpsells] = useState<UpsellSelection[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [deliveryTime, setDeliveryTime] = useState('18:00');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const updateUpsell = (id: string, name: string, price: number, delta: number, variant?: string) => {
    setUpsells(prev => {
      const existingIndex = prev.findIndex(u => u.id === id);
      if (existingIndex >= 0) {
        const newUpsells = [...prev];
        const newQty = newUpsells[existingIndex].quantity + delta;
        if (newQty <= 0) {
          newUpsells.splice(existingIndex, 1);
        } else {
          newUpsells[existingIndex] = { ...newUpsells[existingIndex], quantity: newQty };
        }
        return newUpsells;
      } else if (delta > 0) {
        return [...prev, { id, name, variant, price, quantity: delta }];
      }
      return prev;
    });
  };

  const getUpsellQuantity = (id: string) => {
    return upsells.find(u => u.id === id)?.quantity || 0;
  };

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

  const { regularMeals, premiumMeals, upsellTotal, totalUsd } = useMemo(() => {
    let regular = 0;
    let premium = 0;
    selections.forEach(s => {
      if (s.tier === 'regular') regular += s.quantity;
      else premium += s.quantity;
    });
    const upsellSum = upsells.reduce((sum, u) => sum + (u.price * u.quantity), 0);
    return {
      regularMeals: regular,
      premiumMeals: premium,
      upsellTotal: upsellSum,
      totalUsd: regular * PAYMENT_CONFIG.regularMealPrice + premium * PAYMENT_CONFIG.premiumMealPrice + upsellSum
    };
  }, [selections, upsells]);

  const isMinimumMet = totalUsd >= selectedPlan.price;
  const amountRemaining = Math.max(0, selectedPlan.price - totalUsd);
  const progressPercent = Math.min(100, (totalUsd / selectedPlan.price) * 100);

  const buildWhatsAppMessage = () => {
    const lines = ['🍽️ *SECRET MENU ORDER*\n'];
    lines.push(`*Plan:* ${selectedPlan.name} ($${selectedPlan.price}/mo)\n`);

    if (selections.length > 0) {
      lines.push('*MEALS:*');
      selections.forEach(s => {
        lines.push(`• Day ${s.dayId} ${s.mealType}: ${s.mealName} (${s.tier}) x${s.quantity}`);
      });
    }
    
    if (upsells.length > 0) {
      lines.push('\n*EXTRAS:*');
      upsells.forEach(u => {
        lines.push(`• ${u.name} x${u.quantity} - $${u.price * u.quantity}`);
      });
    }
    
    lines.push(`\n💰 *Total: $${totalUsd}*`);
    if (regularMeals > 0) lines.push(`Regular meals: ${regularMeals} × $${PAYMENT_CONFIG.regularMealPrice}`);
    if (premiumMeals > 0) lines.push(`Premium meals: ${premiumMeals} × $${PAYMENT_CONFIG.premiumMealPrice}`);
    if (upsellTotal > 0) lines.push(`Extras: $${upsellTotal}`);
    
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
        description: `Please add $${amountRemaining} more to meet the ${selectedPlan.name} plan minimum of $${selectedPlan.price}`,
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
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
              PLACE YOUR ORDER
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Select your plan, then choose your meals
            </p>
          </div>

          {/* Plan Selector */}
          <div className="mb-12">
            <p className="font-display text-xs tracking-[0.3em] text-muted-foreground text-center mb-6">
              SELECT YOUR PLAN
            </p>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {subscriptionPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative p-5 border rounded-lg transition-all duration-300 ${
                    selectedPlan.id === plan.id
                      ? 'border-foreground bg-foreground/10 scale-[1.02]'
                      : plan.popular
                      ? 'border-foreground/30 bg-card/50 hover:border-foreground/50'
                      : 'border-border/30 bg-card/30 hover:border-border/50'
                  }`}
                >
                  {plan.popular && selectedPlan.id !== plan.id && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-0.5 text-[9px] font-display tracking-[0.2em] bg-foreground text-background rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}
                  {selectedPlan.id === plan.id && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-0.5 text-[9px] font-display tracking-[0.2em] bg-foreground text-background rounded-full flex items-center gap-1">
                        <Check size={10} />
                        SELECTED
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h4 className="font-display text-sm tracking-[0.15em] text-foreground mb-1">
                      {plan.name.toUpperCase()}
                    </h4>
                    <p className="font-display text-2xl text-mystical mb-1">
                      ${plan.price}
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </p>
                    <p className="font-body text-xs text-muted-foreground/60">
                      {plan.mealsPerWeek} meals/week
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress toward minimum */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-display text-xs tracking-wider text-muted-foreground">
                ORDER PROGRESS
              </span>
              <span className="font-display text-xs tracking-wider">
                ${totalUsd} / ${selectedPlan.price}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isMinimumMet ? 'bg-green-500' : 'bg-foreground/50'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {!isMinimumMet && totalUsd > 0 && (
              <p className="text-center mt-2 text-sm text-muted-foreground">
                Add <span className="text-foreground font-semibold">${amountRemaining}</span> more to meet {selectedPlan.name} minimum
              </p>
            )}
            {isMinimumMet && (
              <p className="text-center mt-2 text-sm text-green-500 flex items-center justify-center gap-1">
                <Check size={14} />
                {selectedPlan.name} minimum met!
              </p>
            )}
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

              {/* Extras / Upsells Section */}
              <div className="border border-border/30 rounded-lg p-6 bg-card/30">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-display text-xl tracking-[0.2em] text-mystical">EXTRAS</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>
                
                <div className="space-y-4">
                  {upsellItems.map((item) => (
                    <div key={item.id} className="py-3 border-b border-border/20 last:border-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-body text-foreground">{item.name}</p>
                          <p className="font-body text-sm text-muted-foreground italic">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-display tracking-wider">${item.price}</span>
                          <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-1">
                            <button
                              onClick={() => updateUpsell(item.id, item.name, item.price, -1, item.variant)}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              disabled={getUpsellQuantity(item.id) === 0}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm font-display">{getUpsellQuantity(item.id)}</span>
                            <button
                              onClick={() => updateUpsell(item.id, item.name, item.price, 1, item.variant)}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="font-body text-sm text-muted-foreground mt-6 italic">
                  Tea, coffee, and other beverages available upon request.
                </p>
              </div>

              {/* WhatsApp Note */}
              <div className="text-center py-6">
                <p className="font-body text-sm text-muted-foreground">
                  Questions or secret menu items not listed?{' '}
                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline inline-flex items-center gap-1"
                  >
                    <MessageCircle size={14} />
                    Contact us on WhatsApp
                  </a>
                </p>
              </div>
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
                  {upsellTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Extras</span>
                      <span>${upsellTotal}</span>
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
                    <span>Add ${amountRemaining} more for {selectedPlan.name}</span>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={!isMinimumMet || (selections.length === 0 && upsells.length === 0)}
                  className="w-full font-display tracking-wider mb-3"
                >
                  {isMinimumMet ? `CHECKOUT $${totalUsd}` : `ADD $${amountRemaining} MORE`}
                </Button>

                {/* WhatsApp confirmation */}
                {(selections.length > 0 || upsells.length > 0) && (
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
