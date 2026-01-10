import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WHATSAPP_NUMBER } from '@/lib/menuData';
import { PAYMENT_CONFIG } from '@/lib/wagmi';
import { subscriptionPlans, type SubscriptionPlan } from '@/data/plans';
import { allMenus, dietaryInfo, type WeekMenu, type DayMenu, type MenuItem } from '@/data/menus';
import { format } from 'date-fns';
import { Plus, Minus, MessageCircle, AlertCircle, Check, Shuffle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Extra meal price (beyond plan max)
const EXTRA_MEAL_PRICE = 50;

interface MealSelection {
  weekId: string;
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

const DietaryTag = ({ tag }: { tag: 'gf' | 'df' | 'v' | 'vg' }) => {
  const info = dietaryInfo[tag];
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-display tracking-wider border border-border/50 rounded-full text-muted-foreground"
      title={info.label}
    >
      {info.icon}
    </span>
  );
};

const Order = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isConnected } = useAccount();
  const { toast } = useToast();

  // Get week from URL params or default to first available
  const initialWeekId = searchParams.get('week');
  const initialWeekIndex = initialWeekId
    ? allMenus.findIndex(m => m.id === initialWeekId)
    : 0;

  // Get plan from URL params or default to standard
  const initialPlanId = searchParams.get('plan') || 'standard';

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(Math.max(0, initialWeekIndex));
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    subscriptionPlans.find(p => p.id === initialPlanId) || subscriptionPlans[1]
  );

  const [selections, setSelections] = useState<MealSelection[]>([]);
  const [upsells, setUpsells] = useState<UpsellSelection[]>([]);
  const [deliveryTime, setDeliveryTime] = useState('18:00');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const currentMenu = allMenus[selectedWeekIndex];

  // Generate random selections for a given week and meal count
  const generateRandomSelections = useCallback((menu: WeekMenu, mealCount: number): MealSelection[] => {
    const newSelections: MealSelection[] = [];
    const availableMeals: { day: DayMenu; meal: MenuItem; type: 'lunch' | 'dinner' }[] = [];

    menu.days.forEach(day => {
      availableMeals.push({ day, meal: day.lunch, type: 'lunch' });
      day.dinner.forEach(dinnerItem => {
        availableMeals.push({ day, meal: dinnerItem, type: 'dinner' });
      });
    });

    const shuffled = [...availableMeals].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(mealCount, shuffled.length));

    selected.forEach(({ day, meal, type }) => {
      newSelections.push({
        weekId: menu.id,
        dayId: day.day,
        mealType: type,
        mealName: meal.name,
        tier: 'regular',
        quantity: 1
      });
    });

    return newSelections;
  }, []);

  // Auto-fill when week changes
  const handleWeekChange = useCallback((newIndex: number) => {
    setSelectedWeekIndex(newIndex);
    const newMenu = allMenus[newIndex];
    const newSelections = generateRandomSelections(newMenu, selectedPlan.mealsPerWeek);
    setSelections(newSelections);
    toast({
      title: `${newMenu.theme}`,
      description: `Auto-selected ${newSelections.length} meals for you`,
    });
  }, [selectedPlan.mealsPerWeek, generateRandomSelections, toast]);

  // Auto-upgrade plan based on meal count
  const autoUpgradePlan = useCallback((totalMeals: number) => {
    // Find the appropriate plan for the meal count
    const sortedPlans = [...subscriptionPlans].sort((a, b) => a.mealsPerWeek - b.mealsPerWeek);

    for (const plan of sortedPlans) {
      if (totalMeals <= plan.mealsPerWeek) {
        if (plan.id !== selectedPlan.id) {
          setSelectedPlan(plan);
          toast({
            title: `Upgraded to ${plan.name}`,
            description: `Your selections fit the ${plan.name} plan (${plan.mealsPerWeek} meals/week)`,
          });
        }
        return;
      }
    }

    // If exceeds all plans, stay on Premium (extras will be charged separately)
    const maxPlan = sortedPlans[sortedPlans.length - 1];
    if (selectedPlan.id !== maxPlan.id) {
      setSelectedPlan(maxPlan);
    }
  }, [selectedPlan.id, toast]);

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
    weekId: string,
    dayId: string,
    mealType: 'lunch' | 'dinner',
    mealName: string,
    tier: 'regular' | 'premium',
    delta: number
  ) => {
    setSelections(prev => {
      const existingIndex = prev.findIndex(
        s => s.weekId === weekId && s.dayId === dayId && s.mealType === mealType && s.mealName === mealName && s.tier === tier
      );

      let newSelections: MealSelection[];
      if (existingIndex >= 0) {
        newSelections = [...prev];
        const newQty = newSelections[existingIndex].quantity + delta;
        if (newQty <= 0) {
          newSelections.splice(existingIndex, 1);
        } else {
          newSelections[existingIndex] = { ...newSelections[existingIndex], quantity: newQty };
        }
      } else if (delta > 0) {
        newSelections = [...prev, { weekId, dayId, mealType, mealName, tier, quantity: delta }];
      } else {
        return prev;
      }

      // Calculate new total meals and auto-upgrade plan if needed
      const newTotalMeals = newSelections.reduce((sum, s) => sum + s.quantity, 0);
      if (delta > 0) {
        autoUpgradePlan(newTotalMeals);
      }

      return newSelections;
    });
  };

  const getQuantity = (weekId: string, dayId: string, mealType: 'lunch' | 'dinner', mealName: string, tier: 'regular' | 'premium') => {
    const selection = selections.find(
      s => s.weekId === weekId && s.dayId === dayId && s.mealType === mealType && s.mealName === mealName && s.tier === tier
    );
    return selection?.quantity || 0;
  };

  // Random fill function
  const randomFill = () => {
    const mealsNeeded = selectedPlan.mealsPerWeek;
    const newSelections: MealSelection[] = [];

    // Get all available meals for the current week
    const availableMeals: { day: DayMenu; meal: MenuItem; type: 'lunch' | 'dinner' }[] = [];
    currentMenu.days.forEach(day => {
      availableMeals.push({ day, meal: day.lunch, type: 'lunch' });
      day.dinner.forEach(dinnerItem => {
        availableMeals.push({ day, meal: dinnerItem, type: 'dinner' });
      });
    });

    // Shuffle and pick random meals
    const shuffled = [...availableMeals].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(mealsNeeded, shuffled.length));

    selected.forEach(({ day, meal, type }) => {
      newSelections.push({
        weekId: currentMenu.id,
        dayId: day.day,
        mealType: type,
        mealName: meal.name,
        tier: 'regular',
        quantity: 1
      });
    });

    setSelections(newSelections);
    toast({
      title: "Random selection made",
      description: `Selected ${selected.length} meals for ${currentMenu.theme}`,
    });
  };

  const clearSelections = () => {
    setSelections([]);
    setUpsells([]);
  };

  // Auto-fill on initial load
  useEffect(() => {
    if (selections.length === 0) {
      const initialSelections = generateRandomSelections(currentMenu, selectedPlan.mealsPerWeek);
      setSelections(initialSelections);
    }
  }, []); // Only on mount

  const { regularMeals, premiumMeals, totalMeals, extraMeals, upsellTotal, mealsCost, extrasCost, totalUsd } = useMemo(() => {
    let regular = 0;
    let premium = 0;
    selections.forEach(s => {
      if (s.tier === 'regular') regular += s.quantity;
      else premium += s.quantity;
    });
    const total = regular + premium;
    const upsellSum = upsells.reduce((sum, u) => sum + (u.price * u.quantity), 0);

    // Calculate extras beyond max plan
    const maxPlan = subscriptionPlans[subscriptionPlans.length - 1]; // Premium
    const extrasCount = Math.max(0, total - maxPlan.mealsPerWeek);
    const extrasCostValue = extrasCount * EXTRA_MEAL_PRICE;

    // Meals cost is plan price + extras
    const mealsBase = regular * PAYMENT_CONFIG.regularMealPrice + premium * PAYMENT_CONFIG.premiumMealPrice;

    return {
      regularMeals: regular,
      premiumMeals: premium,
      totalMeals: total,
      extraMeals: extrasCount,
      upsellTotal: upsellSum,
      mealsCost: mealsBase,
      extrasCost: extrasCostValue,
      totalUsd: selectedPlan.price + extrasCostValue + upsellSum
    };
  }, [selections, upsells, selectedPlan.price]);

  const isMinimumMet = totalMeals >= selectedPlan.mealsPerWeek;
  const mealsRemaining = Math.max(0, selectedPlan.mealsPerWeek - totalMeals);
  const progressPercent = Math.min(100, (totalMeals / selectedPlan.mealsPerWeek) * 100);

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const buildWhatsAppMessage = () => {
    const lines = ['*SECRET MENU ORDER*\n'];
    lines.push(`*Plan:* ${selectedPlan.name} ($${selectedPlan.price}/mo)`);
    lines.push(`*Week:* ${currentMenu.theme} (${formatDateRange(currentMenu.startDate, currentMenu.endDate)})\n`);

    if (selections.length > 0) {
      lines.push('*MEALS:*');
      selections.forEach(s => {
        lines.push(`• ${s.dayId} ${s.mealType}: ${s.mealName} (${s.tier}) x${s.quantity}`);
      });
    }

    if (upsells.length > 0) {
      lines.push('\n*EXTRAS:*');
      upsells.forEach(u => {
        lines.push(`• ${u.name} x${u.quantity} - $${u.price * u.quantity}`);
      });
    }

    lines.push(`\n*Total: $${totalUsd}*`);
    if (regularMeals > 0) lines.push(`Regular meals: ${regularMeals} × $${PAYMENT_CONFIG.regularMealPrice}`);
    if (premiumMeals > 0) lines.push(`Premium meals: ${premiumMeals} × $${PAYMENT_CONFIG.premiumMealPrice}`);
    if (upsellTotal > 0) lines.push(`Extras: $${upsellTotal}`);

    lines.push(`\n*Preferred Time:* ${deliveryTime}`);
    if (deliveryAddress) {
      lines.push(`*Address:* ${deliveryAddress}`);
    }
    if (deliveryNotes) {
      lines.push(`*Notes:* ${deliveryNotes}`);
    }

    return encodeURIComponent(lines.join('\n'));
  };

  const handleCheckout = () => {
    if (!isMinimumMet) {
      toast({
        title: "Select more meals",
        description: `Add ${mealsRemaining} more meal${mealsRemaining > 1 ? 's' : ''} to complete your ${selectedPlan.name} plan`,
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
              BUILD YOUR MENU
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Select your plan, pick a week, choose your meals
            </p>
          </div>

          {/* Plan Selector */}
          <div className="mb-8">
            <p className="font-display text-xs tracking-[0.3em] text-muted-foreground text-center mb-4">
              1. SELECT YOUR PLAN
            </p>
            <div className="grid md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {subscriptionPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={cn(
                    "relative p-4 border rounded-2xl transition-all duration-300",
                    selectedPlan.id === plan.id
                      ? 'border-foreground bg-foreground/5 scale-[1.02]'
                      : 'border-border/30 bg-card/30 hover:border-border/50'
                  )}
                >
                  {selectedPlan.id === plan.id && (
                    <div className="absolute -top-2 right-3">
                      <Check size={16} className="text-foreground" />
                    </div>
                  )}
                  <div className="text-center">
                    <h4 className="font-display text-xs tracking-[0.15em] text-foreground mb-1">
                      {plan.name.toUpperCase()}
                    </h4>
                    <p className="font-display text-xl text-mystical">
                      ${plan.price}
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </p>
                    <p className="font-body text-xs text-muted-foreground/60">
                      {plan.mealsPerWeek} meals/week
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Week Selector */}
          <div className="mb-8">
            <p className="font-display text-xs tracking-[0.3em] text-muted-foreground text-center mb-4">
              2. SELECT YOUR WEEK
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={() => handleWeekChange(Math.max(0, selectedWeekIndex - 1))}
                disabled={selectedWeekIndex === 0}
                className="p-2 rounded-full border border-border/50 hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-center min-w-[200px]">
                <p className="font-display text-lg tracking-wider text-foreground">
                  {currentMenu.theme?.toUpperCase()}
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  {formatDateRange(currentMenu.startDate, currentMenu.endDate)}
                </p>
              </div>

              <button
                onClick={() => handleWeekChange(Math.min(allMenus.length - 1, selectedWeekIndex + 1))}
                disabled={selectedWeekIndex === allMenus.length - 1}
                className="p-2 rounded-full border border-border/50 hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Quick week buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {allMenus.slice(0, 6).map((week, idx) => (
                <button
                  key={week.id}
                  onClick={() => handleWeekChange(idx)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs font-display tracking-wider transition-all",
                    idx === selectedWeekIndex
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border/50 hover:border-foreground/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {format(new Date(week.startDate), 'MMM d')}
                </button>
              ))}
            </div>
          </div>

          {/* Progress toward minimum */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-display text-xs tracking-wider text-muted-foreground">
                MEALS SELECTED
              </span>
              <span className="font-display text-xs tracking-wider">
                {totalMeals} / {selectedPlan.mealsPerWeek} meals
                {extraMeals > 0 && <span className="text-muted-foreground ml-1">(+{extraMeals} extra)</span>}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  extraMeals > 0 ? 'bg-amber-500' : isMinimumMet ? 'bg-green-500' : 'bg-foreground/50'
                )}
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
            {!isMinimumMet && (
              <p className="text-center mt-2 text-sm text-muted-foreground">
                Select <span className="text-foreground font-semibold">{mealsRemaining}</span> more meal{mealsRemaining > 1 ? 's' : ''} for {selectedPlan.name}
              </p>
            )}
            {isMinimumMet && extraMeals === 0 && (
              <p className="text-center mt-2 text-sm text-green-500 flex items-center justify-center gap-1">
                <Check size={14} />
                {selectedPlan.name} complete!
              </p>
            )}
            {extraMeals > 0 && (
              <p className="text-center mt-2 text-sm text-amber-500 flex items-center justify-center gap-1">
                <Sparkles size={14} />
                {extraMeals} extra meal{extraMeals > 1 ? 's' : ''} (+${extrasCost})
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-3 mb-8">
            <Button
              variant="outline"
              onClick={randomFill}
              className="font-display text-xs tracking-wider"
            >
              <Shuffle size={14} className="mr-2" />
              RANDOM FILL ({selectedPlan.mealsPerWeek} MEALS)
            </Button>
            {selections.length > 0 && (
              <Button
                variant="ghost"
                onClick={clearSelections}
                className="font-display text-xs tracking-wider text-muted-foreground"
              >
                CLEAR ALL
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Menu Selection */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-sm tracking-[0.15em] text-muted-foreground">3. SELECT MEALS</h2>

              {currentMenu.days.map((day) => (
                <div key={day.day} className="border border-border/30 rounded-2xl p-6 bg-card/30">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-display text-lg tracking-[0.2em] text-mystical">{day.day}</span>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>

                  {/* Lunch */}
                  <div className="mb-4">
                    <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-3">LUNCH</h4>
                    <MealRow
                      item={day.lunch}
                      weekId={currentMenu.id}
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
                        item={item}
                        weekId={currentMenu.id}
                        dayId={day.day}
                        mealType="dinner"
                        getQuantity={getQuantity}
                        updateSelection={updateSelection}
                      />
                    ))}
                  </div>

                  {/* Dessert */}
                  {day.dessert && (
                    <div className="mt-4 pt-4 border-t border-border/20">
                      <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-3">DESSERT</h4>
                      <MealRow
                        item={day.dessert}
                        weekId={currentMenu.id}
                        dayId={day.day}
                        mealType="dinner"
                        getQuantity={getQuantity}
                        updateSelection={updateSelection}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Extras / Upsells Section */}
              <div className="border border-border/30 rounded-2xl p-6 bg-card/30">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-display text-lg tracking-[0.2em] text-mystical">EXTRAS</span>
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
              </div>

              {/* WhatsApp Note */}
              <div className="text-center py-6">
                <p className="font-body text-sm text-muted-foreground">
                  Questions or custom requests?{' '}
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
              <div className="border border-border/30 rounded-2xl p-6 bg-card/30 sticky top-24">
                <h3 className="font-display text-sm tracking-[0.15em] text-foreground mb-4">DELIVERY DETAILS</h3>

                {/* Week info */}
                <div className="mb-4 p-3 bg-secondary/30 rounded-xl">
                  <p className="font-display text-xs tracking-wider text-muted-foreground mb-1">DELIVERY WEEK</p>
                  <p className="font-body text-sm text-foreground">{currentMenu.theme}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {formatDateRange(currentMenu.startDate, currentMenu.endDate)}
                  </p>
                </div>

                {/* Time */}
                <div className="space-y-2 mb-4">
                  <Label className="font-display text-xs tracking-wider">PREFERRED TIME</Label>
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
                    className="bg-transparent resize-none rounded-xl"
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
                    className="bg-transparent resize-none rounded-xl"
                    rows={2}
                  />
                </div>

                {/* Order Summary */}
                <div className="border-t border-border/50 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{selectedPlan.name} Plan ({totalMeals} meals)</span>
                    <span>${selectedPlan.price}</span>
                  </div>
                  {extraMeals > 0 && (
                    <div className="flex justify-between text-sm text-amber-500">
                      <span>{extraMeals} extra meal{extraMeals > 1 ? 's' : ''} × ${EXTRA_MEAL_PRICE}</span>
                      <span>+${extrasCost}</span>
                    </div>
                  )}
                  {upsellTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Add-ons</span>
                      <span>${upsellTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display tracking-wider pt-2 border-t border-border/30">
                    <span>TOTAL</span>
                    <span>${totalUsd}</span>
                  </div>
                </div>

                {!isMinimumMet && (
                  <div className="flex items-center gap-2 text-destructive text-xs mb-4">
                    <AlertCircle size={14} />
                    <span>Select {mealsRemaining} more meal{mealsRemaining > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={!isMinimumMet || selections.length === 0}
                  className="w-full font-display tracking-wider mb-3"
                >
                  {isMinimumMet ? `CHECKOUT $${totalUsd}` : `SELECT ${mealsRemaining} MORE`}
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
  item: MenuItem;
  weekId: string;
  dayId: string;
  mealType: 'lunch' | 'dinner';
  getQuantity: (weekId: string, dayId: string, mealType: 'lunch' | 'dinner', mealName: string, tier: 'regular' | 'premium') => number;
  updateSelection: (weekId: string, dayId: string, mealType: 'lunch' | 'dinner', mealName: string, tier: 'regular' | 'premium', delta: number) => void;
}

const MealRow = ({ item, weekId, dayId, mealType, getQuantity, updateSelection }: MealRowProps) => {
  const regularQty = getQuantity(weekId, dayId, mealType, item.name, 'regular');
  const premiumQty = getQuantity(weekId, dayId, mealType, item.name, 'premium');

  return (
    <div className="py-3 border-b border-border/20 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-body text-foreground">{item.name}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex gap-1">
                {item.tags.map(tag => (
                  <DietaryTag key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
          {item.description && (
            <p className="font-body text-sm text-muted-foreground italic">{item.description}</p>
          )}
        </div>

        <div className="flex gap-4">
          {/* Regular */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-display tracking-wider">$50</span>
            <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-1">
              <button
                onClick={() => updateSelection(weekId, dayId, mealType, item.name, 'regular', -1)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                disabled={regularQty === 0}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-display">{regularQty}</span>
              <button
                onClick={() => updateSelection(weekId, dayId, mealType, item.name, 'regular', 1)}
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
                onClick={() => updateSelection(weekId, dayId, mealType, item.name, 'premium', -1)}
                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                disabled={premiumQty === 0}
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-display">{premiumQty}</span>
              <button
                onClick={() => updateSelection(weekId, dayId, mealType, item.name, 'premium', 1)}
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
