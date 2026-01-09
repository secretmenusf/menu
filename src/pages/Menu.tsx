import { useState } from 'react';
import SeedOfLife from '@/components/SeedOfLife';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Leaf, WheatOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Week of January 12, 2026 (Current Week)
const week2Data: DayMenu[] = [
  {
    day: "Day 1",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Bulgogi bowl with steamed jasmine rice, garlic broccoli & preserved egg", glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Blistered padrón peppers with sea salt", vegetarian: true, glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Duck confit with roasted root vegetables", glutenFree: true },
          { name: "Mixed greens with lemon vinaigrette", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Rice pudding with blueberries", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 2",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Caprese panini with green goddess sauce", vegetarian: true },
          { name: "Fennel dill cucumber & bulgur salad", vegetarian: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Crispy Persian rice with spiced beef skewers", glutenFree: true },
          { name: "Beet salad with feta & caramelized onions", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Colossal chocolate chip cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 3",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Kale chicken Caesar wrap with crudités", },
          { name: "Roasted garlic hummus", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Spanish chicken paella with chorizo", glutenFree: true },
          { name: "Spanish gildas with anchovies", glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Burnt Basque cheesecake", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 4",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Grilled cheese on fresh sourdough", vegetarian: true },
          { name: "Roasted tomato soup", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Almond saffron albondigas", glutenFree: true },
          { name: "Roasted smashed potatoes", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate chip cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 5",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Fresh falafel stuffed pita", vegetarian: true },
          { name: "Tabbouleh salad", vegetarian: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Classic dinner favorites: Duck confit, mixed greens & rice pudding", glutenFree: true }
        ]
      }
    ]
  }
];

// Week of January 5, 2026 (Last Week)
const week1Data: DayMenu[] = [
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

// Week of January 19, 2026 (Upcoming Week)
const week3Data: DayMenu[] = [
  {
    day: "Day 1",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Shoyu chicken bowl with jasmine rice, pickled daikon & sesame greens", glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Charred shishito peppers with sea salt", vegetarian: true, glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Harissa-spiced lamb meatballs with tomato fennel ragout", glutenFree: true },
          { name: "Citrus herb salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Rose water rice pudding", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 2",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Caprese panini with basil aioli", vegetarian: true },
          { name: "Roasted beet & orange salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Saffron chicken paella with chorizo", glutenFree: true },
          { name: "Marinated Spanish gildas", glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Burnt Basque cheesecake", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 3",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Kale chicken Caesar wrap with herb croutons" },
          { name: "Roasted garlic hummus", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Duck confit with rosemary potatoes", glutenFree: true },
          { name: "Mixed greens with lemon vinaigrette", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Colossal chocolate chip cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 4",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Falafel pita with tahini slaw", vegetarian: true },
          { name: "Tabbouleh salad", vegetarian: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Almond saffron albondigas", glutenFree: true },
          { name: "Roasted smashed potatoes", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate chip cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 5",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Grilled cheese on fresh sourdough", vegetarian: true },
          { name: "Roasted tomato soup", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Beef bulgogi bowl with chili crunch & scallions", glutenFree: true }
        ]
      }
    ]
  }
];

const weeks = [
  { id: 0, label: "January 5, 2026", data: week1Data },
  { id: 1, label: "January 12, 2026", data: week2Data },
  { id: 2, label: "January 19, 2026", data: week3Data },
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
  const [weekIndex, setWeekIndex] = useState(1); // Start on current week (Jan 12)
  
  const currentWeek = weeks[weekIndex];
  const canGoPrev = weekIndex > 0;
  const canGoNext = weekIndex < weeks.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Section header */}
          <div className="text-center mb-16">
            <SeedOfLife size={48} className="text-foreground mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-foreground mb-4">
              THE MENU
            </h1>
            
            {/* Week Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekIndex(prev => prev - 1)}
                disabled={!canGoPrev}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </Button>
              
              <p className="font-body text-lg text-muted-foreground min-w-[200px]">
                Week of {currentWeek.label}
              </p>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekIndex(prev => prev + 1)}
                disabled={!canGoNext}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </Button>
            </div>

          </div>

          {/* Menu by day */}
          <div className="space-y-16">
            {currentWeek.data.map((day, dayIndex) => (
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

      <Footer />
    </div>
  );
};

export default Menu;
