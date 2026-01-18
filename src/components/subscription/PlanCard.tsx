import { Check, Lock, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { StripeCheckout } from '@/components/StripeCheckout';
import { useToast } from '@/hooks/use-toast';
import type { SubscriptionPlan } from '@/data/plans';

interface PlanCardProps {
  plan: SubscriptionPlan;
}

const PlanCard = ({ plan }: PlanCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const isPopular = plan.popular;
  const isLoggedIn = !!user;

  const handleSubscriptionSuccess = () => {
    setShowCheckout(false);
    toast({
      title: 'Subscription Created!',
      description: `Welcome to the ${plan.name} plan. You'll receive your first delivery soon.`,
    });
  };

  return (
    <div
      className={`relative flex flex-col p-8 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
        isPopular
          ? 'border-foreground/50 bg-card/50 shadow-[0_0_40px_rgba(255,255,255,0.08)]'
          : 'border-border/30 bg-card/30 hover:border-border/50'
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-[10px] font-display tracking-[0.3em] bg-foreground text-background rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="text-center mb-8">
        <h3 className="font-display text-2xl tracking-[0.15em] text-foreground mb-2">
          {plan.name.toUpperCase()}
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="text-center mb-8">
        {isLoggedIn ? (
          <>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display text-5xl text-mystical">
                ${plan.price}
              </span>
              <span className="font-body text-muted-foreground">
                /{plan.period}
              </span>
            </div>
            <p className="font-body text-xs text-muted-foreground/60 mt-2">
              {plan.mealsPerWeek} meals per week
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock size={18} className="text-muted-foreground" />
              <span className="font-display text-2xl text-muted-foreground">
                • • •
              </span>
            </div>
            <p className="font-body text-xs text-muted-foreground/60 mt-2">
              {plan.mealsPerWeek} meals per week
            </p>
            <p className="font-body text-xs text-foreground/70 mt-1">
              Sign in to see pricing
            </p>
          </>
        )}
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border border-border/50 flex items-center justify-center mt-0.5">
              <Check size={12} className="text-foreground" />
            </div>
            <span className="font-body text-sm text-muted-foreground">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isLoggedIn ? (
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogTrigger asChild>
            <Button
              className={`w-full rounded-full font-display tracking-wider ${
                isPopular
                  ? 'bg-mystical text-background hover:bg-mystical/90'
                  : 'bg-transparent border border-border hover:bg-card hover:border-mystical/50'
              }`}
              variant={isPopular ? 'default' : 'outline'}
            >
              <CreditCard size={14} className="mr-2" />
              SELECT {plan.name.toUpperCase()}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg border-mystical/30">
            <StripeCheckout
              plan={plan}
              customerEmail={user?.email}
              onSuccess={handleSubscriptionSuccess}
              onCancel={() => setShowCheckout(false)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          asChild
          className="w-full rounded-full font-display tracking-wider bg-transparent border border-border hover:bg-card hover:border-mystical/50"
          variant="outline"
        >
          <Link to="/login">
            <Lock size={14} className="mr-2" />
            JOIN TO UNLOCK
          </Link>
        </Button>
      )}
    </div>
  );
};

export default PlanCard;
