import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check, X, Globe, ChefHat, Utensils, Bot, Truck, Users, Lock, CreditCard, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlanCard from '@/components/subscription/PlanCard';
import { subscriptionPlans, planBenefits, DELIVERY_FEE_CENTS, CREDIT_PRICING } from '@/data/plans';
import { ShareButton } from '@/components/social/ShareButton';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';

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
    { name: 'Browse weekly menus', explorer: true, member: true, pro: true, developer: true, startup: true },
    { name: 'Chef Antje AI', explorer: '50/mo', member: '100/mo', pro: '200/mo', developer: 'Unlimited', startup: 'Unlimited' },
    { name: 'Cook-at-home recipes', explorer: true, member: true, pro: true, developer: true, startup: true },
    { name: 'Order delivery (SF)', explorer: false, member: true, pro: true, developer: true, startup: true },
    { name: 'Secret menu access', explorer: false, member: true, pro: true, developer: true, startup: true },
    { name: 'Menu archives', explorer: false, member: true, pro: true, developer: true, startup: true },
    { name: 'Customize orders', explorer: false, member: false, pro: true, developer: true, startup: true },
    { name: 'Secret secret menu', explorer: false, member: false, pro: true, developer: true, startup: true },
    { name: 'Universal credits', explorer: '$0', member: '$0', pro: '$50', developer: '$350', startup: '$900' },
    { name: 'Credit discount', explorer: '0%', member: '0%', pro: '0%', developer: '10%', startup: '20%' },
    { name: 'Delivery fee', explorer: '$10', member: '$10', pro: '$10', developer: 'Free', startup: 'Free' },
    { name: 'Team members', explorer: '1', member: '1', pro: '2', developer: '2', startup: 'Unlimited' },
  ];

  const tiers = ['explorer', 'member', 'pro', 'developer', 'startup'] as const;
  const tierNames = ['Explorer', 'Member', 'Pro', 'Developer', 'Startup'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-border/30">
            <th className="text-left py-4 px-4 font-display text-sm tracking-wider text-muted-foreground">FEATURE</th>
            {tierNames.map((name, i) => (
              <th key={tiers[i]} className="text-center py-4 px-4 font-display text-sm tracking-wider text-foreground">
                {name.toUpperCase()}
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
                      <X size={16} className="mx-auto text-muted-foreground/30" />
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
    </div>
  );
};

const Pricing = () => {
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
        <div className="container mx-auto px-6 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>
        </div>

        {/* Section header */}
        <div className="container mx-auto px-6 max-w-4xl text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-6">
            MEMBERSHIP
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Join the inner circle. Experience Chef Antje's curated culinary excellence
            delivered to your door—or cook along from anywhere in the world.
          </p>
          <p className="font-body text-sm text-foreground/60 max-w-xl mx-auto mb-6">
            Currently serving <span className="text-mystical font-semibold">San Francisco</span> • More cities coming soon
          </p>
          <ShareButton
            title="SF Secret Menu - Membership Plans"
            text="Check out the membership tiers for SF Secret Menu - chef-crafted meals delivered weekly"
            variant="outline"
            size="sm"
          />
        </div>

        {/* How it works */}
        <div className="container mx-auto px-6 max-w-5xl mb-20">
          <div className="border border-border/30 rounded-lg p-8 md:p-12 bg-card/20">
            <h2 className="font-display text-xl tracking-[0.2em] text-foreground text-center mb-10">
              HOW IT WORKS
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <HowItWorksStep
                number={1}
                title="Subscribe"
                description="Choose a plan starting at $9/mo. Explorer lets you browse and cook at home. Member ($29/mo) unlocks delivery."
                icon={CreditCard}
              />
              <HowItWorksStep
                number={2}
                title="Browse This Week"
                description="See the current week's secret menu. New dishes every week, curated by Chef Antje."
                icon={Utensils}
              />
              <HowItWorksStep
                number={3}
                title="Order Next Week"
                description="Place orders for NEXT week's menu. This ensures fresh prep and perfect timing."
                icon={Calendar}
              />
              <HowItWorksStep
                number={4}
                title="Enjoy"
                description="Delivery in SF ($10 fee, free on Developer+). Or use Chef AI to cook at home anywhere."
                icon={ChefHat}
              />
            </div>
          </div>
        </div>

        {/* Plans grid */}
        <div className="container mx-auto px-6 max-w-7xl mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {subscriptionPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Feature comparison */}
        <div className="container mx-auto px-6 max-w-6xl mb-20">
          <div className="border border-border/30 rounded-lg p-6 md:p-8 bg-card/20">
            <h2 className="font-display text-xl tracking-[0.2em] text-foreground text-center mb-8">
              COMPARE PLANS
            </h2>
            <FeatureComparison />
          </div>
        </div>

        {/* Universal Credits Section */}
        <div className="container mx-auto px-6 max-w-4xl mb-20">
          <div className="border border-mystical/30 rounded-lg p-8 md:p-12 bg-gradient-to-b from-mystical/5 to-transparent">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles size={20} className="text-mystical" />
              <h2 className="font-display text-xl tracking-[0.2em] text-foreground">
                UNIVERSAL CREDITS
              </h2>
              <Sparkles size={20} className="text-mystical" />
            </div>
            <p className="text-center font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
              Credits work for both food orders AND Chef Antje AI. Use them however you like—order meals,
              get nutrition advice, plan your week, or learn to cook. One balance, endless possibilities.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <Utensils size={24} className="mx-auto text-mystical mb-3" />
                <h3 className="font-display text-sm tracking-wider mb-2">FOOD ORDERS</h3>
                <p className="font-body text-xs text-muted-foreground">
                  $1 credit = $1 toward meals. Use credits for delivery orders anytime.
                </p>
              </div>
              <div className="text-center p-4">
                <Bot size={24} className="mx-auto text-mystical mb-3" />
                <h3 className="font-display text-sm tracking-wider mb-2">CHEF AI</h3>
                <p className="font-body text-xs text-muted-foreground">
                  ~$0.10/message. Get recipes, nutrition advice, meal planning help.
                </p>
              </div>
              <div className="text-center p-4">
                <CreditCard size={24} className="mx-auto text-mystical mb-3" />
                <h3 className="font-display text-sm tracking-wider mb-2">BULK DISCOUNTS</h3>
                <p className="font-body text-xs text-muted-foreground">
                  Buy more, save more. Up to 20% off on credit purchases of $500+.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why We're Different */}
        <div className="container mx-auto px-6 max-w-4xl mb-20">
          <h2 className="font-display text-xl tracking-[0.2em] text-foreground text-center mb-10">
            WHY WE'RE DIFFERENT
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Lock size={20} className="flex-shrink-0 text-mystical mt-1" />
                <div>
                  <h3 className="font-display text-sm tracking-wider mb-1">SECRET MENU</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Only members see what's cooking. New menu every week—dishes you won't find anywhere else.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Calendar size={20} className="flex-shrink-0 text-mystical mt-1" />
                <div>
                  <h3 className="font-display text-sm tracking-wider mb-1">ORDER AHEAD</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Browse this week's menu, order for next week. Gives Chef Antje time to source the best ingredients.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <ChefHat size={20} className="flex-shrink-0 text-mystical mt-1" />
                <div>
                  <h3 className="font-display text-sm tracking-wider mb-1">REAL CHEF, REAL AI</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Chef Antje creates the menus. Her AI helps you cook, plan nutrition, and master each recipe.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Globe size={20} className="flex-shrink-0 text-mystical mt-1" />
                <div>
                  <h3 className="font-display text-sm tracking-wider mb-1">COOK FROM ANYWHERE</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Not in SF? The $9 Explorer plan gives you menus and AI help to cook at home in any city.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users size={20} className="flex-shrink-0 text-mystical mt-1" />
                <div>
                  <h3 className="font-display text-sm tracking-wider mb-1">TEAMS & HOUSEHOLDS</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Startup plan lets your whole team order on-demand with shared credits and individual preferences.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Truck size={20} className="flex-shrink-0 text-mystical mt-1" />
                <div>
                  <h3 className="font-display text-sm tracking-wider mb-1">$10 DELIVERY</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Flat rate in SF. Free delivery on Developer and Startup plans. More cities coming soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits section */}
        <div className="container mx-auto px-6 max-w-4xl mb-20">
          <div className="border border-border/30 rounded-lg p-8 md:p-12 bg-card/20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles size={20} className="text-muted-foreground" />
              <h2 className="font-display text-xl tracking-[0.2em] text-foreground">
                ALL MEMBERSHIPS INCLUDE
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

        {/* Global Expansion CTA */}
        <div className="container mx-auto px-6 max-w-4xl mb-16">
          <div className="text-center border border-mystical/20 rounded-lg p-8 bg-gradient-to-b from-mystical/5 to-transparent">
            <Globe size={32} className="mx-auto text-mystical mb-4" />
            <h2 className="font-display text-2xl tracking-[0.15em] text-foreground mb-3">
              COMING TO 100 CITIES
            </h2>
            <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
              LA, NYC, Chicago, Miami next. Then London, Paris, Tokyo, and beyond.
              Vote for your city and be first to know when we launch.
            </p>
            <Button asChild variant="outline" className="rounded-full font-display tracking-wider">
              <Link to="/global">
                <Globe size={14} className="mr-2" />
                VIEW EXPANSION MAP
              </Link>
            </Button>
          </div>
        </div>

        {/* FAQ teaser */}
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="font-body text-sm text-muted-foreground/60">
            Questions about our service?{' '}
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
