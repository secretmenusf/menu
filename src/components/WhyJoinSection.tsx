/**
 * Why Members Join + Simple How It Works
 * Compact sections for landing page
 */

import { Calendar, Clock, Bot, CreditCard, Utensils, ChefHat } from 'lucide-react';

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

export function WhyMembersJoinSection({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="container mx-auto px-6 max-w-4xl">
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
    </section>
  );
}

export function SimpleHowItWorksSection({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="container mx-auto px-6 max-w-5xl">
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
    </section>
  );
}

export default WhyMembersJoinSection;
