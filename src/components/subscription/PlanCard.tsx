import { Check, Lock, CreditCard, Sparkles, Truck, Bot } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { StripeCheckout } from '@/components/StripeCheckout';
import { useToast } from '@/hooks/use-toast';
import type { SubscriptionPlan } from '@/data/plans';

interface PlanCardProps {
  plan: SubscriptionPlan;
  compact?: boolean;
}

const PlanCard = ({ plan, compact = false }: PlanCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const isPopular = plan.popular;
  const isLoggedIn = !!user;

  const handleSubscriptionSuccess = () => {
    setShowCheckout(false);
    toast({
      title: 'Subscription Created!',
      description: `Welcome to the ${plan.name} plan. ${plan.canOrderDelivery ? "You can now order for next week's menu." : "Start exploring menus and talking to Chef AI."}`,
    });
  };

  // Highlight badges based on tier
  const getBadges = () => {
    const badges = [];
    if (plan.deliveryFee === 0) {
      badges.push({ label: 'Free Delivery', icon: Truck });
    }
    if (plan.aiCreditsIncluded === -1) {
      badges.push({ label: 'Unlimited AI', icon: Bot });
    }
    if (plan.creditDiscountPercent > 0) {
      badges.push({ label: `${plan.creditDiscountPercent}% Off`, icon: Sparkles });
    }
    return badges;
  };

  const badges = getBadges();

  return (
    <div
      className={`relative flex flex-col p-6 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
        isPopular
          ? 'border-mystical/50 bg-gradient-to-b from-mystical/10 to-card/50 shadow-[0_0_40px_rgba(255,255,255,0.08)]'
          : 'border-border/30 bg-card/30 hover:border-border/50'
      } ${compact ? 'p-4' : ''}`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-[10px] font-display tracking-[0.3em] bg-mystical text-background rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="text-center mb-4">
        <h3 className={`font-display tracking-[0.15em] text-foreground mb-1 ${compact ? 'text-lg' : 'text-xl'}`}>
          {plan.name.toUpperCase()}
        </h3>
        <p className="font-body text-xs text-muted-foreground">
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="text-center mb-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-baseline justify-center gap-1">
              <span className={`font-display text-mystical ${compact ? 'text-3xl' : 'text-4xl'}`}>
                ${plan.price}
              </span>
              <span className="font-body text-sm text-muted-foreground">
                /{plan.period}
              </span>
            </div>
            {plan.includedCredits > 0 && (
              <p className="font-body text-xs text-mystical/80 mt-1">
                ${plan.includedCredits / 100} credits included
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Lock size={16} className="text-muted-foreground" />
              <span className="font-display text-xl text-muted-foreground">
                • • •
              </span>
            </div>
            <p className="font-body text-xs text-foreground/70">
              Sign in to see pricing
            </p>
          </>
        )}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {badges.map((badge, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] py-0 px-2 bg-mystical/10 text-mystical border-mystical/20">
              <badge.icon size={10} className="mr-1" />
              {badge.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Features */}
      <ul className={`flex-1 space-y-2 mb-6 ${compact ? 'text-xs' : ''}`}>
        {plan.features.slice(0, compact ? 4 : undefined).map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="flex-shrink-0 w-4 h-4 rounded-full border border-border/50 flex items-center justify-center mt-0.5">
              <Check size={10} className="text-foreground" />
            </div>
            <span className={`font-body text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
              {feature}
            </span>
          </li>
        ))}
        {compact && plan.features.length > 4 && (
          <li className="text-xs text-muted-foreground/60 text-center">
            +{plan.features.length - 4} more features
          </li>
        )}
      </ul>

      {/* Delivery info for plans that can't order */}
      {!plan.canOrderDelivery && (
        <p className="text-xs text-center text-muted-foreground/60 mb-4">
          Delivery requires Member plan ($29/mo)
        </p>
      )}

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
              size={compact ? 'sm' : 'default'}
            >
              <CreditCard size={14} className="mr-2" />
              {plan.price === 9 ? 'START EXPLORING' :
               plan.price === 29 ? 'UNLOCK DELIVERY' :
               plan.price === 79 ? 'GET CREDITS' :
               plan.price === 399 ? 'FEED ME' :
               'FEED THE TEAM'}
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
          size={compact ? 'sm' : 'default'}
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
