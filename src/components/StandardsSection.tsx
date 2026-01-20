import { suppliers, certifications } from '@/data/suppliers';
import { supplierLogos, certificationLogos } from '@/components/supplier-logos';
import { cn } from '@/lib/utils';

// Bento card with background image
const BentoCard = ({
  value,
  label,
  image,
  className,
  size = 'default',
}: {
  value: string;
  label: string;
  image: string;
  className?: string;
  size?: 'default' | 'large' | 'wide';
}) => {
  const isLarge = size === 'large';
  const isWide = size === 'wide';

  return (
    <div
      className={cn(
        'relative rounded-3xl overflow-hidden',
        'hover:scale-[1.02] transition-all duration-300',
        'flex flex-col',
        isLarge && 'row-span-2',
        isWide && 'col-span-2',
        className
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full justify-end">
        <span
          className={cn(
            'font-display tracking-wide text-white block drop-shadow-lg',
            isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
          )}
        >
          {value}
        </span>
        <span className="text-sm text-white/80 tracking-wider uppercase mt-2 block drop-shadow">
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
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.4em] text-muted-foreground mb-6 uppercase">
            What Sets Us Apart
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.08em] text-foreground mb-8">
            UNWAVERING STANDARDS
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
            value="40–60g"
            label="Quality Protein"
            image="/images/menu/plated/proteins.jpg"
            size="large"
            className="min-h-[200px]"
          />
          <BentoCard
            value="100%"
            label="Organic Produce"
            image="/images/menu/plated/organicproduce.jpg"
            className="min-h-[140px]"
          />
          <BentoCard
            value="Zero"
            label="Processed Foods"
            image="/images/menu/plated/processedfoods.jpg"
            className="min-h-[140px]"
          />
          <BentoCard
            value="Wild"
            label="Sustainable Seafood"
            image="/images/menu/plated/linecaughtseafood.webp"
            size="large"
            className="min-h-[200px]"
          />

          {/* Row 2 */}
          <BentoCard
            value="No"
            label="Seed Oils"
            image="/images/menu/plated/noseedoils.jpg"
            className="min-h-[140px]"
          />
          <BentoCard
            value="60+"
            label="Super Foods"
            image="/images/menu/plated/superfoods.jpg"
            className="min-h-[140px]"
          />

          {/* Row 3 - Wide cards */}
          <BentoCard
            value="8g+"
            label="Fiber Per Meal"
            image="/images/menu/plated/fibermaxxing.jpg"
            size="wide"
            className="min-h-[140px]"
          />
          <BentoCard
            value="Glass"
            label="Reusable Containers"
            image="/images/menu/plated/reusableglasscontainers.jpg"
            size="wide"
            className="min-h-[140px]"
          />
        </div>

        {/* The Bay Logo */}
        <div className="flex justify-center mt-20 mb-8">
          <img
            src="/images/the-bay-logo.png"
            alt="The Bay"
            className="h-24 w-auto object-contain"
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
