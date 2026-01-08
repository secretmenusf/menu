import SeedOfLife from '@/components/SeedOfLife';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Leaf, WheatOff } from 'lucide-react';

interface MenuItem {
  name: string;
  vegetarian?: boolean;
  glutenFree?: boolean;
}

interface DayMenu {
  day: string;
  meals: {
    type: string;
    items: MenuItem[];
  }[];
}

const menuData: DayMenu[] = [
  {
    day: "Day 1",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Caprese panini on freshly baked artisan bread", vegetarian: true },
          { name: "Mixed green salad with vinaigrette & pickled red onions", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Spanish gildas with anchovies", glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Chicken & beef andouille sausage paella", glutenFree: true },
          { name: "Grilled padrón peppers", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Burnt Basque cheesecake", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 2",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Grilled chicken Caesar kale wrap" },
          { name: "Beet salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Carrots with hummus", vegetarian: true, glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Pita sandwich with freshly made falafel", vegetarian: true },
          { name: "Tabbouleh", vegetarian: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate chip cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 3",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Bulgogi bowl with steamed jasmine rice, garlic broccoli, preserved egg, pickled carrots & chili crunch", glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Mezze spread: beet hummus, roasted pepper hummus & roasted garlic hummus", vegetarian: true, glutenFree: true },
          { name: "Fresh pita bread", vegetarian: true },
          { name: "Grilled meat skewers", glutenFree: true },
          { name: "Saffron rice", vegetarian: true, glutenFree: true },
          { name: "Beet salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate chip cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 4",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Spanish albondigas with almond saffron sauce", glutenFree: true },
          { name: "Smashed potatoes with bravas sauce", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Beef \"Sunday roast\" with rosemary potatoes, carrots & gravy", glutenFree: true },
          { name: "Side salad with vinaigrette", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Rice pudding", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 5",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Duck confit (48-hour)", glutenFree: true },
          { name: "Seasonal vegetable medley", vegetarian: true, glutenFree: true },
          { name: "French lentil salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Grilled cheese sandwich on fresh sourdough", vegetarian: true },
          { name: "Tomato soup", vegetarian: true, glutenFree: true }
        ]
      }
    ]
  }
];

const DietaryIcon = ({ vegetarian, glutenFree }: { vegetarian?: boolean; glutenFree?: boolean }) => {
  if (!vegetarian && !glutenFree) return null;
  
  return (
    <span className="inline-flex items-center gap-1.5 ml-2">
      {vegetarian && (
        <span className="inline-flex items-center justify-center" title="Vegetarian">
          <Leaf size={14} className="text-green-600" />
        </span>
      )}
      {glutenFree && (
        <span className="inline-flex items-center justify-center" title="Gluten-Free">
          <WheatOff size={14} className="text-amber-600" />
        </span>
      )}
    </span>
  );
};
const Menu = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Footer />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <SeedOfLife size={48} className="text-foreground mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-foreground mb-4">
              THE MENU
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Week of January 5, 2026
            </p>
          </div>

          {/* Menu by day */}
          <div className="space-y-16">
            {menuData.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-8">
                {/* Day header */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <h2 className="font-display text-sm tracking-[0.3em] text-foreground uppercase">
                    {day.day}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                {/* Meals */}
                <div className="space-y-6">
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="group">
                      <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-3 uppercase">
                        {meal.type}
                      </h3>
                      <div className="space-y-2 pl-4 border-l border-border/50">
                        {meal.items.map((item, itemIndex) => (
                          <p 
                            key={itemIndex} 
                            className="font-body text-foreground/90 leading-relaxed inline-flex items-center flex-wrap"
                          >
                            {item.name}
                            <DietaryIcon vegetarian={item.vegetarian} glutenFree={item.glutenFree} />
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="text-center mt-20">
            <div className="h-px bg-border mb-8" />
            <p className="font-body text-sm text-muted-foreground/60 tracking-wide">
              Menu subject to seasonal availability
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
