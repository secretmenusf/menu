import { useMemo } from 'react';
import { Plus, Minus, Leaf, WheatOff, Milk } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOrderContext, OrderItem } from '@/contexts/OrderContext';
import { WeekMenu, DayMenu, MenuItem, dietaryInfo } from '@/data/menus';

// Price per meal in cents
const MEAL_PRICE_CENTS = 5000; // $50.00
const PREMIUM_PRICE_CENTS = 8000; // $80.00

interface OrderBuilderProps {
  menu: WeekMenu;
  onProceed?: () => void;
}

// Dietary tag badge component
function DietaryBadge({ tag }: { tag: 'gf' | 'df' | 'v' | 'vg' }) {
  const info = dietaryInfo[tag];
  const icons = {
    gf: <WheatOff size={12} className="mr-1" />,
    df: <Milk size={12} className="mr-1" />,
    v: <Leaf size={12} className="mr-1" />,
    vg: <Leaf size={12} className="mr-1" />,
  };

  return (
    <Badge
      variant="outline"
      className="text-xs font-body px-1.5 py-0 border-border/50 text-muted-foreground"
    >
      {icons[tag]}
      {info.icon}
    </Badge>
  );
}

// Quantity selector component
interface QuantitySelectorProps {
  quantity: number;
  onChange: (delta: number) => void;
  min?: number;
  max?: number;
}

function QuantitySelector({
  quantity,
  onChange,
  min = 0,
  max = 10,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-1">
      <button
        onClick={() => onChange(-1)}
        disabled={quantity <= min}
        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-display">{quantity}</span>
      <button
        onClick={() => onChange(1)}
        disabled={quantity >= max}
        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// Single meal item row
interface MealItemRowProps {
  item: MenuItem;
  menuWeekId: string;
  dayIndex: number;
  mealType: 'lunch' | 'dinner' | 'dessert';
  quantity: number;
  onQuantityChange: (delta: number) => void;
}

function MealItemRow({
  item,
  quantity,
  onQuantityChange,
}: MealItemRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="font-body text-foreground">{item.name}</p>
        {item.description && (
          <p className="font-body text-sm text-muted-foreground italic mt-0.5">
            {item.description}
          </p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {item.tags.map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-muted-foreground font-display tracking-wider">
          ${(MEAL_PRICE_CENTS / 100).toFixed(0)}
        </span>
        <QuantitySelector quantity={quantity} onChange={onQuantityChange} />
      </div>
    </div>
  );
}

// Day section component
interface DaySectionProps {
  day: DayMenu;
  dayIndex: number;
  menuWeekId: string;
  getQuantity: (dayIndex: number, mealType: 'lunch' | 'dinner' | 'dessert', itemName: string) => number;
  updateQuantity: (dayIndex: number, mealType: 'lunch' | 'dinner' | 'dessert', item: MenuItem, delta: number) => void;
}

function DaySection({
  day,
  dayIndex,
  menuWeekId,
  getQuantity,
  updateQuantity,
}: DaySectionProps) {
  return (
    <Card className="border-border/30 bg-card/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <CardTitle className="font-display text-xl tracking-[0.2em] text-gold">
            {day.day}
          </CardTitle>
          <div className="flex-1 h-px bg-border/50" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lunch */}
        <div>
          <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
            LUNCH
          </h4>
          <MealItemRow
            item={day.lunch}
            menuWeekId={menuWeekId}
            dayIndex={dayIndex}
            mealType="lunch"
            quantity={getQuantity(dayIndex, 'lunch', day.lunch.name)}
            onQuantityChange={(delta) => updateQuantity(dayIndex, 'lunch', day.lunch, delta)}
          />
        </div>

        {/* Dinner */}
        {day.dinner.length > 0 && (
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
              DINNER
            </h4>
            <div className="divide-y divide-border/20">
              {day.dinner.map((item, idx) => (
                <MealItemRow
                  key={idx}
                  item={item}
                  menuWeekId={menuWeekId}
                  dayIndex={dayIndex}
                  mealType="dinner"
                  quantity={getQuantity(dayIndex, 'dinner', item.name)}
                  onQuantityChange={(delta) => updateQuantity(dayIndex, 'dinner', item, delta)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dessert */}
        {day.dessert && (
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
              DESSERT
            </h4>
            <MealItemRow
              item={day.dessert}
              menuWeekId={menuWeekId}
              dayIndex={dayIndex}
              mealType="dessert"
              quantity={getQuantity(dayIndex, 'dessert', day.dessert.name)}
              onQuantityChange={(delta) => updateQuantity(dayIndex, 'dessert', day.dessert!, delta)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OrderBuilder({ menu, onProceed }: OrderBuilderProps) {
  const { cart, addItem, updateQuantity: updateCartQuantity, cartItemCount, cartTotal } = useOrderContext();

  // Get quantity for a specific item
  const getQuantity = (dayIndex: number, mealType: 'lunch' | 'dinner' | 'dessert', itemName: string): number => {
    const itemId = `${menu.id}-${dayIndex}-${mealType}-${itemName}`;
    const item = cart.items.find((i) => i.id === itemId);
    return item?.quantity || 0;
  };

  // Update quantity for an item
  const handleQuantityChange = (
    dayIndex: number,
    mealType: 'lunch' | 'dinner' | 'dessert',
    item: MenuItem,
    delta: number
  ) => {
    const itemId = `${menu.id}-${dayIndex}-${mealType}-${item.name}`;
    const currentQuantity = getQuantity(dayIndex, mealType, item.name);
    const newQuantity = currentQuantity + delta;

    if (currentQuantity === 0 && delta > 0) {
      // Add new item
      addItem({
        menuWeekId: menu.id,
        dayIndex,
        mealType,
        item,
        quantity: 1,
        unitPrice: MEAL_PRICE_CENTS,
      });
    } else {
      // Update existing item quantity
      updateCartQuantity(itemId, newQuantity);
    }
  };

  // Summary stats
  const summary = useMemo(() => {
    const itemCount = cartItemCount;
    const totalCents = cartTotal;
    return {
      itemCount,
      totalCents,
      totalDollars: (totalCents / 100).toFixed(2),
    };
  }, [cartItemCount, cartTotal]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-foreground mb-2">
          SELECT YOUR MEALS
        </h2>
        {menu.theme && (
          <p className="font-body text-muted-foreground">
            {menu.theme} - Week of {new Date(menu.startDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>

      {/* Menu days */}
      <div className="space-y-4">
        {menu.days.map((day, index) => (
          <DaySection
            key={index}
            day={day}
            dayIndex={index}
            menuWeekId={menu.id}
            getQuantity={getQuantity}
            updateQuantity={handleQuantityChange}
          />
        ))}
      </div>

      {/* Sticky footer with summary */}
      {summary.itemCount > 0 && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-4 -mx-6 px-6 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-sm tracking-wider text-muted-foreground">
                {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
              </span>
              <span className="mx-2 text-border">|</span>
              <span className="font-display text-lg tracking-wider text-foreground">
                ${summary.totalDollars}
              </span>
            </div>
            <Button
              onClick={onProceed}
              className="font-display tracking-[0.15em] px-8"
            >
              CONTINUE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderBuilder;
