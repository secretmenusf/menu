import { useRef } from 'react';
import {
  Beef,
  Leaf,
  Ban,
  Droplets,
  ShieldX,
  Container,
  Fish,
  Wheat,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { standards, suppliers, certifications } from '@/data/suppliers';
import { supplierLogos, certificationLogos } from '@/components/supplier-logos';
import { cn } from '@/lib/utils';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Beef,
  Leaf,
  Ban,
  Droplets,
  ShieldX,
  Container,
  Fish,
  Wheat,
};

// Standard card component
const StandardCard = ({ standard }: { standard: typeof standards[0] }) => {
  const Icon = iconMap[standard.icon] || Leaf;

  return (
    <div
      className={cn(
        'flex-shrink-0 w-[280px] p-6 rounded-2xl border transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-lg',
        standard.highlight
          ? 'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30 hover:border-amber-500/50'
          : 'bg-card/30 border-border/30 hover:border-border/50'
      )}
    >
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
        standard.highlight
          ? 'bg-amber-500/20'
          : 'bg-muted/50'
      )}>
        <Icon className={cn(
          'h-7 w-7',
          standard.highlight ? 'text-amber-500' : 'text-foreground'
        )} />
      </div>

      <div className="mb-3">
        <span className={cn(
          'font-display text-3xl tracking-wide',
          standard.highlight ? 'text-amber-400' : 'text-foreground'
        )}>
          {standard.title}
        </span>
        {standard.subtitle && (
          <p className="font-display text-sm tracking-wider text-muted-foreground mt-1">
            {standard.subtitle.toUpperCase()}
          </p>
        )}
      </div>

      <p className="font-body text-sm text-muted-foreground leading-relaxed">
        {standard.description}
      </p>
    </div>
  );
};

// Supplier card component
const SupplierCard = ({ supplier }: { supplier: typeof suppliers[0] }) => {
  const Logo = supplierLogos[supplier.id];

  return (
    <a
      href={supplier.website}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[200px] group"
    >
      <div className="p-4 rounded-xl border border-border/30 bg-card/20 hover:border-amber-500/30 hover:bg-card/40 transition-all duration-300 h-full">
        {/* Monochrome Logo */}
        <div className="h-14 flex items-center justify-center mb-3">
          {Logo ? (
            <Logo className="w-full h-full text-foreground/70 group-hover:text-foreground transition-colors" />
          ) : (
            <span className="font-display text-sm tracking-wider text-foreground/70">
              {supplier.name}
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {supplier.location}
        </div>
      </div>
    </a>
  );
};

// Certification badge with SVG logo
const CertificationBadge = ({ cert }: { cert: typeof certifications[0] }) => {
  const Logo = certificationLogos[cert.id];

  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-colors">
      {Logo && (
        <Logo className="h-10 w-10 text-emerald-500" />
      )}
      <div>
        <span className="font-display text-xs tracking-wider text-foreground block">
          {cert.name.toUpperCase()}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {cert.description}
        </span>
      </div>
    </div>
  );
};

// Horizontal scroll container with buttons
const ScrollContainer = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-[5]" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-[5]" />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-4 overflow-x-auto scrollbar-hide px-6 py-2',
          'scroll-smooth snap-x snap-mandatory',
          className
        )}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

// Main Standards Section
const StandardsSection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-sm tracking-[0.3em] text-muted-foreground mb-3 uppercase">
            What Sets Us Apart
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-mystical mb-4">
            UNWAVERING STANDARDS
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Most meal services claim to be "healthy" — but use processed ingredients,
            cheap oils, and hidden sugars.{' '}
            <span className="text-foreground font-medium">
              Here's what healthy actually means to us.
            </span>
          </p>
        </div>

        {/* Standards carousel */}
        <div className="mb-16">
          <ScrollContainer>
            {standards.map((standard) => (
              <StandardCard key={standard.id} standard={standard} />
            ))}
          </ScrollContainer>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {certifications.map((cert) => (
            <CertificationBadge key={cert.id} cert={cert} />
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-border/30" />
          <span className="font-display text-xs tracking-[0.3em] text-muted-foreground">
            OUR PARTNERS
          </span>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        {/* Suppliers header */}
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl tracking-[0.15em] text-foreground mb-3">
            BAY AREA SOURCED
          </h3>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
            You deserve to know where your food comes from. We source from the best
            local organic producers. Detailed sourcing information available on all meals.
          </p>
        </div>

        {/* Suppliers carousel */}
        <ScrollContainer>
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </ScrollContainer>
      </div>
    </section>
  );
};

export default StandardsSection;
