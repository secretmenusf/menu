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
  <div className="flex flex-wrap justify-center gap-2 mb-8">
    {categories.map((cat) => {
      const Icon = iconMap[cat.icon] || Leaf;
      return (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-display text-xs tracking-wider',
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
  <div className="p-4 border border-border/30 rounded-lg bg-card/30">
    <div className="flex items-start justify-between mb-2">
      <div>
        <h4 className="font-display text-sm tracking-wide text-foreground">
          {competitor.name}
        </h4>
        <p className="text-xs text-muted-foreground">{competitor.tagline}</p>
      </div>
      <Badge variant="outline" className="text-[10px]">
        {competitor.priceRange}
      </Badge>
    </div>
    <p className="text-xs text-muted-foreground/70">{competitor.description}</p>
  </div>
);

// Quick stats section
const QuickStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
    {quickStats.map((stat) => (
      <div
        key={stat.label}
        className="text-center p-4 border border-border/30 rounded-lg bg-card/30"
      >
        <p className="font-display text-xs tracking-wider text-muted-foreground mb-2">
          {stat.label}
        </p>
        <div className="space-y-1">
          <p className="font-display text-lg text-emerald-400">{stat.secretMenu}</p>
          <p className="text-xs text-zinc-500">vs {stat.average}</p>
        </div>
      </div>
    ))}
  </div>
);

// Value props section
const ValuePropsSection = () => (
  <div className="mb-20">
    <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-center text-mystical mb-12">
      WHY WE'RE DIFFERENT
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {valueProps.map((prop) => {
        const Icon = iconMap[prop.icon] || Sparkles;
        return (
          <div
            key={prop.title}
            className="p-6 border border-border/30 rounded-lg bg-card/30 hover:border-amber-500/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Icon className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="font-display text-sm tracking-wider text-foreground">
                {prop.title}
              </h3>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {prop.description}
            </p>
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
            <th className="text-left py-4 px-4 font-display text-xs tracking-wider text-muted-foreground">
              Feature
            </th>
            <th className="py-4 px-4 font-display text-xs tracking-wider text-amber-400 text-center min-w-[100px]">
              <div className="flex flex-col items-center gap-1">
                <SeedOfLife size={20} className="text-amber-500" />
                Secret Menu
              </div>
            </th>
            {visibleCompetitors.map((comp) => (
              <th
                key={comp.id}
                className="py-4 px-4 font-display text-xs tracking-wider text-muted-foreground text-center min-w-[100px]"
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
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-foreground">
                    {feature.name}
                  </span>
                  {feature.highlight && (
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center">
                  <FeatureValue value={feature.secretMenu} />
                </div>
              </td>
              {visibleCompetitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4 text-center">
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
  <div className="mb-20">
    <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-center text-mystical mb-4">
      FROM THOSE WHO SWITCHED
    </h2>
    <p className="font-body text-muted-foreground text-center mb-12 max-w-xl mx-auto">
      Real testimonials from customers who tried other services first
    </p>
    <div className="grid md:grid-cols-3 gap-6">
      {switcherTestimonials.map((testimonial, idx) => (
        <div
          key={idx}
          className="p-6 border border-border/30 rounded-lg bg-card/30 relative"
        >
          <Quote className="absolute top-4 right-4 h-8 w-8 text-amber-500/20" />
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 italic">
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
        url="https://sfsecretmenu.com/compare"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://sfsecretmenu.com' },
          { name: 'Compare', url: 'https://sfsecretmenu.com/compare' },
        ])}
      />

      <Header />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <SeedOfLife size={48} className="text-foreground mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-foreground mb-4">
              THE DIFFERENCE
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              Not all meal delivery is created equal.
            </p>
            <p className="font-body text-muted-foreground/70 max-w-2xl mx-auto">
              See how SF Secret Menu compares to meal kits, delivery apps, and premium wellness services.
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Value Props */}
          <ValuePropsSection />

          {/* Detailed Comparison */}
          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-center text-mystical mb-4">
              DETAILED COMPARISON
            </h2>
            <p className="font-body text-muted-foreground text-center mb-8">
              Click any category to see how we stack up
            </p>

            {/* Category Tabs */}
            <CategoryTabs
              categories={comparisonCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            {/* Competitor Filter */}
            <div className="mb-6">
              <p className="font-display text-xs tracking-wider text-muted-foreground text-center mb-3">
                COMPARE WITH
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {competitors.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => toggleCompetitor(comp.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full border text-xs font-body transition-all',
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
              <div className="border border-border/30 rounded-lg bg-card/20 overflow-hidden">
                <ComparisonTable
                  category={currentCategory}
                  selectedCompetitors={selectedCompetitors}
                />
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Yes / Full Support</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-zinc-600" />
                <span>No / Not Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>Key Differentiator</span>
              </div>
            </div>
          </div>

          {/* Competitor Cards (Mobile-friendly overview) */}
          <div className="mb-20 lg:hidden">
            <h3 className="font-display text-lg tracking-wider text-center text-muted-foreground mb-6">
              COMPETITORS OVERVIEW
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {competitors.map((comp) => (
                <CompetitorCard key={comp.id} competitor={comp} />
              ))}
            </div>
          </div>

          {/* Switcher Testimonials */}
          <SwitcherTestimonials />

          {/* CTA Section */}
          <div className="text-center py-12 border border-amber-500/20 rounded-2xl bg-gradient-to-b from-amber-500/5 to-transparent">
            <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-foreground mb-4">
              READY TO TASTE THE DIFFERENCE?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Join the Bay Area's most discerning food lovers. Experience what real quality tastes like.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/order">
                <Button size="lg" className="px-10 font-display tracking-wider">
                  START YOUR JOURNEY
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 font-display tracking-wider"
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
