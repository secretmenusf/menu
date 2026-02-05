import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEOHead, pageSEO, schemas } from '@/components/seo/SEOHead';
import { withBasePath } from '@/lib/utils';
import { Share2, Download, Mail, Check, Link2 } from 'lucide-react';

interface MealItem {
  name: string;
  description: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
}

interface DaySchedule {
  day: string;
  lunch: MealItem;
  dinner: MealItem;
}

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
      price: 18,
    },
    dinner: {
      name: 'Pepper Steak & Celery Stir-Fry',
      description: 'Pepper steak and celery stir-fry with lemon and steamed rice.',
      image: '/menu-pepper-steak.png',
      calories: 580,
      protein: 42,
      carbs: 48,
      fat: 22,
      price: 26,
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
      price: 16,
    },
    dinner: {
      name: 'Salmon with Crispy Potatoes',
      description: 'Crispy potato wedges and whipped pesto feta with slow-roasted salmon and green olive chutney.',
      image: '/menu-salmon-potatoes.png',
      calories: 680,
      protein: 44,
      carbs: 38,
      fat: 36,
      price: 32,
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
      price: 22,
    },
    dinner: {
      name: "Mom's Meatloaf",
      description: "Mom's meatloaf with marinara sauce and cauliflower mash.",
      image: '/menu-meatloaf.png',
      calories: 640,
      protein: 38,
      carbs: 32,
      fat: 34,
      price: 24,
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
      price: 26,
    },
    dinner: {
      name: 'Steak Salad',
      description: 'Roasted cauliflower green salad with green goddess dressing + grilled steak.',
      image: '/menu-steak-salad.png',
      calories: 560,
      protein: 46,
      carbs: 18,
      fat: 34,
      price: 28,
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
      price: 24,
    },
    dinner: {
      name: 'Beef Ragu Lasagne',
      description: 'Slow-braised beef ragu lasagne with béchamel, mozzarella and Parmigiano Reggiano.',
      image: '/menu-lasagne.png',
      calories: 820,
      protein: 44,
      carbs: 62,
      fat: 42,
      price: 26,
    },
  },
];

const MealCard = ({ meal, mealType }: { meal: MealItem; mealType: 'Lunch' | 'Dinner' }) => (
  <div className="flex-1 bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow">
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={withBasePath(meal.image)}
        alt={meal.name}
        className="w-full h-full object-contain"
      />
      <span className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium tracking-wide">
        {mealType}
      </span>
    </div>
    <div className="p-4 sm:p-5">
      <h3 className="font-semibold text-lg text-foreground leading-tight mb-2">{meal.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{meal.description}</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-sm font-semibold text-foreground">{meal.calories}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Cal</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-sm font-semibold text-foreground">{meal.protein}g</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Protein</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-sm font-semibold text-foreground">{meal.carbs}g</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Carbs</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-sm font-semibold text-foreground">{meal.fat}g</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Fat</div>
        </div>
      </div>
    </div>
  </div>
);

const WeeklySchedule = () => {
  const [copied, setCopied] = useState(false);

  const menuUrl = 'https://secretmenusf.com/weekly';
  const menuTitle = 'Secret Menu SF - Weekly Menu';
  const menuDescription = 'Check out this week\'s chef-prepared meals from Secret Menu SF!';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: menuTitle,
          text: menuDescription,
          url: menuUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = menuUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    // Get base URL for images
    const baseUrl = window.location.origin;

    // Create a printable version that can be saved as PDF
    const printContent = `
      <html>
        <head>
          <title>Secret Menu SF - Weekly Menu</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; max-width: 900px; margin: 0 auto; }
            h1 { text-align: center; margin-bottom: 5px; font-size: 28px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; }
            .day { margin-bottom: 25px; page-break-inside: avoid; }
            .day-header { font-size: 18px; font-weight: bold; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #10b981; color: #10b981; }
            .meals { display: flex; gap: 20px; }
            .meal { flex: 1; background: #f9f9f9; border-radius: 12px; padding: 15px; }
            .meal-img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; background: #eee; }
            .meal-type { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
            .meal-name { font-size: 14px; font-weight: 600; margin-bottom: 5px; }
            .meal-desc { font-size: 11px; color: #666; margin-bottom: 8px; line-height: 1.4; }
            .nutrition { font-size: 10px; color: #888; background: #fff; padding: 8px; border-radius: 6px; }
            .nutrition span { display: inline-block; margin-right: 10px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #888; font-size: 11px; }
            @media print {
              body { padding: 20px; }
              .meal-img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>Secret Menu SF</h1>
          <p class="subtitle">Weekly Menu - Chef-Prepared Meals Delivered Twice Weekly</p>
          ${weeklyMenu.map(day => `
            <div class="day">
              <div class="day-header">${day.day}</div>
              <div class="meals">
                <div class="meal">
                  <img class="meal-img" src="${baseUrl}${day.lunch.image}" alt="${day.lunch.name}" />
                  <div class="meal-type">Lunch</div>
                  <div class="meal-name">${day.lunch.name}</div>
                  <div class="meal-desc">${day.lunch.description}</div>
                  <div class="nutrition">
                    <span>${day.lunch.calories} cal</span>
                    <span>${day.lunch.protein}g protein</span>
                    <span>${day.lunch.carbs}g carbs</span>
                    <span>${day.lunch.fat}g fat</span>
                  </div>
                </div>
                <div class="meal">
                  <img class="meal-img" src="${baseUrl}${day.dinner.image}" alt="${day.dinner.name}" />
                  <div class="meal-type">Dinner</div>
                  <div class="meal-name">${day.dinner.name}</div>
                  <div class="meal-desc">${day.dinner.description}</div>
                  <div class="nutrition">
                    <span>${day.dinner.calories} cal</span>
                    <span>${day.dinner.protein}g protein</span>
                    <span>${day.dinner.carbs}g carbs</span>
                    <span>${day.dinner.fat}g fat</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
          <div class="footer">
            Order at secretmenusf.com | Order by Thursday evening to be included in next week's delivery
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(menuTitle);
    const body = encodeURIComponent(`${menuDescription}\n\nView the full menu: ${menuUrl}\n\nThis week's highlights:\n\n${weeklyMenu.map(day => `${day.day}:\n  Lunch: ${day.lunch.name}\n  Dinner: ${day.dinner.name}`).join('\n\n')}\n\nOrder by Thursday evening to be included in next week's delivery!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Next Week's Menu | Secret Menu SF"
        description="Chef-prepared organic meals for next week. 10 delicious lunch & dinner options from Monday to Friday. Grass-fed beef, wild salmon, truffle gnocchi & more. Order by Thursday!"
        keywords="weekly meal menu, organic meal delivery, chef prepared meals, san francisco meal delivery, healthy lunch dinner"
        image="https://secretmenusf.com/og-weekly.png"
        url="https://secretmenusf.com/weekly"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://secretmenusf.com' },
          { name: 'Weekly Menu', url: 'https://secretmenusf.com/weekly' },
        ])}
      />

      <Header />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="container max-w-6xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
              Weekly Menu
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Fresh chef-prepared meals, delivered twice weekly. Lunch & dinner, Monday through Friday.
            </p>

            {/* Share Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Link2 size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={handleEmail}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Mail size={16} />
                Email
              </button>
            </div>
          </div>
        </section>

        {/* Weekly Schedule */}
        <section className="py-8 sm:py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="space-y-6 sm:space-y-8">
              {weeklyMenu.map((daySchedule) => (
                <div key={daySchedule.day} className="bg-card/30 rounded-3xl p-4 sm:p-6 border border-border/30">
                  {/* Day Header */}
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 pb-3 border-b border-emerald-500/30">
                    {daySchedule.day}
                  </h2>

                  {/* Meals Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <MealCard meal={daySchedule.lunch} mealType="Lunch" />
                    <MealCard meal={daySchedule.dinner} mealType="Dinner" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/menu"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Order Now
                </a>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-6 py-4 bg-card border border-border text-foreground font-semibold rounded-full hover:bg-muted transition-colors"
                >
                  <Share2 size={18} />
                  Share Menu
                </button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Order by Thursday evening to be included in next week's delivery
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WeeklySchedule;
