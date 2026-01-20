import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';

const heroImages = [
  { src: '/images/menu/plated/misoglazedcod.png', alt: 'Miso Glazed Cod' },
  { src: '/images/menu/plated/searedduckbreast.png', alt: 'Seared Duck Breast' },
  { src: '/images/menu/plated/crazycaprese.png', alt: 'Crazy Caprese' },
  { src: '/images/menu/plated/goldensweetpotatognocchi.png', alt: 'Sweet Potato Gnocchi' },
  { src: '/images/menu/plated/chickenpaella.png', alt: 'Chicken Paella' },
  { src: '/images/menu/plated/basquecheesecake.png', alt: 'Basque Cheesecake' },
];

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="container mx-auto px-6 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="relative z-10 animate-reveal lg:pr-8">
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

            <p className="font-body text-sm tracking-[0.4em] text-muted-foreground mb-4 uppercase">
              San Francisco's Gastronomic Meal Service
            </p>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[0.1em] text-mystical mb-6">
              SECRET
              <span className="block text-muted-foreground mt-1">MENU</span>
            </h1>

            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mb-2">
              Chef-crafted organic meals delivered to your doorstep.
            </p>
            <p className="font-body text-lg md:text-xl text-foreground font-medium mb-8">
              Food that nourishes the body, mind, and soul.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
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

          {/* Right side - Image grid */}
          <div className="relative hidden lg:block">
            {/* Gradient overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10 pointer-events-none" />

            {/* Image grid - 2x3 masonry-style layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-4 pt-12">
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-muted shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={heroImages[0].src}
                    alt={heroImages[0].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={heroImages[1].src}
                    alt={heroImages[1].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right column - offset */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={heroImages[2].src}
                    alt={heroImages[2].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-muted shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={heroImages[3].src}
                    alt={heroImages[3].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={heroImages[4].src}
                    alt={heroImages[4].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile image carousel */}
          <div className="lg:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {heroImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-40 h-40 rounded-2xl overflow-hidden bg-muted shadow-lg"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
