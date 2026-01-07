import { Link } from 'react-router-dom';
import SeedOfLife from '@/components/SeedOfLife';

interface DayMenu {
  day: string;
  meals: {
    type: string;
    items: string[];
  }[];
}

const menuData: DayMenu[] = [
  {
    day: "Day 1",
    meals: [
      {
        type: "Lunch",
        items: [
          "Caprese panini on freshly baked artisan bread",
          "Mixed green salad with vinaigrette & pickled red onions"
        ]
      },
      {
        type: "Snack",
        items: ["Spanish gildas with anchovies"]
      },
      {
        type: "Dinner",
        items: [
          "Chicken & beef andouille sausage paella",
          "Grilled padrón peppers"
        ]
      },
      {
        type: "Dessert",
        items: ["Burnt Basque cheesecake"]
      }
    ]
  },
  {
    day: "Day 2",
    meals: [
      {
        type: "Lunch",
        items: [
          "Grilled chicken Caesar kale wrap",
          "Beet salad"
        ]
      },
      {
        type: "Snack",
        items: ["Carrots with hummus"]
      },
      {
        type: "Dinner",
        items: [
          "Pita sandwich with freshly made falafel",
          "Tabbouleh"
        ]
      },
      {
        type: "Dessert",
        items: ["Chocolate chip cookies"]
      }
    ]
  },
  {
    day: "Day 3",
    meals: [
      {
        type: "Lunch",
        items: [
          "Bulgogi bowl with steamed jasmine rice, garlic broccoli, preserved egg, pickled carrots & chili crunch"
        ]
      },
      {
        type: "Dinner",
        items: [
          "Mezze spread: beet hummus, roasted pepper hummus & roasted garlic hummus",
          "Fresh pita bread",
          "Grilled meat skewers",
          "Saffron rice",
          "Beet salad"
        ]
      },
      {
        type: "Dessert",
        items: ["Chocolate chip cookies"]
      }
    ]
  },
  {
    day: "Day 4",
    meals: [
      {
        type: "Lunch",
        items: [
          "Spanish albondigas with almond saffron sauce",
          "Smashed potatoes with bravas sauce"
        ]
      },
      {
        type: "Dinner",
        items: [
          "Beef \"Sunday roast\" with rosemary potatoes, carrots & gravy",
          "Side salad with vinaigrette"
        ]
      },
      {
        type: "Dessert",
        items: ["Rice pudding"]
      }
    ]
  },
  {
    day: "Day 5",
    meals: [
      {
        type: "Lunch",
        items: [
          "Duck confit (48-hour)",
          "Seasonal vegetable medley",
          "French lentil salad"
        ]
      },
      {
        type: "Dinner",
        items: [
          "Grilled cheese sandwich on fresh sourdough",
          "Tomato soup"
        ]
      }
    ]
  }
];

const Menu = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <SeedOfLife size={32} className="text-foreground transition-transform duration-300 group-hover:scale-110" />
            <span className="font-display text-sm tracking-[0.3em] text-foreground">SECRET MENU</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link to="/chef" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              CHEF
            </Link>
            <Link to="/entry" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              ORDER
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <SeedOfLife size={48} className="text-foreground mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-foreground mb-4">
              THE MENU
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Five days of curated culinary experiences
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
                            className="font-body text-foreground/90 leading-relaxed"
                          >
                            {item}
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
