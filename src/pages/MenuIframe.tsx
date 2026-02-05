import { useState, useMemo, useCallback, useEffect } from 'react';
import { Leaf, ChevronLeft, ChevronRight, X, Star, ChevronDown, Truck, Shield } from 'lucide-react';
import { galleryMenuItems, type MenuItem, dietaryInfo } from '@/data/menus';
import SeedOfLife from '@/components/SeedOfLife';
import FishIcon from '@/components/FishIcon';
import { withBasePath } from '@/lib/utils';

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}
      />
    ))}
  </div>
);

// Helper to check if item is a dessert
const isDessert = (item: MenuItem): boolean => {
  const name = item.name.toLowerCase();
  const dessertKeywords = ['cookie', 'cake', 'pudding', 'cheesecake', 'shortcake', 'brownie', 'pie', 'tart', 'mousse', 'tiramisu', 'gelato', 'ice cream', 'sorbet', 'macaron'];
  return dessertKeywords.some(keyword => name.includes(keyword)) || (item.sortPriority && item.sortPriority >= 70);
};

type FilterType = 'all' | 'vegetarian' | 'dairy-free' | 'gluten-free' | 'pescatarian' | 'low-carb';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'vegetarian', label: 'Veg' },
  { id: 'dairy-free', label: 'DF' },
  { id: 'gluten-free', label: 'GF' },
  { id: 'low-carb', label: 'LC' },
  { id: 'pescatarian', label: 'Fish' },
];

// Lightweight Modal for iframe
const IframeMenuModal = ({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex,
  totalItems
}: {
  item: MenuItem;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalItems?: number;
}) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext, onClose]);

  // Notify parent window of selection
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'secretmenu:item-selected',
        item: {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          nutrition: item.nutrition,
        }
      }, '*');
    }
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      {/* Navigation */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
          disabled={!hasPrev}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        {currentIndex !== undefined && totalItems !== undefined && (
          <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-white">
            {currentIndex + 1} / {totalItems}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onNext?.(); }}
          disabled={!hasNext}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="fixed top-4 right-4 z-[60] w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <X size={18} />
      </button>

      {/* Content */}
      <div
        className="absolute inset-0 overflow-y-auto pt-16 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto px-4">
          {/* Image */}
          <div className="relative aspect-square max-w-md mx-auto mb-6 rounded-2xl overflow-hidden bg-muted">
            {item.image ? (
              <img
                src={withBasePath(item.image)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <SeedOfLife size={80} className="text-muted-foreground/30" />
              </div>
            )}
            {/* Dietary badges */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {item.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur text-white rounded-full text-xs font-medium uppercase tracking-wide">
                  {dietaryInfo[tag]?.label || tag}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">{item.name}</h2>
            <p className="text-white/70 mb-6">{item.description}</p>

            {/* Nutrition */}
            {item.nutrition && (
              <div className="grid grid-cols-5 gap-2 mb-6">
                {[
                  { label: 'Cal', value: item.nutrition.calories },
                  { label: 'Protein', value: `${item.nutrition.protein}g` },
                  { label: 'Carbs', value: `${item.nutrition.carbs}g` },
                  { label: 'Fat', value: `${item.nutrition.fat}g` },
                  { label: 'Fiber', value: `${item.nutrition.fiber}g` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-lg font-semibold">{value}</div>
                    <div className="text-[10px] text-white/60 uppercase">{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-medium uppercase tracking-wide mb-3 text-white/50">Ingredients</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {item.ingredients.map((ingredient, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Order CTA */}
            <a
              href="https://secretmenusf.com/menu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
            >
              View Full Menu & Order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Card component
const IframeMenuCard = ({ item, onClick }: { item: MenuItem; onClick: () => void }) => {
  const isVegetarian = item.tags?.includes('v') || item.tags?.includes('vg');
  const isVegan = item.tags?.includes('vg');
  const hasFish = item.allergens?.includes('fish') || item.allergens?.includes('shellfish');

  const [isHovering, setIsHovering] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center center');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      className="group bg-card rounded-xl overflow-hidden flex flex-col border border-border hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative p-4 pb-2">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {(isVegetarian || isVegan) && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[7px] font-medium uppercase">
              <Leaf size={7} />
              {isVegan ? 'V' : 'VG'}
            </span>
          )}
          {hasFish && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-sky-600 text-white rounded-full text-[7px] font-medium uppercase">
              <FishIcon size={7} />
            </span>
          )}
        </div>

        {/* Food image */}
        <div
          className="w-[100px] h-[100px] mx-auto rounded-full overflow-hidden bg-muted"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); setTransformOrigin('center center'); }}
        >
          {item.image ? (
            <img
              src={withBasePath(item.image)}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: isHovering ? 'scale(1.8)' : 'scale(1)',
                transformOrigin,
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <SeedOfLife size={32} className="text-muted-foreground/30" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3 pt-1 flex flex-col flex-grow text-center">
        <h3 className="font-semibold text-xs text-foreground mb-0.5 line-clamp-1">{item.name}</h3>
        <p className="text-[10px] text-muted-foreground leading-tight mb-2 flex-grow line-clamp-2">
          {item.description || `with ${item.ingredients?.slice(0, 2).join(', ')}`}
        </p>

        {/* Nutrition mini */}
        {item.nutrition && (
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">{item.nutrition.calories}</div>
              <div className="text-[8px] text-muted-foreground">Cal</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">{item.nutrition.protein}g</div>
              <div className="text-[8px] text-muted-foreground">Pro</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">{item.nutrition.carbs}g</div>
              <div className="text-[8px] text-muted-foreground">Carb</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main iframe menu component
const MenuIframe = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'secretmenu:set-filter') {
        setActiveFilter(event.data.filter);
      }
      if (event.data?.type === 'secretmenu:close-modal') {
        setSelectedIndex(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Notify parent of ready state
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'secretmenu:ready' }, '*');
    }
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    let items = galleryMenuItems;

    if (activeFilter !== 'all') {
      items = items.filter(item => {
        const tags = item.tags || [];
        switch (activeFilter) {
          case 'vegetarian':
            return tags.includes('v') || tags.includes('vg');
          case 'dairy-free':
            return tags.includes('df');
          case 'gluten-free':
            return tags.includes('gf');
          case 'low-carb':
            return item.nutrition && item.nutrition.carbs < 30;
          case 'pescatarian': {
            const name = item.name.toLowerCase();
            const ingredients = item.ingredients?.map(i => i.toLowerCase()).join(' ') || '';
            const hasMeat = name.includes('chicken') || name.includes('beef') || name.includes('pork') || name.includes('lamb') || name.includes('steak') || name.includes('meatball') ||
              ingredients.includes('chicken') || ingredients.includes('beef') || ingredients.includes('pork') || ingredients.includes('lamb') || ingredients.includes('steak');
            if (hasMeat) return false;
            const hasSeafood = name.includes('cod') || name.includes('salmon') || name.includes('crab') || name.includes('shrimp') || name.includes('tuna') || name.includes('seafood') ||
              ingredients.includes(' cod') || ingredients.includes('salmon') || ingredients.includes('crab') || ingredients.includes('shrimp') || ingredients.includes('tuna');
            const isVegetarian = item.tags?.includes('v') || item.tags?.includes('vg');
            return hasSeafood || isVegetarian;
          }
          default:
            return true;
        }
      });
    }

    return [...items].sort((a, b) => {
      const aIsDessert = isDessert(a);
      const bIsDessert = isDessert(b);
      if (aIsDessert && !bIsDessert) return 1;
      if (!aIsDessert && bIsDessert) return -1;
      return (a.sortPriority || 50) - (b.sortPriority || 50);
    });
  }, [activeFilter]);

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const handleSelectItem = useCallback((item: MenuItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    setSelectedIndex(index >= 0 ? index : null);
  }, [filteredItems]);

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, filteredItems.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'secretmenu:modal-closed' }, '*');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Compact header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-3 py-3">
          {/* Logo + Link */}
          <div className="flex items-center justify-between mb-3">
            <a
              href="https://secretmenusf.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
            >
              <SeedOfLife size={20} className="text-foreground" />
              <span className="text-xs font-semibold tracking-wide">SECRET MENU</span>
            </a>
            <a
              href="https://secretmenusf.com/menu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] px-3 py-1.5 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
            >
              Order Now
            </a>
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredItems.map((item) => (
            <IframeMenuCard
              key={item.id}
              item={item}
              onClick={() => handleSelectItem(item)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No meals match this filter.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6 mt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            {filteredItems.length} gourmet meals • Chef-prepared • Bay Area delivery
          </p>
          <a
            href="https://secretmenusf.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground hover:underline"
          >
            secretmenusf.com
          </a>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && selectedIndex !== null && (
        <IframeMenuModal
          item={selectedItem}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filteredItems.length - 1}
          currentIndex={selectedIndex}
          totalItems={filteredItems.length}
        />
      )}
    </div>
  );
};

export default MenuIframe;
