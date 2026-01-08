import { useState, useEffect, useCallback } from 'react';
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

const galleryImages = [
  spanishgildas,
  spanishchickenpaella,
  spaininspireddinner,
  roastbeef,
  ricepudding,
  mixedgreens,
  mixedbeetsalad,
  kalechickenwrap,
  grilledcheese,
  falafelpita,
];

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<boolean[]>(new Array(galleryImages.length).fill(false));

  // Staggered animation on mount
  useEffect(() => {
    galleryImages.forEach((_, index) => {
      setTimeout(() => {
        setVisibleImages(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 150); // 150ms stagger between each image
    });
  }, []);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % galleryImages.length);
    }
  }, [selectedIndex]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  }, [selectedIndex]);

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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-foreground text-2xl mb-4 block">✦</span>
            <h2 className="font-display text-3xl tracking-[0.2em] text-mystical">
              THE GALLERY
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
            {galleryImages.map((src, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={`group relative aspect-square overflow-visible rounded-xl cursor-pointer transition-all duration-700 ease-out ${
                  visibleImages[index] 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Subtle backglow for PNG transparency */}
                <div className="absolute inset-0 -m-2 bg-foreground/5 blur-xl rounded-2xl opacity-60 group-hover:opacity-100 group-hover:bg-foreground/10 transition-all duration-500" />
                
                {/* Image container */}
                <div className="relative w-full h-full bg-card/30 rounded-xl overflow-hidden">
                  <img
                    src={src}
                    alt={`Gallery dish ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                  />
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
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backglow effect for fullscreen */}
            <div className="absolute inset-0 -m-8 bg-foreground/10 blur-3xl rounded-3xl" />
            
            <img
              src={galleryImages[selectedIndex]}
              alt={`Gallery dish ${selectedIndex + 1}`}
              className="relative max-w-full max-h-[85vh] object-contain drop-shadow-2xl"
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-sm tracking-[0.2em] text-muted-foreground">
            {selectedIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
