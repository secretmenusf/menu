import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife from '@/components/SeedOfLife';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';
import {
  Check,
  X,
  Minus,
  ChefHat,
  Leaf,
  Heart,
  Sparkles,
  Recycle,
  Flame,
  Search,
  Calendar,
  ArrowRight,
  Star,
  Quote,
} from 'lucide-react';
import {
  competitors,
  comparisonCategories,
  valueProps,
  quickStats,
  switcherTestimonials,
  type Competitor,
} from '@/data/competitors';
import { cn } from '@/lib/utils';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Leaf,
  ChefHat,
  Heart,
  Sparkles,
  Recycle,
  Flame,
  Search,
  Calendar,
};

// Render feature value
const FeatureValue = ({ value }: { value: string | boolean }) => {
  if (value === true) {
    return <Check className="h-5 w-5 text-emerald-500" />;
  }
  if (value === false) {
    return <X className="h-5 w-5 text-zinc-600" />;
  }
  // String value
  return <span className="text-xs text-zinc-400">{value}</span>;
};

// Category selector tabs
const CategoryTabs = ({
  categories,
  selected,
  onSelect,
}: {
  categories: typeof comparisonCategories;
  selected: string;
  onSelect: (id: string) => void;
}) => (
  <div className="flex flex-wrap justify-center gap-3 mb-12">
    {categories.map((cat) => {
      const Icon = iconMap[cat.icon] || Leaf;
      return (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'flex items-center gap-3 px-6 py-3 rounded-full border transition-all font-display text-xs tracking-wider',
            selected === cat.id
              ? 'bg-foreground text-background border-foreground'
              : 'border-border/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
          {cat.name}
        </button>
      );
    })}
  </div>
);

// Competitor card for mobile
const CompetitorCard = ({ competitor }: { competitor: Competitor }) => (
  <div className="p-6 border border-border/30 rounded-2xl bg-card/30">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h4 className="font-display text-sm tracking-wide text-foreground mb-1">
          {competitor.name}
        </h4>
        <p className="text-xs text-muted-foreground">{competitor.tagline}</p>
      </div>
      <Badge variant="outline" className="text-[10px]">
        {competitor.priceRange}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground/70 leading-relaxed">{competitor.description}</p>
  </div>
);

// Quick stats section
const QuickStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-28">
    {quickStats.map((stat) => (
      <div
        key={stat.label}
        className="text-center p-6 border border-border/30 rounded-2xl bg-card/30"
      >
        <p className="font-display text-xs tracking-wider text-muted-foreground mb-4">
          {stat.label}
        </p>
        <div className="space-y-2">
          <p className="font-display text-2xl text-emerald-400">{stat.secretMenu}</p>
          <p className="text-xs text-zinc-500">vs {stat.average}</p>
        </div>
      </div>
    ))}
  </div>
);

// Value props section
const ValuePropsSection = () => (
  <div className="mb-32">
    <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-center text-mystical mb-16">
      WHY WE'RE DIFFERENT
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {valueProps.map((prop) => {
        const Icon = iconMap[prop.icon] || Sparkles;
        const hasImage = 'image' in prop && prop.image;

        return (
          <div
            key={prop.title}
            className={cn(
              "relative p-8 border border-border/30 rounded-2xl hover:border-amber-500/30 transition-colors overflow-hidden",
              hasImage ? "min-h-[280px] flex flex-col justify-end" : "bg-card/30"
            )}
          >
            {/* Background image */}
            {hasImage && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${(prop as any).image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
              </>
            )}

            {/* Content */}
            <div className={cn("relative z-10", hasImage && "text-white")}>
              <h3 className={cn(
                "font-display text-sm tracking-wider mb-5",
                hasImage ? "text-white" : "text-foreground"
              )}>
                {prop.title}
              </h3>
              <p className={cn(
                "font-body text-base leading-relaxed",
                hasImage ? "text-white/80" : "text-muted-foreground"
              )}>
                {prop.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Comparison table
const ComparisonTable = ({
  category,
  selectedCompetitors,
}: {
  category: (typeof comparisonCategories)[0];
  selectedCompetitors: string[];
}) => {
  const visibleCompetitors = competitors.filter((c) =>
    selectedCompetitors.includes(c.id)
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-6 px-6 font-display text-xs tracking-wider text-muted-foreground">
              Feature
            </th>
            <th className="py-6 px-6 font-display text-xs tracking-wider text-amber-400 text-center min-w-[120px]">
              <div className="flex flex-col items-center gap-2">
                <SeedOfLife size={24} className="text-amber-500" />
                Secret Menu
              </div>
            </th>
            {visibleCompetitors.map((comp) => (
              <th
                key={comp.id}
                className="py-6 px-6 font-display text-xs tracking-wider text-muted-foreground text-center min-w-[120px]"
              >
                {comp.name.split(' / ')[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {category.features.map((feature, idx) => (
            <tr
              key={feature.name}
              className={cn(
                'border-b border-border/30 transition-colors',
                feature.highlight && 'bg-amber-500/5',
                idx % 2 === 0 ? 'bg-card/20' : ''
              )}
            >
              <td className="py-5 px-6">
                <div className="flex items-center gap-3">
                  <span className="font-body text-sm text-foreground">
                    {feature.name}
                  </span>
                  {feature.highlight && (
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  )}
                </div>
              </td>
              <td className="py-5 px-6 text-center">
                <div className="flex justify-center">
                  <FeatureValue value={feature.secretMenu} />
                </div>
              </td>
              {visibleCompetitors.map((comp) => (
                <td key={comp.id} className="py-5 px-6 text-center">
                  <div className="flex justify-center">
                    <FeatureValue value={feature.competitors[comp.id]} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Switcher testimonials
const SwitcherTestimonials = () => (
  <div className="mb-32">
    <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-center text-mystical mb-6">
      FROM THOSE WHO SWITCHED
    </h2>
    <p className="font-body text-lg text-muted-foreground text-center mb-16 max-w-xl mx-auto">
      Real testimonials from customers who tried other services first
    </p>
    <div className="grid md:grid-cols-3 gap-8">
      {switcherTestimonials.map((testimonial, idx) => (
        <div
          key={idx}
          className="p-8 border border-border/30 rounded-2xl bg-card/30 relative"
        >
          <Quote className="absolute top-6 right-6 h-10 w-10 text-amber-500/20" />
          <p className="font-body text-base text-muted-foreground leading-relaxed mb-6 italic">
            "{testimonial.quote}"
          </p>
          <div className="flex items-center justify-between">
            <p className="font-display text-xs tracking-wider text-foreground">
              — {testimonial.author}
            </p>
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Previously: {testimonial.previous}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main compare page
const Compare = () => {
  const [selectedCategory, setSelectedCategory] = useState('ingredients');
  const [selectedCompetitors, setSelectedCompetitors] = useState([
    'ubereats',
    'hellofresh',
    'factor',
    'thistle',
  ]);

  const currentCategory = comparisonCategories.find(
    (c) => c.id === selectedCategory
  );

  const toggleCompetitor = (id: string) => {
    setSelectedCompetitors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        {...pageSEO.compare}
        url="https://secretmenusf.com/compare"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://secretmenusf.com' },
          { name: 'Compare', url: 'https://secretmenusf.com/compare' },
        ])}
      />

      {/* Full-width background image - covers viewport until fold */}
      <div className="fixed inset-0 h-screen w-full z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/the-difference-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <Header />

      {/* Hero Section - transparent to show background */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
        <div className="text-center px-8">
          <SeedOfLife size={56} className="text-white mx-auto mb-8" />
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.2em] text-white mb-6">
            THE DIFFERENCE
          </h1>
          <p className="font-body text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Not all meal delivery is created equal.
          </p>
          <p className="font-body text-lg text-white/70 max-w-2xl mx-auto">
            See how SF Secret Menu compares to meal kits, delivery apps, and premium wellness services.
          </p>
        </div>
      </div>

      {/* Main content - scrolls over the background */}
      <main className="relative z-10 flex-1 pb-32 bg-background">
        <div className="container mx-auto px-8 max-w-6xl pt-28">

          {/* Quick Stats */}
          <QuickStats />

          {/* Value Props */}
          <ValuePropsSection />

          {/* Detailed Comparison */}
          <div className="mb-32">
            <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-center text-mystical mb-6">
              DETAILED COMPARISON
            </h2>
            <p className="font-body text-lg text-muted-foreground text-center mb-12">
              Click any category to see how we stack up
            </p>

            {/* Category Tabs */}
            <CategoryTabs
              categories={comparisonCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            {/* Competitor Filter */}
            <div className="mb-10">
              <p className="font-display text-xs tracking-wider text-muted-foreground text-center mb-5">
                COMPARE WITH
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {competitors.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => toggleCompetitor(comp.id)}
                    className={cn(
                      'px-5 py-2.5 rounded-full border text-xs font-body transition-all',
                      selectedCompetitors.includes(comp.id)
                        ? 'border-foreground/50 text-foreground bg-card/50'
                        : 'border-border/30 text-muted-foreground/50 hover:border-border/50'
                    )}
                  >
                    {comp.name.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            {currentCategory && (
              <div className="border border-border/30 rounded-2xl bg-card/20 overflow-hidden">
                <ComparisonTable
                  category={currentCategory}
                  selectedCompetitors={selectedCompetitors}
                />
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-emerald-500" />
                <span>Yes / Full Support</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="h-5 w-5 text-zinc-600" />
                <span>No / Not Available</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Key Differentiator</span>
              </div>
            </div>
          </div>

          {/* Competitor Cards (Mobile-friendly overview) */}
          <div className="mb-32 lg:hidden">
            <h3 className="font-display text-lg tracking-wider text-center text-muted-foreground mb-10">
              COMPETITORS OVERVIEW
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {competitors.map((comp) => (
                <CompetitorCard key={comp.id} competitor={comp} />
              ))}
            </div>
          </div>

          {/* Switcher Testimonials */}
          <SwitcherTestimonials />

          {/* CTA Section */}
          <div className="text-center py-20 px-8 border border-amber-500/20 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 animate-gradient">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] text-foreground mb-6">
              READY TO TASTE THE DIFFERENCE?
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-12 max-w-lg mx-auto">
              Join the Bay Area's most discerning food lovers. Experience what real quality tastes like.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link to="/order">
                <Button size="lg" className="px-12 py-6 font-display tracking-wider text-base">
                  START YOUR JOURNEY
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-12 py-6 font-display tracking-wider text-base"
                >
                  VIEW THIS WEEK'S MENU
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Compare;
