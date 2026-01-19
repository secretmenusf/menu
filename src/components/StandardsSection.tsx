import {
  Beef,
  Leaf,
  Ban,
  Droplet,
  ShieldX,
  Container,
  Fish,
  Wheat,
  MapPin,
  Check,
} from 'lucide-react';
import { suppliers, certifications } from '@/data/suppliers';
import { supplierLogos, certificationLogos } from '@/components/supplier-logos';
import { cn } from '@/lib/utils';

// Our standards data
const standards = [
  {
    icon: Beef,
    value: '40–60g',
    label: 'Quality Protein',
    color: 'text-red-400',
  },
  {
    icon: Leaf,
    value: '100%',
    label: 'Organic Produce',
    color: 'text-emerald-400',
  },
  {
    icon: Ban,
    value: 'Zero',
    label: 'Processed Foods',
    color: 'text-amber-400',
  },
  {
    icon: Droplet,
    value: 'No',
    label: 'Seed Oils',
    color: 'text-blue-400',
  },
  {
    icon: ShieldX,
    value: '60+',
    label: 'Banned Ingredients',
    color: 'text-purple-400',
  },
  {
    icon: Container,
    value: 'Glass',
    label: 'Reusable Jars',
    color: 'text-cyan-400',
  },
  {
    icon: Fish,
    value: 'Wild',
    label: 'Caught Seafood',
    color: 'text-sky-400',
  },
  {
    icon: Wheat,
    value: '8g+',
    label: 'Fiber Per Meal',
    color: 'text-yellow-400',
  },
];

// Standard item - clean minimal design
const StandardItem = ({ standard }: { standard: typeof standards[0] }) => {
  const Icon = standard.icon;
  return (
    <div className="flex flex-col items-center text-center group">
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center mb-3',
        'bg-card/50 border border-border/50 group-hover:border-border transition-colors'
      )}>
        <Icon className={cn('w-5 h-5', standard.color)} />
      </div>
      <span className="font-display text-xl tracking-wide text-foreground">
        {standard.value}
      </span>
      <span className="text-xs text-muted-foreground tracking-wider uppercase mt-1">
        {standard.label}
      </span>
    </div>
  );
};

// Supplier logo item - simplified
const SupplierLogo = ({ supplier }: { supplier: typeof suppliers[0] }) => {
  const Logo = supplierLogos[supplier.id];

  return (
    <a
      href={supplier.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center"
      title={`${supplier.name} - ${supplier.location}`}
    >
      <div className="h-10 w-28 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
        {Logo ? (
          <Logo className="w-full h-full text-foreground" />
        ) : (
          <span className="font-display text-xs tracking-wider text-foreground">
            {supplier.name}
          </span>
        )}
      </div>
    </a>
  );
};

// Main Standards Section - cleaner design
const StandardsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] text-muted-foreground mb-4 uppercase">
            What Sets Us Apart
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.1em] text-foreground mb-6">
            UNWAVERING STANDARDS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Most meal services claim to be "healthy" — but use processed ingredients,
            cheap oils, and hidden sugars.{' '}
            <span className="text-foreground">
              Here's what healthy actually means to us.
            </span>
          </p>
        </div>

        {/* Standards Grid - 4x2 on desktop, 2x4 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
          {standards.map((standard, idx) => (
            <StandardItem key={idx} standard={standard} />
          ))}
        </div>

        {/* Certifications - horizontal row */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {certifications.map((cert) => {
            const Logo = certificationLogos[cert.id];
            return (
              <div
                key={cert.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5"
              >
                {Logo && <Logo className="h-6 w-6 text-emerald-500" />}
                <span className="text-xs tracking-wider text-foreground">
                  {cert.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-16">
          <div className="flex-1 h-px bg-border/30" />
          <span className="text-xs tracking-[0.3em] text-muted-foreground">
            BAY AREA SOURCED
          </span>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        {/* Supplier description */}
        <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto mb-10">
          You deserve to know where your food comes from. We partner with the best
          local organic producers in California.
        </p>

        {/* Supplier logos grid - clean monochrome */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center">
          {suppliers.map((supplier) => (
            <SupplierLogo key={supplier.id} supplier={supplier} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StandardsSection;
