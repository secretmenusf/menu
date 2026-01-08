import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  '/lovable-uploads/1c6a1b50-b2c5-45f7-ac79-1e20c5b29cd7.png',
  '/lovable-uploads/66a0e9f1-4b56-4d70-957b-45a73568f46e.png',
  '/lovable-uploads/c5269a9e-1e19-48e1-8e91-b8ad29cc6ffd.png',
  '/lovable-uploads/e2e7f7b1-18ed-4e59-9e4f-e29fd6f1dd58.png',
  '/lovable-uploads/69e5d405-b6d0-4aca-9953-eff9fb1c6b64.png',
  '/lovable-uploads/0faa65a3-2aa7-4e9c-9b15-0f51b0cbb9ab.png',
];

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {galleryImages.map((src, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-card cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Subtle backglow */}
                <div className="absolute inset-0 bg-gradient-radial from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-4 bg-foreground/10 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                
                <img
                  src={src}
                  alt={`Gallery dish ${index + 1}`}
                  className="relative w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
                />
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

          {/* Image container */}
          <div 
            className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backglow effect */}
            <div className="absolute inset-0 bg-foreground/5 blur-3xl scale-110" />
            
            <img
              src={galleryImages[selectedIndex]}
              alt={`Gallery dish ${selectedIndex + 1}`}
              className="relative max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
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
