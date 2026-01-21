import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Salad, UtensilsCrossed, Sparkles, ArrowRight, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

type BillingCycle = 'weekly' | 'monthly';

const plans = [
  {
    id: 'everyday',
    icon: Salad,
    emoji: '🥗',
    name: 'Everyday Secret',
    tagline: 'Effortless chef-made meals, ready when you are',
    bestFor: 'individuals, couples, and small households',
    features: [
      '~10–20 meals per billing period, depending on how you spend',
      'Full menu access: mains, sides, snacks, desserts, and specials',
      'Use credits anytime — no required order schedule',
      '$1 paid = $1 in food credit',
    ],
    weeklyPrice: 100,
    monthlyPrice: 400,
    deliveryNote: 'Delivery: $25+ per delivery',
    monthlyBenefit: 'Free standard delivery when prepaid monthly',
    footnote: '(Surcharges may apply outside our core zone)',
    highlighted: false,
    ctaText: 'Get Started',
    ctaLink: '/checkout?plan=everyday',
  },
  {
    id: 'house',
    icon: UtensilsCrossed,
    emoji: '🍽️',
    name: 'House & Team Table',
    tagline: 'Lunch and dinner covered for groups who eat together',
    bestFor: 'families, shared homes, and small teams',
    features: [
      'Designed for daily eating (example: ~40 meals/week)',
      'Rotating, globally inspired menus with premium proteins',
      'Weekly extras included: 2 complimentary appetizers + 2 complimentary desserts',
      'Menus tailored to preferences and dietary needs',
      '$1 paid = $1 in food credit',
    ],
    weeklyPrice: 1400,
    monthlyPrice: 5600,
    pricePrefix: 'From ',
    deliveryNote: 'Delivery: $25+ per delivery (2x/week standard)',
    monthlyBenefit: 'Free standard delivery + Priority menu planning & calendar locking',
    highlighted: true,
    ctaText: 'Get Started',
    ctaLink: '/checkout?plan=house',
  },
  {
    id: 'luxe',
    icon: Sparkles,
    emoji: '✨',
    name: 'Luxe Secret',
    tagline: 'Private-chef level dining, without the restaurant',
    bestFor: 'high-end households, executives, and hosted experiences',
    features: [
      'Fully customized, fine-dining style menus',
      'Ultra-premium ingredients (wagyu, lobster, caviar, black cod, filet mignon)',
      'Same-day delivery, ready to heat and plate',
      'Private chef service in your home or office',
      '$1 paid = $1 toward Luxe menus and chef experiences',
    ],
    weeklyPrice: null,
    monthlyPrice: null,
    customPricing: true,
    pricingNote: 'Custom monthly membership based on: Group size & number of courses, Ingredient level, Delivery-only vs. private-chef service',
    highlighted: false,
    ctaText: 'Contact Us',
    ctaLink: '/contact?subject=luxe',
  },
];

const Order = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.15em] text-foreground mb-4">
              CHOOSE YOUR SECRETMENU
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Chef-made food, stocked on your schedule.
            </p>
            <p className="font-body text-lg text-foreground/80 max-w-xl mx-auto">
              Every plan uses food credits — <span className="text-foreground font-medium">$1 in = $1 to spend</span> across the Secretmenu.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-muted/50 rounded-full p-1">
              <button
                onClick={() => setBillingCycle('weekly')}
                className={cn(
                  'px-6 py-2 rounded-full font-display text-sm tracking-wider transition-all',
                  billingCycle === 'weekly'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                WEEKLY
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'px-6 py-2 rounded-full font-display text-sm tracking-wider transition-all',
                  billingCycle === 'monthly'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                MONTHLY
                <span className="ml-2 text-xs text-emerald-500">(Best Value)</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-3xl border p-8 transition-all duration-300',
                  plan.highlighted
                    ? 'border-foreground bg-foreground/5 scale-[1.02]'
                    : 'border-border/50 bg-card/30 hover:border-border'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-foreground text-background px-4 py-1 rounded-full text-xs font-display tracking-wider">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <span className="text-4xl mb-4 block">{plan.emoji}</span>
                  <h3 className="font-display text-xl tracking-wider text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {plan.tagline}
                  </p>
                </div>

                {/* Best For */}
                <div className="text-center mb-6 pb-6 border-b border-border/30">
                  <p className="font-display text-xs tracking-wider text-muted-foreground mb-1">
                    BEST FOR
                  </p>
                  <p className="font-body text-sm text-foreground">
                    {plan.bestFor}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <p className="font-display text-xs tracking-wider text-muted-foreground mb-4">
                    INCLUDES
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="font-body text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <p className="font-display text-xs tracking-wider text-muted-foreground mb-2">
                    PRICING
                  </p>
                  {plan.customPricing ? (
                    <div className="space-y-2">
                      <p className="font-body text-sm text-foreground/80">
                        {plan.pricingNote}
                      </p>
                      <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
                        <Mail size={14} />
                        Contact us to design your Luxe Secret experience.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1">
                        {plan.pricePrefix && (
                          <span className="font-body text-sm text-muted-foreground">{plan.pricePrefix}</span>
                        )}
                        <span className="font-display text-3xl text-foreground">
                          ${billingCycle === 'weekly' ? plan.weeklyPrice?.toLocaleString() : plan.monthlyPrice?.toLocaleString()}
                        </span>
                        <span className="font-body text-sm text-muted-foreground">
                          /{billingCycle === 'weekly' ? 'week' : 'month'}
                        </span>
                      </div>
                      <p className="font-body text-xs text-muted-foreground">
                        {plan.deliveryNote}
                      </p>
                      {billingCycle === 'monthly' && plan.monthlyBenefit && (
                        <p className="font-body text-xs text-emerald-500">
                          {plan.monthlyBenefit}
                        </p>
                      )}
                      {plan.footnote && (
                        <p className="font-body text-xs text-muted-foreground/60 italic">
                          {plan.footnote}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link to={plan.ctaLink}>
                  <Button
                    className={cn(
                      'w-full font-display tracking-wider',
                      plan.highlighted
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : ''
                    )}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.ctaText}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Simple Rule */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="border border-border/50 rounded-2xl p-8 bg-card/20">
              <h3 className="font-display text-lg tracking-wider text-foreground mb-4">
                ONE SIMPLE RULE
              </h3>
              <p className="font-body text-lg text-foreground/80 leading-relaxed">
                Every plan is food credits. Every dollar is usable.{' '}
                <span className="text-foreground font-medium">No contracts. No wasted spend.</span>
              </p>
            </div>
          </div>

          {/* View Menu CTA */}
          <div className="text-center mt-12">
            <p className="font-body text-muted-foreground mb-4">
              Want to see what's cooking first?
            </p>
            <Link to="/menu">
              <Button variant="ghost" className="font-display tracking-wider">
                VIEW THIS WEEK'S MENU
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Order;
