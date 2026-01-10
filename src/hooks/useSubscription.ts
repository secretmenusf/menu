import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Type aliases
type DbSubscription = Tables<'subscriptions'>;
type DbSubscriptionInsert = TablesInsert<'subscriptions'>;
type DbSubscriptionUpdate = TablesUpdate<'subscriptions'>;

// Subscription status
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due';

// Subscription plan types
export type SubscriptionPlan = 'weekly' | 'monthly';

// Application subscription type
export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  paymentMethod: 'stripe' | 'crypto';
  stripeSubscriptionId?: string;
  walletAddress?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelledAt?: Date;
  createdAt: Date;
}

// Plan pricing (in cents)
export const SUBSCRIPTION_PLANS = {
  weekly: {
    id: 'weekly',
    name: 'Weekly Plan',
    description: '5 days of curated meals',
    priceCents: 10000, // $100/week
    interval: 'week' as const,
    features: [
      '5 lunches per week',
      '5 dinners per week',
      'Rotating seasonal menu',
      'Free delivery in SF',
    ],
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    description: 'Best value for regulars',
    priceCents: 39500, // $395/month
    interval: 'month' as const,
    features: [
      '20 lunches per month',
      '20 dinners per month',
      'Priority menu customization',
      'Free delivery in SF',
      'Save $5/week',
    ],
  },
} as const;

// Map database subscription to application type
function mapDbSubscription(db: DbSubscription): Subscription {
  return {
    id: db.id,
    userId: db.user_id,
    status: db.status as SubscriptionStatus,
    plan: 'weekly', // Default, would come from metadata
    paymentMethod: db.payment_method as 'stripe' | 'crypto',
    stripeSubscriptionId: db.stripe_subscription_id || undefined,
    walletAddress: db.wallet_address || undefined,
    cancelledAt: db.cancelled_at ? new Date(db.cancelled_at) : undefined,
    createdAt: new Date(db.created_at),
  };
}

interface UseSubscriptionOptions {
  userId?: string;
}

export function useSubscription({ userId }: UseSubscriptionOptions = {}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch current subscription
  const {
    data: subscription,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['subscription', userId],
    queryFn: async (): Promise<Subscription | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data ? mapDbSubscription(data) : null;
    },
    enabled: !!userId,
  });

  // Fetch subscription history
  const {
    data: subscriptionHistory = [],
    isLoading: isLoadingHistory,
  } = useQuery({
    queryKey: ['subscription-history', userId],
    queryFn: async (): Promise<Subscription[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(mapDbSubscription);
    },
    enabled: !!userId,
  });

  // Create subscription
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({
      userId,
      plan,
      paymentMethod,
      stripeSubscriptionId,
      walletAddress,
    }: {
      userId: string;
      plan: SubscriptionPlan;
      paymentMethod: 'stripe' | 'crypto';
      stripeSubscriptionId?: string;
      walletAddress?: string;
    }): Promise<Subscription> => {
      const insert: DbSubscriptionInsert = {
        user_id: userId,
        status: 'active',
        payment_method: paymentMethod,
        stripe_subscription_id: stripeSubscriptionId || null,
        wallet_address: walletAddress || null,
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(insert)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbSubscription(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
      queryClient.invalidateQueries({ queryKey: ['subscription-history', userId] });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Update subscription
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({
      subscriptionId,
      updates,
    }: {
      subscriptionId: string;
      updates: DbSubscriptionUpdate;
    }): Promise<Subscription> => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return mapDbSubscription(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
      queryClient.invalidateQueries({ queryKey: ['subscription-history', userId] });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Pause subscription
  const pauseSubscription = useCallback(async () => {
    if (!subscription) {
      setError('No active subscription to pause');
      return;
    }

    return updateSubscriptionMutation.mutateAsync({
      subscriptionId: subscription.id,
      updates: { status: 'paused' },
    });
  }, [subscription, updateSubscriptionMutation]);

  // Resume subscription
  const resumeSubscription = useCallback(async () => {
    if (!subscription) {
      setError('No subscription to resume');
      return;
    }

    return updateSubscriptionMutation.mutateAsync({
      subscriptionId: subscription.id,
      updates: { status: 'active' },
    });
  }, [subscription, updateSubscriptionMutation]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!subscription) {
      setError('No active subscription to cancel');
      return;
    }

    return updateSubscriptionMutation.mutateAsync({
      subscriptionId: subscription.id,
      updates: {
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      },
    });
  }, [subscription, updateSubscriptionMutation]);

  // Check if user has active subscription
  const hasActiveSubscription = useCallback((): boolean => {
    return subscription?.status === 'active';
  }, [subscription]);

  // Get subscription plan details
  const getPlanDetails = useCallback((plan: SubscriptionPlan) => {
    return SUBSCRIPTION_PLANS[plan];
  }, []);

  // Get current plan details
  const getCurrentPlanDetails = useCallback(() => {
    if (!subscription) return null;
    return SUBSCRIPTION_PLANS[subscription.plan];
  }, [subscription]);

  // Calculate savings for monthly vs weekly
  const getMonthlySavings = useCallback((): number => {
    const weeklyMonthly = SUBSCRIPTION_PLANS.weekly.priceCents * 4;
    const monthly = SUBSCRIPTION_PLANS.monthly.priceCents;
    return weeklyMonthly - monthly;
  }, []);

  return {
    // Data
    subscription,
    subscriptionHistory,
    error,

    // Loading states
    isLoading,
    isLoadingHistory,
    isCreating: createSubscriptionMutation.isPending,
    isUpdating: updateSubscriptionMutation.isPending,

    // Actions
    createSubscription: createSubscriptionMutation.mutateAsync,
    updateSubscription: updateSubscriptionMutation.mutateAsync,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    refetch,

    // Helpers
    hasActiveSubscription,
    getPlanDetails,
    getCurrentPlanDetails,
    getMonthlySavings,

    // Constants
    plans: SUBSCRIPTION_PLANS,
  };
}

export default useSubscription;
