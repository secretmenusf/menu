import { useState } from 'react';
import { Loader2, Mail, MessageSquare, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  email: {
    menuUpdates: boolean;
    orderConfirmation: boolean;
    deliveryUpdates: boolean;
    weeklyReminder: boolean;
    promotions: boolean;
  };
  sms: {
    orderConfirmation: boolean;
    deliveryUpdates: boolean;
  };
  push: {
    orderUpdates: boolean;
    promotions: boolean;
  };
}

interface NotificationPreferencesProps {
  settings?: NotificationSettings;
  onSave: (settings: NotificationSettings) => Promise<void>;
}

const defaultSettings: NotificationSettings = {
  email: {
    menuUpdates: true,
    orderConfirmation: true,
    deliveryUpdates: true,
    weeklyReminder: true,
    promotions: false,
  },
  sms: {
    orderConfirmation: true,
    deliveryUpdates: true,
  },
  push: {
    orderUpdates: true,
    promotions: false,
  },
};

export function NotificationPreferences({ settings = defaultSettings, onSave }: NotificationPreferencesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NotificationSettings>(settings);
  const { toast } = useToast();

  const updateSetting = <K extends keyof NotificationSettings>(
    category: K,
    key: keyof NotificationSettings[K],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated.',
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

  const emailOptions = [
    { key: 'menuUpdates' as const, label: 'New Menu Available', description: 'Get notified when the weekly menu is posted' },
    { key: 'orderConfirmation' as const, label: 'Order Confirmation', description: 'Receive order confirmation emails' },
    { key: 'deliveryUpdates' as const, label: 'Delivery Updates', description: 'Get updates when your order is on the way' },
    { key: 'weeklyReminder' as const, label: 'Weekly Ordering Reminder', description: 'Reminder before the ordering deadline' },
    { key: 'promotions' as const, label: 'Promotions & Offers', description: 'Special discounts and member offers' },
  ];

  const smsOptions = [
    { key: 'orderConfirmation' as const, label: 'Order Confirmation', description: 'Text confirmation for orders' },
    { key: 'deliveryUpdates' as const, label: 'Delivery Updates', description: 'Real-time delivery notifications' },
  ];

  const pushOptions = [
    { key: 'orderUpdates' as const, label: 'Order Updates', description: 'Push notifications for order status' },
    { key: 'promotions' as const, label: 'Promotions', description: 'Special offers and discounts' },
  ];

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="font-display text-sm tracking-[0.15em]">
              EMAIL
            </CardTitle>
          </div>
          <CardDescription>
            Manage email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  {option.label}
                </label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <Switch
                checked={formData.email[option.key]}
                onCheckedChange={(checked) =>
                  updateSetting('email', option.key, checked)
                }
                disabled={isLoading}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="font-display text-sm tracking-[0.15em]">
              SMS
            </CardTitle>
          </div>
          <CardDescription>
            Manage text message notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {smsOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  {option.label}
                </label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <Switch
                checked={formData.sms[option.key]}
                onCheckedChange={(checked) =>
                  updateSetting('sms', option.key, checked)
                }
                disabled={isLoading}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="font-display text-sm tracking-[0.15em]">
              PUSH NOTIFICATIONS
            </CardTitle>
          </div>
          <CardDescription>
            Manage browser push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pushOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  {option.label}
                </label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <Switch
                checked={formData.push[option.key]}
                onCheckedChange={(checked) =>
                  updateSetting('push', option.key, checked)
                }
                disabled={isLoading}
              />
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
