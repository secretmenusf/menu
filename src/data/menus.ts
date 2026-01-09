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

// Week 3: Jan 18-24, 2026
const week3: WeekMenu = {
  id: 'week-2026-01-18',
  startDate: '2026-01-18',
  endDate: '2026-01-24',
  theme: 'Global Flavors',
  days: [
    {
      day: 'SAT',
      lunch: { name: 'Healing Miso Lemon Ginger Shrimp Detox Broth', description: 'Optional organic tofu, vegan chipotle kale chips available', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Shrimp & Veggie Pan Fried Spring Rolls', description: 'With tofu avocado salad' },
        { name: 'Stir Fried Basil Chicken', description: 'With steamed jasmine rice and fried egg', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'SUN',
      lunch: { name: 'Lemon Arugula Pasta Salad', description: 'With egg salad sandwich on artisan sourdough' },
      dinner: [
        { name: 'Roasted Lamb Leg', description: 'Pomegranate glaze, roasted potatoes, fresh mint sauce', tags: ['gf', 'df'] },
        { name: 'Charred Carrots', description: 'Yogurt tahini sauce and fresh herbs', tags: ['v', 'gf'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Beef Cheek Quesadillas', description: 'With fresh guacamole and pico de gallo' },
      dinner: [
        { name: 'Lettuce Wraps', description: 'Steak carne asada, cotija cheese, cilantro lime aioli, avocado and pickled onions', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Irresistible Cuban Arroz con Pollo', description: 'Classic Cuban chicken and rice', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Lamb Carnitas Enchiladas', description: 'With salsa verde and queso fresco' }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Fresh Spaghetti', description: 'With crushed tomatoes, anchovies, olives and capers', tags: ['df'] },
      dinner: [
        { name: 'Tuscan Artichoke Tomato Salad', description: 'With grilled local grass fed steak', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Cannellini Soup', description: 'With artisan focaccia, heirloom tomato, basil and burrata', tags: ['v'] },
      dinner: [
        { name: 'Porchetta', description: 'Melt in your mouth, with polenta and wild mushrooms', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'California Chicken Salad', description: 'Microgreens, feta, avocado, artichoke hearts and fennel', tags: ['gf'] },
      dinner: [
        { name: 'Braised Beef Cheeks', description: 'With parsnip purée and charred scallion gremolata', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 4: Jan 25-31, 2026
const week4: WeekMenu = {
  id: 'week-2026-01-25',
  startDate: '2026-01-25',
  endDate: '2026-01-31',
  theme: 'Latin Inspirations',
  days: [
    {
      day: 'SAT',
      lunch: { name: 'Jennifer Aniston Salad', description: 'Chickpeas, cucumbers, pistachios, herbs, feta and lemon dressing', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Slow Cooked Beef Ragu Bolognese', description: 'Red wine tomato reduction with fresh egg yolk pappardelle, shaved pecorino and sourdough garlic bread' }
      ],
      dessert: null
    },
    {
      day: 'SUN',
      lunch: { name: 'Italian Tortellini Pasta Salami Salad', description: 'Classic Italian flavors' },
      dinner: [
        { name: 'Cuban Beef Picadillo', description: 'With black beans and savory plantains', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Chicken Tinga Empanadas', description: 'With chimichurri dipping sauce' },
      dinner: [
        { name: 'Cuban Beef Picadillo', description: 'With black beans and savory plantains', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Brazilian Moqueca', description: 'Tangy Brazilian fish stew with tomato, coconut milk and bell peppers', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Ropa Vieja', description: 'Cuban slow cooked beef with black beans and sweet plantains', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Vegan Cheesy Potato Empanadas', description: 'With cashew cheese, fried potatoes, fried basil and sundried tomatoes', tags: ['v', 'df'] },
      dinner: [
        { name: 'Creamy Tuscan Chicken', description: 'With angel hair pasta' }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Onigiri Sandwiches', description: 'Sesame scallion egg mayo and spicy sustainable tuna', tags: ['df'] },
      dinner: [
        { name: 'Chicken or Pork Katsu', description: 'With gravy, chopped cabbage and steamed rice' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Spanish Tortilla', description: 'Caramelized onions, confit potatoes, green onions. Add caviar +$75', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Tuna Tataki', description: 'Pistachio, almond, and macadamia crust with steamed veggies', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 5: Feb 1-7, 2026
const week5: WeekMenu = {
  id: 'week-2026-02-01',
  startDate: '2026-02-01',
  endDate: '2026-02-07',
  theme: 'Asian Fusion',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Tuna Poke Bowl', description: 'Edamame, pickled ginger, avocado, black sesame, scallions', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Duck Ramen', description: 'With shiitake and rich housemade bone broth, scallions', tags: ['df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Salmon Cherry Tomato Curry', description: 'With steamed jasmine rice', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Miso-Butter Chicken', description: 'With grapefruit', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Greek Chicken', description: 'With cucumber feta salad', tags: ['gf'] },
      dinner: [
        { name: 'Grass Fed Filet', description: 'With mashed potatoes and steamed carrots', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Ras el Hanout Chickpea Spinach Stew', description: 'Optional add chorizo', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Smashed Beef Kebab', description: 'With cucumber mint yogurt and freshly made pitas' }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Dan Dan Noodle Salad', description: 'Spicy Sichuan flavors' },
      dinner: [
        { name: 'Butternut Squash Ravioli', description: 'With brown butter sage and pecorino romano', tags: ['v'] }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Crispy Coconut Asparagus Green Bean Salad', description: 'Fresh and crunchy', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Hoisin Garlic Noodles', description: 'With pink jumbo prawns', tags: ['df'] }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Chicken Red Lentil Soup', description: 'With lemony yogurt', tags: ['gf'] },
      dinner: [
        { name: 'Stuffed Poblano Peppers', description: 'With chicken tinga', tags: ['gf'] }
      ],
      dessert: null
    }
  ]
};

// Week 6: Feb 8-14, 2026 (Valentine's Week)
const week6: WeekMenu = {
  id: 'week-2026-02-08',
  startDate: '2026-02-08',
  endDate: '2026-02-14',
  theme: "Valentine's Romance",
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Whipped Tofu', description: 'With roasted broccolini, crispy garlic chili crunch and cold soba noodles with edamame', tags: ['v', 'df'] },
      dinner: [
        { name: 'Pepper Steak Celery Stir-Fry', description: 'With lemon and steamed rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Italian Wedding Soup', description: 'Classic comfort' },
      dinner: [
        { name: '12 Hour Braised Beef Lasagne', description: 'With bechamel, mozzarella and Parmigiano Reggiano' }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Creamy Butternut Squash Coconut Noodle Soup', description: 'Warming and rich', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Chicken Cordon Bleu', description: 'With scalloped potatoes' }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Aloo Gobi', description: 'With fresh turmeric-dahl soup and basmati rice', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Lamb Biryani', description: 'With tempered spices, saffron and rose water', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Crepes', description: 'With Gruyere and Ham or Gruyere and Mushrooms, side salad', tags: ['v'] },
      dinner: [
        { name: 'Eastern European Beef Cabbage Rolls', description: 'With crusty artisan bread' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Savory Cheddar Scones', description: 'Or Cheddar Bacon Scones with onion jam and radicchio salad' },
      dinner: [
        { name: "Moms' Meatloaf", description: 'With marinara sauce and cauliflower mash', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Chicken Kale Caesar Salad', description: 'Classic with a twist', tags: ['gf'] },
      dinner: [
        { name: 'Roast Lamb Shoulder', description: 'With spring vegetables', tags: ['gf', 'df'] }
      ],
      dessert: null
    }
  ]
};

// Week 7: Feb 15-21, 2026
const week7: WeekMenu = {
  id: 'week-2026-02-15',
  startDate: '2026-02-15',
  endDate: '2026-02-21',
  theme: 'Mediterranean & Beyond',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Peruvian Ceviche', description: 'With leche de tigre and plantain chips', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Lentil Salad', description: 'With roasted veggies, beef kofta and saffron rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Four Cheese Gnocchi', description: 'With side of arugula salad', tags: ['v'] },
      dinner: [
        { name: 'Lamb Rack', description: 'With pistachio mint crust and turnip puree', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Korean Soy Garlic Chicken Thighs', description: 'With kimchi, pickled veggies and steamed rice', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Spring Chicken', description: 'Red pepper sun dried tomato hummus, brown lentils and roasted cauliflower', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Pomegranate Greens Salad', description: 'With halloumi croutons and spiced orange vinaigrette', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Aglio e Olio Pan Seared Cod', description: 'With creamy polenta', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Thai Style Salmon Salad', description: 'Fresh and vibrant', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Pad See Ew "Drunken Noodles"', description: 'With chicken or pork and fried egg' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Roasted Cauliflower Green Salad', description: 'With green goddess dressing. Add chicken +$5', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Classic Chicken Pot Pie', description: 'Comfort food perfection' }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Crispy Potato Galette', description: 'With crème fraîche, scallions, capers, smoked salmon and fresh fraise', tags: ['gf'] },
      dinner: [
        { name: 'Fall-Apart Lamb Shoulder', description: 'With roast acorn squash on herbed white bean mash with chili, mint and pistachio butter', tags: ['gf'] }
      ],
      dessert: null
    }
  ]
};

// Week 8: Feb 22-28, 2026
const week8: WeekMenu = {
  id: 'week-2026-02-22',
  startDate: '2026-02-22',
  endDate: '2026-02-28',
  theme: 'Comfort Classics',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Cheese Soufflé', description: 'With endive salad', tags: ['v', 'gf'] },
      dinner: [
        { name: 'Grilled Grass Fed Steak', description: 'With tomatoes, pistachios, cumin, scallions, slow roasted sweet potato and chimichurri', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Grilled Cheese Sandwich', description: 'On artisan bread with tomato soup', tags: ['v'] },
      dinner: [
        { name: 'Roasted Beet & Pistachio Salad', description: 'With horseradish crème fraîche and gently poached spring chicken', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Crispy Brussels Sprouts', description: 'With pesto mac and cheese', tags: ['v'] },
      dinner: [
        { name: 'Veal and Chicken Cannelloni', description: 'With bechamel sauce and truffle' }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Indonesian Nasi Goreng', description: 'Fried rice with shrimp and vegetables', tags: ['df'] },
      dinner: [
        { name: 'Grilled Salmon', description: 'With charred cabbage, lemon, capers and white bean puree', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Grilled Zucchini Salad', description: 'With lemon-herb vinaigrette, smoky cauliflower steaks and beet salad', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Duck Confit', description: 'With roasted potatoes and raw asparagus salad with walnuts and parmesan', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Salmon Carpaccio', description: 'With sourdough crackers, blistered padrón peppers and beet salad', tags: ['gf'] },
      dinner: [
        { name: 'Porchetta', description: 'With sweet apple glaze, parsnip puree and fennel apple slaw', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Mandarin Fennel Burrata Salad', description: 'With gentle poached cod and white beans', tags: ['gf'] },
      dinner: [
        { name: 'Duck Ragu', description: 'With fresh pappardelle pasta in our famous marinara sauce' }
      ],
      dessert: null
    }
  ]
};

// Week 9: Mar 1-7, 2026
const week9: WeekMenu = {
  id: 'week-2026-03-01',
  startDate: '2026-03-01',
  endDate: '2026-03-07',
  theme: 'International Journey',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Burmese Tea Leaf Salad', description: 'With mixed nuts and grilled chicken', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Lomo Saltado', description: 'Peruvian sirloin beef cubes with stir fried tomatoes and french fries', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Fig Carpaccio', description: 'With pine nuts, blue cheese, arugula, duck prosciutto, lemon and artisan bread', tags: ['gf'] },
      dinner: [
        { name: 'Bangers and Mash', description: 'Local beef sausage, mashed potatoes and rich gravy', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Portuguese Octopus Salad', description: 'Salada de Polvo with olive oil, potatoes, fresh herbs, tomatoes and cucumber', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Portuguese Carne Assada', description: 'Traditional Azorean braised beef with small red potatoes, chouriço and onions', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'WED',
      lunch: { name: 'Thai Papaya Salad', description: 'With peanuts and shrimp', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Massaman Thai Curry', description: 'With duck breast and steamed jasmine rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'THU',
      lunch: { name: 'Scotch Egg', description: 'With honey mustard sauce and balsamic vinaigrette', tags: ['gf'] },
      dinner: [
        { name: 'Beef Wellington', description: 'With gravy, smashed potatoes and roasted carrots' }
      ],
      dessert: null
    },
    {
      day: 'FRI',
      lunch: { name: 'Bavarian Pretzel', description: 'With housemade sauerkraut, mustard, bratwurst and German potato salad' },
      dinner: [
        { name: 'Veal Vienna Schnitzel', description: 'With spätzle and gravy' }
      ],
      dessert: null
    },
    {
      day: 'SAT',
      lunch: { name: 'Italian Panini', description: 'Roasted bell peppers, eggplant, goat cheese and zesty basil pesto', tags: ['v'] },
      dinner: [
        { name: 'Chicken Piccata', description: 'Sautéed in bright lemon-white wine butter sauce, fried capers, fresh parsley over angel hair pasta' }
      ],
      dessert: null
    }
  ]
};

// Week 10: Mar 8-14, 2026
const week10: WeekMenu = {
  id: 'week-2026-03-08',
  startDate: '2026-03-08',
  endDate: '2026-03-14',
  theme: 'Spring Preview',
  days: [
    {
      day: 'SUN',
      lunch: { name: 'Crispy Potato Wedges', description: 'With whipped pesto feta, slow roasted salmon and green olive chutney', tags: ['gf'] },
      dinner: [
        { name: '24 Hour Adobo Crispy Pork Belly', description: 'With fried basil and steamed rice', tags: ['gf', 'df'] }
      ],
      dessert: null
    },
    {
      day: 'MON',
      lunch: { name: 'Roasted Cauliflower Butternut Squash Soup', description: 'With side of artisan bread', tags: ['v', 'gf', 'df'] },
      dinner: [
        { name: 'Pork Chop', description: 'In apple cider reduction with polenta and sautéed greens', tags: ['gf'] }
      ],
      dessert: null
    },
    {
      day: 'TUE',
      lunch: { name: 'Hearty Chicken Bone Broth Soup', description: 'With red cabbage salad', tags: ['gf', 'df'] },
      dinner: [
        { name: 'Eggplant Parmesan', description: 'With balsamic roasted brussels sprouts, panzanella salad and artisan bread', tags: ['v'] }
      ],
      dessert: null
    }
  ]
};

export const allMenus: WeekMenu[] = [week1, week2, week3, week4, week5, week6, week7, week8, week9, week10];

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
  monthlyPlan: 395,
  note: 'Gluten-free, dairy-free, and vegetarian modifications available on request at no extra charge.'
};
