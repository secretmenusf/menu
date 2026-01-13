import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileStickyCTAProps {
  className?: string;
}

export function MobileStickyCTA({ className }: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const location = useLocation();

  // Pages where CTA should not appear
  const hiddenPaths = ['/order', '/checkout', '/login', '/signup', '/admin'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    if (shouldHide || isDismissed) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling 300px
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide, isDismissed]);

  // Reset dismissed state on path change
  useEffect(() => {
    setIsDismissed(false);
  }, [location.pathname]);

  if (shouldHide || !isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'transform transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        className
      )}
    >
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* CTA Bar */}
      <div className="bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3 safe-area-pb">
        <div className="flex items-center gap-3">
          {/* Rating badge */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-display text-amber-400">4.9</span>
          </div>

          {/* Main CTA */}
          <Link to="/order" className="flex-1">
            <Button
              size="lg"
              className="w-full font-display tracking-wider text-sm py-5"
            >
              ORDER NOW
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Subtext */}
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Free delivery • 100% organic • Made fresh daily
        </p>
      </div>
    </div>
  );
}

// Floating action button alternative (simpler)
export function FloatingOrderButton({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const hiddenPaths = ['/order', '/checkout', '/login', '/signup', '/admin'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    if (shouldHide) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  if (shouldHide || !isVisible) return null;

  return (
    <Link to="/order">
      <Button
        size="lg"
        className={cn(
          'fixed bottom-6 right-6 z-50 rounded-full shadow-xl',
          'bg-amber-500 hover:bg-amber-400 text-background',
          'px-6 font-display tracking-wider',
          'transform transition-all duration-300',
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          'lg:hidden',
          className
        )}
      >
        ORDER
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  );
}

export default MobileStickyCTA;
