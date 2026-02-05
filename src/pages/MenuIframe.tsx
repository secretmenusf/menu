import { withBasePath } from '@/lib/utils';
import SeedOfLife from '@/components/SeedOfLife';

interface MealItem {
  name: string;
  description: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DaySchedule {
  day: string;
  lunch: MealItem;
  dinner: MealItem;
}

// Next week's menu - keep in sync with WeeklySchedule.tsx
const weeklyMenu: DaySchedule[] = [
  {
    day: 'Monday',
    lunch: {
      name: 'Grass-Fed Beef Empanadas',
      description: 'Grass-fed beef empanadas with chimichurri dipping sauce + side salad.',
      image: '/menu-empanadas.png',
      calories: 520,
      protein: 28,
      carbs: 42,
      fat: 26,
    },
    dinner: {
      name: 'Pepper Steak & Celery Stir-Fry',
      description: 'Pepper steak and celery stir-fry with lemon and steamed rice.',
      image: '/menu-pepper-steak.png',
      calories: 580,
      protein: 42,
      carbs: 48,
      fat: 22,
    },
  },
  {
    day: 'Tuesday',
    lunch: {
      name: 'Beef Cheek Quesadillas',
      description: 'Beef cheek quesadillas with fresh guacamole and pico de gallo + side salad.',
      image: '/menu-quesadillas.png',
      calories: 620,
      protein: 36,
      carbs: 44,
      fat: 32,
    },
    dinner: {
      name: 'Salmon with Crispy Potatoes',
      description: 'Crispy potato wedges and whipped pesto feta with slow-roasted salmon and green olive chutney.',
      image: '/menu-salmon-potatoes.png',
      calories: 680,
      protein: 44,
      carbs: 38,
      fat: 36,
    },
  },
  {
    day: 'Wednesday',
    lunch: {
      name: 'Spring Chicken',
      description: 'Spring chicken with red pepper/sun-dried tomato hummus, brown lentils, roasted cauliflower & quinoa.',
      image: '/menu-spring-chicken.png',
      calories: 520,
      protein: 48,
      carbs: 42,
      fat: 16,
    },
    dinner: {
      name: "Mom's Meatloaf",
      description: "Mom's meatloaf with marinara sauce and cauliflower mash.",
      image: '/menu-meatloaf.png',
      calories: 640,
      protein: 38,
      carbs: 32,
      fat: 34,
    },
  },
  {
    day: 'Thursday',
    lunch: {
      name: 'Chicken Cordon Bleu',
      description: 'Chicken cordon bleu with scalloped potatoes.',
      image: '/menu-cordon-bleu.png',
      calories: 720,
      protein: 52,
      carbs: 42,
      fat: 36,
    },
    dinner: {
      name: 'Steak Salad',
      description: 'Roasted cauliflower green salad with green goddess dressing + grilled steak.',
      image: '/menu-steak-salad.png',
      calories: 560,
      protein: 46,
      carbs: 18,
      fat: 34,
    },
  },
  {
    day: 'Friday',
    lunch: {
      name: '4-Cheese Truffle Gnocchi',
      description: '4-cheese truffle gnocchi with panzanella salad.',
      image: '/menu-gnocchi.png',
      calories: 740,
      protein: 22,
      carbs: 68,
      fat: 42,
    },
    dinner: {
      name: 'Beef Ragu Lasagne',
      description: 'Slow-braised beef ragu lasagne with béchamel, mozzarella and Parmigiano Reggiano.',
      image: '/menu-lasagne.png',
      calories: 820,
      protein: 44,
      carbs: 62,
      fat: 42,
    },
  },
];

const MealCard = ({ meal, mealType }: { meal: MealItem; mealType: 'Lunch' | 'Dinner' }) => (
  <div className="flex-1 bg-card rounded-xl overflow-hidden border border-border/50">
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={withBasePath(meal.image)}
        alt={meal.name}
        className="w-full h-full object-contain"
      />
      <span className="absolute top-2 left-2 px-2 py-0.5 bg-background/90 backdrop-blur-sm rounded-full text-[10px] font-medium tracking-wide">
        {mealType}
      </span>
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">{meal.name}</h3>
      <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{meal.description}</p>
      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="bg-muted/50 rounded p-1.5">
          <div className="text-xs font-semibold text-foreground">{meal.calories}</div>
          <div className="text-[8px] text-muted-foreground uppercase">Cal</div>
        </div>
        <div className="bg-muted/50 rounded p-1.5">
          <div className="text-xs font-semibold text-foreground">{meal.protein}g</div>
          <div className="text-[8px] text-muted-foreground uppercase">Pro</div>
        </div>
        <div className="bg-muted/50 rounded p-1.5">
          <div className="text-xs font-semibold text-foreground">{meal.carbs}g</div>
          <div className="text-[8px] text-muted-foreground uppercase">Carb</div>
        </div>
        <div className="bg-muted/50 rounded p-1.5">
          <div className="text-xs font-semibold text-foreground">{meal.fat}g</div>
          <div className="text-[8px] text-muted-foreground uppercase">Fat</div>
        </div>
      </div>
    </div>
  </div>
);

const MenuIframe = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
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
            className="text-[10px] px-3 py-1.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Order Now
          </a>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 py-4 text-center border-b border-border/50">
        <h1 className="text-lg font-bold text-foreground mb-1">Next Week's Menu</h1>
        <p className="text-xs text-muted-foreground">
          Chef-prepared meals delivered twice weekly
        </p>
      </div>

      {/* Weekly Schedule */}
      <div className="p-4 space-y-4">
        {weeklyMenu.map((daySchedule) => (
          <div key={daySchedule.day} className="bg-card/30 rounded-2xl p-3 border border-border/30">
            <h2 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-emerald-500/30">
              {daySchedule.day}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <MealCard meal={daySchedule.lunch} mealType="Lunch" />
              <MealCard meal={daySchedule.dinner} mealType="Dinner" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-6 px-4 border-t border-border">
        <a
          href="https://secretmenusf.com/menu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          Order Now
        </a>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Order by Thursday evening for next week's delivery
        </p>
        <a
          href="https://secretmenusf.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground hover:underline mt-2 inline-block"
        >
          secretmenusf.com
        </a>
      </div>
    </div>
  );
};

export default MenuIframe;
