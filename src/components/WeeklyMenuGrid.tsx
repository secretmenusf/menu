import { useState, useMemo } from 'react';
import { Leaf, Fish } from 'lucide-react';
import { galleryMenuItems, type MenuItem } from '@/data/menus';

type FilterType = 'all' | 'vegetarian' | 'dairy-free' | 'gluten-free' | 'pescatarian' | 'vegan' | 'low-carb';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Meals' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'low-carb', label: 'Low Carb' },
  { id: 'pescatarian', label: 'Pescatarian' },
];

const MenuCard = ({ item }: { item: MenuItem }) => {
  const isVegetarian = item.tags?.includes('v') || item.tags?.includes('vg');
  const isVegan = item.tags?.includes('vg');
  const isGlutenFree = item.tags?.includes('gf');
  const isDairyFree = item.tags?.includes('df');

  return (
    <div className="bg-[#EEEAE4] rounded-[20px] overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.02] duration-200">
      {/* Image container */}
      <div className="relative p-4 pb-0">
        {/* Dietary badge */}
        {(isVegetarian || isVegan) && (
          <div className="absolute top-6 left-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 rounded-full text-xs font-semibold text-[#245B50] shadow-sm">
              <Leaf size={14} />
              {isVegan ? 'Vegan' : 'Veg'}
            </span>
          </div>
        )}

        {/* Food image - perfect circle, same size */}
        <div className="w-[200px] h-[200px] mx-auto flex items-center justify-center rounded-full overflow-hidden bg-[#E5E0D8]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#1e1e20]/40 text-sm">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-base text-[#1e1e20] mb-1 leading-tight">{item.name}</h3>
        <p className="text-sm text-[#1e1e20]/70 leading-relaxed mb-4 flex-grow line-clamp-2">
          {item.description || `with ${item.ingredients?.slice(0, 3).join(', ')}`}
        </p>

        {/* Nutritional info - 4 column grid */}
        {item.nutrition && (
          <div className="grid grid-cols-4 gap-1 pt-3 border-t border-[#1e1e20]/10">
            <div className="text-center py-2">
              <div className="text-base font-bold text-[#1e1e20]">{item.nutrition.calories}</div>
              <div className="text-[11px] text-[#1e1e20]/50 uppercase tracking-wide">Cal</div>
            </div>
            <div className="text-center py-2">
              <div className="text-base font-bold text-[#1e1e20]">{item.nutrition.protein}g</div>
              <div className="text-[11px] text-[#1e1e20]/50 uppercase tracking-wide">Protein</div>
            </div>
            <div className="text-center py-2">
              <div className="text-base font-bold text-[#1e1e20]">{item.nutrition.carbs}g</div>
              <div className="text-[11px] text-[#1e1e20]/50 uppercase tracking-wide">Carbs</div>
            </div>
            <div className="text-center py-2">
              <div className="text-base font-bold text-[#1e1e20]">{item.nutrition.fat}g</div>
              <div className="text-[11px] text-[#1e1e20]/50 uppercase tracking-wide">Fat</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WeeklyMenuGrid = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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
        case 'vegan':
          return tags.includes('vg');
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
    <section id="weekly-menu" className="py-16 md:py-24 bg-[#f7f4f0]">
      <div className="container mx-auto px-5 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1e1e20] mb-3">
            Menu for week of {dayOfWeek}, {month}/{day}
          </h2>
          <p className="text-lg text-[#1e1e20]/60">
            {galleryMenuItems.length}+ rotating high protein meals to choose from
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-[#1e1e20] text-white'
                  : 'bg-white text-[#1e1e20] hover:bg-[#1e1e20]/10 border border-[#1e1e20]/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Menu grid - 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#1e1e20]/50 text-lg">No meals match this filter. Try another option.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WeeklyMenuGrid;
