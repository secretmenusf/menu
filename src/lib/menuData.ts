export interface MenuItem {
  name: string;
  description: string;
}

export interface DayMenu {
  day: string;
  lunch: MenuItem;
  dinner: MenuItem[];
  dessert: MenuItem | null;
}

export const dayA: DayMenu = {
  day: "A",
  lunch: { name: "Leek & Goat Cheese Tart", description: "With radicchio salad" },
  dinner: [
    { name: "Sweet Potato Gnocchi", description: "" },
    { name: "Zucchini Tartare", description: "With pine nuts" }
  ],
  dessert: { name: "Chilled Sweet Mango-Cream", description: "" }
};

export const dayB: DayMenu = {
  day: "B",
  lunch: { name: "Crab Cakes", description: "With asparagus and corn salad" },
  dinner: [
    { name: "Duck Breast", description: "With port wine reduction and silky carrots" }
  ],
  dessert: { name: "Avocado Chocolate Mousse", description: "" }
};

export const dayC: DayMenu = {
  day: "C",
  lunch: { name: "Arugula Salad", description: "With lemon, artichoke hearts, sunflower seeds, pecorino, thinly shaved sweet onion + slice of artisan bread" },
  dinner: [
    { name: "Shepherd's Pie", description: "" },
    { name: "Spinach Walnut Goat Cheese & Apple Salad", description: "" }
  ],
  dessert: null
};

export const dayD: DayMenu = {
  day: "D",
  lunch: { name: "Rosemary Lemon Braised Chicken", description: "With wild farro and roasted carrots" },
  dinner: [
    { name: "Nobu Inspired Miso Glazed Cod", description: "" }
  ],
  dessert: { name: "Bread Pudding", description: "With rum-raisin" }
};

export const dayE: DayMenu = {
  day: "E",
  lunch: { name: "Roasted Cauliflower & Butternut Squash Soup", description: "With slice of artisan bread" },
  dinner: [
    { name: "Chicken Piccata", description: "Sautéed in bright lemon-white wine butter sauce, fried capers, fresh parsley, served over angel hair pasta" }
  ],
  dessert: null
};

export const weeklyMenu: DayMenu[] = [dayA, dayB, dayC, dayD, dayE];

export const WHATSAPP_NUMBER = '+14153724496';
