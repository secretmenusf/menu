import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Check, Globe, ChefHat, Utensils, Bot, Truck, Users, Lock, CreditCard, Calendar, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlanCard from '@/components/subscription/PlanCard';
import { subscriptionPlans, planBenefits } from '@/data/plans';
import { ShareButton } from '@/components/social/ShareButton';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { stripeService, getStripePriceId } from '@/services/stripeService';
import { useToast } from '@/hooks/use-toast';

const HowItWorksStep = ({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
}) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center">
      <Icon size={20} className="text-mystical" />
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-muted-foreground font-display tracking-wider">STEP {number}</span>
      </div>
      <h3 className="font-display text-lg tracking-wide text-foreground mb-1">{title}</h3>
      <p className="font-body text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const FeatureComparison = () => {
  const features = [
    { name: 'Weekly menu access', access: true, plus: true, solodev: true, hackerhouse: true },
    { name: 'Chef AI included', access: true, plus: true, solodev: 'Unlimited', hackerhouse: 'Unlimited' },
    { name: 'Order delivery (SF)', access: true, plus: true, solodev: true, hackerhouse: true },
    { name: 'Menu archives', access: true, plus: true, solodev: true, hackerhouse: true },
    { name: 'Meal credits included', access: '$0', plus: '~$35', solodev: '$350', hackerhouse: '$900' },
    { name: 'Customize orders', access: false, plus: true, solodev: true, hackerhouse: true },
    { name: 'Early access / VIP items', access: false, plus: true, solodev: true, hackerhouse: true },
    { name: 'Delivery fee', access: '$10', plus: '$10*', solodev: 'Free', hackerhouse: 'Free' },
    { name: 'Team members', access: '1', plus: '2', solodev: '2', hackerhouse: 'Unlimited' },
    { name: 'Priority support', access: false, plus: false, solodev: true, hackerhouse: 'Concierge' },
  ];

  const tiers = ['access', 'plus', 'solodev', 'hackerhouse'] as const;
  const tierNames = ['Access', 'Plus', 'Solo Dev', 'Hacker House'];
  const tierPrices = ['$29', '$79', '$399', '$999'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-border/30">
            <th className="text-left py-4 px-4 font-display text-sm tracking-wider text-muted-foreground">FEATURE</th>
            {tierNames.map((name, i) => (
              <th key={tiers[i]} className="text-center py-4 px-4">
                <span className="font-display text-sm tracking-wider text-foreground block">{name.toUpperCase()}</span>
                <span className="font-body text-xs text-muted-foreground">{tierPrices[i]}/mo</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i} className="border-b border-border/10">
              <td className="py-3 px-4 font-body text-sm text-muted-foreground">{feature.name}</td>
              {tiers.map((tier) => {
                const value = feature[tier];
                return (
                  <td key={tier} className="text-center py-3 px-4">
                    {value === true ? (
                      <Check size={16} className="mx-auto text-green-500" />
                    ) : value === false ? (
                      <span className="text-muted-foreground/30">—</span>
                    ) : (
                      <span className="font-body text-sm text-foreground">{value}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
        *Plus plan includes credits that cover first delivery
      </p>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="border-b border-border/20 pb-4 mb-4">
    <h4 className="font-display text-sm tracking-wider text-foreground mb-2">{question}</h4>
    <p className="font-body text-sm text-muted-foreground">{answer}</p>
  </div>
);

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDirectCheckout = async (planId: string) => {
    setIsLoading(planId);
    try {
      const priceId = getStripePriceId(planId);
      if (!priceId) {
        throw new Error('Invalid plan configuration');
      }

      // Go directly to Stripe Checkout - no login required
      const { url } = await stripeService.createCheckoutSession({
        priceId,
        successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
        cancelUrl: `${window.location.origin}/pricing`,
        metadata: {
          planId,
          source: 'secretmenusf',
        },
      });

      window.location.href = url;
    } catch (error) {
      console.error('Failed to start checkout:', error);
      toast({
        title: 'Checkout Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        {...pageSEO.pricing}
        url="https://secretmenusf.com/pricing"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://secretmenusf.com' },
          { name: 'Pricing', url: 'https://secretmenusf.com/pricing' },
        ])}
      />

      <Header />

      <main className="pt-32 pb-24">
        {/* Back link */}
        <div className="container mx-auto px-6 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>
        </div>

        {/* Hero section - Conversion focused */}
        <div className="container mx-auto px-6 max-w-4xl text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.1em] text-foreground mb-6">
            JOIN THE SECRET MENU
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Weekly drops curated by Chef Antje.<br />
            Members get access first. When a dish sells out, it's gone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Button
              onClick={() => handleDirectCheckout('access')}
              disabled={isLoading === 'access'}
              className="rounded-full font-display tracking-wider bg-mystical text-background hover:bg-mystical/90 px-8"
              size="lg"
            >
              {isLoading === 'access' ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  LOADING...
                </>
              ) : (
                <>
                  <Lock size={16} className="mr-2" />
                  UNLOCK ACCESS — $29/MO
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/menu')}
              className="rounded-full font-display tracking-wider px-8"
              size="lg"
            >
              SEE THIS WEEK'S DROP
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          {/* Truth line */}
          <div className="inline-block px-6 py-3 bg-muted/30 border border-border/30 rounded-lg">
            <p className="font-body text-xs text-muted-foreground">
              All plans include Chef AI. Meals are paid separately unless included in your plan.<br />
              SF Bay Area delivery is $10 per delivery unless included.
            </p>
          </div>
        </div>

        {/* Why Members Join - tight bullets */}
        <div className="container mx-auto px-6 max-w-4xl mb-16">
          <h2 className="font-display text-xl tracking-[0.15em] text-foreground text-center mb-8">
            WHY MEMBERS JOIN
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <Calendar size={28} className="mx-auto text-mystical mb-3" />
              <h3 className="font-display text-sm tracking-wider mb-2">WEEKLY DROPS</h3>
              <p className="font-body text-xs text-muted-foreground">
                New dishes every week, limited availability
              </p>
            </div>
            <div className="text-center p-4">
              <Clock size={28} className="mx-auto text-mystical mb-3" />
              <h3 className="font-display text-sm tracking-wider mb-2">ORDER AHEAD</h3>
              <p className="font-body text-xs text-muted-foreground">
                Order for next week (fresh sourcing, real prep time)
              </p>
            </div>
            <div className="text-center p-4">
              <Bot size={28} className="mx-auto text-mystical mb-3" />
              <h3 className="font-display text-sm tracking-wider mb-2">CHEF AI INCLUDED</h3>
              <p className="font-body text-xs text-muted-foreground">
                Recipes, swaps, nutrition, meal plans
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="container mx-auto px-6 max-w-5xl mb-16">
          <div className="border border-border/30 rounded-lg p-8 md:p-12 bg-card/20">
            <h2 className="font-display text-xl tracking-[0.2em] text-foreground text-center mb-10">
              HOW IT WORKS
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <HowItWorksStep
                number={1}
                title="Subscribe"
                description="Instant access + Chef AI. Starting at $29/mo."
                icon={CreditCard}
              />
              <HowItWorksStep
                number={2}
                title="Browse"
                description="See this week's menu. New drop every week."
                icon={Utensils}
              />
              <HowItWorksStep
                number={3}
                title="Order"
                description="Order next week's menu. SF Bay Area delivery only."
                icon={Calendar}
              />
              <HowItWorksStep
                number={4}
                title="Enjoy"
                description="Most plans: pay for meals + $10 delivery. Some plans: included."
                icon={ChefHat}
              />
            </div>
          </div>
        </div>

        {/* Plans grid - 4 columns */}
        <div className="container mx-auto px-6 max-w-6xl mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Feature comparison */}
        <div className="container mx-auto px-6 max-w-5xl mb-16">
          <div className="border border-border/30 rounded-lg p-6 md:p-8 bg-card/20">
            <h2 className="font-display text-xl tracking-[0.2em] text-foreground text-center mb-8">
              COMPARE PLANS
            </h2>
            <FeatureComparison />
          </div>
        </div>

        {/* FOMO Section */}
        <div className="container mx-auto px-6 max-w-4xl mb-16">
          <div className="border border-amber-500/30 rounded-lg p-8 md:p-12 bg-gradient-to-b from-amber-500/5 to-transparent text-center">
            <AlertTriangle size={32} className="mx-auto text-amber-500 mb-4" />
            <h2 className="font-display text-2xl tracking-[0.1em] text-foreground mb-3">
              THIS WEEK'S MENU DISAPPEARS
            </h2>
            <p className="font-body text-muted-foreground mb-6 max-w-lg mx-auto">
              You don't "scroll it later." You either join—or you miss it.<br />
              Members see the drop first. Orders are for next week. Delivery slots are limited.
            </p>
            <Button
              onClick={() => handleDirectCheckout('access')}
              disabled={isLoading === 'access'}
              className="rounded-full font-display tracking-wider bg-amber-500 text-background hover:bg-amber-600 px-8"
              size="lg"
            >
              {isLoading === 'access' ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  LOADING...
                </>
              ) : (
                'JOIN BEFORE NEXT DROP'
              )}
            </Button>
          </div>
        </div>

        {/* Clarity Box */}
        <div className="container mx-auto px-6 max-w-4xl mb-16">
          <div className="border border-border/50 rounded-lg p-6 bg-muted/20">
            <h3 className="font-display text-sm tracking-[0.2em] text-foreground mb-4 text-center">
              THE FINE PRINT (IN PLAIN ENGLISH)
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Lock size={16} className="text-mystical mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-foreground font-medium">What membership is:</span>
                  <span className="text-muted-foreground"> Access to weekly menu + ordering + Chef AI</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={16} className="text-mystical mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-foreground font-medium">Where delivery works:</span>
                  <span className="text-muted-foreground"> San Francisco Bay Area only</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={16} className="text-mystical mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-foreground font-medium">What you pay separately:</span>
                  <span className="text-muted-foreground"> Meals at checkout (unless plan includes credits)</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={16} className="text-mystical mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-foreground font-medium">Delivery fee:</span>
                  <span className="text-muted-foreground"> $10 per delivery (free on Solo Dev & Hacker House)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="container mx-auto px-6 max-w-2xl mb-16">
          <h2 className="font-display text-xl tracking-[0.2em] text-foreground text-center mb-8">
            FAQ
          </h2>
          <FAQItem
            question="Do I still pay for food?"
            answer="Yes—meals are priced per dish at checkout, unless your plan includes a monthly meal credit (Plus and above)."
          />
          <FAQItem
            question="Is delivery included?"
            answer="Delivery is SF Bay Area only. It's $10 per delivery unless your plan includes it (Solo Dev and Hacker House get free delivery)."
          />
          <FAQItem
            question="Why order next week?"
            answer="So Chef Antje can source peak ingredients and prep properly—this is how the quality stays high."
          />
          <FAQItem
            question="Can I cancel anytime?"
            answer="Yes. Cancel or pause anytime. No long-term commitments."
          />
        </div>

        {/* Benefits section */}
        <div className="container mx-auto px-6 max-w-4xl mb-16">
          <div className="border border-border/30 rounded-lg p-8 md:p-12 bg-card/20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles size={20} className="text-muted-foreground" />
              <h2 className="font-display text-xl tracking-[0.2em] text-foreground">
                ALL PLANS INCLUDE
              </h2>
              <Sparkles size={20} className="text-muted-foreground" />
            </div>

            <ul className="grid md:grid-cols-2 gap-4">
              {planBenefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 font-body text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Share & contact */}
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <ShareButton
              title="SF Secret Menu - Membership Plans"
              text="Check out the membership tiers for SF Secret Menu - chef-crafted meals delivered weekly"
              variant="outline"
              size="sm"
            />
          </div>
          <p className="font-body text-sm text-muted-foreground/60">
            Questions?{' '}
            <Link
              to="/support"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              Contact our concierge team
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
