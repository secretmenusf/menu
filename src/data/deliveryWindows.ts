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
    id: 'morning',
    name: 'Morning',
    startHour: 10,
    endHour: 12,
    label: '10am - 12pm',
    description: 'Perfect for brunch prep'
  },
  {
    id: 'lunch',
    name: 'Lunch',
    startHour: 12,
    endHour: 14,
    label: '12pm - 2pm',
    description: 'Ready for lunch service'
  },
  {
    id: 'afternoon',
    name: 'Afternoon',
    startHour: 14,
    endHour: 17,
    label: '2pm - 5pm',
    description: 'Ideal for dinner prep'
  },
  {
    id: 'dinner',
    name: 'Dinner',
    startHour: 17,
    endHour: 20,
    label: '5pm - 8pm',
    description: 'Evening delivery'
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
