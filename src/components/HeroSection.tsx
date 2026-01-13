import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SeedOfLife3D from './SeedOfLife3D';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(0_0%_1%)_80%)]" />

      <div className="relative z-10 text-center px-6 animate-reveal">
        <p className="font-body text-sm tracking-[0.4em] text-muted-foreground mb-6 uppercase">
          San Francisco's Private Kitchen
        </p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-mystical mb-4">
          SECRET
          <span className="block text-muted-foreground mt-2">MENU</span>
        </h1>

        {/* Seed of Life */}
        <div className="flex justify-center mb-6">
          <SeedOfLife3D size={240} />
        </div>

        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-4">
          Chef-crafted organic meals delivered to your door.
          <br />
          <span className="text-foreground">Nourishing body, mind, and soul.</span>
        </p>

        <p className="font-body text-sm text-muted-foreground/70 mb-10">
          100% Organic • Locally-Sourced • Healing Ingredients • Bay Area Delivery
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/order">
            <Button size="lg" className="px-10 font-display tracking-wider">
              START YOUR JOURNEY
            </Button>
          </Link>
          <button
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground px-8 py-3 transition-colors"
          >
            VIEW THIS WEEK'S MENU
          </button>
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
