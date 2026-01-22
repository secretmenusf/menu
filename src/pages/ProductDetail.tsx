import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { galleryMenuItems, type MenuItem, type MenuItemOption, vegetarianCustomizations } from '@/data/menus';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Star,
  Plus,
  Minus,
  ChevronDown,
  Leaf,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

// FAQ Data
const faqs = [
  {
    question: 'How does the subscription work?',
    answer: 'Your first week is 43% off. After that, your order renews weekly at the regular price. You can pause, skip, or cancel anytime with no fees.'
  },
  {
    question: 'How is the food delivered?',
    answer: 'We deliver fresh, chef-prepared meals in insulated packaging to keep everything at the perfect temperature. Delivery is $10 in the Bay Area.'
  },
  {
    question: 'How long do the meals last?',
    answer: 'Our meals stay fresh for 5-7 days in the refrigerator. Each meal comes with heating instructions for the best experience.'
  },
  {
    question: 'Can I customize my order?',
    answer: 'Yes! You can add proteins, swap sides, and customize portions. We also accommodate dietary restrictions - just let us know.'
  },
  {
    question: 'What if I\'m not satisfied?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not happy with your order, we\'ll make it right or refund you.'
  }
];

// Quantity Stepper
const QuantityStepper = ({ value, onChange, min = 1, max = 10 }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) => (
  <div className="flex items-center border border-border rounded-lg">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className="w-10 h-10 flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
    >
      <Minus size={16} />
    </button>
    <span className="w-12 text-center font-medium">{value}</span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      className="w-10 h-10 flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
    >
      <Plus size={16} />
    </button>
  </div>
);

// FAQ Item
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left"
      >
        <span className="font-display text-lg tracking-wide">{question}</span>
        <ChevronDown className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="pb-6">
          <p className="font-body text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  );
};

// Star Rating
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={cn(
          star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
        )}
      />
    ))}
  </div>
);

// Option Selection Component
const OptionCheckbox = ({
  option,
  isSelected,
  quantity: optQuantity,
  onToggle,
  onQuantityChange
}: {
  option: MenuItemOption;
  isSelected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (qty: number) => void;
}) => {
  const priceDisplay = option.priceModifier > 0
    ? `+$${option.priceModifier.toFixed(2)}`
    : option.priceModifier < 0
      ? `-$${Math.abs(option.priceModifier).toFixed(2)}`
      : 'Free';

  return (
    <div className={cn(
      'flex items-center justify-between p-4 rounded-xl border transition-all',
      isSelected
        ? 'border-emerald-500 bg-emerald-500/5'
        : 'border-border/50 hover:border-border'
    )}>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 flex-1 text-left"
      >
        <div className={cn(
          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
          isSelected
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-muted-foreground/30'
        )}>
          {isSelected && <Check size={12} className="text-white" />}
        </div>
        <span className="font-body text-foreground">{option.name}</span>
      </button>
      <div className="flex items-center gap-3">
        {option.allowMultiple && isSelected && (
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => onQuantityChange(Math.max(1, optQuantity - 1))}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{optQuantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(option.maxQuantity || 10, optQuantity + 1))}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
        <span className={cn(
          'font-medium text-sm min-w-[60px] text-right',
          option.priceModifier < 0 ? 'text-emerald-500' : 'text-muted-foreground'
        )}>
          {priceDisplay}
        </span>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the menu item
  const item = useMemo(() =>
    galleryMenuItems.find(m => m.id === id) || galleryMenuItems[0],
    [id]
  );

  // State
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Get all available options for this item
  const availableOptions = useMemo(() => {
    // Use item's own options, or default vegetarian customizations for items without options
    return item.options || vegetarianCustomizations;
  }, [item]);

  // Group options by category
  const groupedOptions = useMemo(() => {
    const groups: Record<string, MenuItemOption[]> = {};
    availableOptions.forEach(opt => {
      const category = opt.category || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(opt);
    });
    return groups;
  }, [availableOptions]);

  // Category labels
  const categoryLabels: Record<string, string> = {
    protein: '🥩 Add Protein',
    side: '🥗 Side Options',
    'add-on': '✨ Add-ons',
    extra: '➕ Extras',
    portion: '📏 Portion Size',
    dietary: '🌱 Dietary Options',
    other: '📋 Other Options'
  };

  // Toggle option selection
  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev[optionId]) {
        const { [optionId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [optionId]: 1 };
    });
  };

  // Update option quantity
  const updateOptionQuantity = (optionId: string, qty: number) => {
    setSelectedOptions(prev => ({ ...prev, [optionId]: qty }));
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = item.price;
    Object.entries(selectedOptions).forEach(([optId, qty]) => {
      const option = availableOptions.find(o => o.id === optId);
      if (option) {
        total += option.priceModifier * qty;
      }
    });
    return total * quantity;
  };

  // Get related items (same category or random)
  const relatedItems = useMemo(() =>
    galleryMenuItems
      .filter(m => m.id !== item.id)
      .slice(0, 4),
    [item.id]
  );

  // Mock images for gallery (using same image repeated for demo)
  const images = [
    item.image || '/images/menu/plated/default.png',
    item.image || '/images/menu/plated/default.png',
    item.image || '/images/menu/plated/default.png',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Hero Section - Product Info */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                <img
                  src={images[selectedImageIndex]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImageIndex === idx
                        ? 'border-foreground'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
                <div className="text-center">
                  <p className="font-display text-2xl text-foreground">{item.nutrition?.calories || 450}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl text-foreground">{item.nutrition?.protein || 35}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl text-foreground">{item.prepTime || 5} min</p>
                  <p className="text-xs text-muted-foreground">Heat Time</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl text-foreground">5-7</p>
                  <p className="text-xs text-muted-foreground">Days Fresh</p>
                </div>
              </div>
            </div>

            {/* Right - Product Info */}
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {item.tags?.includes('gf') && (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-full">
                    Gluten-Free
                  </span>
                )}
                {item.tags?.includes('v') && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full flex items-center gap-1">
                    <Leaf size={12} /> Vegetarian
                  </span>
                )}
                {item.tags?.includes('df') && (
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-medium rounded-full">
                    Dairy-Free
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-4">
                {item.name}
              </h1>

              {/* Description */}
              <p className="font-body text-lg text-muted-foreground mb-6">
                {item.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-8">
                <StarRating rating={5} />
                <span className="text-sm text-muted-foreground">4.9 (127 reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl text-foreground">${originalPrice}</span>
                  <span className="text-muted-foreground">per serving</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                <span className="font-display text-sm tracking-wider text-muted-foreground">QUANTITY</span>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </div>

              {/* Customization Options */}
              {Object.keys(groupedOptions).length > 0 && (
                <div className="space-y-6 mb-6">
                  {Object.entries(groupedOptions).map(([category, options]) => (
                    <div key={category}>
                      <h3 className="font-display text-sm tracking-wider text-muted-foreground mb-3">
                        {categoryLabels[category] || category.toUpperCase()}
                      </h3>
                      <div className="space-y-2">
                        {options.map(option => (
                          <OptionCheckbox
                            key={option.id}
                            option={option}
                            isSelected={!!selectedOptions[option.id]}
                            quantity={selectedOptions[option.id] || 1}
                            onToggle={() => toggleOption(option.id)}
                            onQuantityChange={(qty) => updateOptionQuantity(option.id, qty)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-6">
                <h3 className="font-display text-sm tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <MessageSquare size={14} />
                  SPECIAL INSTRUCTIONS
                </h3>
                <Textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any allergies, preferences, or special requests..."
                  className="min-h-[100px] resize-none bg-muted/30 border-border/50"
                />
              </div>

              {/* Add to Delivery Button */}
              <Button
                size="lg"
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-display text-lg tracking-wider"
              >
                Add to Delivery - ${calculateTotal().toFixed(2)}
              </Button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck size={18} />
                  <span>$10 Delivery in Bay Area</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield size={18} />
                  <span>30-Day Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl tracking-wider text-foreground mb-4">
                CUSTOMER REVIEWS
              </h2>
              <div className="flex items-center justify-center gap-3">
                <StarRating rating={5} />
                <span className="text-lg">4.9 out of 5 based on 127 reviews</span>
              </div>
            </div>

            {/* Review Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Sarah M.', review: 'The lamb is absolutely incredible. Restaurant quality without leaving home. My family looks forward to delivery day!', rating: 5 },
                { name: 'James K.', review: 'Finally, healthy food that actually tastes good. The portions are generous and everything is so fresh.', rating: 5 },
                { name: 'Emily R.', review: 'Game changer for busy weeknights. Heat for 5 minutes and dinner is served. The quality is unmatched.', rating: 5 },
              ].map((review, idx) => (
                <div key={idx} className="bg-background rounded-2xl p-6 border border-border/50">
                  <StarRating rating={review.rating} />
                  <p className="font-body text-foreground/80 mt-4 mb-4">"{review.review}"</p>
                  <p className="font-display text-sm tracking-wider text-muted-foreground">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nutrition Facts Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl tracking-wider text-foreground mb-4">
                NUTRITION FACTS
              </h2>
              <p className="font-body text-muted-foreground">
                Per serving ({item.nutrition?.servingSize || '1 plate'})
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Main Nutrition Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="text-center p-6 bg-muted/30 rounded-2xl">
                  <p className="font-display text-4xl text-foreground">{item.nutrition?.calories || 450}</p>
                  <p className="text-sm text-muted-foreground mt-1">Calories</p>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-2xl">
                  <p className="font-display text-4xl text-foreground">{item.nutrition?.protein || 35}g</p>
                  <p className="text-sm text-muted-foreground mt-1">Protein</p>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-2xl">
                  <p className="font-display text-4xl text-foreground">{item.nutrition?.carbs || 28}g</p>
                  <p className="text-sm text-muted-foreground mt-1">Carbs</p>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-2xl">
                  <p className="font-display text-4xl text-foreground">{item.nutrition?.fat || 22}g</p>
                  <p className="text-sm text-muted-foreground mt-1">Fat</p>
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-muted/30 rounded-2xl p-8">
                <h3 className="font-display text-lg tracking-wider text-foreground mb-4">INGREDIENTS</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {item.ingredients?.join(', ') || 'Fresh, organic ingredients prepared daily by our chefs.'}
                </p>
                {item.allergens && item.allergens.length > 0 && (
                  <p className="font-body text-amber-600 mt-4">
                    <strong>Contains:</strong> {item.allergens.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl tracking-wider text-foreground mb-4">
                WHY SECRET MENU?
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div></div>
                <div className="font-display text-sm tracking-wider text-muted-foreground">SECRET MENU</div>
                <div className="font-display text-sm tracking-wider text-muted-foreground">MEAL KITS</div>
                <div className="font-display text-sm tracking-wider text-muted-foreground">TAKEOUT</div>
              </div>

              {[
                { feature: 'Chef-prepared', us: true, kits: false, takeout: true },
                { feature: 'Organic ingredients', us: true, kits: false, takeout: false },
                { feature: 'No cooking required', us: true, kits: false, takeout: true },
                { feature: 'Restaurant quality', us: true, kits: false, takeout: true },
                { feature: 'Customizable', us: true, kits: true, takeout: false },
                { feature: 'Cost per meal', us: '$15-25', kits: '$10-15', takeout: '$20-40' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 py-4 border-t border-border/30">
                  <div className="font-body text-foreground">{row.feature}</div>
                  <div className="text-center">
                    {typeof row.us === 'boolean' ? (
                      row.us ? <Check className="mx-auto text-emerald-500" size={20} /> : <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="font-medium text-foreground">{row.us}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof row.kits === 'boolean' ? (
                      row.kits ? <Check className="mx-auto text-emerald-500" size={20} /> : <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="text-muted-foreground">{row.kits}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof row.takeout === 'boolean' ? (
                      row.takeout ? <Check className="mx-auto text-emerald-500" size={20} /> : <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="text-muted-foreground">{row.takeout}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What is SECRET MENU */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-3xl tracking-wider text-foreground mb-6">
                WHAT IS SECRET MENU?
              </h2>
              <p className="font-body text-xl text-muted-foreground leading-relaxed mb-8">
                Secret Menu is San Francisco's premier chef-crafted meal delivery service.
                We prepare restaurant-quality dishes using organic, locally-sourced ingredients
                and deliver them fresh to your door. Just heat, plate, and enjoy.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👨‍🍳</span>
                  </div>
                  <h3 className="font-display text-lg tracking-wider mb-2">Chef-Crafted</h3>
                  <p className="font-body text-muted-foreground text-sm">
                    Every dish is prepared by professional chefs using culinary techniques.
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="font-display text-lg tracking-wider mb-2">100% Organic</h3>
                  <p className="font-body text-muted-foreground text-sm">
                    We source only organic, sustainable ingredients from local farms.
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="font-display text-lg tracking-wider mb-2">Ready in Minutes</h3>
                  <p className="font-body text-muted-foreground text-sm">
                    No cooking required. Heat for 5 minutes and dinner is served.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl tracking-wider text-foreground text-center mb-12">
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <div>
                {faqs.map((faq, idx) => (
                  <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Dishes */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="font-display text-3xl tracking-wider text-foreground text-center mb-12">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  to={`/product/${relatedItem.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
                    <img
                      src={relatedItem.image || '/images/menu/plated/default.png'}
                      alt={relatedItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-display text-sm tracking-wider text-foreground group-hover:text-foreground/70 transition-colors">
                    {relatedItem.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">${relatedItem.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-foreground text-background py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-3xl tracking-wider mb-4">
                JOIN THE SECRET
              </h2>
              <p className="font-body text-background/70 mb-8">
                Get exclusive access to new dishes, special offers, and chef's secrets delivered to your inbox.
              </p>
              <form className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-background/50"
                />
                <Button className="bg-background text-foreground hover:bg-background/90 font-display tracking-wider">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
