import { Leaf, ShieldCheck, MapPin, Clock, Heart, Award, Truck, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadge {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  color: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: Leaf,
    label: '100% Organic',
    sublabel: 'USDA Certified',
    color: 'text-emerald-500',
  },
  {
    icon: MapPin,
    label: 'Locally Sourced',
    sublabel: 'Bay Area Farms',
    color: 'text-blue-500',
  },
  {
    icon: Clock,
    label: 'Made Fresh Daily',
    sublabel: 'Never Frozen',
    color: 'text-amber-500',
  },
  {
    icon: ShieldCheck,
    label: 'Food Safety Certified',
    sublabel: 'SF Health Dept.',
    color: 'text-sky-500',
  },
];

const certifications = [
  { label: 'USDA Organic', color: 'border-emerald-500/30 text-emerald-400' },
  { label: 'Non-GMO', color: 'border-teal-500/30 text-teal-400' },
  { label: 'Sustainable', color: 'border-blue-500/30 text-blue-400' },
  { label: 'Local First', color: 'border-amber-500/30 text-amber-400' },
];

// Compact inline badges for headers/hero
export function TrustBadgesInline({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-4 md:gap-6', className)}>
      {trustBadges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2">
          <badge.icon className={cn('h-4 w-4', badge.color)} />
          <span className="font-body text-xs text-muted-foreground">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

// Full badges section with sublabels
export function TrustBadgesSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-12 border-y border-border/30 bg-card/20', className)}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="text-center">
              <div className={cn(
                'w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50'
              )}>
                <badge.icon className={cn('h-6 w-6', badge.color)} />
              </div>
              <p className="font-display text-sm tracking-wider text-foreground">
                {badge.label}
              </p>
              {badge.sublabel && (
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {badge.sublabel}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Certification badges row
export function CertificationBadges({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-2', className)}>
      {certifications.map((cert) => (
        <span
          key={cert.label}
          className={cn(
            'px-3 py-1 text-xs font-display tracking-wider border rounded-full',
            cert.color
          )}
        >
          {cert.label}
        </span>
      ))}
    </div>
  );
}

// Guarantee badges
const guarantees = [
  { icon: Heart, label: 'Satisfaction Guaranteed', desc: 'Love it or we make it right' },
  { icon: Truck, label: 'Free Delivery', desc: 'On all subscriptions' },
  { icon: BadgeCheck, label: 'Quality Promise', desc: 'Highest standards always' },
  { icon: Award, label: '100+ 5-Star Reviews', desc: 'From Bay Area foodies' },
];

export function GuaranteeBadges({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {guarantees.map((item) => (
        <div
          key={item.label}
          className="p-4 text-center border border-border/30 rounded-lg bg-card/30 hover:border-amber-500/30 transition-colors"
        >
          <item.icon className="h-6 w-6 mx-auto mb-2 text-amber-500" />
          <p className="font-display text-xs tracking-wider text-foreground mb-1">
            {item.label}
          </p>
          <p className="font-body text-[10px] text-muted-foreground">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TrustBadgesSection;
