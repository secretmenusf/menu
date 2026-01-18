import { useState } from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface SquarePaymentProps {
  amount: number;
  onPaymentSuccess: (result: PaymentResult) => void;
  onPaymentError: (error: PaymentError) => void;
  loading: boolean;
}

const SquarePayment = ({ amount, onPaymentSuccess, onPaymentError, loading }: SquarePaymentProps) => {
  const { toast } = useToast();
  const [cardPaymentReady, setCardPaymentReady] = useState(false);

  // Square Application ID and Location ID should be env variables
  const SQUARE_APPLICATION_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-UUJGLZGLWdjCH7E9JNNI1g';
  const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || 'L8CHYF41B1AM8';

  if (!SQUARE_APPLICATION_ID || !SQUARE_LOCATION_ID) {
    return (
      <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/10 text-center">
        <p className="text-red-500 font-body text-sm">
          Payment system configuration error. Please try alternative payment methods.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg p-6 bg-card/30">
      <h3 className="font-display text-sm tracking-[0.2em] text-muted-foreground mb-4">
        SECURE CARD PAYMENT
      </h3>
      
      <PaymentForm
        applicationId={SQUARE_APPLICATION_ID}
        locationId={SQUARE_LOCATION_ID}
        cardTokenizeResponseReceived={async (token, buyer) => {
          try {
            // Here you would send the token to your backend to process the payment
            // For now, we'll simulate success
            const result = {
              token,
              buyer,
              amount,
            };
            
            onPaymentSuccess(result);
            
            toast({
              title: 'Payment successful',
              description: 'Your order has been processed',
            });
          } catch (error) {
            onPaymentError(error);
            toast({
              title: 'Payment failed',
              description: 'Please try again or use alternative payment method',
              variant: 'destructive',
            });
          }
        }}
        createPaymentRequest={() => ({
          countryCode: 'US',
          currencyCode: 'USD',
          total: {
            amount: amount.toString(),
            label: 'SF Secret Menu Order',
          },
        })}
      >
        <CreditCard
          includeInputLabels
          style={{
            input: {
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              color: 'hsl(var(--foreground))',
              backgroundColor: 'transparent',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              padding: '12px',
            },
            inputLabel: {
              fontSize: '12px',
              fontWeight: '500',
              color: 'hsl(var(--muted-foreground))',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            },
            '.input-container.is-error': {
              borderColor: 'hsl(var(--destructive))',
            },
            '.input-container.is-focus': {
              borderColor: 'hsl(var(--foreground))',
            },
          }}
          onLoad={() => setCardPaymentReady(true)}
        />
      </PaymentForm>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Amount</span>
          <span className="font-display text-foreground">${amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Processing Fee</span>
          <span className="font-display text-foreground">$0</span>
        </div>
        <div className="border-t border-border/30 pt-3">
          <div className="flex justify-between">
            <span className="font-display tracking-wider">TOTAL</span>
            <span className="font-display text-xl text-mystical">${amount}</span>
          </div>
        </div>
      </div>

      {!cardPaymentReady && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 font-body text-sm text-muted-foreground">Loading payment form...</span>
        </div>
      )}
    </div>
  );
};

export default SquarePayment;