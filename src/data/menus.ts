// Menu data for Secret Menu - Weekly rotating menus
// Gluten-free, dairy-free, and vegetarian options available on request

export interface MenuItem {
  name: string;
  description?: string;
  tags?: ('gf' | 'df' | 'v' | 'vg')[];  // gluten-free, dairy-free, vegetarian, vegan
}

export interface DayMenu {
  day: string;
  lunch: MenuItem;
  dinner: MenuItem[];
  dessert: MenuItem | null;
}

export interface WeekMenu {
  id: string;
  startDate: string;  // ISO date string
  endDate: string;
  theme?: string;
  days: DayMenu[];
}

// Week 1: Jan 6-10, 2026 (Current)
const week1: WeekMenu = {
  id: 'week-2026-01-06',
  startDate: '2026-01-06',
  endDate: '2026-01-10',
  theme: 'Winter Comfort',
  days: [
    {
      day: 'MON',
      lunch: { name: 'Leek & Goat Cheese Tart', description: 'With radicchio salad', tags: ['v'] },
      dinner: [
        { name: 'Sweet Potato Gnocchi', description: 'Sage brown butter, toasted walnuts', tags: ['v'] },
        { name: 'Zucchini Tartare', description: 'With pine nuts and mint', tags: ['v', 'gf', 'df'] }
      ],
      dessert: { name: 'Chilled Mango-Coconut Cream', description: '', tags: ['gf', 'df', 'vg'] }
    },
    {
      day: 'TUE',
      lunch: { name: 'Crab Cakes', description: 'With asparagus and corn salad', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Duck Breast', description: 'Port wine reduction, silky carrots', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Avocado Chocolate Mousse', description: '', tags: ['gf', 'df', 'vg'] }
    },
    {
      day: 'WED',
      lunch: { name: 'Arugula Salad', description: 'Lemon, artichoke hearts, sunflower seeds, pecorino, sweet onion', tags: ['v', 'gf'] },
      dinner: [
        { name: "Shepherd's Pie", description: 'Classic with lamb and root vegetables' },
        { name: 'Spinach Walnut Apple Salad', description: 'With goat cheese crumbles', tags: ['v', 'gf'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Rosemary Lemon Braised Chicken', description: 'With wild farro and roasted carrots', tags: ['df'] },
      dinner: [
        { name: 'Nobu-Inspired Miso Glazed Cod', description: 'With bok choy and jasmine rice', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Bread Pudding', description: 'With rum-raisin sauce' }
    },
    {
      day: 'FRI',
      lunch: { name: 'Roasted Cauliflower & Butternut Squash Soup', description: 'With artisan bread', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Chicken Piccata', description: 'Lemon-white wine butter, capers, angel hair pasta' }
      ],
      dessert: null
    }
  ]
};

// Week 2: Jan 13-17, 2026
const week2: WeekMenu = {
  id: 'week-2026-01-13',
  startDate: '2026-01-13',
  endDate: '2026-01-17',
  theme: 'Mediterranean Journey',
  days: [
    {
      day: 'MON',
      lunch: { name: 'Greek Lentil Soup', description: 'With crusty sourdough', tags: ['v', 'df'] },
      dinner: [
        { name: 'Lamb Kofta', description: 'Tzatziki, grilled flatbread, cucumber salad', tags: ['gf'] }
      ],
      dessert: { name: 'Orange Blossom Panna Cotta', description: 'With pistachios' }
    },
    {
      day: 'TUE',
      lunch: { name: 'Falafel Bowl', description: 'Hummus, tabbouleh, pickled turnips', tags: ['v', 'df'] },
      dinner: [
        { name: 'Branzino en Papillote', description: 'Olives, capers, cherry tomatoes, herbs', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Baklava Bites', description: 'Honey, walnuts, phyllo' }
    },
    {
      day: 'WED',
      lunch: { name: 'Shakshuka', description: 'Poached eggs in spiced tomato, crusty bread', tags: ['v'] },
      dinner: [
        { name: 'Moroccan Chicken Tagine', description: 'Preserved lemon, olives, couscous', tags: ['df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Spanakopita', description: 'Spinach feta pie with Greek salad', tags: ['v'] },
      dinner: [
        { name: 'Grilled Octopus', description: 'Crispy potatoes, smoked paprika aioli', tags: ['gf'] }
      ],
      dessert: { name: 'Greek Yogurt with Honey & Figs', description: '', tags: ['gf', 'v'] }
    },
    {
      day: 'FRI',
      lunch: { name: 'Mezze Platter', description: 'Baba ganoush, muhammara, labneh, warm pita', tags: ['v'] },
      dinner: [
        { name: 'Herb-Crusted Rack of Lamb', description: 'Ratatouille, rosemary jus', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 3: Jan 20-24, 2026
const week3: WeekMenu = {
  id: 'week-2026-01-20',
  startDate: '2026-01-20',
  endDate: '2026-01-24',
  theme: 'Asian Fusion',
  days: [
    {
      day: 'MON',
      lunch: { name: 'Vietnamese Pho', description: 'Rice noodles, herbs, bean sprouts', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Balinese Bebek Betutu', description: 'Slow-roasted duck, sambal matah, steamed rice', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Black Rice Pudding', description: 'Coconut cream, mango', tags: ['gf', 'df', 'vg'] }
    },
    {
      day: 'TUE',
      lunch: { name: 'Miso Ramen', description: 'Soft egg, chashu pork, nori, scallions' },
      dinner: [
        { name: 'Thai Green Curry', description: 'Prawns, Thai basil, jasmine rice', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Matcha Cheesecake', description: 'With black sesame tuile' }
    },
    {
      day: 'WED',
      lunch: { name: 'Korean Bibimbap', description: 'Crispy rice, vegetables, gochujang, fried egg', tags: ['gf'] },
      dinner: [
        { name: 'Soy-Glazed Black Cod', description: 'Miso eggplant, pickled ginger', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Pad Thai', description: 'Rice noodles, tamarind, crushed peanuts', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Peking Duck Lettuce Wraps', description: 'Hoisin, scallions, cucumber', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Coconut Tapioca', description: 'With fresh tropical fruit', tags: ['gf', 'df', 'vg'] }
    },
    {
      day: 'FRI',
      lunch: { name: 'Japanese Curry', description: 'Katsu chicken, pickles, steamed rice' },
      dinner: [
        { name: 'Char Siu Pork Belly', description: 'Bok choy, garlic noodles', tags: ['df'] }
      ],
      dessert: null
    }
  ]
};

// Week 4: Jan 27-31, 2026
const week4: WeekMenu = {
  id: 'week-2026-01-27',
  startDate: '2026-01-27',
  endDate: '2026-01-31',
  theme: 'Alpine Elegance',
  days: [
    {
      day: 'MON',
      lunch: { name: 'French Onion Soup', description: 'Gruyère crouton', tags: ['v'] },
      dinner: [
        { name: 'Wiener Schnitzel', description: 'Veal, lingonberry, potato salad', tags: ['df'] }
      ],
      dessert: { name: 'Apple Strudel', description: 'Vanilla sauce' }
    },
    {
      day: 'TUE',
      lunch: { name: 'Rösti', description: 'Swiss potato cake, smoked salmon, crème fraîche', tags: ['gf'] },
      dinner: [
        { name: 'Beef Bourguignon', description: 'Pearl onions, mushrooms, egg noodles' }
      ],
      dessert: { name: 'Chocolate Fondant', description: 'Crème anglaise', tags: ['gf'] }
    },
    {
      day: 'WED',
      lunch: { name: 'Salade Lyonnaise', description: 'Frisée, lardons, poached egg', tags: ['gf'] },
      dinner: [
        { name: 'Raclette Night', description: 'Melted cheese, charcuterie, cornichons, potatoes', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Käsespätzle', description: 'Swiss cheese egg noodles, caramelized onions', tags: ['v'] },
      dinner: [
        { name: 'Pan-Seared Trout', description: 'Hazelnut brown butter, green beans almondine', tags: ['gf'] }
      ],
      dessert: { name: 'Tarte Tatin', description: 'Caramelized apple, whipped cream' }
    },
    {
      day: 'FRI',
      lunch: { name: 'Gstaad Mushroom Risotto', description: 'Wild forest mushrooms, truffle oil, parmesan', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Venison Medallions', description: 'Juniper berry sauce, celery root purée, braised red cabbage', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 5: Feb 3-7, 2026
const week5: WeekMenu = {
  id: 'week-2026-02-03',
  startDate: '2026-02-03',
  endDate: '2026-02-07',
  theme: 'California Fresh',
  days: [
    {
      day: 'MON',
      lunch: { name: 'Avocado Toast Deluxe', description: 'Poached eggs, everything seasoning, microgreens', tags: ['v'] },
      dinner: [
        { name: 'Grilled Salmon', description: 'Meyer lemon, asparagus, quinoa pilaf', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Meyer Lemon Tart', description: 'Torched meringue' }
    },
    {
      day: 'TUE',
      lunch: { name: 'Dungeness Crab Louie', description: 'Classic SF salad with Louis dressing', tags: ['gf'] },
      dinner: [
        { name: 'Cioppino', description: 'San Francisco seafood stew, sourdough', tags: ['df'] }
      ],
      dessert: { name: 'Olive Oil Cake', description: 'Citrus, mascarpone' }
    },
    {
      day: 'WED',
      lunch: { name: 'Mission-Style Burrito Bowl', description: 'Carnitas, black beans, pico, guacamole', tags: ['gf'] },
      dinner: [
        { name: 'Wine Country Chicken', description: 'Sonoma herbs, roasted grapes, polenta', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Farmers Market Salad', description: 'Seasonal vegetables, citrus vinaigrette, goat cheese', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Grass-Fed Filet Mignon', description: 'Cabernet reduction, truffle mash, broccolini', tags: ['gf'] }
      ],
      dessert: { name: 'Strawberry Shortcake', description: 'Watsonville berries, chantilly' }
    },
    {
      day: 'FRI',
      lunch: { name: 'Sourdough Grilled Cheese', description: 'Three cheese blend, tomato bisque' , tags: ['v'] },
      dinner: [
        { name: 'Halibut Crudo', description: 'Yuzu, jalapeño, cilantro', tags: ['gf', 'df'] },
        { name: 'Seared Scallops', description: 'Cauliflower purée, pancetta crisp', tags: ['gf'] }
      ],
      dessert: null
    }
  ]
};

// Week 6: Feb 10-14, 2026 (Valentine's Week)
const week6: WeekMenu = {
  id: 'week-2026-02-10',
  startDate: '2026-02-10',
  endDate: '2026-02-14',
  theme: "Valentine's Romance",
  days: [
    {
      day: 'MON',
      lunch: { name: 'Lobster Bisque', description: 'Cognac cream, chive oil', tags: ['gf'] },
      dinner: [
        { name: 'Oysters Rockefeller', description: 'Spinach, pernod, parmesan', tags: ['gf'] }
      ],
      dessert: { name: 'Champagne Sorbet', description: '', tags: ['gf', 'df', 'vg'] }
    },
    {
      day: 'TUE',
      lunch: { name: 'Beet & Burrata Salad', description: 'Arugula, candied walnuts, balsamic', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Truffle Risotto', description: 'Black truffle shavings, aged parmesan', tags: ['v', 'gf'] }
      ],
      dessert: { name: 'Rose Petal Crème Brûlée', description: '', tags: ['gf'] }
    },
    {
      day: 'WED',
      lunch: { name: 'Hearts of Palm Ceviche', description: 'Coconut leche de tigre, plantain chips', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Filet & Lobster Tail', description: 'Surf and turf, drawn butter, asparagus', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Seared Foie Gras', description: 'Fig compote, brioche toast' },
      dinner: [
        { name: 'Beef Wellington for Two', description: 'Mushroom duxelles, puff pastry, red wine jus' }
      ],
      dessert: { name: 'Chocolate Lava Cake', description: 'Raspberry coulis, gold leaf', tags: ['gf'] }
    },
    {
      day: 'FRI',
      lunch: { name: 'Caviar Service', description: 'Blini, crème fraîche, traditional garnishes' },
      dinner: [
        { name: 'A5 Wagyu Ribeye', description: 'Japanese preparation, wasabi, soy', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Passion Fruit Soufflé', description: 'White chocolate sauce', tags: ['gf'] }
    }
  ]
};

// Week 7: Feb 17-21, 2026
const week7: WeekMenu = {
  id: 'week-2026-02-17',
  startDate: '2026-02-17',
  endDate: '2026-02-21',
  theme: 'South American Soul',
  days: [
    {
      day: 'MON',
      lunch: { name: 'Empanadas', description: 'Beef, chimichurri, pickled onions', tags: ['df'] },
      dinner: [
        { name: 'Peruvian Ceviche', description: 'Fresh catch, leche de tigre, sweet potato, cancha', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Tres Leches Cake', description: '' }
    },
    {
      day: 'TUE',
      lunch: { name: 'Causa Limeña', description: 'Layered potato, avocado, chicken', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Lomo Saltado', description: 'Stir-fried beef, tomatoes, fries, rice', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Alfajores', description: 'Dulce de leche sandwich cookies' }
    },
    {
      day: 'WED',
      lunch: { name: 'Brazilian Feijoada', description: 'Black bean stew, rice, farofa, orange', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Argentine Asado', description: 'Grilled skirt steak, provoleta, salsa criolla', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Arepas', description: 'Corn cakes, pulled pork, black beans, guac', tags: ['gf'] },
      dinner: [
        { name: 'Moqueca', description: 'Brazilian seafood stew, coconut, dendê oil, rice', tags: ['gf', 'df'] }
      ],
      dessert: { name: 'Churros', description: 'Chocolate sauce, cajeta' }
    },
    {
      day: 'FRI',
      lunch: { name: 'Ceviche Mixto', description: 'Mixed seafood, ají amarillo', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Cochinita Pibil', description: 'Slow-roasted pork, pickled onion, tortillas', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 8: Feb 24-28, 2026
const week8: WeekMenu = {
  id: 'week-2026-02-24',
  startDate: '2026-02-24',
  endDate: '2026-02-28',
  theme: 'Global Vegetarian',
  days: [
    {
      day: 'MON',
      lunch: { name: 'Indian Chana Masala', description: 'Chickpea curry, basmati, naan', tags: ['v', 'df'] },
      dinner: [
        { name: 'Mushroom Bourguignon', description: 'Red wine, pearl onions, mashed potatoes', tags: ['v', 'df'] }
      ],
      dessert: { name: 'Gulab Jamun', description: 'Rose syrup, cardamom', tags: ['v'] }
    },
    {
      day: 'TUE',
      lunch: { name: 'Falafel Wrap', description: 'Tahini, pickled vegetables, za\'atar', tags: ['v', 'df'] },
      dinner: [
        { name: 'Eggplant Parmesan', description: 'San Marzano tomato, fresh mozzarella, basil', tags: ['v'] }
      ],
      dessert: { name: 'Tiramisu', description: 'Classic preparation', tags: ['v'] }
    },
    {
      day: 'WED',
      lunch: { name: 'Tom Kha Soup', description: 'Coconut, galangal, mushrooms, tofu', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Vegetable Tagine', description: 'Seven vegetables, preserved lemon, couscous', tags: ['v', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Caprese Stack', description: 'Heirloom tomato, burrata, basil, balsamic', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Wild Mushroom Ravioli', description: 'Truffle cream, crispy sage', tags: ['v'] }
      ],
      dessert: { name: 'Panna Cotta', description: 'Seasonal berry compote', tags: ['v', 'gf'] }
    },
    {
      day: 'FRI',
      lunch: { name: 'Buddha Bowl', description: 'Quinoa, roasted vegetables, tahini, avocado', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Stuffed Bell Peppers', description: 'Rice, beans, cheese, ranchero sauce', tags: ['v', 'gf'] }
      ],
      dessert: null
    }
  ]
};

export const allMenus: WeekMenu[] = [week1, week2, week3, week4, week5, week6, week7, week8];

export const getCurrentWeekMenu = (): WeekMenu => {
  const today = new Date();
  const currentMenu = allMenus.find(menu => {
    const start = new Date(menu.startDate);
    const end = new Date(menu.endDate);
    end.setHours(23, 59, 59);
    return today >= start && today <= end;
  });
  return currentMenu || allMenus[0];
};

export const getUpcomingMenus = (count: number = 4): WeekMenu[] => {
  const today = new Date();
  return allMenus
    .filter(menu => new Date(menu.startDate) >= today)
    .slice(0, count);
};

export const dietaryInfo = {
  gf: { label: 'Gluten-Free', icon: 'GF' },
  df: { label: 'Dairy-Free', icon: 'DF' },
  v: { label: 'Vegetarian', icon: 'V' },
  vg: { label: 'Vegan', icon: 'VG' }
};

export const pricingInfo = {
  weeklyPlan: 100,
  monthlyPlan: 400,
  note: 'Gluten-free, dairy-free, and vegetarian modifications available on request at no extra charge.'
};
