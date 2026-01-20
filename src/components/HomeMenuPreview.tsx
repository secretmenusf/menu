import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react';
import { galleryMenuItems, type MenuItem, dietaryInfo } from '@/data/menus';
import SeedOfLife from '@/components/SeedOfLife';
import FishIcon from '@/components/FishIcon';

const MenuCard = ({ item }: { item: MenuItem }) => {
  const isVegetarian = item.tags?.includes('v') || item.tags?.includes('vg');
  const isVegan = item.tags?.includes('vg');
  const hasFish = item.allergens?.includes('fish') || item.allergens?.includes('shellfish');

  return (
    <div className="flex-shrink-0 w-[320px] bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      {/* Image container */}
      <div className="relative p-6 pb-2">
        {/* Dietary badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          {(isVegetarian || isVegan) && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 bg-emerald-600 text-white rounded-full text-[9px] font-semibold uppercase tracking-wide">
              <Leaf size={10} />
              {isVegan ? 'Vegan' : 'Vegetarian'}
            </span>
          )}
          {hasFish && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 bg-sky-600 text-white rounded-full text-[9px] font-semibold uppercase tracking-wide">
              <FishIcon size={10} />
              Seafood
            </span>
          )}
        </div>

        {/* Food image - larger circle */}
        <div className="w-[200px] h-[200px] mx-auto rounded-full overflow-hidden bg-muted">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-4 flex flex-col flex-grow text-center">
        <h3 className="font-semibold text-base text-foreground mb-2">{item.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow line-clamp-2">
          {item.description || `with ${item.ingredients?.slice(0, 3).join(', ')}`}
        </p>

        {/* Nutritional info - 4 columns like Shoplocale */}
        {item.nutrition && (
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-muted rounded-lg py-3 text-center">
              <div className="text-base font-semibold text-foreground">{item.nutrition.calories}</div>
              <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Cal</div>
            </div>
            <div className="bg-muted rounded-lg py-3 text-center">
              <div className="text-base font-semibold text-foreground">{item.nutrition.protein}g</div>
              <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Protein</div>
            </div>
            <div className="bg-muted rounded-lg py-3 text-center">
              <div className="text-base font-semibold text-foreground">{item.nutrition.carbs}g</div>
              <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Carbs</div>
            </div>
            <div className="bg-muted rounded-lg py-3 text-center">
              <div className="text-base font-semibold text-foreground">{item.nutrition.fiber || item.nutrition.fat}g</div>
              <div className="text-[10px] text-muted-foreground uppercase mt-0.5">{item.nutrition.fiber ? 'Fiber' : 'Fat'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HomeMenuPreview = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const itemsToShow = 4;
  const maxIndex = Math.max(0, galleryMenuItems.length - itemsToShow);

  const handlePrev = () => {
    setScrollIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4">
            Selection
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
            30+ rotating high<br />protein meals
          </h2>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['No pesticides', 'Never processed', 'No seed oils'].map((badge) => (
              <span
                key={badge}
                className="px-5 py-2.5 bg-card border border-border rounded-full text-sm text-foreground"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* See full menu link */}
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm text-foreground underline underline-offset-4 hover:no-underline transition-all"
          >
            See the full menu <ArrowRight size={14} />
          </Link>
        </div>

        {/* Scrollable menu cards */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${scrollIndex * 340}px)` }}
            >
              {galleryMenuItems.map(item => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-center gap-3 mt-10">
          <button
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={scrollIndex >= maxIndex}
            className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeMenuPreview;
