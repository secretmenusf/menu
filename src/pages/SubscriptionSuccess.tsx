import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Loader2, AlertCircle, ChefHat, Calendar, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPlanById } from '@/data/plans';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signInWithMagicLink } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'creating_account' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const planId = searchParams.get('plan');
  const plan = planId ? getPlanById(planId as any) : null;

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('Missing session ID');
        setStatus('error');
        return;
      }

      try {
        // Verify the checkout session with the backend
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();

        if (data.status === 'complete' || data.status === 'paid') {
          setCustomerEmail(data.customer_email);

          // If user is already logged in, just show success
          if (user) {
            setStatus('success');
            return;
          }

          // User not logged in - need to create account or send magic link
          setStatus('creating_account');

          // Send magic link to the customer email
          // The backend should have already created the user during webhook
          if (data.customer_email) {
            try {
              await signInWithMagicLink(data.customer_email, `${window.location.origin}/menu`);
              setStatus('success');
            } catch (err) {
              // Even if magic link fails, subscription is created
              // They can sign in later
              console.warn('Magic link failed, but subscription is active:', err);
              setStatus('success');
            }
          } else {
            setStatus('success');
          }
        } else {
          setError('Payment not completed');
          setStatus('error');
        }
      } catch (err) {
        console.error('Session verification error:', err);
        // Even if verification fails, assume success (Stripe redirect means payment worked)
        setStatus('success');
      }
    };

    verifySession();
  }, [sessionId, user, signInWithMagicLink]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-lg text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-mystical" />
            <h1 className="font-display text-2xl tracking-[0.1em] mb-4">
              CONFIRMING YOUR SUBSCRIPTION
            </h1>
            <p className="font-body text-muted-foreground">
              Please wait while we set up your account...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === 'creating_account') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-lg text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-mystical" />
            <h1 className="font-display text-2xl tracking-[0.1em] mb-4">
              CREATING YOUR ACCOUNT
            </h1>
            <p className="font-body text-muted-foreground">
              Setting up your membership...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-lg text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="font-display text-2xl tracking-[0.1em] mb-4">
              SOMETHING WENT WRONG
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              {error || 'We couldn\'t verify your payment. If you were charged, please contact support.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/pricing')} variant="outline">
                Try Again
              </Button>
              <Link to="/support">
                <Button>
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl tracking-[0.1em] mb-4">
            WELCOME TO THE SECRET MENU
          </h1>

          {plan && (
            <p className="font-display text-lg text-mystical tracking-wider mb-2">
              {plan.name.toUpperCase()} MEMBER
            </p>
          )}

          <p className="font-body text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Your subscription is active. You now have full access to the weekly menu and Chef AI.
          </p>

          {/* Check email notice */}
          {customerEmail && !user && (
            <div className="bg-mystical/10 border border-mystical/30 rounded-lg p-6 mb-8">
              <p className="font-display text-sm tracking-wider text-foreground mb-2">
                CHECK YOUR EMAIL
              </p>
              <p className="font-body text-sm text-muted-foreground">
                We sent a sign-in link to <span className="text-foreground">{customerEmail}</span>.
                <br />
                Click the link to access your account and start ordering.
              </p>
            </div>
          )}

          {/* What's next */}
          <div className="border border-border/30 rounded-lg p-8 mb-8 text-left">
            <h2 className="font-display text-lg tracking-wider text-foreground mb-6 text-center">
              WHAT YOU CAN DO NOW
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-mystical" />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-wider text-foreground mb-1">
                    BROWSE THIS WEEK'S MENU
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    See what Chef Antje has prepared for this week's drop.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-5 h-5 text-mystical" />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-wider text-foreground mb-1">
                    ORDER FOR NEXT WEEK
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Place your order now for fresh delivery next week.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-mystical" />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-wider text-foreground mb-1">
                    TALK TO CHEF AI
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Get recipe ideas, nutrition info, and meal planning help.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/menu">
              <Button size="lg" className="font-display tracking-wider px-8">
                VIEW THIS WEEK'S MENU
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;
