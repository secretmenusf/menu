import { useState, useEffect } from 'react';
import { X, Sparkles, Flame, Wrench, Leaf, Cookie } from 'lucide-react';
import { SECRET_SECRET_MENU, SECRET_CATEGORIES, type SecretMenuItem } from '@/data/secretSecretMenu';
import { Button } from '@/components/ui/button';

// Get theme colors and icons based on category
const getCategoryTheme = (category: SecretMenuItem['category']) => {
  switch (category) {
    case 'services':
      return {
        bgGradient: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20',
        radialGradient: 'bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]',
        iconColor: 'text-cyan-500/40',
        iconHover: 'text-cyan-500/60',
        textHover: 'group-hover:text-cyan-400',
        priceColor: 'text-cyan-500',
        tagBorder: 'border-cyan-500/20',
        tagText: 'text-cyan-500/80',
        Icon: Wrench,
      };
    case 'plants':
      return {
        bgGradient: 'bg-gradient-to-br from-green-900/20 to-emerald-900/20',
        radialGradient: 'bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.1),transparent_70%)]',
        iconColor: 'text-emerald-500/40',
        iconHover: 'text-emerald-500/60',
        textHover: 'group-hover:text-emerald-400',
        priceColor: 'text-emerald-500',
        tagBorder: 'border-emerald-500/20',
        tagText: 'text-emerald-500/80',
        Icon: Leaf,
      };
    case 'pantry':
      return {
        bgGradient: 'bg-gradient-to-br from-orange-900/20 to-rose-900/20',
        radialGradient: 'bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_70%)]',
        iconColor: 'text-orange-500/40',
        iconHover: 'text-orange-500/60',
        textHover: 'group-hover:text-orange-400',
        priceColor: 'text-orange-500',
        tagBorder: 'border-orange-500/20',
        tagText: 'text-orange-500/80',
        Icon: Cookie,
      };
    default:
      return {
        bgGradient: 'bg-gradient-to-br from-amber-900/20 to-orange-900/20',
        radialGradient: 'bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]',
        iconColor: 'text-amber-500/40',
        iconHover: 'text-amber-500/60',
        textHover: 'group-hover:text-amber-400',
        priceColor: 'text-amber-500',
        tagBorder: 'border-amber-500/20',
        tagText: 'text-amber-500/80',
        Icon: Flame,
      };
  }
};

interface SecretSecretMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const SecretItemCard = ({ item }: { item: SecretMenuItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = getCategoryTheme(item.category);
  const IconComponent = theme.Icon;

  return (
    <div
      className="group relative border border-border/30 rounded-lg p-4 bg-card/30 hover:bg-card/50 hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image placeholder - in production would use actual images */}
      <div className={`aspect-square mb-4 rounded-md flex items-center justify-center overflow-hidden relative ${theme.bgGradient}`}>
        <div className={`absolute inset-0 ${theme.radialGradient}`} />
        <IconComponent
          className={`${theme.iconColor} transition-all duration-500 ${isHovered ? `scale-125 ${theme.iconHover}` : ''}`}
          size={48}
        />
        {item.tags.includes('Signature') && (
          <div className="absolute top-2 right-2">
            <Sparkles className="text-amber-400" size={16} />
          </div>
        )}
        {item.tags.includes('Bundle') && (
          <div className="absolute top-2 right-2">
            <Sparkles className={theme.priceColor} size={16} />
          </div>
        )}
      </div>

      {/* Item info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-display text-sm tracking-[0.1em] text-foreground transition-colors ${theme.textHover}`}>
            {item.name.toUpperCase()}
          </h4>
          <div className="text-right">
            <span className={`font-display text-lg ${theme.priceColor}`}>
              ${item.price}{item.priceUnit || ''}
            </span>
            {item.minHours && (
              <p className="font-body text-[10px] text-muted-foreground">
                {item.minHours}hr min
              </p>
            )}
          </div>
        </div>

        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 text-[9px] font-display tracking-wider border rounded-full ${theme.tagBorder} ${theme.tagText}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Inspiration credit */}
        {item.inspiration && (
          <p className="font-body text-[10px] text-muted-foreground/50 italic pt-1">
            Inspired by {item.inspiration}
          </p>
        )}
      </div>
    </div>
  );
};

const SecretSecretMenu = ({ isVisible, onClose }: SecretSecretMenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Delay showing content for dramatic effect
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const filteredItems = selectedCategory === 'all'
    ? SECRET_SECRET_MENU
    : SECRET_SECRET_MENU.filter((item) => item.category === selectedCategory);

  if (!isAnimating && !isVisible) return null;

  return (
    <div
      className={`absolute inset-0 z-50 overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Animated background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-amber-950/95 via-background/98 to-background transition-transform duration-700 ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

        {/* Animated flame particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content container */}
      <div
        className={`relative z-10 h-full overflow-y-auto transition-all duration-500 delay-200 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="container mx-auto px-6 max-w-6xl py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Flame className="text-amber-500" size={24} />
                <h2 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-amber-400">
                  THE SECRET SECRET MENU
                </h2>
                <Flame className="text-amber-500" size={24} />
              </div>
              <p className="font-body text-amber-500/60 text-sm tracking-wide">
                California classics • All-time favorites • Not on any menu
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full border border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all group"
            >
              <X className="text-amber-500 group-hover:rotate-90 transition-transform duration-300" size={20} />
            </button>
          </div>

          {/* Konami code hint */}
          <div className="mb-8 p-4 border border-amber-500/20 rounded-lg bg-amber-500/5 text-center">
            <p className="font-display text-xs tracking-[0.2em] text-amber-500/80">
              YOU FOUND THE SECRET • ↑↑↓↓←→←→ ENTER SPACE
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {SECRET_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full border transition-all font-display text-xs tracking-wider ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-background border-amber-500'
                    : 'border-amber-500/30 text-amber-500/70 hover:border-amber-500/60 hover:text-amber-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {filteredItems.map((item) => (
              <SecretItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Footer */}
          <div className="text-center space-y-4 pb-8">
            <Button
              size="lg"
              className="rounded-full px-12 font-display tracking-wider bg-amber-500 hover:bg-amber-400 text-background"
            >
              ORDER FROM SECRET MENU
            </Button>
            <p className="font-body text-xs text-amber-500/50">
              Available for pickup only • Cash preferred • IYKYK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretSecretMenu;
