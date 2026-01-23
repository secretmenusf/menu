/**
 * Stripe Checkout Component
 * Handles subscription creation with Stripe Elements
 */

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Shield, Check } from 'lucide-react';
import { subscriptionPlans, type SubscriptionPlan } from '@/data/plans';
import { stripeService, getStripePriceId } from '@/services/stripeService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutFormProps {
  plan: SubscriptionPlan;
  customerEmail?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function CheckoutForm({ plan, customerEmail, onSuccess, onCancel }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // For demo purposes - in production, create payment intent on your backend
      const priceId = getStripePriceId(plan.id);
      if (!priceId) {
        throw new Error('Invalid plan configuration');
      }

      await stripeService.createSubscriptionDemo(plan.id, customerEmail || 'customer@example.com');
      
      onSuccess?.();
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-border/30 rounded-lg p-4 bg-card/50">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 font-display tracking-wider"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Subscribe ${plan.price}/month
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function StripeCheckout({ plan, customerEmail, onSuccess, onCancel }: StripeCheckoutFormProps) {
  const options = {
    mode: 'subscription' as const,
    amount: plan.price * 100, // Convert to cents
    currency: 'usd',
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: 'hsl(var(--mystical))',
        colorBackground: 'hsl(var(--card))',
        colorText: 'hsl(var(--foreground))',
        colorDanger: 'hsl(var(--destructive))',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-mystical/30 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-display tracking-wider flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-mystical" />
            Secure Checkout
          </CardTitle>
          
          {/* Plan Summary */}
          <div className="mt-4 p-4 bg-mystical/10 rounded-lg">
            <h3 className="font-display text-lg tracking-wider text-mystical mb-2">
              {plan.name.toUpperCase()} PLAN
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">{plan.description}</span>
              <span className="font-display text-2xl text-mystical">${plan.price}/mo</span>
            </div>
            {plan.includedCredits > 0 && (
              <p className="text-sm text-mystical/80 mb-2">
                Includes ${plan.includedCredits / 100} in universal credits
              </p>
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              {plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-mystical" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              plan={plan}
              customerEmail={customerEmail}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </Elements>

          {/* Security badges */}
          <div className="mt-6 flex justify-center items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <span>•</span>
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <span>•</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StripeCheckout;