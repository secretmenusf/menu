/**
 * Stripe Payment Component for One-Time Payments
 * Uses Stripe Elements for secure card processing
 */

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentResult {
  token?: string;
  status?: string;
  [key: string]: unknown;
}

interface PaymentError {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

interface CustomerInfo {
  email: string;
  phone: string;
  name: string;
  address: string;
}

interface StripePaymentProps {
  amount: number;
  onPaymentSuccess: (result: PaymentResult) => void;
  onPaymentError: (error: PaymentError) => void;
  loading: boolean;
  customerInfo?: CustomerInfo;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: 'hsl(0 0% 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': {
        color: 'hsl(0 0% 45%)',
      },
    },
    invalid: {
      color: 'hsl(0 84.2% 60.2%)',
    },
  },
};

function CheckoutForm({ amount, onPaymentSuccess, onPaymentError, customerInfo }: Omit<StripePaymentProps, 'loading'>) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cardReady, setCardReady] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const allReady = cardReady.number && cardReady.expiry && cardReady.cvc;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: customerInfo?.name,
          email: customerInfo?.email,
          phone: customerInfo?.phone,
          address: {
            line1: customerInfo?.address,
          },
        },
      });

      if (error) {
        throw error;
      }

      // In production, you'd send paymentMethod.id to your backend
      // which would create a PaymentIntent and confirm it
      // For now, we simulate success with the payment method
      const result: PaymentResult = {
        token: paymentMethod.id,
        status: 'succeeded',
        paymentMethod,
        amount,
      };

      toast({
        title: 'Payment successful',
        description: 'Your order has been processed',
      });

      onPaymentSuccess(result);
    } catch (error) {
      console.error('Payment failed:', error);
      const paymentError: PaymentError = {
        message: error instanceof Error ? error.message : 'Payment failed',
        code: 'payment_error',
      };
      onPaymentError(paymentError);
      toast({
        title: 'Payment failed',
        description: paymentError.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Card Number */}
        <div className="space-y-2">
          <label className="text-xs tracking-wider text-muted-foreground uppercase">
            Card Number
          </label>
          <div className="relative">
            <div className="h-12 px-4 flex items-center border border-border/50 rounded-lg bg-background/50 focus-within:border-primary/50 transition-colors">
              <CardNumberElement
                options={cardElementOptions}
                onReady={() => setCardReady(prev => ({ ...prev, number: true }))}
                className="w-full"
              />
            </div>
            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs tracking-wider text-muted-foreground uppercase">
              Expiry
            </label>
            <div className="h-12 px-4 flex items-center border border-border/50 rounded-lg bg-background/50 focus-within:border-primary/50 transition-colors">
              <CardExpiryElement
                options={cardElementOptions}
                onReady={() => setCardReady(prev => ({ ...prev, expiry: true }))}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs tracking-wider text-muted-foreground uppercase">
              CVC
            </label>
            <div className="h-12 px-4 flex items-center border border-border/50 rounded-lg bg-background/50 focus-within:border-primary/50 transition-colors">
              <CardCvcElement
                options={cardElementOptions}
                onReady={() => setCardReady(prev => ({ ...prev, cvc: true }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="border-t border-border/30 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Subtotal</span>
          <span className="font-display text-foreground">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Processing</span>
          <span className="font-display text-foreground">$0.00</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border/30">
          <span className="font-display tracking-wider">TOTAL</span>
          <span className="font-display text-xl text-mystical">${amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isLoading || !allReady}
        className="w-full h-12 font-display tracking-wider"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            PROCESSING...
          </>
        ) : !allReady ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            LOADING...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            PAY ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Security badges */}
      <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>SSL Encrypted</span>
        </div>
        <span>•</span>
        <span>PCI Compliant</span>
        <span>•</span>
        <span>Powered by Stripe</span>
      </div>
    </form>
  );
}

const StripePayment = ({ amount, onPaymentSuccess, onPaymentError, loading, customerInfo }: StripePaymentProps) => {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    stripePromise.then((stripe) => {
      if (stripe) {
        setStripeReady(true);
      }
    });
  }, []);

  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/10 text-center">
        <p className="text-red-500 font-body text-sm">
          Payment system configuration error. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg p-6 bg-card/30">
      <h3 className="font-display text-sm tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        SECURE CARD PAYMENT
      </h3>

      {!stripeReady ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 font-body text-sm text-muted-foreground">
            Loading secure payment form...
          </span>
        </div>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: 'hsl(45 100% 51%)',
                colorBackground: 'hsl(0 0% 4%)',
                colorText: 'hsl(0 0% 100%)',
                colorDanger: 'hsl(0 84.2% 60.2%)',
                borderRadius: '8px',
              },
            },
          }}
        >
          <CheckoutForm
            amount={amount}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            customerInfo={customerInfo}
          />
        </Elements>
      )}
    </div>
  );
};

export default StripePayment;
