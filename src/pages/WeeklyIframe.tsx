import { useState } from 'react';
import { withBasePath } from '@/lib/utils';
import { Share2 } from 'lucide-react';

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
  <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img
        src={withBasePath(meal.image)}
        alt={meal.name}
        className="w-full h-full object-contain"
      />
      <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 dark:bg-black/80 rounded-full text-[10px] font-medium tracking-wide text-zinc-800 dark:text-zinc-200">
        {mealType}
      </span>
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-sm text-zinc-900 dark:text-white leading-tight mb-1">{meal.name}</h3>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">{meal.description}</p>
      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-1.5">
          <div className="text-xs font-semibold text-zinc-900 dark:text-white">{meal.calories}</div>
          <div className="text-[8px] text-zinc-500 uppercase">Cal</div>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-1.5">
          <div className="text-xs font-semibold text-zinc-900 dark:text-white">{meal.protein}g</div>
          <div className="text-[8px] text-zinc-500 uppercase">Pro</div>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-1.5">
          <div className="text-xs font-semibold text-zinc-900 dark:text-white">{meal.carbs}g</div>
          <div className="text-[8px] text-zinc-500 uppercase">Carb</div>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-1.5">
          <div className="text-xs font-semibold text-zinc-900 dark:text-white">{meal.fat}g</div>
          <div className="text-[8px] text-zinc-500 uppercase">Fat</div>
        </div>
      </div>
    </div>
  </div>
);

const WeeklyIframe = () => {
  const [copied, setCopied] = useState(false);
  const menuUrl = 'https://secretmenusf.com/weekly';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Secret Menu SF - Weekly Menu',
          text: "Check out this week's chef-prepared meals!",
          url: menuUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      // Copy link fallback
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Next Week's Menu</h1>
        <p className="text-xs text-zinc-500">
          Chef-prepared meals delivered twice weekly
        </p>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {weeklyMenu.map((daySchedule) => (
          <div key={daySchedule.day} className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl p-3 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 pb-2 border-b border-emerald-500/30">
              {daySchedule.day}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <MealCard meal={daySchedule.lunch} mealType="Lunch" />
              <MealCard meal={daySchedule.dinner} mealType="Dinner" />
            </div>
          </div>
        ))}
      </div>

      {/* CTA - Only Order and Share */}
      <div className="text-center py-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://secretmenusf.com/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-zinc-800 transition-colors"
          >
            Order Now
          </a>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 size={16} />
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          Order by Thursday evening for next week's delivery
        </p>
      </div>
    </div>
  );
};

export default WeeklyIframe;
