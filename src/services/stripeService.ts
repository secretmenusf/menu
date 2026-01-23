/**
 * Stripe Integration for SF Secret Menu
 * Handles subscription creation, management, and payment processing
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { subscriptionPlans } from '@/data/plans';

// Load Stripe with publishable key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key not found. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
};

// Stripe Price IDs (these should match your Stripe Dashboard)
// Maps to new subscription tiers: explorer, member, pro, developer, startup
export const STRIPE_PRICE_IDS = {
  explorer: import.meta.env.VITE_STRIPE_PRICE_EXPLORER || 'price_explorer_2026',
  member: import.meta.env.VITE_STRIPE_PRICE_MEMBER || 'price_member_2026',
  pro: import.meta.env.VITE_STRIPE_PRICE_PRO || 'price_pro_2026',
  developer: import.meta.env.VITE_STRIPE_PRICE_DEVELOPER || 'price_developer_2026',
  startup: import.meta.env.VITE_STRIPE_PRICE_STARTUP || 'price_startup_2026',
} as const;

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  current_period_start: number;
  plan_id: string;
  customer: StripeCustomer;
  cancel_at_period_end: boolean;
}

export interface CreateCheckoutSessionParams {
  priceId: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl?: string;
}

class StripeService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

  /**
   * Create a Stripe Checkout Session for subscription
   */
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string; sessionId: string }> {
    const response = await fetch(`${this.baseUrl}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: params.priceId,
        customer_email: params.customerEmail,
        success_url: params.successUrl || `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: params.cancelUrl || `${window.location.origin}/pricing`,
        metadata: params.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  }

  /**
   * Create a Stripe Customer Portal Session for subscription management
   */
  async createPortalSession(params: CreatePortalSessionParams): Promise<{ url: string }> {
    const response = await fetch(`${this.baseUrl}/stripe/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: params.customerId,
        return_url: params.returnUrl || `${window.location.origin}/account`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    return response.json();
  }

  /**
   * Get customer subscriptions
   */
  async getCustomerSubscriptions(customerEmail: string): Promise<StripeSubscription[]> {
    const response = await fetch(`${this.baseUrl}/stripe/subscriptions?customer_email=${encodeURIComponent(customerEmail)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    return response.json();
  }

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const response = await fetch(`${this.baseUrl}/stripe/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return response.json();
  }

  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const response = await fetch(`${this.baseUrl}/stripe/subscriptions/${subscriptionId}/reactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to reactivate subscription');
    }

    return response.json();
  }

  /**
   * Update subscription (change plan)
   */
  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<StripeSubscription> {
    const response = await fetch(`${this.baseUrl}/stripe/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: newPriceId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return response.json();
  }

  /**
   * Client-side subscription creation (for demo/development)
   * In production, this should be handled by your backend
   */
  async createSubscriptionDemo(planId: string, customerEmail: string) {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const priceId = STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS];
    if (!priceId) {
      throw new Error('Invalid plan ID');
    }

    // For demo purposes, redirect directly to Stripe Checkout
    // In production, you'd create a session through your backend
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/pricing`,
      customerEmail,
      metadata: {
        planId,
        source: 'secretmenusf',
      },
    });

    if (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService();

// Helper functions for plan integration
export function getPlanByStripePrice(priceId: string) {
  const planId = Object.entries(STRIPE_PRICE_IDS).find(([_, id]) => id === priceId)?.[0];
  return planId ? subscriptionPlans.find(plan => plan.id === planId) : null;
}

export function getStripePriceId(planId: string): string | null {
  // First check if plan has stripePriceId defined
  const plan = subscriptionPlans.find(p => p.id === planId);
  if (plan?.stripePriceId) {
    return plan.stripePriceId;
  }
  // Fall back to STRIPE_PRICE_IDS mapping
  return STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS] || null;
}

export default stripeService;