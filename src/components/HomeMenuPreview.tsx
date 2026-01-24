import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, X, Plus, Minus, Check, MessageSquare, Star, ChevronDown, Truck, Shield, Lock, CreditCard } from 'lucide-react';
import { galleryMenuItems, type MenuItem, type MenuItemOption, dietaryInfo } from '@/data/menus';
import SeedOfLife from '@/components/SeedOfLife';
import FishIcon from '@/components/FishIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}
      />
    ))}
  </div>
);

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform text-muted-foreground ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-sm text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  );
};

// FAQ Data
const productFAQs = [
  {
    question: 'How does delivery work?',
    answer: 'We deliver fresh, chef-prepared meals in insulated packaging to keep everything at the perfect temperature. Delivery is available throughout the Bay Area.'
  },
  {
    question: 'How long do the meals last?',
    answer: 'Our meals stay fresh for 5-7 days in the refrigerator. Each meal comes with heating instructions for the best experience.'
  },
  {
    question: 'Can I customize my order?',
    answer: 'Yes! You can add proteins, swap sides, and customize portions using the options above. We also accommodate dietary restrictions - just add your requests in special instructions.'
  },
  {
    question: 'What if I\'m not satisfied?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not happy with your order, we\'ll make it right or refund you.'
  }
];

// Sample Reviews
const sampleReviews = [
  { name: 'Sarah M.', review: 'The food is absolutely incredible. Restaurant quality without leaving home!', rating: 5 },
  { name: 'James K.', review: 'Finally, healthy food that actually tastes good. The portions are generous.', rating: 5 },
  { name: 'Emily R.', review: 'Game changer for busy weeknights. Heat for 5 minutes and dinner is served.', rating: 5 },
];

// Helper to check if item is a dessert
const isDessert = (item: MenuItem): boolean => {
  const name = item.name.toLowerCase();
  const dessertKeywords = ['cookie', 'cake', 'pudding', 'cheesecake', 'shortcake', 'brownie', 'pie', 'tart', 'mousse', 'tiramisu', 'gelato', 'ice cream', 'sorbet', 'macaron'];
  return dessertKeywords.some(keyword => name.includes(keyword)) || (item.sortPriority && item.sortPriority >= 70);
};

// Sort items with desserts last
const sortedMenuItems = [...galleryMenuItems].sort((a, b) => {
  const aIsDessert = isDessert(a);
  const bIsDessert = isDessert(b);
  if (aIsDessert && !bIsDessert) return 1;
  if (!aIsDessert && bIsDessert) return -1;
  return (a.sortPriority || 50) - (b.sortPriority || 50);
});

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

// Detail Modal Component - Full-page with fixed CTA
const MenuDetailModal = ({
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canCustomizeOrders, canOrderDelivery, isSubscribed } = useSubscriptionContext();

  // State for customization options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Check if user can customize (must be subscribed)
  const canCustomize = user && isSubscribed && canCustomizeOrders;
  const canOrder = user && isSubscribed && canOrderDelivery;

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

  // Reset selections when item changes
  useEffect(() => {
    setSelectedOptions({});
    setSpecialInstructions('');
    setQuantity(1);
  }, [item.id]);

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

    const whatsappUrl = `https://wa.me/14153732496?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

      {/* Navigation controls - centered */}
      {(onPrev || onNext) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
            disabled={!hasPrev}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          {currentIndex !== undefined && totalItems !== undefined && (
            <span className="px-3 py-1.5 bg-background/90 backdrop-blur border border-border rounded-full text-xs font-medium text-foreground shadow-lg">
              {currentIndex + 1} / {totalItems}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
            disabled={!hasNext}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

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

              {/* Customization Options - Uber Eats Style */}
              {item.options && item.options.length > 0 && (
                <div className="mb-8 space-y-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Customize Your Order</h3>
                  {canCustomize ? (
                    // Show customization options for subscribers
                    Object.entries(groupedOptions).map(([category, options]) => (
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
                    ))
                  ) : (
                    // Show subscribe CTA for non-subscribers
                    <div className="p-6 bg-muted/50 rounded-xl border border-border/50 text-center">
                      <Lock size={32} className="mx-auto mb-3 text-muted-foreground" />
                      <h4 className="text-base font-medium text-foreground mb-2">
                        Subscribe to Customize
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {!user
                          ? "Join SF Secret Menu to customize your meals with add-ons, protein upgrades, and more."
                          : "Upgrade your subscription to unlock meal customization options."}
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(user ? '/pricing' : '/join');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
                      >
                        <CreditCard size={18} />
                        {user ? 'View Plans' : 'Get Started'}
                      </button>
                    </div>
                  )}
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

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 mb-8 py-4 border-t border-b border-border/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck size={18} />
                  <span>Bay Area Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield size={18} />
                  <span>30-Day Guarantee</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Additional Content Sections - Below the fold */}
        <div className="bg-background">
          {/* Reviews Section */}
          <div className="py-12 border-t border-border/30">
            <div className="px-6 md:px-10 lg:px-12 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">Customer Reviews</h3>
                <div className="flex items-center justify-center gap-2">
                  <StarRating rating={5} />
                  <span className="text-sm text-muted-foreground">4.9 out of 5</span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {sampleReviews.map((review, idx) => (
                  <div key={idx} className="bg-muted/30 rounded-xl p-4">
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-foreground/80 mt-3 mb-3">"{review.review}"</p>
                    <p className="text-xs text-muted-foreground font-medium">{review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Secret Menu - Comparison */}
          <div className="py-12 bg-muted/20 border-t border-border/30">
            <div className="px-6 md:px-10 lg:px-12 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-foreground text-center mb-8">Why Secret Menu?</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 font-normal text-muted-foreground"></th>
                      <th className="text-center py-3 font-semibold text-foreground">Secret Menu</th>
                      <th className="text-center py-3 font-normal text-muted-foreground">Meal Kits</th>
                      <th className="text-center py-3 font-normal text-muted-foreground">Takeout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Chef-prepared', us: true, kits: false, takeout: true },
                      { feature: 'Organic ingredients', us: true, kits: false, takeout: false },
                      { feature: 'No cooking required', us: true, kits: false, takeout: true },
                      { feature: 'Fully customizable', us: true, kits: true, takeout: false },
                      { feature: 'Cost per meal', us: '$15-25', kits: '$10-15', takeout: '$20-40' },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-border/30">
                        <td className="py-3 text-foreground">{row.feature}</td>
                        <td className="py-3 text-center">
                          {typeof row.us === 'boolean' ? (
                            row.us ? <Check className="mx-auto text-emerald-500" size={18} /> : <span className="text-muted-foreground">—</span>
                          ) : (
                            <span className="font-medium text-foreground">{row.us}</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {typeof row.kits === 'boolean' ? (
                            row.kits ? <Check className="mx-auto text-emerald-500" size={18} /> : <span className="text-muted-foreground">—</span>
                          ) : (
                            <span className="text-muted-foreground">{row.kits}</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {typeof row.takeout === 'boolean' ? (
                            row.takeout ? <Check className="mx-auto text-emerald-500" size={18} /> : <span className="text-muted-foreground">—</span>
                          ) : (
                            <span className="text-muted-foreground">{row.takeout}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-12 border-t border-border/30">
            <div className="px-6 md:px-10 lg:px-12 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-foreground text-center mb-8">Frequently Asked Questions</h3>
              <div>
                {productFAQs.map((faq, idx) => (
                  <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </div>

          {/* Related Dishes */}
          <div className="py-12 bg-muted/20 border-t border-border/30">
            <div className="px-6 md:px-10 lg:px-12">
              <h3 className="text-xl font-semibold text-foreground text-center mb-8">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {sortedMenuItems
                  .filter(m => m.id !== item.id)
                  .slice(0, 4)
                  .map((relatedItem) => (
                    <div key={relatedItem.id} className="text-center">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted mb-3">
                        {relatedItem.image && (
                          <img
                            src={relatedItem.image}
                            alt={relatedItem.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-foreground line-clamp-1">{relatedItem.name}</h4>
                      <p className="text-sm text-muted-foreground">${relatedItem.price}</p>
                    </div>
                  ))}
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
              {canOrder ? (
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToOrder(); }}
                  className="flex-1 max-w-md py-4 px-6 bg-emerald-600 text-white rounded-full font-semibold text-base md:text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Add to Delivery
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    navigate(user ? '/pricing' : '/join');
                  }}
                  className="flex-1 max-w-md py-4 px-6 bg-emerald-600 text-white rounded-full font-semibold text-base md:text-lg hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  {user ? 'Subscribe to Order' : 'Join to Order'}
                </button>
              )}
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
      className="group flex-shrink-0 w-[320px] bg-card border border-border rounded-2xl overflow-hidden flex flex-col cursor-pointer hover:border-foreground/30 hover:-translate-y-1 transition-all duration-300"
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

        {/* Food image - larger circle with zoom and pan on hover */}
        <div
          className="w-[200px] h-[200px] mx-auto rounded-full overflow-hidden bg-muted"
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const wasDragged = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragStartIndex = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);

  const cardWidth = 320;
  const gap = 20;
  const cardTotalWidth = cardWidth + gap;
  const maxIndex = Math.max(0, sortedMenuItems.length - 1);

  // Get selected item from index
  const selectedItem = selectedIndex !== null ? sortedMenuItems[selectedIndex] : null;

  const handlePrev = () => {
    setScrollIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex(prev => Math.min(maxIndex, prev + 1));
  };

  // Modal navigation handlers
  const handleModalPrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleModalNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < sortedMenuItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex]);

  const handleModalClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Handle mouse wheel scrolling with debouncing
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const now = Date.now();
    const timeSinceLastWheel = now - lastWheelTime.current;

    // Debounce: only allow scroll every 150ms
    if (timeSinceLastWheel < 150) {
      e.preventDefault();
      return;
    }

    const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;

    // Require a minimum delta to trigger scroll
    if (Math.abs(delta) < 10) return;

    if (delta > 0 && scrollIndex < maxIndex) {
      e.preventDefault();
      lastWheelTime.current = now;
      setScrollIndex(prev => Math.min(maxIndex, prev + 1));
    } else if (delta < 0 && scrollIndex > 0) {
      e.preventDefault();
      lastWheelTime.current = now;
      setScrollIndex(prev => Math.max(0, prev - 1));
    }
  }, [scrollIndex, maxIndex]);

  // Handle touch events for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && scrollIndex < maxIndex) {
        setScrollIndex(prev => Math.min(maxIndex, prev + 1));
      } else if (diff < 0 && scrollIndex > 0) {
        setScrollIndex(prev => Math.max(0, prev - 1));
      }
    }
  }, [scrollIndex, maxIndex]);

  // Handle mouse drag for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    wasDragged.current = false;
    dragStartX.current = e.clientX;
    dragStartIndex.current = scrollIndex;
  }, [scrollIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const diff = dragStartX.current - e.clientX;

    // Only consider it a drag if moved more than 10px
    if (Math.abs(diff) > 10) {
      wasDragged.current = true;
    }

    const indexDiff = Math.round(diff / cardTotalWidth);
    const newIndex = Math.max(0, Math.min(maxIndex, dragStartIndex.current + indexDiff));

    if (newIndex !== scrollIndex) {
      setScrollIndex(newIndex);
    }
  }, [scrollIndex, maxIndex, cardTotalWidth]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleCardClick = useCallback((item: MenuItem) => {
    // Prevent click if we were dragging
    if (wasDragged.current) {
      wasDragged.current = false;
      return;
    }
    const index = sortedMenuItems.findIndex(i => i.id === item.id);
    setSelectedIndex(index >= 0 ? index : null);
  }, []);

  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      {/* Header - centered with container */}
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Selection
          </p>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-8 leading-[1.1] tracking-tight">
            55+ rotating<br />gourmet meals
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
      </div>

      {/* Scrollable menu cards - Full width: 100px from left, flush to right */}
      <div
        ref={carouselRef}
        className="relative ml-6 md:ml-[100px] pr-0 cursor-grab active:cursor-grabbing select-none"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-visible">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${scrollIndex * cardTotalWidth}px)`
            }}
          >
            {sortedMenuItems.map(item => (
              <MenuCard key={item.id} item={item} onClick={() => handleCardClick(item)} />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation arrows - centered */}
      <div className="container mx-auto px-6 max-w-7xl">
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
      {selectedItem && selectedIndex !== null && createPortal(
        <MenuDetailModal
          item={selectedItem}
          onClose={handleModalClose}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < sortedMenuItems.length - 1}
          currentIndex={selectedIndex}
          totalItems={sortedMenuItems.length}
        />,
        document.body
      )}
    </section>
  );
};

export default HomeMenuPreview;
