/**
 * Onboarding Wizard
 * Multi-step flow: Plan Size → Preferences → Delivery Info → Payment
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2, ChefHat, Truck, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { stripeService, getStripePriceId, getStripe } from '@/services/stripeService';
import { subscriptionPlans } from '@/data/plans';
import Header from '@/components/Header';

// Types
interface OnboardingData {
  email: string;
  zip: string;
  // Plan selection
  mealCount: number;
  planId: string;
  // Preferences
  caloriePreference: string;
  diets: string[];
  allergies: string[];
  // Delivery
  fullName: string;
  streetAddress: string;
  aptSuite: string;
  city: string;
  state: string;
  phone: string;
  textUpdates: boolean;
}

const INITIAL_DATA: OnboardingData = {
  email: '',
  zip: '',
  mealCount: 8,
  planId: 'plus',
  caloriePreference: 'none',
  diets: [],
  allergies: [],
  fullName: '',
  streetAddress: '',
  aptSuite: '',
  city: 'San Francisco',
  state: 'CA',
  phone: '',
  textUpdates: true,
};

// Step components - Simplified flow: Plan → Delivery → Payment
// Preferences are collected AFTER successful payment on the success page
const STEPS = ['plan', 'delivery', 'payment'] as const;
type Step = typeof STEPS[number];

// Meal count options mapped to plans
const MEAL_COUNTS = [
  { count: 4, label: '4 meals', planId: 'access', pricePerMeal: 25 },
  { count: 6, label: '6 meals', planId: 'access', pricePerMeal: 22 },
  { count: 8, label: '8 meals', planId: 'plus', pricePerMeal: 19, popular: true },
  { count: 10, label: '10 meals', planId: 'plus', pricePerMeal: 18 },
  { count: 16, label: '16 meals', planId: 'solodev', pricePerMeal: 16 },
  { count: 20, label: '20 meals', planId: 'hackerhouse', pricePerMeal: 15 },
];

const CALORIE_OPTIONS = [
  { value: 'none', label: 'No Preference' },
  { value: 'low', label: 'Low Calorie (~400-500 cal)' },
  { value: 'medium', label: 'Medium (~500-700 cal)' },
  { value: 'high', label: 'High (~700-900 cal)' },
  { value: 'very-high', label: 'Very High (~900+ cal)' },
];

const DIET_OPTIONS = [
  'Vegetarian',
  'Pescatarian',
  'Gluten Free',
  'Dairy Free',
  'Low Carb',
  'Nut Free',
  'Not Spicy',
  'Keto',
  'Paleo',
];

const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Soy',
  'Wheat',
  'Sesame',
];

// Progress indicator
function ProgressBar({ currentStep }: { currentStep: Step }) {
  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="w-full bg-border/30 h-1 rounded-full overflow-hidden">
      <div
        className="h-full bg-mystical transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Order summary sidebar
function OrderSummary({ data }: { data: OnboardingData }) {
  const mealOption = MEAL_COUNTS.find(m => m.count === data.mealCount) || MEAL_COUNTS[2];
  const plan = subscriptionPlans.find(p => p.id === data.planId);
  const mealsTotal = mealOption.count * mealOption.pricePerMeal;
  const delivery = plan?.deliveryFee ? plan.deliveryFee / 100 : 10;
  const discount = mealOption.count >= 8 ? 15 : 0;
  const total = mealsTotal + delivery - discount;
  const originalTotal = mealsTotal + delivery;

  return (
    <div className="bg-card border border-border/30 rounded-xl p-6 sticky top-24">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="font-display text-lg tracking-wider">Weekly Total</h3>
        <div className="text-right">
          {discount > 0 && (
            <span className="text-muted-foreground line-through mr-2">${originalTotal.toFixed(2)}</span>
          )}
          <span className="font-display text-xl text-mystical">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm border-b border-border/30 pb-4 mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{data.mealCount} meals</span>
          <span>${mealsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span>{delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-500">
            <span>First Order Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check size={16} className="text-green-500" />
          <span>Fully prepared, ready to eat</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check size={16} className="text-green-500" />
          <span>Pause, skip, or cancel anytime</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check size={16} className="text-green-500" />
          <span>Customize your menu each week</span>
        </div>
      </div>
    </div>
  );
}

// Step 1: Plan Selection
function PlanStep({
  data,
  onUpdate,
  onNext,
}: {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl tracking-[0.08em] mb-2">
        Choose your meal plan size
      </h1>
      <p className="font-body text-muted-foreground mb-8">
        Change plan size or add extra meals anytime. Choose your meals after checkout.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {MEAL_COUNTS.map((option) => (
          <button
            key={option.count}
            onClick={() => onUpdate({ mealCount: option.count, planId: option.planId })}
            className={cn(
              'relative p-4 rounded-lg border-2 transition-all text-center',
              data.mealCount === option.count
                ? 'border-mystical bg-mystical/10'
                : 'border-border/50 hover:border-border'
            )}
          >
            {option.popular && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-display tracking-wider bg-mystical text-background px-2 py-0.5 rounded-full">
                POPULAR
              </span>
            )}
            <span className="font-display text-2xl block">{option.count}</span>
            <span className="text-xs text-muted-foreground">meals/week</span>
          </button>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="bg-card border border-border/30 rounded-lg p-4 mb-8">
        {(() => {
          const option = MEAL_COUNTS.find(m => m.count === data.mealCount)!;
          const total = option.count * option.pricePerMeal;
          const discount = option.count >= 8 ? 15 : 0;
          return (
            <>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Price per Meal</span>
                <span className="font-display">${option.pricePerMeal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weekly Total</span>
                <div>
                  {discount > 0 && (
                    <span className="text-muted-foreground line-through mr-2">${total.toFixed(2)}</span>
                  )}
                  <span className="font-display text-lg">${(total - discount).toFixed(2)}</span>
                </div>
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-500 mt-2">First Order Discount Applied</p>
              )}
            </>
          );
        })()}
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="w-full rounded-lg font-display tracking-wider"
      >
        Next: Delivery Info
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

// Step 2: Preferences
function PreferencesStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [allergySearch, setAllergySearch] = useState('');

  const toggleDiet = (diet: string) => {
    const newDiets = data.diets.includes(diet)
      ? data.diets.filter(d => d !== diet)
      : [...data.diets, diet];
    onUpdate({ diets: newDiets });
  };

  const toggleAllergy = (allergy: string) => {
    const newAllergies = data.allergies.includes(allergy)
      ? data.allergies.filter(a => a !== allergy)
      : [...data.allergies, allergy];
    onUpdate({ allergies: newAllergies });
  };

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl tracking-[0.08em] mb-8">
        Tell us your preferences
      </h1>

      {/* Calorie Preference */}
      <div className="mb-8">
        <h2 className="font-display text-lg tracking-wider mb-3">
          Do you have a calorie preference?
        </h2>
        <Select
          value={data.caloriePreference}
          onValueChange={(value) => onUpdate({ caloriePreference: value })}
        >
          <SelectTrigger className="rounded-lg">
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent>
            {CALORIE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Diets */}
      <div className="mb-8">
        <h2 className="font-display text-lg tracking-wider mb-3">
          Do you follow any diets?
        </h2>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((diet) => (
            <button
              key={diet}
              onClick={() => toggleDiet(diet)}
              className={cn(
                'px-4 py-2 rounded-full border text-sm transition-all',
                data.diets.includes(diet)
                  ? 'border-mystical bg-mystical/10 text-mystical'
                  : 'border-border/50 hover:border-border'
              )}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="mb-8">
        <h2 className="font-display text-lg tracking-wider mb-3">
          Do you have any ingredient allergies?
        </h2>
        <Input
          type="text"
          placeholder="Search ingredients..."
          value={allergySearch}
          onChange={(e) => setAllergySearch(e.target.value)}
          className="rounded-lg mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.filter(a =>
            allergySearch ? a.toLowerCase().includes(allergySearch.toLowerCase()) : true
          ).map((allergy) => (
            <button
              key={allergy}
              onClick={() => toggleAllergy(allergy)}
              className={cn(
                'px-3 py-1.5 rounded-full border text-sm transition-all',
                data.allergies.includes(allergy)
                  ? 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-border/50 hover:border-border'
              )}
            >
              {allergy}
            </button>
          ))}
        </div>
        {data.allergies.length > 0 && (
          <p className="text-sm text-muted-foreground mt-3">
            Selected: {data.allergies.join(', ')}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="rounded-lg font-display tracking-wider"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          className="flex-1 rounded-lg font-display tracking-wider"
        >
          Next: Delivery Info
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 3: Delivery Information
function DeliveryStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!data.streetAddress.trim()) newErrors.streetAddress = 'Address is required';
    if (!data.city.trim()) newErrors.city = 'City is required';
    if (!data.state.trim()) newErrors.state = 'State is required';
    if (!data.phone.trim()) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl tracking-[0.08em] mb-8">
        Delivery Information
      </h1>

      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            value={data.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            className={cn('rounded-lg', errors.fullName && 'border-red-500')}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <Input
            type="text"
            placeholder="Street Address"
            value={data.streetAddress}
            onChange={(e) => onUpdate({ streetAddress: e.target.value })}
            className={cn('rounded-lg', errors.streetAddress && 'border-red-500')}
          />
          {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
        </div>

        <Input
          type="text"
          placeholder="Apt/Suite (optional)"
          value={data.aptSuite}
          onChange={(e) => onUpdate({ aptSuite: e.target.value })}
          className="rounded-lg"
        />

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <Input
              type="text"
              placeholder="City"
              value={data.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
              className={cn('rounded-lg', errors.city && 'border-red-500')}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="State"
              value={data.state}
              onChange={(e) => onUpdate({ state: e.target.value })}
              className={cn('rounded-lg', errors.state && 'border-red-500')}
              maxLength={2}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="ZIP"
              value={data.zip}
              onChange={(e) => onUpdate({ zip: e.target.value.replace(/\D/g, '').slice(0, 5) })}
              className="rounded-lg"
              maxLength={5}
              disabled
            />
          </div>
        </div>

        <div>
          <Input
            type="tel"
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className={cn('rounded-lg', errors.phone && 'border-red-500')}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="flex items-start gap-3 py-2">
          <Checkbox
            id="textUpdates"
            checked={data.textUpdates}
            onCheckedChange={(checked) => onUpdate({ textUpdates: !!checked })}
          />
          <div>
            <label htmlFor="textUpdates" className="font-display text-sm tracking-wider cursor-pointer">
              Receive text updates
            </label>
            <p className="text-xs text-muted-foreground">
              Get notified when your delivery is on its way and once it has arrived.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="rounded-lg font-display tracking-wider"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          className="flex-1 rounded-lg font-display tracking-wider"
        >
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 3: Payment
function PaymentStep({
  data,
  onBack,
}: {
  data: OnboardingData;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const priceId = getStripePriceId(data.planId);
      if (!priceId) {
        throw new Error('Invalid plan configuration');
      }

      // Store onboarding data for post-payment processing (preferences will be collected after payment)
      localStorage.setItem('onboarding_data', JSON.stringify(data));

      // Use client-side Stripe checkout (works without backend API)
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe not loaded. Please check your connection and try again.');
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan=${data.planId}&onboarding=true`,
        cancelUrl: `${window.location.origin}/onboarding`,
        customerEmail: data.email,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const mealOption = MEAL_COUNTS.find(m => m.count === data.mealCount)!;
  const plan = subscriptionPlans.find(p => p.id === data.planId);
  const mealsTotal = mealOption.count * mealOption.pricePerMeal;
  const delivery = plan?.deliveryFee ? plan.deliveryFee / 100 : 10;
  const discount = mealOption.count >= 8 ? 15 : 0;
  const total = mealsTotal + delivery - discount;

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl tracking-[0.08em] mb-2">
        Review & Pay
      </h1>
      <p className="font-body text-muted-foreground mb-8">
        Review your order and complete payment to get started.
      </p>

      {/* Order Summary */}
      <div className="bg-card border border-border/30 rounded-xl p-6 mb-6">
        <h2 className="font-display text-lg tracking-wider mb-4">Order Summary</h2>

        <div className="space-y-3 text-sm border-b border-border/30 pb-4 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{data.mealCount} meals × ${mealOption.pricePerMeal}</span>
            <span>${mealsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>{delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>First Order Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between font-display text-lg">
          <span>Total</span>
          <span className="text-mystical">${total.toFixed(2)}/week</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-card border border-border/30 rounded-xl p-6 mb-6">
        <h2 className="font-display text-lg tracking-wider mb-2">Delivery Address</h2>
        <p className="text-sm text-muted-foreground">
          {data.fullName}<br />
          {data.streetAddress}{data.aptSuite && `, ${data.aptSuite}`}<br />
          {data.city}, {data.state} {data.zip}
        </p>
      </div>

      {/* Note about preferences */}
      <div className="bg-mystical/10 border border-mystical/30 rounded-xl p-4 mb-8">
        <p className="font-body text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Note:</span> You'll customize your dietary preferences and meal selections after completing your subscription.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="rounded-lg font-display tracking-wider"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePayment}
          size="lg"
          className="flex-1 rounded-lg font-display tracking-wider bg-mystical hover:bg-mystical/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Complete Order — ${total.toFixed(2)}
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        By completing this order, you agree to our Terms of Service and Privacy Policy.
        You can pause, skip, or cancel anytime.
      </p>
    </div>
  );
}

// Main Onboarding Component
export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('plan');
  const [data, setData] = useState<OnboardingData>(() => {
    // Initialize from location state or localStorage
    const locationState = location.state as { email?: string; zip?: string } | null;
    const savedEmail = localStorage.getItem('onboarding_email');
    const savedZip = localStorage.getItem('onboarding_zip');

    return {
      ...INITIAL_DATA,
      email: locationState?.email || savedEmail || '',
      zip: locationState?.zip || savedZip || '',
    };
  });

  // Redirect if no email/zip
  useEffect(() => {
    if (!data.email || !data.zip) {
      navigate('/');
    }
  }, [data.email, data.zip, navigate]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      goToStep(STEPS[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      goToStep(STEPS[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-24">
        {/* Progress */}
        <div className="container mx-auto px-6 max-w-4xl mb-8">
          <ProgressBar currentStep={currentStep} />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className={currentStep === 'plan' ? 'text-mystical' : ''}>Plan</span>
            <span className={currentStep === 'delivery' ? 'text-mystical' : ''}>Delivery</span>
            <span className={currentStep === 'payment' ? 'text-mystical' : ''}>Payment</span>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-[1fr,320px] gap-8">
            {/* Main content */}
            <div>
              {currentStep === 'plan' && (
                <PlanStep data={data} onUpdate={updateData} onNext={nextStep} />
              )}
              {currentStep === 'delivery' && (
                <DeliveryStep data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 'payment' && (
                <PaymentStep data={data} onBack={prevStep} />
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <OrderSummary data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
