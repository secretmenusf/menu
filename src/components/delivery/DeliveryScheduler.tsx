import { useState, useMemo } from 'react';
import { Clock, Sun, Coffee, Sunset, Moon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { deliveryWindows, DeliveryWindow, getAvailableWindows } from '@/data/deliveryWindows';
import { cn } from '@/lib/utils';

interface DeliverySchedulerProps {
  selectedDate?: Date;
  selectedWindow?: string;
  onWindowSelect?: (windowId: string) => void;
  className?: string;
}

const windowIcons: Record<string, React.ReactNode> = {
  morning: <Sun className="h-4 w-4" />,
  lunch: <Coffee className="h-4 w-4" />,
  afternoon: <Sunset className="h-4 w-4" />,
  dinner: <Moon className="h-4 w-4" />,
};

export const DeliveryScheduler = ({
  selectedDate,
  selectedWindow,
  onWindowSelect,
  className
}: DeliverySchedulerProps) => {
  const [hoveredWindow, setHoveredWindow] = useState<string | null>(null);

  const availableWindows = useMemo(() => {
    if (!selectedDate) return deliveryWindows;
    return getAvailableWindows(selectedDate);
  }, [selectedDate]);

  const handleWindowClick = (windowId: string) => {
    if (onWindowSelect) {
      onWindowSelect(windowId);
    }
  };

  const isWindowAvailable = (windowId: string) => {
    return availableWindows.some(w => w.id === windowId);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Label className="font-display text-xs tracking-wider text-muted-foreground flex items-center gap-2">
        <Clock className="h-3 w-3" />
        DELIVERY WINDOW
      </Label>

      <div className="grid grid-cols-2 gap-3">
        {deliveryWindows.map((window) => {
          const isAvailable = isWindowAvailable(window.id);
          const isSelected = selectedWindow === window.id;
          const isHovered = hoveredWindow === window.id;

          return (
            <button
              key={window.id}
              onClick={() => isAvailable && handleWindowClick(window.id)}
              onMouseEnter={() => setHoveredWindow(window.id)}
              onMouseLeave={() => setHoveredWindow(null)}
              disabled={!isAvailable}
              className={cn(
                'relative p-4 rounded-lg border transition-all duration-300',
                'flex flex-col items-center gap-2 text-center',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : isAvailable
                    ? 'border-border/30 hover:border-primary/50 hover:bg-primary/5'
                    : 'border-border/10 opacity-40 cursor-not-allowed',
                isHovered && isAvailable && !isSelected && 'scale-[1.02]'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  isSelected
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary/50 text-muted-foreground'
                )}
              >
                {windowIcons[window.id]}
              </div>

              {/* Name */}
              <span
                className={cn(
                  'font-display text-xs tracking-wider transition-colors',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {window.name.toUpperCase()}
              </span>

              {/* Time Label */}
              <span
                className={cn(
                  'font-body text-sm transition-colors',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {window.label}
              </span>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}

              {/* Unavailable Indicator */}
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                  <span className="font-display text-[10px] tracking-wider text-muted-foreground">
                    UNAVAILABLE
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Description for selected window */}
      {selectedWindow && (
        <div className="text-center">
          <p className="font-body text-sm text-muted-foreground italic">
            {deliveryWindows.find(w => w.id === selectedWindow)?.description}
          </p>
        </div>
      )}

      {/* No windows available message */}
      {selectedDate && availableWindows.length === 0 && (
        <div className="text-center p-4 border border-border/30 rounded-lg">
          <p className="font-body text-sm text-muted-foreground">
            No delivery windows available for today.
          </p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Please select a future date.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryScheduler;
