import { useState, useMemo } from 'react';
import { addDays, format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DeliveryScheduler } from './DeliveryScheduler';
import { cn } from '@/lib/utils';

interface DeliveryCalendarProps {
  selectedDate?: Date;
  selectedWindow?: string;
  onDateSelect?: (date: Date) => void;
  onWindowSelect?: (windowId: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  showWindowSelector?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DeliveryCalendar = ({
  selectedDate,
  selectedWindow,
  onDateSelect,
  onWindowSelect,
  minDate = addDays(new Date(), 1),
  maxDate = addDays(new Date(), 30),
  className,
  showWindowSelector = true
}: DeliveryCalendarProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(minDate));

  const weekDays = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart);
    return eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
  }, [currentWeekStart]);

  const canGoBack = useMemo(() => {
    const prevWeekEnd = addDays(currentWeekStart, -1);
    return !isBefore(prevWeekEnd, startOfDay(minDate));
  }, [currentWeekStart, minDate]);

  const canGoForward = useMemo(() => {
    const nextWeekStart = addDays(currentWeekStart, 7);
    return !isBefore(maxDate, nextWeekStart);
  }, [currentWeekStart, maxDate]);

  const handlePrevWeek = () => {
    if (canGoBack) {
      setCurrentWeekStart(addDays(currentWeekStart, -7));
    }
  };

  const handleNextWeek = () => {
    if (canGoForward) {
      setCurrentWeekStart(addDays(currentWeekStart, 7));
    }
  };

  const handleDateClick = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, minDate) || isBefore(maxDate, date)) return;
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate) || isBefore(maxDate, date);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Calendar Header */}
      <div className="space-y-4">
        <Label className="font-display text-xs tracking-wider text-muted-foreground flex items-center gap-2">
          <CalendarDays className="h-3 w-3" />
          DELIVERY DATE
        </Label>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevWeek}
            disabled={!canGoBack}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="font-display text-sm tracking-wider text-foreground">
            {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart), 'MMM d, yyyy')}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextWeek}
            disabled={!canGoForward}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday Headers */}
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center py-2 font-display text-[10px] tracking-wider text-muted-foreground"
          >
            {day.toUpperCase()}
          </div>
        ))}

        {/* Day Cells */}
        {weekDays.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isDisabled = isDateDisabled(date);
          const isTodayDate = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => !isDisabled && handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                'relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : isDisabled
                    ? 'text-muted-foreground/30 cursor-not-allowed'
                    : 'hover:bg-primary/10 text-foreground',
                isTodayDate && !isSelected && 'ring-1 ring-primary/50'
              )}
            >
              <span className="font-display text-lg">
                {format(date, 'd')}
              </span>
              {isTodayDate && (
                <span className="absolute bottom-1 font-display text-[8px] tracking-wider text-muted-foreground">
                  TODAY
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="text-center p-3 border border-border/30 rounded-lg bg-card/30">
          <p className="font-display text-xs tracking-wider text-muted-foreground">
            SELECTED
          </p>
          <p className="font-body text-lg text-foreground mt-1">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      )}

      {/* Delivery Window Selector */}
      {showWindowSelector && selectedDate && (
        <DeliveryScheduler
          selectedDate={selectedDate}
          selectedWindow={selectedWindow}
          onWindowSelect={onWindowSelect}
        />
      )}
    </div>
  );
};

export default DeliveryCalendar;
