import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Leaf, ChevronLeft, ChevronRight, ArrowRight, X, Plus, Minus, Check, MessageSquare } from 'lucide-react';
import { galleryMenuItems, type MenuItem, type MenuItemOption, dietaryInfo } from '@/data/menus';
import SeedOfLife from '@/components/SeedOfLife';
import FishIcon from '@/components/FishIcon';

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
  // State for customization options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Group options by category
  const groupedOptions = useMemo(() => {
    if (!item.options) return {};
    return item.options.reduce((acc, option) => {
      const category = option.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(option);
      return acc;
    }, {} as Record<string, MenuItemOption[]>);
  }, [item.options]);

  // Category display labels with emojis
  const categoryLabels: Record<string, string> = {
    'protein': '🥩 Add Protein',
    'side': '🥗 Sides',
    'add-on': '✨ Add-ons',
    'portion': '📏 Portion Size',
    'extra': '➕ Extras',
    'dietary': '🌱 Dietary Options',
    'other': '📋 Options'
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = item.price * quantity;
    Object.entries(selectedOptions).forEach(([optionId, qty]) => {
      if (qty > 0) {
        const option = item.options?.find(o => o.id === optionId);
        if (option) {
          total += option.priceModifier * qty;
        }
      }
    });
    return total;
  };

  // Handle option toggle (for single select)
  const handleOptionToggle = (optionId: string, checked: boolean) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: checked ? 1 : 0
    }));
  };

  // Handle quantity change (for multi-select options)
  const handleQuantityChange = (optionId: string, qty: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: qty
    }));
  };

  // Build WhatsApp order message
  const handleAddToOrder = () => {
    const selectedList = Object.entries(selectedOptions)
      .filter(([_, qty]) => qty > 0)
      .map(([optionId, qty]) => {
        const option = item.options?.find(o => o.id === optionId);
        if (!option) return '';
        const qtyText = qty > 1 ? ` x${qty}` : '';
        const priceText = option.priceModifier !== 0
          ? ` (${option.priceModifier > 0 ? '+' : ''}$${option.priceModifier.toFixed(2)}${qty > 1 ? ' each' : ''})`
          : '';
        return `  • ${option.name}${qtyText}${priceText}`;
      })
      .filter(Boolean)
      .join('\n');

    const message = `🍽️ *New Order from Secret Menu SF*\n\n` +
      `*Item:* ${item.name}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Base Price:* $${item.price.toFixed(2)}\n` +
      (selectedList ? `\n*Customizations:*\n${selectedList}\n` : '') +
      (specialInstructions ? `\n*Special Instructions:*\n${specialInstructions}\n` : '') +
      `\n*Total:* $${calculateTotal().toFixed(2)}`;

    const whatsappUrl = `https://wa.me/14155551234?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-card border border-border w-full h-full md:h-auto md:max-h-[95vh] md:max-w-2xl md:mx-4 md:rounded-3xl overflow-y-auto"
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
        <div className="relative h-72 md:h-64 bg-muted md:rounded-t-3xl overflow-hidden">
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
        <div className="p-6 md:p-6 pb-20 md:pb-6">
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

          {/* Customization Options - Uber Eats Style */}
          {item.options && item.options.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">Customize Your Order</h3>

              {Object.entries(groupedOptions).map(([category, options]) => (
                <div key={category} className="mb-6 last:mb-0">
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
                          onChange={(qty) => handleQuantityChange(option.id, qty)}
                        />
                      ) : (
                        <CheckboxOption
                          key={option.id}
                          option={option}
                          checked={!!selectedOptions[option.id]}
                          onChange={(checked) => handleOptionToggle(option.id, checked)}
                        />
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Special Instructions</h3>
            </div>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any allergies, preferences, or special requests..."
              className="w-full p-4 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20"
              rows={3}
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-4 border-t border-border">
            <span className="text-sm font-medium text-foreground">Quantity</span>
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={10}
            />
          </div>

          {/* Price and CTA - Sticky on mobile */}
          <div className="sticky bottom-0 -mx-6 md:-mx-6 -mb-6 md:mb-0 px-6 py-4 bg-card border-t border-border md:relative md:border-t-0 md:mt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-2xl font-semibold text-foreground">${calculateTotal().toFixed(2)}</span>
                {quantity > 1 && (
                  <span className="text-sm text-muted-foreground ml-2">({quantity} items)</span>
                )}
              </div>
              <button
                onClick={handleAddToOrder}
                className="flex-1 md:flex-none px-6 py-3.5 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} />
                Order via WhatsApp
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

  return (
    <div
      className="flex-shrink-0 w-[320px] bg-card border border-border rounded-2xl overflow-hidden flex flex-col cursor-pointer hover:border-foreground/30 hover:-translate-y-1 transition-all duration-300"
      onClick={onClick}
    >
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
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Selection
          </p>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-8 leading-[1.1] tracking-tight">
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
                <MenuCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
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

      {/* Detail Modal - rendered via portal to escape parent containers */}
      {selectedItem && createPortal(
        <MenuDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />,
        document.body
      )}
    </section>
  );
};

export default HomeMenuPreview;
