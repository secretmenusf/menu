import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  CalendarCheck,
  ChefHat,
  Truck,
  UtensilsCrossed,
  ArrowRight,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
}

const steps: Step[] = [
  {
    number: '01',
    icon: Sparkles,
    title: 'Choose Your Plan',
    description: 'Select Access, Plus, Solo Dev, or Hacker House',
    details: [
      'From $29/mo',
      'Meal credits included on higher tiers',
      'Cancel anytime',
    ],
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Customize Your Week',
    description: 'Pick your meals or let Chef Antje surprise you',
    details: [
      'Browse the weekly menu',
      'Note dietary preferences',
      'Request special dishes',
    ],
  },
  {
    number: '03',
    icon: ChefHat,
    title: 'We Prepare Fresh',
    description: 'Your meals are crafted with organic ingredients',
    details: [
      'Sourced from local farms',
      'Made fresh, never frozen',
      'Restaurant-quality plating',
    ],
  },
  {
    number: '04',
    icon: Truck,
    title: 'Delivered to You',
    description: 'Receive your meals the following week',
    details: [
      'Order by Friday',
      'Delivered next week',
      'Temperature-controlled',
    ],
  },
  {
    number: '05',
    icon: UtensilsCrossed,
    title: 'Enjoy & Nourish',
    description: 'Heat, serve, and savor chef-crafted excellence',
    details: [
      'Simple reheating instructions',
      'Pairs beautifully',
      'Nutritional info included',
    ],
  },
];

// Compact horizontal version
export function HowItWorksCompact({ className }: { className?: string }) {
  return (
    <div className={cn('py-8', className)}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
        {steps.slice(0, 4).map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-foreground/10 border border-foreground/30 flex items-center justify-center mb-2">
                <step.icon className="h-6 w-6 text-foreground" />
              </div>
              <p className="font-display text-xs tracking-wider text-foreground">
                {step.title}
              </p>
            </div>
            {index < 3 && (
              <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Full section with details
export function HowItWorksSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-20 bg-background', className)}>
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="font-display text-xs tracking-[0.4em] text-muted-foreground mb-6">
            SIMPLE & SEAMLESS
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] text-foreground mb-6">
            HOW IT WORKS
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From farm to your table in five simple steps. Experience the ease of having
            a personal chef without the complexity.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-foreground/50 via-foreground/20 to-transparent hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  'relative lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center',
                  index % 2 === 1 && 'lg:flex-row-reverse'
                )}
              >
                {/* Step Content */}
                <div className={cn(
                  'lg:text-left',
                  index % 2 === 1 ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right'
                )}>
                  <div className={cn(
                    'p-6 border border-border/30 rounded-xl bg-card/30',
                    'hover:border-foreground/30 transition-all duration-300',
                    'lg:mb-0 mb-4'
                  )}>
                    <div className={cn(
                      'flex items-center gap-4 mb-4',
                      index % 2 === 1 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    )}>
                      <span className="font-display text-4xl text-foreground/30">
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-display text-lg tracking-wider text-foreground">
                          {step.title}
                        </h3>
                        <p className="font-body text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <ul className={cn(
                      'space-y-2',
                      index % 2 === 1 ? 'lg:text-left' : 'lg:text-right'
                    )}>
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className={cn(
                            'flex items-center gap-2 text-sm text-muted-foreground',
                            index % 2 === 1 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                          )}
                        >
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Center Icon (visible on lg) */}
                <div className={cn(
                  'hidden lg:flex absolute left-1/2 -translate-x-1/2',
                  'w-16 h-16 rounded-full',
                  'bg-gradient-to-br from-foreground/20 to-muted-foreground/10',
                  'border border-foreground/30',
                  'items-center justify-center',
                  'z-10'
                )}>
                  <step.icon className="h-8 w-8 text-foreground" />
                </div>

                {/* Mobile Icon */}
                <div className="lg:hidden flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-foreground/10 border border-foreground/30 flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-foreground" />
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className={cn(
                  'hidden lg:block',
                  index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2'
                )} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/join">
            <Button size="lg" className="px-10 font-display tracking-wider">
              JOIN FROM $29/MO
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="font-body text-sm text-muted-foreground mt-4">
            SF Bay Area delivery • Chef AI included • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
