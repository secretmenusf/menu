import MenuItem from './MenuItem';

const dayA = {
  day: "A",
  lunch: { name: "Leek & Goat Cheese Tart", description: "With radicchio salad" },
  dinner: [
    { name: "Sweet Potato Gnocchi", description: "" },
    { name: "Zucchini Tartare", description: "With pine nuts" }
  ],
  dessert: { name: "Chilled Sweet Mango-Cream", description: "" }
};

const dayB = {
  day: "B",
  lunch: { name: "Crab Cakes", description: "With asparagus and corn salad" },
  dinner: [
    { name: "Duck Breast", description: "With port wine reduction and silky carrots" }
  ],
  dessert: { name: "Avocado Chocolate Mousse", description: "" }
};

const dayC = {
  day: "C",
  lunch: { name: "Arugula Salad", description: "With lemon, artichoke hearts, sunflower seeds, pecorino, thinly shaved sweet onion + slice of artisan bread" },
  dinner: [
    { name: "Shepherd's Pie", description: "" },
    { name: "Spinach Walnut Goat Cheese & Apple Salad", description: "" }
  ],
  dessert: null
};

const dayD = {
  day: "D",
  lunch: { name: "Rosemary Lemon Braised Chicken", description: "With wild farro and roasted carrots" },
  dinner: [
    { name: "Nobu Inspired Miso Glazed Cod", description: "" }
  ],
  dessert: { name: "Bread Pudding", description: "With rum-raisin" }
};

const dayE = {
  day: "E",
  lunch: { name: "Roasted Cauliflower & Butternut Squash Soup", description: "With slice of artisan bread" },
  dinner: [
    { name: "Chicken Piccata", description: "Sautéed in bright lemon-white wine butter sauce, fried capers, fresh parsley, served over angel hair pasta" }
  ],
  dessert: null
};

const weeklyMenu = [dayA, dayB, dayC, dayD, dayE];

const MenuSection = () => {
  return (
    <section id="menu" className="relative py-32 bg-background">
      {/* Decorative top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-foreground text-3xl mb-4 block">☽</span>
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
            THE OFFERINGS
          </h2>
          <p className="font-body text-lg text-muted-foreground italic">
            Five days of curated nourishment
          </p>
        </div>

        {/* Weekly Menu */}
        <div className="space-y-12">
          {weeklyMenu.map((day) => (
            <div key={day.day} className="border border-border/30 rounded-lg p-6 bg-card/30">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-2xl tracking-[0.2em] text-mystical">DAY {day.day}</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              
              {/* Lunch */}
              <div className="mb-4">
                <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">LUNCH</h4>
                <p className="font-body text-foreground">{day.lunch.name}</p>
                {day.lunch.description && (
                  <p className="font-body text-sm text-muted-foreground italic">{day.lunch.description}</p>
                )}
              </div>

              {/* Dinner */}
              <div className="mb-4">
                <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">DINNER</h4>
                {day.dinner.map((item, idx) => (
                  <div key={idx} className="mb-1">
                    <p className="font-body text-foreground">{item.name}</p>
                    {item.description && (
                      <p className="font-body text-sm text-muted-foreground italic">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Dessert */}
              {day.dessert && (
                <div>
                  <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">DESSERT</h4>
                  <p className="font-body text-foreground">{day.dessert.name}</p>
                  {day.dessert.description && (
                    <p className="font-body text-sm text-muted-foreground italic">{day.dessert.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-20 text-center">
          <p className="font-body text-sm text-muted-foreground/60 tracking-wide">
            A gratuity of 20% is included for all who partake in the mysteries
          </p>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
