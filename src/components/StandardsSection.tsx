import {
  Beef,
  Leaf,
  Ban,
  Droplet,
  ShieldX,
  Container,
  Fish,
  Wheat,
} from 'lucide-react';
import { suppliers, certifications } from '@/data/suppliers';
import { supplierLogos, certificationLogos } from '@/components/supplier-logos';
import { cn } from '@/lib/utils';

// Bento card component
const BentoCard = ({
  icon: Icon,
  value,
  label,
  color,
  className,
  size = 'default',
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  className?: string;
  size?: 'default' | 'large' | 'wide';
}) => {
  const isLarge = size === 'large';
  const isWide = size === 'wide';

  return (
    <div
      className={cn(
        'relative rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm p-6',
        'hover:border-border hover:bg-card/50 transition-all duration-300',
        'flex flex-col',
        isLarge && 'row-span-2',
        isWide && 'col-span-2',
        className
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
          'bg-foreground/5 border border-border/30'
        )}
      >
        <Icon className={cn('w-6 h-6', color)} />
      </div>
      <div className="mt-auto">
        <span
          className={cn(
            'font-display tracking-wide text-foreground block',
            isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
          )}
        >
          {value}
        </span>
        <span className="text-sm text-muted-foreground tracking-wider uppercase mt-2 block">
          {label}
        </span>
      </div>
    </div>
  );
};

// Certification bento card
const CertificationCard = ({
  certId,
  label,
  sublabel,
  className,
}: {
  certId: string;
  label: string;
  sublabel: string;
  className?: string;
}) => {
  const Logo = certificationLogos[certId];
  return (
    <div
      className={cn(
        'relative rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6',
        'hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300',
        'flex flex-col items-center justify-center text-center',
        className
      )}
    >
      {Logo && <Logo className="h-10 w-10 text-emerald-500 mb-3" />}
      <span className="font-display text-lg tracking-wide text-foreground">
        {label}
      </span>
      <span className="text-xs text-muted-foreground tracking-wider uppercase mt-1">
        {sublabel}
      </span>
    </div>
  );
};

// Supplier logo item
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

// Main Standards Section - Bento Grid Design
const StandardsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
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

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {/* Row 1 */}
          <BentoCard
            icon={Beef}
            value="40–60g"
            label="Quality Protein"
            color="text-red-400"
            size="large"
            className="min-h-[200px]"
          />
          <BentoCard
            icon={Leaf}
            value="100%"
            label="Organic Produce"
            color="text-emerald-400"
            className="min-h-[140px]"
          />
          <BentoCard
            icon={Ban}
            value="Zero"
            label="Processed Foods"
            color="text-amber-400"
            className="min-h-[140px]"
          />
          <BentoCard
            icon={Fish}
            value="Wild"
            label="Caught Seafood"
            color="text-sky-400"
            size="large"
            className="min-h-[200px]"
          />

          {/* Row 2 */}
          <BentoCard
            icon={Droplet}
            value="No"
            label="Seed Oils"
            color="text-blue-400"
            className="min-h-[140px]"
          />
          <BentoCard
            icon={ShieldX}
            value="60+"
            label="Banned Ingredients"
            color="text-purple-400"
            className="min-h-[140px]"
          />

          {/* Row 3 - Wide cards */}
          <BentoCard
            icon={Wheat}
            value="8g+"
            label="Fiber Per Meal"
            color="text-yellow-400"
            size="wide"
            className="min-h-[140px]"
          />
          <BentoCard
            icon={Container}
            value="Glass"
            label="Reusable Jars"
            color="text-cyan-400"
            size="wide"
            className="min-h-[140px]"
          />
        </div>

        {/* Certifications Bento Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
          <CertificationCard
            certId="usda-organic"
            label="USDA"
            sublabel="Organic Certified"
          />
          <CertificationCard
            certId="certified-humane"
            label="Certified"
            sublabel="Humane Raised"
          />
          <CertificationCard
            certId="grass-fed"
            label="100%"
            sublabel="Grass-Fed Beef"
          />
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

        {/* Supplier logos grid */}
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
