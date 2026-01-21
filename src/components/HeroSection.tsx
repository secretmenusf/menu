import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';

const heroImage = {
  src: '/images/menu/plated/hero-pasta-hand.png',
  hoverSrc: '/images/menu/plated/hero-pasta-hand-hover.png',
  alt: 'Hand lifting pasta from a plate'
};

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-end lg:min-h-screen">
          {/* Left side - Text content */}
          <div className="relative z-10 animate-reveal px-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-12 py-20 lg:py-0 lg:self-center">
            {/* Rating Badge - Links to reviews page */}
            <div className="flex mb-6">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/20 hover:bg-foreground/10 transition-colors cursor-pointer"
              >
                <Star className="h-4 w-4 text-foreground fill-foreground" />
                <span className="font-display text-sm text-foreground">4.9</span>
                <span className="text-xs text-muted-foreground">• 127 Reviews</span>
              </Link>
            </div>

            <p className="font-body text-xs tracking-[0.4em] text-muted-foreground mb-6 uppercase">
              San Francisco's Gastronomic Meal Service
            </p>

            <h1 className="font-display font-semibold text-6xl md:text-7xl lg:text-8xl tracking-[0.08em] text-foreground mb-8 leading-[0.9]">
              SECRET
              <span className="block text-muted-foreground mt-0">MENU</span>
            </h1>

            <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-lg mb-3 leading-relaxed">
              Chef-crafted organic meals made to order and delivered straight to your door.
            </p>
            <p className="font-body text-xl md:text-2xl text-foreground font-medium mb-10">
              Food that nourishes the body, mind, and soul.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/order">
                <Button size="lg" className="px-10 font-display tracking-wider text-base">
                  START YOUR JOURNEY
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="outline" size="lg" className="px-8 font-display font-semibold tracking-wider hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow duration-300">
                  WHY WE'RE DIFFERENT
                </Button>
              </Link>
            </div>

            {/* Quick trust indicators */}
            <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                USDA Organic
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Bay Area Farms
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Chef Prepared
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                Free Delivery
              </span>
            </div>
          </div>

          {/* Right side - Single hero image flush to right edge, starting at the fold */}
          <Link to="/menu" className="hidden lg:block fixed bottom-0 right-0 z-0 group cursor-pointer">
            {/* Default image */}
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="h-[90vh] w-auto object-contain transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Hover image */}
            <img
              src={heroImage.hoverSrc}
              alt={heroImage.alt}
              className="h-[90vh] w-auto object-contain absolute bottom-0 right-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </Link>

          {/* Mobile image */}
          <div className="lg:hidden px-6">
            <div className="overflow-hidden">
              <img
                src={heroImage.src}
                alt={heroImage.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
