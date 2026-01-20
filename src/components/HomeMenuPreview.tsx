import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Leaf, ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react';
import { galleryMenuItems, type MenuItem, dietaryInfo } from '@/data/menus';
import SeedOfLife from '@/components/SeedOfLife';
import FishIcon from '@/components/FishIcon';

// Detail Modal Component
const MenuDetailModal = ({ item, onClose }: { item: MenuItem; onClose: () => void }) => {
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

          {/* Customization Options */}
          {item.options && item.options.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">Customize Your Order</h3>
              <div className="space-y-2">
                {item.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {option.category && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                          option.category === 'protein' ? 'bg-red-500/20 text-red-400' :
                          option.category === 'side' ? 'bg-emerald-500/20 text-emerald-400' :
                          option.category === 'add-on' ? 'bg-amber-500/20 text-amber-400' :
                          option.category === 'portion' ? 'bg-blue-500/20 text-blue-400' :
                          option.category === 'extra' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-muted-foreground/20 text-muted-foreground'
                        }`}>
                          {option.category}
                        </span>
                      )}
                      <span className="text-sm text-foreground">{option.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      option.priceModifier > 0 ? 'text-foreground' :
                      option.priceModifier < 0 ? 'text-emerald-500' :
                      'text-muted-foreground'
                    }`}>
                      {option.priceModifier > 0 ? `+$${option.priceModifier}` :
                       option.priceModifier < 0 ? `-$${Math.abs(option.priceModifier)}` :
                       'Free'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Select customizations when placing your order via WhatsApp or phone.
              </p>
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
            <Link
              to="/order"
              className="px-6 py-3 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Order Now
            </Link>
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
