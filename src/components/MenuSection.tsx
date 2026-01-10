import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { allMenus, dietaryInfo, pricingInfo, type MenuItem as MenuItemType, type WeekMenu } from '@/data/menus';
import { subscriptionPlans } from '@/data/plans';
import { Button } from '@/components/ui/button';

const DietaryTag = ({ tag }: { tag: 'gf' | 'df' | 'v' | 'vg' }) => {
  const info = dietaryInfo[tag];
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-display tracking-wider border border-border/50 rounded-full text-muted-foreground"
      title={info.label}
    >
      {info.icon}
    </span>
  );
};

const MenuItemDisplay = ({ item }: { item: MenuItemType }) => (
  <div className="mb-2">
    <div className="flex items-center gap-2">
      <p className="font-body text-foreground">{item.name}</p>
      {item.tags && item.tags.length > 0 && (
        <div className="flex gap-1">
          {item.tags.map(tag => (
            <DietaryTag key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
    {item.description && (
      <p className="font-body text-sm text-muted-foreground italic">{item.description}</p>
    )}
  </div>
);

const WeekSelector = ({
  weeks,
  currentIndex,
  onSelect
}: {
  weeks: WeekMenu[];
  currentIndex: number;
  onSelect: (index: number) => void;
}) => {
  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
        className="p-2 rounded-full border border-border/50 hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-2">
        {weeks.map((week, idx) => (
          <button
            key={week.id}
            onClick={() => onSelect(idx)}
            className={`px-4 py-2 rounded-full border transition-all font-display text-xs tracking-wider whitespace-nowrap ${
              idx === currentIndex
                ? 'bg-foreground text-background border-foreground'
                : 'border-border/50 hover:border-foreground/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            {formatShortDate(week.startDate)}
          </button>
        ))}
      </div>

      <button
        onClick={() => onSelect(Math.min(weeks.length - 1, currentIndex + 1))}
        disabled={currentIndex === weeks.length - 1}
        className="p-2 rounded-full border border-border/50 hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const MenuSection = () => {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const currentMenu = allMenus[selectedWeekIndex];

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  return (
    <section id="menu" className="relative py-32 bg-background">
      {/* Decorative top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
            THE OFFERINGS
          </h2>
        </div>

        {/* Week selector */}
        <WeekSelector
          weeks={allMenus}
          currentIndex={selectedWeekIndex}
          onSelect={setSelectedWeekIndex}
        />

        {/* Current week info */}
        <div className="text-center mb-12">
          {currentMenu.theme && (
            <p className="font-display text-lg tracking-[0.3em] text-foreground mb-2">
              {currentMenu.theme.toUpperCase()}
            </p>
          )}
          <p className="font-body text-muted-foreground italic">
            {formatDateRange(currentMenu.startDate, currentMenu.endDate)}
          </p>
        </div>

        {/* Membership tiers preview */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <p className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
              MEMBERSHIP TIERS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Link
                key={plan.id}
                to={`/pricing?plan=${plan.id}`}
                className={`relative p-5 border rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  plan.popular
                    ? 'border-foreground/50 bg-card/50'
                    : 'border-border/30 bg-card/30 hover:border-border/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-0.5 text-[9px] font-display tracking-[0.2em] bg-foreground text-background rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h4 className="font-display text-sm tracking-[0.15em] text-foreground mb-1">
                    {plan.name.toUpperCase()}
                  </h4>
                  <p className="font-display text-2xl text-mystical mb-1">
                    ${plan.price}
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </p>
                  <p className="font-body text-xs text-muted-foreground/60">
                    {plan.mealsPerWeek} meals/week
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/pricing">
              <Button variant="outline" className="rounded-full px-6 font-display tracking-wider text-xs">
                VIEW ALL PLANS
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>

          <p className="font-body text-sm text-muted-foreground/80 text-center mt-4">
            {pricingInfo.note}
          </p>
        </div>

        {/* Dietary legend */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 text-sm text-muted-foreground">
          {Object.entries(dietaryInfo).map(([key, info]) => (
            <div key={key} className="flex items-center gap-2">
              <DietaryTag tag={key as 'gf' | 'df' | 'v' | 'vg'} />
              <span className="font-body">{info.label}</span>
            </div>
          ))}
        </div>

        {/* Weekly Menu */}
        <div className="space-y-8">
          {currentMenu.days.map((day) => (
            <div key={day.day} className="border border-border/30 rounded-lg p-6 bg-card/30">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-xl tracking-[0.2em] text-mystical">{day.day}</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Lunch */}
              <div className="mb-4">
                <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">LUNCH</h4>
                <MenuItemDisplay item={day.lunch} />
              </div>

              {/* Dinner */}
              <div className="mb-4">
                <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">DINNER</h4>
                {day.dinner.map((item, idx) => (
                  <MenuItemDisplay key={idx} item={item} />
                ))}
              </div>

              {/* Dessert */}
              {day.dessert && (
                <div>
                  <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">DESSERT</h4>
                  <MenuItemDisplay item={day.dessert} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order CTA */}
        <div className="mt-12 text-center">
          <Link to={`/entry?week=${currentMenu.id}`}>
            <Button size="lg" className="rounded-full px-12 font-display tracking-wider text-lg">
              ORDER {currentMenu.theme?.toUpperCase()} WEEK
            </Button>
          </Link>
          <p className="font-body text-sm text-muted-foreground/60 tracking-wide mt-4">
            A gratuity of 20% is included for all who partake
          </p>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
