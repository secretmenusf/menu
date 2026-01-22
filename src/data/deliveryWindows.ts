// Delivery time windows for SF Secret Menu

export interface DeliveryWindow {
  id: string;
  name: string;
  startHour: number;
  endHour: number;
  label: string;
  description?: string;
}

export const deliveryWindows: DeliveryWindow[] = [
  {
    id: 'late-morning',
    name: 'Late Morning',
    startHour: 10.5,
    endHour: 12,
    label: '10:30am - 12pm',
    description: 'Late morning delivery'
  },
  {
    id: 'lunch',
    name: 'Lunch',
    startHour: 12,
    endHour: 15,
    label: '12pm - 3pm',
    description: 'Lunch delivery'
  },
];

// Get window by ID
export const getWindowById = (id: string): DeliveryWindow | null => {
  return deliveryWindows.find(w => w.id === id) || null;
};

// Check if a specific time falls within a window
export const isTimeInWindow = (hour: number, windowId: string): boolean => {
  const window = getWindowById(windowId);
  if (!window) return false;
  return hour >= window.startHour && hour < window.endHour;
};

// Get available windows for a given date (could be extended to check day-specific availability)
export const getAvailableWindows = (date: Date): DeliveryWindow[] => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (!isToday) {
    return deliveryWindows;
  }

  // For today, only show windows that haven't started yet
  const currentHour = now.getHours();
  return deliveryWindows.filter(w => w.startHour > currentHour);
};

// Format window for display
export const formatWindowTime = (window: DeliveryWindow): string => {
  return window.label;
};
