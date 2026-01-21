import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Leaf, X, Plus, Minus, Check, MessageSquare, ArrowLeft } from 'lucide-react';
import { galleryMenuItems, type MenuItem, type MenuItemOption, dietaryInfo } from '@/data/menus';
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

// Quantity Stepper Component (Uber Eats style)
const QuantityStepper = ({
  value,
  onChange,
  min = 0,
  max = 10
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
      disabled={value <= min}
      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted/80 transition-colors"
    >
      <Minus size={16} />
    </button>
    <span className="w-8 text-center font-semibold text-foreground">{value}</span>
    <button
      onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
      disabled={value >= max}
      className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
    >
      <Plus size={16} />
    </button>
  </div>
);

// Checkbox Option Component
const CheckboxOption = ({
  option,
  checked,
  onChange
}: {
  option: MenuItemOption;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border-2 ${
      checked
        ? 'bg-emerald-500/10 border-emerald-500/50'
        : 'bg-muted/50 border-transparent hover:bg-muted'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
        checked
          ? 'bg-emerald-500 text-white'
          : 'bg-background border-2 border-border'
      }`}>
        {checked && <Check size={14} strokeWidth={3} />}
      </div>
      <span className="text-sm text-foreground">{option.name}</span>
    </div>
    <span className={`text-sm font-medium ${
      option.priceModifier > 0 ? 'text-foreground' :
      option.priceModifier < 0 ? 'text-emerald-500' :
      'text-muted-foreground'
    }`}>
      {option.priceModifier > 0 ? `+$${option.priceModifier.toFixed(2)}` :
       option.priceModifier < 0 ? `-$${Math.abs(option.priceModifier).toFixed(2)}` :
       'Free'}
    </span>
  </button>
);

// Quantity Option Component (for items that allow multiple)
const QuantityOption = ({
  option,
  quantity,
  onChange
}: {
  option: MenuItemOption;
  quantity: number;
  onChange: (qty: number) => void;
}) => (
  <div className={`flex items-center justify-between p-4 rounded-xl transition-all border-2 ${
    quantity > 0
      ? 'bg-emerald-500/10 border-emerald-500/50'
      : 'bg-muted/50 border-transparent'
  }`}>
    <div className="flex-1">
      <span className="text-sm text-foreground">{option.name}</span>
      <span className={`text-sm font-medium ml-2 ${
        option.priceModifier > 0 ? 'text-muted-foreground' :
        option.priceModifier < 0 ? 'text-emerald-500' :
        'text-muted-foreground'
      }`}>
        {option.priceModifier > 0 ? `+$${option.priceModifier.toFixed(2)} each` :
         option.priceModifier < 0 ? `-$${Math.abs(option.priceModifier).toFixed(2)} each` :
         ''}
      </span>
    </div>
    <QuantityStepper
      value={quantity}
      onChange={onChange}
      min={0}
      max={option.maxQuantity || 10}
    />
  </div>
);

// Detail Modal Component
const MenuDetailModal = ({ item, onClose }: { item: MenuItem; onClose: () => void }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isVegetarian = item.tags?.includes('v') || item.tags?.includes('vg');
  const isVegan = item.tags?.includes('vg');

  // Group options by category
  const groupedOptions = useMemo(() => {
    if (!item.options) return {};
    return item.options.reduce((acc, opt) => {
      const category = opt.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(opt);
      return acc;
    }, {} as Record<string, MenuItemOption[]>);
  }, [item.options]);

  const categoryLabels: Record<string, string> = {
    protein: '🥩 Add Protein',
    side: '🥗 Sides',
    'add-on': '✨ Add-ons',
    portion: '📏 Portion Size',
    extra: '➕ Extras',
    dietary: '🌱 Dietary Options',
    other: 'Other Options'
  };

  const updateOption = (optionId: string, value: number) => {
    setSelectedOptions(prev => ({ ...prev, [optionId]: value }));
  };

  const calculateTotal = () => {
    let total = item.price * quantity;
    if (item.options) {
      item.options.forEach(opt => {
        const qty = selectedOptions[opt.id] || 0;
        total += opt.priceModifier * qty * quantity;
      });
    }
    return total;
  };

  const handleAddToOrder = () => {
    const orderSummary = {
      item: item.name,
      basePrice: item.price,
      quantity,
      customizations: item.options?.filter(opt => selectedOptions[opt.id] > 0).map(opt => ({
        name: opt.name,
        quantity: selectedOptions[opt.id],
        price: opt.priceModifier
      })) || [],
      specialInstructions,
      total: calculateTotal()
    };

    // Build WhatsApp message
    let message = `Hi! I'd like to order:\n\n`;
    message += `*${quantity}x ${item.name}* - $${item.price.toFixed(2)}\n`;

    const selectedCustomizations = item.options?.filter(opt => selectedOptions[opt.id] > 0);
    if (selectedCustomizations && selectedCustomizations.length > 0) {
      message += `\nCustomizations:\n`;
      selectedCustomizations.forEach(opt => {
        const qty = selectedOptions[opt.id];
        const price = opt.priceModifier * qty;
        message += `• ${qty > 1 ? `${qty}x ` : ''}${opt.name}${price !== 0 ? ` (+$${price.toFixed(2)})` : ''}\n`;
      });
    }

    if (specialInstructions) {
      message += `\nSpecial Instructions: ${specialInstructions}\n`;
    }

    message += `\n*Total: $${calculateTotal().toFixed(2)}*`;

    window.open(`https://wa.me/14153732496?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background" onClick={onClose}>
      {/* Back button - fixed position left */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="fixed top-4 left-4 z-[60] w-12 h-12 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-lg"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Close button - fixed position right */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="fixed top-4 right-4 z-[60] w-12 h-12 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-lg"
      >
        <X size={24} />
      </button>

      {/* Scrollable content area - positioned to not cover fixed CTA */}
      <div
        className="absolute inset-0 overflow-y-auto"
        style={{ paddingBottom: '120px' }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Two-column layout on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
          {/* Left column - Image (sticky on desktop) */}
          <div className="relative h-[50vh] lg:h-auto lg:sticky lg:top-0 lg:self-start bg-muted">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full lg:h-screen object-cover"
              />
            ) : (
              <div className="w-full h-full lg:h-screen flex items-center justify-center">
                <SeedOfLife size={120} className="text-muted-foreground/30" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-background/20" />

            {/* Dietary badges - bottom left on mobile, top left (below back button) on desktop */}
            <div className="absolute bottom-6 left-6 lg:top-20 lg:bottom-auto flex flex-wrap gap-2 max-w-[calc(100%-3rem)]">
              {item.tags?.map(tag => (
                <span key={tag} className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium uppercase tracking-wide">
                  {dietaryInfo[tag]?.label || tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right column - Content */}
          <div className="relative bg-background">
            <div className="p-6 md:p-10 lg:p-12 lg:max-w-2xl">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">{item.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
              </div>

              {/* Nutrition Grid */}
              {item.nutrition && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">Nutrition Facts</h3>
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    <div className="bg-muted rounded-xl p-3 md:p-4 text-center">
                      <div className="text-xl md:text-2xl font-semibold text-foreground">{item.nutrition.calories}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground uppercase">Calories</div>
                    </div>
                    <div className="bg-muted rounded-xl p-3 md:p-4 text-center">
                      <div className="text-xl md:text-2xl font-semibold text-foreground">{item.nutrition.protein}g</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground uppercase">Protein</div>
                    </div>
                    <div className="bg-muted rounded-xl p-3 md:p-4 text-center">
                      <div className="text-xl md:text-2xl font-semibold text-foreground">{item.nutrition.carbs}g</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground uppercase">Carbs</div>
                    </div>
                    <div className="bg-muted rounded-xl p-3 md:p-4 text-center">
                      <div className="text-xl md:text-2xl font-semibold text-foreground">{item.nutrition.fat}g</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground uppercase">Fat</div>
                    </div>
                    <div className="bg-muted rounded-xl p-3 md:p-4 text-center">
                      <div className="text-xl md:text-2xl font-semibold text-foreground">{item.nutrition.fiber}g</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground uppercase">Fiber</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Serving size: {item.nutrition.servingSize}</p>
                </div>
              )}

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, i) => (
                      <span key={i} className="px-4 py-2 bg-muted rounded-full text-sm text-foreground">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, i) => (
                      <span key={i} className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-sm text-amber-600 dark:text-amber-400">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization Options - Grouped by Category */}
              {item.options && item.options.length > 0 && (
                <div className="mb-8 space-y-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Customize Your Order</h3>
                  {Object.entries(groupedOptions).map(([category, options]) => (
                    <div key={category}>
                      <h4 className="text-base font-medium text-foreground mb-3">
                        {categoryLabels[category] || category}
                      </h4>
                      <div className="space-y-2">
                        {options.map((option) => (
                          option.allowMultiple ? (
                            <QuantityOption
                              key={option.id}
                              option={option}
                              quantity={selectedOptions[option.id] || 0}
                              onChange={(qty) => updateOption(option.id, qty)}
                            />
                          ) : (
                            <CheckboxOption
                              key={option.id}
                              option={option}
                              checked={(selectedOptions[option.id] || 0) > 0}
                              onChange={(checked) => updateOption(option.id, checked ? 1 : 0)}
                            />
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <MessageSquare size={16} />
                  Special Instructions
                </h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any allergies, preferences, or special requests..."
                  className="w-full p-4 bg-muted/50 border-2 border-transparent rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              {/* Quantity Selector */}
              <div className="mb-8 flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <span className="text-sm font-medium text-foreground">Quantity</span>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={20}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Fixed Price and CTA - Always visible at bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <div className="safe-area-bottom bg-background">
          <div className="px-4 py-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-shrink-0">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
                <div className="text-2xl md:text-3xl font-bold text-foreground">${calculateTotal().toFixed(2)}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToOrder(); }}
                className="flex-1 max-w-md py-4 px-6 bg-emerald-600 text-white rounded-full font-semibold text-base md:text-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Add to Order
              </button>
            </div>
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

  // State for zoom pan effect
  const [isHovering, setIsHovering] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center center');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransformOrigin('center center');
  };

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden flex flex-col border border-border hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
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

        {/* Food image - perfect circle with zoom and pan on hover */}
        <div
          className="w-[160px] h-[160px] mx-auto rounded-full overflow-hidden bg-muted"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isHovering ? 'grab' : 'pointer' }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: isHovering ? 'scale(2)' : 'scale(1)',
                transformOrigin: transformOrigin,
              }}
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
        case 'pescatarian': {
          const name = item.name.toLowerCase();
          const ingredients = item.ingredients?.map(i => i.toLowerCase()).join(' ') || '';
          const hasSeafood = name.includes('cod') || name.includes('fish') || name.includes('salmon') || name.includes('crab') || name.includes('shrimp') ||
            ingredients.includes('cod') || ingredients.includes('fish') || ingredients.includes('salmon') || ingredients.includes('crab') || ingredients.includes('shrimp');
          return hasSeafood;
        }
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

      {/* Detail Modal - rendered via portal to escape parent containers */}
      {selectedItem && createPortal(
        <MenuDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />,
        document.body
      )}
    </section>
  );
};

export default WeeklyMenuGrid;
