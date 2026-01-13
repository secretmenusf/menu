import { Star, Users, Utensils, MapPin, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
  highlight?: boolean;
}

const stats: Stat[] = [
  {
    icon: Star,
    value: '4.9',
    label: 'Rating',
    highlight: true,
  },
  {
    icon: Utensils,
    value: '2,500+',
    label: 'Meals Delivered',
  },
  {
    icon: Users,
    value: '150+',
    label: 'Happy Members',
  },
  {
    icon: MapPin,
    value: '100%',
    label: 'SF Coverage',
  },
];

const extendedStats: Stat[] = [
  ...stats,
  {
    icon: Clock,
    value: '8am-1am',
    label: 'Delivery Hours',
  },
  {
    icon: TrendingUp,
    value: '98%',
    label: 'Retention Rate',
  },
];

// Compact stats bar for header area
export function StatsBarCompact({ className }: { className?: string }) {
  return (
    <div className={cn(
      'flex items-center justify-center gap-6 py-2 px-4 bg-amber-500/5 border-b border-amber-500/10',
      className
    )}>
      {stats.slice(0, 3).map((stat) => (
        <div key={stat.label} className="flex items-center gap-1.5">
          <stat.icon className={cn(
            'h-3.5 w-3.5',
            stat.highlight ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
          )} />
          <span className={cn(
            'font-display text-xs tracking-wider',
            stat.highlight ? 'text-amber-400' : 'text-foreground'
          )}>
            {stat.value}
          </span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Full width stats section
export function StatsSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-16 bg-gradient-to-b from-background to-card/50', className)}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <p className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
            TRUSTED BY BAY AREA FOOD LOVERS
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-foreground">
            THE NUMBERS SPEAK
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 border border-border/30 rounded-xl bg-card/30 hover:border-amber-500/30 transition-colors"
            >
              <div className={cn(
                'w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center',
                stat.highlight
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-zinc-800/50 border border-zinc-700/50'
              )}>
                <stat.icon className={cn(
                  'h-7 w-7',
                  stat.highlight ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'
                )} />
              </div>
              <p className={cn(
                'font-display text-3xl md:text-4xl tracking-wide mb-1',
                stat.highlight ? 'text-amber-400' : 'text-foreground'
              )}>
                {stat.value}
              </p>
              <p className="font-body text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Inline stats for hero area
export function StatsInline({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-8', className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <stat.icon className={cn(
            'h-5 w-5',
            stat.highlight ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
          )} />
          <div className="text-left">
            <p className={cn(
              'font-display text-lg tracking-wider leading-none',
              stat.highlight ? 'text-amber-400' : 'text-foreground'
            )}>
              {stat.value}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Mini rating badge
export function RatingBadge({ className }: { className?: string }) {
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
      'bg-amber-500/10 border border-amber-500/30',
      className
    )}>
      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
      <span className="font-display text-sm text-amber-400">4.9</span>
      <span className="text-xs text-muted-foreground">(127 reviews)</span>
    </div>
  );
}

export default StatsSection;
