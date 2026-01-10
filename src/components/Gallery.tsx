import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import gallery images
import spanishgildas from '@/assets/gallery/spanishgildas.png';
import spanishchickenpaella from '@/assets/gallery/spanishchickenpaella.png';
import spaininspireddinner from '@/assets/gallery/spaininspireddinner.png';
import roastbeef from '@/assets/gallery/roastbeef.png';
import ricepudding from '@/assets/gallery/ricepudding.png';
import mixedgreens from '@/assets/gallery/mixedgreens.png';
import mixedbeetsalad from '@/assets/gallery/mixedbeetsalad.png';
import kalechickenwrap from '@/assets/gallery/kalechickenwrap.png';
import grilledcheese from '@/assets/gallery/grilledcheese.png';
import falafelpita from '@/assets/gallery/falafelpita.png';
import fennelbulgursalad from '@/assets/gallery/fennelbulgursalad.png';
import duckconfit from '@/assets/gallery/duckconfit.png';
import persianrice from '@/assets/gallery/persianrice.png';
import colossalcookies from '@/assets/gallery/colossalcookies.png';
import classicdinner from '@/assets/gallery/classicdinner.png';
import capresepanini from '@/assets/gallery/capresepanini.png';
import basquecheesecake from '@/assets/gallery/basquecheesecake.png';
import padronpeppers from '@/assets/gallery/padronpeppers.png';
import beefbulgogi from '@/assets/gallery/beefbulgogi.png';
import saffronalbondigas from '@/assets/gallery/saffronalbondigas.png';

const galleryItems = [
  { src: spanishgildas, title: 'Spanish Gildas' },
  { src: spanishchickenpaella, title: 'Spanish Chicken Paella' },
  { src: spaininspireddinner, title: 'Spain Inspired Dinner' },
  { src: roastbeef, title: 'Roast Beef' },
  { src: ricepudding, title: 'Rice Pudding' },
  { src: mixedgreens, title: 'Mixed Greens' },
  { src: mixedbeetsalad, title: 'Mixed Beet Salad' },
  { src: kalechickenwrap, title: 'Kale Chicken Wrap' },
  { src: grilledcheese, title: 'Grilled Cheese' },
  { src: falafelpita, title: 'Falafel Pita' },
  { src: fennelbulgursalad, title: 'Fennel Bulgur Salad' },
  { src: duckconfit, title: 'Duck Confit' },
  { src: persianrice, title: 'Persian Rice' },
  { src: colossalcookies, title: 'Colossal Cookies' },
  { src: classicdinner, title: 'Classic Dinner' },
  { src: capresepanini, title: 'Caprese Panini' },
  { src: basquecheesecake, title: 'Basque Cheesecake' },
  { src: padronpeppers, title: 'Padrón Peppers' },
  { src: beefbulgogi, title: 'Beef Bulgogi Bowl' },
  { src: saffronalbondigas, title: 'Saffron Albondigas' },
];

// Shuffle array with a seed for consistent random order per session
const shuffleArray = <T,>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  let randomValue = seed;
  
  while (currentIndex !== 0) {
    randomValue = (randomValue * 9301 + 49297) % 233280;
    const randomIndex = Math.floor((randomValue / 233280) * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  return shuffled;
};

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<boolean[]>(new Array(galleryItems.length).fill(false));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  
  // Generate a random starting seed once per session
  const shuffledItems = useMemo(() => {
    const seed = Math.floor(Math.random() * 1000000);
    return shuffleArray(galleryItems, seed);
  }, []);

  // Staggered animation on first reveal
  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    shuffledItems.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setVisibleImages(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 90);
      timeoutsRef.current.push(timeoutId);
    });

    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, [hasAnimated, shuffledItems]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % shuffledItems.length);
    }
  }, [selectedIndex, shuffledItems.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + shuffledItems.length) % shuffledItems.length);
    }
  }, [selectedIndex, shuffledItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goNext, goPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  return (
    <>
      {/* Gallery Grid */}
      <section ref={sectionRef} className="py-20 bg-background" data-testid="gallery">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl tracking-[0.2em] text-mystical">
              THE GALLERY
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
            {shuffledItems.map((item, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={`group relative aspect-square overflow-visible rounded-xl cursor-pointer transition-all duration-700 ease-out ${
                  visibleImages[index] 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
                data-testid={`gallery-item-${index}`}
                data-visible={visibleImages[index] ? 'true' : 'false'}
              >
                {/* Subtle backglow for PNG transparency */}
                <div className="absolute inset-0 -m-2 bg-foreground/5 blur-xl rounded-2xl opacity-60 group-hover:opacity-100 group-hover:bg-foreground/10 transition-all duration-500" />
                
                {/* Image container */}
                <div className="relative w-full h-full bg-card/30 rounded-xl overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                  />
                  {/* Title overlay on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-display text-xs tracking-[0.1em] text-foreground text-center truncate">
                      {item.title.toUpperCase()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Overlay */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-accent transition-colors"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-accent transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-accent transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image container with backglow */}
          <div 
            className="relative max-w-[90vw] max-h-[80vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backglow effect for fullscreen */}
            <div className="absolute inset-0 -m-8 bg-foreground/10 blur-3xl rounded-3xl" />
            
            <img
              src={shuffledItems[selectedIndex].src}
              alt={shuffledItems[selectedIndex].title}
              className="relative max-w-full max-h-[75vh] object-contain drop-shadow-2xl"
            />
            
            {/* Title below image */}
            <p className="relative mt-6 font-display text-lg tracking-[0.2em] text-foreground">
              {shuffledItems[selectedIndex].title.toUpperCase()}
            </p>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-sm tracking-[0.2em] text-muted-foreground">
            {selectedIndex + 1} / {shuffledItems.length}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
