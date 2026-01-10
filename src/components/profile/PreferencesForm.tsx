import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Preferences {
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
  };
  notifications: {
    menuUpdates: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    weeklyReminder: boolean;
  };
}

interface PreferencesFormProps {
  preferences?: Preferences;
  onSave: (preferences: Preferences) => Promise<void>;
}

const defaultPreferences: Preferences = {
  dietary: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
  },
  notifications: {
    menuUpdates: true,
    orderUpdates: true,
    promotions: false,
    weeklyReminder: true,
  },
};

export function PreferencesForm({ preferences = defaultPreferences, onSave }: PreferencesFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Preferences>(preferences);
  const { toast } = useToast();

  const handleDietaryChange = (key: keyof Preferences['dietary'], checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dietary: {
        ...prev.dietary,
        [key]: checked,
      },
    }));
  };

  const handleNotificationChange = (key: keyof Preferences['notifications'], checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      toast({
        title: 'Preferences saved',
        description: 'Your preferences have been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save preferences.',
      });
    }
    setIsLoading(false);
  };

  const dietaryOptions = [
    { key: 'vegetarian' as const, label: 'Vegetarian', description: 'No meat or fish' },
    { key: 'vegan' as const, label: 'Vegan', description: 'No animal products' },
    { key: 'glutenFree' as const, label: 'Gluten-Free', description: 'No gluten-containing ingredients' },
    { key: 'dairyFree' as const, label: 'Dairy-Free', description: 'No dairy products' },
    { key: 'nutFree' as const, label: 'Nut-Free', description: 'No tree nuts or peanuts' },
  ];

  const notificationOptions = [
    { key: 'menuUpdates' as const, label: 'Menu Updates', description: 'Be notified when new menus are available' },
    { key: 'orderUpdates' as const, label: 'Order Updates', description: 'Status updates for your orders' },
    { key: 'promotions' as const, label: 'Promotions', description: 'Special offers and discounts' },
    { key: 'weeklyReminder' as const, label: 'Weekly Reminder', description: 'Reminder to order before deadline' },
  ];

  return (
    <div className="space-y-6">
      {/* Dietary Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.15em]">
            DIETARY PREFERENCES
          </CardTitle>
          <CardDescription>
            Help us tailor menu suggestions to your dietary needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dietaryOptions.map((option) => (
            <div key={option.key} className="flex items-start space-x-3">
              <Checkbox
                id={option.key}
                checked={formData.dietary[option.key]}
                onCheckedChange={(checked) =>
                  handleDietaryChange(option.key, checked as boolean)
                }
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={option.key}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {option.label}
                </label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.15em]">
            EMAIL NOTIFICATIONS
          </CardTitle>
          <CardDescription>
            Choose which emails you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-start space-x-3">
              <Checkbox
                id={option.key}
                checked={formData.notifications[option.key]}
                onCheckedChange={(checked) =>
                  handleNotificationChange(option.key, checked as boolean)
                }
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={option.key}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {option.label}
                </label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        className="w-full font-display tracking-[0.15em]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            SAVING...
          </>
        ) : (
          'SAVE PREFERENCES'
        )}
      </Button>
    </div>
  );
}
