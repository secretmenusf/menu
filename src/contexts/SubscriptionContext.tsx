import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import {
  SubscriptionTier,
  SubscriptionPlan,
  getPlanById,
  canAccessFeature,
  getDeliveryFee,
  getCreditDiscount,
  isInServiceArea,
  DELIVERY_FEE_CENTS,
  subscriptionPlans,
} from '@/data/plans';

// Subscription status
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';

// Week info for menu ordering
export interface WeekInfo {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  label: string;
  isOrderable: boolean; // Can only order NEXT week
}

// User subscription data
export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  creditsRemaining: number; // in cents
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  organizationId?: string;
  createdAt: Date;
}

// Context value type
interface SubscriptionContextType {
  // Subscription data
  subscription: UserSubscription | null;
  plan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;

  // Status checks
  isSubscribed: boolean;
  isActive: boolean;
  tier: SubscriptionTier | null;

  // Access control
  canViewSecretMenu: boolean;
  canOrderDelivery: boolean;
  canCustomizeOrders: boolean;
  canAccessArchives: boolean;
  canAccessSecretSecretMenu: boolean;
  canAccessChefAI: boolean;
  canCookAtHome: boolean;

  // Location checks
  isInServiceArea: (city: string) => boolean;
  serviceArea: string | null;

  // Credits & pricing
  creditsRemaining: number;
  deliveryFee: number;
  creditDiscount: number;

  // Week management
  currentWeek: WeekInfo;
  nextWeek: WeekInfo;
  getWeekInfo: (date: Date) => WeekInfo;
  canOrderForWeek: (week: WeekInfo) => boolean;

  // Actions
  refreshSubscription: () => Promise<void>;
  useCredits: (amountCents: number) => Promise<boolean>;
}

// Helper to get week info from a date
function getWeekInfoFromDate(date: Date): WeekInfo {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Get ISO week number
  const tempDate = new Date(startOfWeek.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const label = `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}`;

  const now = new Date();
  const currentWeekStart = new Date(now);
  const currentDay = currentWeekStart.getDay();
  const currentDiff = currentWeekStart.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
  currentWeekStart.setDate(currentDiff);
  currentWeekStart.setHours(0, 0, 0, 0);

  // Can only order for NEXT week and beyond, not current week
  const isOrderable = startOfWeek.getTime() > currentWeekStart.getTime();

  return {
    weekNumber,
    year: startOfWeek.getFullYear(),
    startDate: startOfWeek,
    endDate: endOfWeek,
    label,
    isOrderable,
  };
}

// Get current week info
function getCurrentWeek(): WeekInfo {
  return getWeekInfoFromDate(new Date());
}

// Get next week info
function getNextWeek(): WeekInfo {
  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  return getWeekInfoFromDate(nextWeekDate);
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [serviceArea, setServiceArea] = useState<string | null>(null);

  // Fetch user subscription
  const {
    data: subscription,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async (): Promise<UserSubscription | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing', 'paused'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        throw new Error(error.message);
      }

      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        tier: (data.tier as SubscriptionTier) || 'member',
        status: data.status as SubscriptionStatus,
        creditsRemaining: data.credits_remaining_cents || 0,
        currentPeriodStart: new Date(data.current_period_start || data.created_at),
        currentPeriodEnd: new Date(data.current_period_end || data.created_at),
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        stripeSubscriptionId: data.stripe_subscription_id || undefined,
        organizationId: data.organization_id || undefined,
        createdAt: new Date(data.created_at),
      };
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
  });

  // Get user's service area from their address
  useEffect(() => {
    async function fetchUserAddress() {
      if (!user?.id) {
        setServiceArea(null);
        return;
      }

      const { data } = await supabase
        .from('addresses')
        .select('city')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();

      if (data?.city) {
        setServiceArea(data.city);
      }
    }
    fetchUserAddress();
  }, [user?.id]);

  // Use credits with optimistic concurrency control to prevent race conditions
  const useCredits = useCallback(async (amountCents: number): Promise<boolean> => {
    const MAX_RETRIES = 3;

    if (!subscription) {
      return false;
    }

    // Retry loop to handle race conditions
    for (let retryCount = 0; retryCount <= MAX_RETRIES; retryCount++) {
      // First, fetch the current balance to ensure we have the latest value
      const { data: currentSub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('credits_remaining_cents')
        .eq('id', subscription.id)
        .single();

      if (fetchError || !currentSub) {
        console.error('Error fetching current credits:', fetchError);
        return false;
      }

      const currentCredits = currentSub.credits_remaining_cents || 0;

      // Check if we have enough credits
      if (currentCredits < amountCents) {
        await refetch(); // Update local state with actual balance
        return false;
      }

      // Update with optimistic concurrency - only update if credits haven't changed
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          credits_remaining_cents: currentCredits - amountCents,
        })
        .eq('id', subscription.id)
        .eq('credits_remaining_cents', currentCredits) // Optimistic lock
        .select('credits_remaining_cents');

      if (error) {
        console.error('Error using credits:', error);
        await refetch();
        return false;
      }

      // If rows updated, success!
      if (data && data.length > 0) {
        await refetch();
        return true;
      }

      // No rows updated - race condition detected
      if (retryCount < MAX_RETRIES) {
        console.warn(`Credit update race condition detected - retry ${retryCount + 1}/${MAX_RETRIES}`);
        await refetch();
        // Continue to next iteration
      }
    }

    // Max retries exceeded
    console.error('Max retries exceeded for credit update');
    await refetch();
    return false;
  }, [subscription, refetch]);

  // Computed values
  const plan = subscription?.tier ? getPlanById(subscription.tier) : null;
  const isSubscribed = !!subscription && subscription.status !== 'cancelled';
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const tier = subscription?.tier || null;

  // Access control based on tier
  const canViewSecretMenu = tier ? canAccessFeature(tier, 'canViewSecretMenu') : false;
  const canOrderDelivery = tier ? canAccessFeature(tier, 'canOrderDelivery') : false;
  const canCustomizeOrders = tier ? canAccessFeature(tier, 'canCustomizeOrders') : false;
  const canAccessArchives = tier ? canAccessFeature(tier, 'canAccessArchives') : false;
  const canAccessSecretSecretMenu = tier ? canAccessFeature(tier, 'canAccessSecretSecretMenu') : false;
  const canAccessChefAI = tier ? canAccessFeature(tier, 'canAccessChefAI') : false;
  const canCookAtHome = tier ? canAccessFeature(tier, 'canCookAtHome') : false;

  // Pricing
  const creditsRemaining = subscription?.creditsRemaining || 0;
  const deliveryFee = getDeliveryFee(tier);
  const creditDiscount = getCreditDiscount(tier);

  // Week management
  const currentWeek = getCurrentWeek();
  const nextWeek = getNextWeek();

  const canOrderForWeek = useCallback((week: WeekInfo): boolean => {
    if (!canOrderDelivery) return false;
    if (!isActive) return false;
    return week.isOrderable;
  }, [canOrderDelivery, isActive]);

  const refreshSubscription = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const value: SubscriptionContextType = {
    subscription,
    plan,
    isLoading,
    error: queryError?.message || null,

    isSubscribed,
    isActive,
    tier,

    canViewSecretMenu,
    canOrderDelivery,
    canCustomizeOrders,
    canAccessArchives,
    canAccessSecretSecretMenu,
    canAccessChefAI,
    canCookAtHome,

    isInServiceArea,
    serviceArea,

    creditsRemaining,
    deliveryFee,
    creditDiscount,

    currentWeek,
    nextWeek,
    getWeekInfo: getWeekInfoFromDate,
    canOrderForWeek,

    refreshSubscription,
    useCredits,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}

// Alias for convenience
export const useSubscriptionTier = useSubscriptionContext;
