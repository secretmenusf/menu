import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import SeedOfLife3D from './SeedOfLife3D';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(0_0%_1%)_80%)]" />

      <div className="relative z-10 text-center px-6 animate-reveal">
        {/* Rating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-display text-sm text-amber-400">4.9</span>
            <span className="text-xs text-muted-foreground">• 127 Reviews</span>
          </div>
        </div>

        <p className="font-body text-sm tracking-[0.4em] text-muted-foreground mb-4 uppercase">
          San Francisco's Premier Private Kitchen
        </p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-mystical mb-4">
          SECRET
          <span className="block text-muted-foreground mt-2">MENU</span>
        </h1>

        {/* Seed of Life */}
        <div className="flex justify-center mb-6">
          <SeedOfLife3D size={200} />
        </div>

        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-3">
          Chef-crafted organic meals delivered fresh daily.
          <br />
          <span className="text-foreground font-medium">Nourishing body, mind, and soul.</span>
        </p>

        <p className="font-body text-sm text-muted-foreground/70 mb-8">
          100% Organic • Locally-Sourced • Never Frozen • Same-Day Delivery
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link to="/order">
            <Button size="lg" className="px-10 font-display tracking-wider text-base">
              START YOUR JOURNEY
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/compare">
            <Button variant="outline" size="lg" className="px-8 font-display tracking-wider">
              WHY WE'RE DIFFERENT
            </Button>
          </Link>
        </div>

        {/* Quick trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            USDA Organic
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Bay Area Farms
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Chef Prepared
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Free Delivery
          </span>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-slow">
        <span className="font-body text-xs tracking-widest text-muted-foreground">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-foreground/50 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
