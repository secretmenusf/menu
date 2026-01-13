import { useState } from 'react';
import SeedOfLife from '@/components/SeedOfLife';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Leaf, WheatOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/social/ShareButton';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';

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
          { name: "Bulgogi Bowl with Steamed Jasmine Rice, Garlic Broccoli & Preserved Egg", glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Blistered Padrón Peppers with Sea Salt", vegetarian: true, glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Duck Confit with Roasted Root Vegetables", glutenFree: true },
          { name: "Mixed Greens with Lemon Vinaigrette", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Rice Pudding with Blueberries", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 2",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Caprese Panini with Green Goddess Sauce", vegetarian: true },
          { name: "Fennel Dill Cucumber & Bulgur Salad", vegetarian: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Crispy Persian Rice with Spiced Beef Skewers", glutenFree: true },
          { name: "Beet Salad with Feta & Caramelized Onions", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Colossal Chocolate Chip Cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 3",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Kale Chicken Caesar Wrap with Crudités", },
          { name: "Roasted Garlic Hummus", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Spanish Chicken Paella with Chorizo", glutenFree: true },
          { name: "Spanish Gildas with Anchovies", glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Burnt Basque Cheesecake", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 4",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Grilled Cheese on Fresh Sourdough", vegetarian: true },
          { name: "Roasted Tomato Soup", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Almond Saffron Albondigas", glutenFree: true },
          { name: "Roasted Smashed Potatoes", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate Chip Cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 5",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Fresh Falafel Stuffed Pita", vegetarian: true },
          { name: "Tabbouleh Salad", vegetarian: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Classic Dinner Favorites: Duck Confit, Mixed Greens & Rice Pudding", glutenFree: true }
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
          { name: "Caprese Panini on Freshly Baked Artisan Bread", vegetarian: true },
          { name: "Mixed Green Salad with Vinaigrette & Pickled Red Onions", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Spanish Gildas with Anchovies", glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Chicken & Beef Andouille Sausage Paella", glutenFree: true },
          { name: "Grilled Padrón Peppers", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Burnt Basque Cheesecake", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 2",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Grilled Chicken Caesar Kale Wrap" },
          { name: "Beet Salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Carrots with Hummus", vegetarian: true, glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Pita Sandwich with Freshly Made Falafel", vegetarian: true },
          { name: "Tabbouleh", vegetarian: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate Chip Cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 3",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Bulgogi Bowl with Steamed Jasmine Rice, Garlic Broccoli, Preserved Egg, Pickled Carrots & Chili Crunch", glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Mezze Spread: Beet Hummus, Roasted Pepper Hummus & Roasted Garlic Hummus", vegetarian: true, glutenFree: true },
          { name: "Fresh Pita Bread", vegetarian: true },
          { name: "Grilled Meat Skewers", glutenFree: true },
          { name: "Saffron Rice", vegetarian: true, glutenFree: true },
          { name: "Beet Salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate Chip Cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 4",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Spanish Albondigas with Almond Saffron Sauce", glutenFree: true },
          { name: "Smashed Potatoes with Bravas Sauce", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Beef \"Sunday Roast\" with Rosemary Potatoes, Carrots & Gravy", glutenFree: true },
          { name: "Side Salad with Vinaigrette", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Rice Pudding", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 5",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Duck Confit (48-Hour)", glutenFree: true },
          { name: "Seasonal Vegetable Medley", vegetarian: true, glutenFree: true },
          { name: "French Lentil Salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Grilled Cheese Sandwich on Fresh Sourdough", vegetarian: true },
          { name: "Tomato Soup", vegetarian: true, glutenFree: true }
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
          { name: "Shoyu Chicken Bowl with Jasmine Rice, Pickled Daikon & Sesame Greens", glutenFree: true }
        ]
      },
      {
        type: "Snack",
        items: [{ name: "Charred Shishito Peppers with Sea Salt", vegetarian: true, glutenFree: true }]
      },
      {
        type: "Dinner",
        items: [
          { name: "Harissa-Spiced Lamb Meatballs with Tomato Fennel Ragout", glutenFree: true },
          { name: "Citrus Herb Salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Rose Water Rice Pudding", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 2",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Caprese Panini with Basil Aioli", vegetarian: true },
          { name: "Roasted Beet & Orange Salad", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Saffron Chicken Paella with Chorizo", glutenFree: true },
          { name: "Marinated Spanish Gildas", glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Burnt Basque Cheesecake", vegetarian: true, glutenFree: true }]
      }
    ]
  },
  {
    day: "Day 3",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Kale Chicken Caesar Wrap with Herb Croutons" },
          { name: "Roasted Garlic Hummus", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Duck Confit with Rosemary Potatoes", glutenFree: true },
          { name: "Mixed Greens with Lemon Vinaigrette", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Colossal Chocolate Chip Cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 4",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Falafel Pita with Tahini Slaw", vegetarian: true },
          { name: "Tabbouleh Salad", vegetarian: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Almond Saffron Albondigas", glutenFree: true },
          { name: "Roasted Smashed Potatoes", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dessert",
        items: [{ name: "Chocolate Chip Cookies", vegetarian: true }]
      }
    ]
  },
  {
    day: "Day 5",
    meals: [
      {
        type: "Lunch",
        items: [
          { name: "Grilled Cheese on Fresh Sourdough", vegetarian: true },
          { name: "Roasted Tomato Soup", vegetarian: true, glutenFree: true }
        ]
      },
      {
        type: "Dinner",
        items: [
          { name: "Beef Bulgogi Bowl with Chili Crunch & Scallions", glutenFree: true }
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
      <SEOHead
        {...pageSEO.menu}
        url="https://sfsecretmenu.com/menu"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://sfsecretmenu.com' },
          { name: 'Menu', url: 'https://sfsecretmenu.com/menu' },
        ])}
      />

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
            <div className="flex items-center justify-center gap-4 mb-4">
              <ShareButton
                title={`SF Secret Menu - Week of ${currentWeek.label}`}
                text="Check out this week's chef-crafted menu from SF Secret Menu"
                variant="outline"
                size="sm"
              />
            </div>
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
