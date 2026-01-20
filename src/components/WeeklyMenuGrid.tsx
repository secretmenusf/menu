import { useState, useMemo } from 'react';
import { Leaf, X } from 'lucide-react';
import { galleryMenuItems, type MenuItem, dietaryInfo } from '@/data/menus';
import SeedOfLife from '@/components/SeedOfLife';
import FishIcon from '@/components/FishIcon';

type FilterType = 'all' | 'vegetarian' | 'dairy-free' | 'gluten-free' | 'pescatarian' | 'low-carb';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Meals' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'low-carb', label: 'Low Carb' },
  { id: 'pescatarian', label: 'Pescatarian' },
];

// Detail Modal Component
const MenuDetailModal = ({ item, onClose }: { item: MenuItem; onClose: () => void }) => {
  const isVegetarian = item.tags?.includes('v') || item.tags?.includes('vg');
  const isVegan = item.tags?.includes('vg');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-accent transition-colors"
        >
          <X size={20} />
        </button>

        {/* Hero image */}
        <div className="relative h-64 bg-muted rounded-t-3xl overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <SeedOfLife size={80} className="text-muted-foreground/30" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

          {/* Dietary badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {item.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-foreground text-background rounded-full text-xs font-medium uppercase">
                {dietaryInfo[tag]?.label || tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">{item.name}</h2>
          <p className="text-muted-foreground mb-6">{item.description}</p>

          {/* Nutrition Grid */}
          {item.nutrition && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">Nutrition Facts</h3>
              <div className="grid grid-cols-5 gap-3">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-semibold text-foreground">{item.nutrition.calories}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Calories</div>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-semibold text-foreground">{item.nutrition.protein}g</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Protein</div>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-semibold text-foreground">{item.nutrition.carbs}g</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Carbs</div>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-semibold text-foreground">{item.nutrition.fat}g</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Fat</div>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-xl font-semibold text-foreground">{item.nutrition.fiber}g</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Fiber</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Serving size: {item.nutrition.servingSize}</p>
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, i) => (
                  <span key={i} className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-sm text-amber-600 dark:text-amber-400">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-2xl font-semibold text-foreground">${item.price}</span>
              {item.prepTime && (
                <span className="text-sm text-muted-foreground ml-2">• {item.prepTime} min prep</span>
              )}
            </div>
            <a
              href="/order"
              className="px-6 py-3 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuCard = ({ item, onClick }: { item: MenuItem; onClick: () => void }) => {
  const isVegetarian = item.tags?.includes('v') || item.tags?.includes('vg');
  const isVegan = item.tags?.includes('vg');
  const hasFish = item.allergens?.includes('fish') || item.allergens?.includes('shellfish');

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden flex flex-col border border-border hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Image container */}
      <div className="relative p-6 pb-4">
        {/* Dietary badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          {(isVegetarian || isVegan) && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[8px] font-medium uppercase tracking-wide">
              <Leaf size={8} />
              {isVegan ? 'Vegan' : 'Vegetarian'}
            </span>
          )}
          {hasFish && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-sky-600 text-white rounded-full text-[8px] font-medium uppercase tracking-wide">
              <FishIcon size={8} />
              Seafood
            </span>
          )}
        </div>

        {/* Food image - perfect circle */}
        <div className="w-[160px] h-[160px] mx-auto rounded-full overflow-hidden bg-muted">
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
      <div className="px-5 pb-5 pt-2 flex flex-col flex-grow text-center">
        <h3 className="font-semibold text-sm text-foreground mb-1">{item.name}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-2">
          {item.description || `with ${item.ingredients?.slice(0, 3).join(', ')}`}
        </p>

        {/* Nutritional info - 4 column grid */}
        {item.nutrition && (
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">{item.nutrition.calories}</div>
              <div className="text-[9px] text-muted-foreground uppercase">Cal</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">{item.nutrition.protein}g</div>
              <div className="text-[9px] text-muted-foreground uppercase">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">{item.nutrition.carbs}g</div>
              <div className="text-[9px] text-muted-foreground uppercase">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">{item.nutrition.fat}g</div>
              <div className="text-[9px] text-muted-foreground uppercase">Fat</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WeeklyMenuGrid = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Get current date for the title
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' });
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // Filter menu items based on active filter
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return galleryMenuItems;
    }

    return galleryMenuItems.filter(item => {
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
        case 'pescatarian':
          const name = item.name.toLowerCase();
          const hasSeafood = name.includes('cod') || name.includes('fish') || name.includes('salmon') || name.includes('crab') || name.includes('shrimp');
          const hasMeat = name.includes('chicken') || name.includes('beef') || name.includes('lamb') || name.includes('pork') || name.includes('duck');
          return hasSeafood || (tags.includes('v') && !hasMeat);
        default:
          return true;
      }
    });
  }, [activeFilter]);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <SeedOfLife size={40} className="mx-auto mb-6 text-foreground" />

          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-3 tracking-tight">
            Menu for week of {dayOfWeek}, {month}/{day}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {galleryMenuItems.length}+ rotating high protein meals to choose from
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground border border-border hover:border-foreground/30'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu grid - 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No meals match this filter. Try another option.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <MenuDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
};

export default WeeklyMenuGrid;
