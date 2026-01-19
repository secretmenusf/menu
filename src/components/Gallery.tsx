import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Gallery items using new menu images from public folder
const galleryItems = [
  { src: '/images/menu/arugula-salad-artichoke.png', title: 'Arugula Salad with Artichoke' },
  { src: '/images/menu/basque-cheesecake.png', title: 'Basque Cheesecake' },
  { src: '/images/menu/beet-salad.png', title: 'Beet Salad' },
  { src: '/images/menu/bulgur-salad.png', title: 'Bulgur Salad' },
  { src: '/images/menu/butternut-squash-soup.png', title: 'Butternut Squash Soup' },
  { src: '/images/menu/chicken-caesar-wrap.png', title: 'Chicken Caesar Wrap' },
  { src: '/images/menu/chicken-harissa.png', title: 'Chicken Harissa' },
  { src: '/images/menu/chicken-paella.png', title: 'Chicken Paella' },
  { src: '/images/menu/chicken-piccata.png', title: 'Chicken Piccata' },
  { src: '/images/menu/chocolate-chip-cookies.png', title: 'Chocolate Chip Cookies' },
  { src: '/images/menu/crab-cakes.png', title: 'Crab Cakes' },
  { src: '/images/menu/crazy-caprese.png', title: 'Crazy Caprese' },
  { src: '/images/menu/crispy-persian-rice.png', title: 'Crispy Persian Rice' },
  { src: '/images/menu/duck-confit.png', title: 'Duck Confit' },
  { src: '/images/menu/garlic-noodles.png', title: 'Garlic Noodles' },
  { src: '/images/menu/golden-sweet-potato-gnocchi.png', title: 'Golden Sweet Potato Gnocchi' },
  { src: '/images/menu/grilled-cheese-tomato-soup.png', title: 'Grilled Cheese & Tomato Soup' },
  { src: '/images/menu/miso-glazed-cod.png', title: 'Miso Glazed Cod' },
  { src: '/images/menu/padron-peppers.png', title: 'Padrón Peppers' },
  { src: '/images/menu/rice-pudding-candied-cherries.png', title: 'Rice Pudding with Candied Cherries' },
  { src: '/images/menu/seared-duck-breast.png', title: 'Seared Duck Breast' },
  { src: '/images/menu/shepherds-pie.png', title: "Shepherd's Pie" },
  { src: '/images/menu/spanish-gildas.png', title: 'Spanish Gildas' },
  { src: '/images/menu/spinach-salad.png', title: 'Spinach Salad' },
  { src: '/images/menu/sunday-roast.png', title: 'Sunday Roast' },
  { src: '/images/menu/zucchini-carpaccio.png', title: 'Zucchini Carpaccio' },
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

const ITEMS_PER_PAGE = 12;

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<boolean[]>(new Array(galleryItems.length).fill(false));
  const [hasAnimated, setHasAnimated] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
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

  // Animate only the currently visible items
  useEffect(() => {
    if (!hasAnimated) return;

    for (let index = 0; index < visibleCount; index++) {
      if (visibleImages[index]) continue;
      const timeoutId = window.setTimeout(() => {
        setVisibleImages(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 90);
      timeoutsRef.current.push(timeoutId);
    }

    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, [hasAnimated, visibleCount]);

  const loadMore = () => {
    const newCount = Math.min(visibleCount + ITEMS_PER_PAGE, shuffledItems.length);
    setVisibleCount(newCount);
  };

  const displayedItems = shuffledItems.slice(0, visibleCount);
  const hasMore = visibleCount < shuffledItems.length;

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
      <section id="gallery" ref={sectionRef} className="py-20 bg-neutral-950" data-testid="gallery">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] text-neutral-500 mb-3 uppercase">
              Chef-Crafted Dishes
            </p>
            <h2 className="font-display text-3xl tracking-[0.2em] text-white">
              THE GALLERY
            </h2>
          </div>

          {/* Grid with dark cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayedItems.map((item, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={`group relative aspect-square overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-out bg-neutral-900 ${
                  visibleImages[index]
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${(index % ITEMS_PER_PAGE) * 80}ms` }}
                data-testid={`gallery-item-${index}`}
              >
                {/* Dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10 pointer-events-none" />

                {/* Corner vignette for better blending */}
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />

                {/* Image - object-contain to show full bowl without cropping */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 p-2"
                />

                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                  <p className="font-display text-sm tracking-[0.15em] text-white text-center drop-shadow-lg">
                    {item.title.toUpperCase()}
                  </p>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-amber-500/10 to-transparent z-[5]" />
              </button>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMore}
                className="px-8 py-3 font-display text-sm tracking-[0.2em] text-neutral-300 border border-neutral-700 rounded-full hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
              >
                LOAD MORE
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="relative max-w-[90vw] max-h-[80vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={shuffledItems[selectedIndex].src}
              alt={shuffledItems[selectedIndex].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />

            <p className="mt-6 font-display text-lg tracking-[0.2em] text-white">
              {shuffledItems[selectedIndex].title.toUpperCase()}
            </p>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-sm tracking-[0.2em] text-neutral-500">
            {selectedIndex + 1} / {shuffledItems.length}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
