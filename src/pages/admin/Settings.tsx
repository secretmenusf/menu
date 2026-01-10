import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, Wallet, MapPin, Clock, DollarSign, AlertTriangle } from 'lucide-react';

interface BusinessSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

interface PaymentSettings {
  walletAddress: string;
  usdcEnabled: boolean;
  stripeEnabled: boolean;
  minimumOrder: number;
  regularMealPrice: number;
  premiumMealPrice: number;
}

interface DeliverySettings {
  deliveryZones: string[];
  deliveryFee: number;
  freeDeliveryMinimum: number;
  operatingHoursStart: string;
  operatingHoursEnd: string;
  leadTime: number;
}

export default function Settings() {
  const { toast } = useToast();

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: 'Secret Menu SF',
    email: 'hello@secretmenu.sf',
    phone: '+1 415 555 0100',
    address: 'San Francisco, CA',
    description: 'Private dining experience with weekly curated menus.',
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8B4E0',
    usdcEnabled: true,
    stripeEnabled: true,
    minimumOrder: 900,
    regularMealPrice: 50,
    premiumMealPrice: 80,
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    deliveryZones: ['94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110', '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94121', '94122', '94123', '94124', '94127', '94131', '94132', '94133', '94134'],
    deliveryFee: 0,
    freeDeliveryMinimum: 0,
    operatingHoursStart: '08:00',
    operatingHoursEnd: '01:00',
    leadTime: 24,
  });

  const [newZone, setNewZone] = useState('');

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  const addDeliveryZone = () => {
    if (newZone && !deliverySettings.deliveryZones.includes(newZone)) {
      setDeliverySettings((prev) => ({
        ...prev,
        deliveryZones: [...prev.deliveryZones, newZone],
      }));
      setNewZone('');
    }
  };

  const removeDeliveryZone = (zone: string) => {
    setDeliverySettings((prev) => ({
      ...prev,
      deliveryZones: prev.deliveryZones.filter((z) => z !== zone),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">SETTINGS</h1>
          <p className="text-muted-foreground font-body">
            Configure business, payment, and delivery settings
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">
            BUSINESS INFORMATION
          </CardTitle>
          <CardDescription>Basic business details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">BUSINESS NAME</Label>
              <Input
                value={businessSettings.businessName}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, businessName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">EMAIL</Label>
              <Input
                type="email"
                value={businessSettings.email}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">PHONE</Label>
              <Input
                value={businessSettings.phone}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display text-xs tracking-wider">ADDRESS</Label>
              <Input
                value={businessSettings.address}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-display text-xs tracking-wider">DESCRIPTION</Label>
            <Textarea
              value={businessSettings.description}
              onChange={(e) =>
                setBusinessSettings((prev) => ({ ...prev, description: e.target.value }))
              }
              className="resize-none"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="font-display text-sm tracking-[0.1em]">
                PAYMENT SETTINGS
              </CardTitle>
              <CardDescription>Configure payment methods and pricing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Address */}
          <div className="space-y-2">
            <Label className="font-display text-xs tracking-wider">WALLET ADDRESS (USDC)</Label>
            <Input
              value={paymentSettings.walletAddress}
              onChange={(e) =>
                setPaymentSettings((prev) => ({ ...prev, walletAddress: e.target.value }))
              }
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Wallet address for receiving USDC payments on Base
            </p>
          </div>

          <Separator />

          {/* Payment Methods */}
          <div className="space-y-4">
            <Label className="font-display text-xs tracking-wider">PAYMENT METHODS</Label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">USDC on Base</p>
                  <p className="text-xs text-muted-foreground">Accept crypto payments</p>
                </div>
                <Switch
                  checked={paymentSettings.usdcEnabled}
                  onCheckedChange={(v) =>
                    setPaymentSettings((prev) => ({ ...prev, usdcEnabled: v }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Stripe</p>
                  <p className="text-xs text-muted-foreground">Accept card payments</p>
                </div>
                <Switch
                  checked={paymentSettings.stripeEnabled}
                  onCheckedChange={(v) =>
                    setPaymentSettings((prev) => ({ ...prev, stripeEnabled: v }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-4">
            <Label className="font-display text-xs tracking-wider">PRICING</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Minimum Order ($)</Label>
                <Input
                  type="number"
                  value={paymentSettings.minimumOrder}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      minimumOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Regular Meal ($)</Label>
                <Input
                  type="number"
                  value={paymentSettings.regularMealPrice}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      regularMealPrice: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Premium Meal ($)</Label>
                <Input
                  type="number"
                  value={paymentSettings.premiumMealPrice}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      premiumMealPrice: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="font-display text-sm tracking-[0.1em]">
                DELIVERY SETTINGS
              </CardTitle>
              <CardDescription>Configure delivery zones and hours</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery Zones */}
          <div className="space-y-4">
            <Label className="font-display text-xs tracking-wider">DELIVERY ZONES (ZIP CODES)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add ZIP code"
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
                className="max-w-[150px]"
              />
              <Button variant="outline" onClick={addDeliveryZone}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {deliverySettings.deliveryZones.map((zone) => (
                <Badge
                  key={zone}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeDeliveryZone(zone)}
                >
                  {zone} x
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Operating Hours */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="font-display text-xs tracking-wider">OPERATING HOURS</Label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Start Time</Label>
                <Input
                  type="time"
                  value={deliverySettings.operatingHoursStart}
                  onChange={(e) =>
                    setDeliverySettings((prev) => ({
                      ...prev,
                      operatingHoursStart: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">End Time</Label>
                <Input
                  type="time"
                  value={deliverySettings.operatingHoursEnd}
                  onChange={(e) =>
                    setDeliverySettings((prev) => ({
                      ...prev,
                      operatingHoursEnd: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Lead Time (hours)</Label>
                <Input
                  type="number"
                  value={deliverySettings.leadTime}
                  onChange={(e) =>
                    setDeliverySettings((prev) => ({
                      ...prev,
                      leadTime: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Fees */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Label className="font-display text-xs tracking-wider">DELIVERY FEES</Label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Delivery Fee ($)</Label>
                <Input
                  type="number"
                  value={deliverySettings.deliveryFee}
                  onChange={(e) =>
                    setDeliverySettings((prev) => ({
                      ...prev,
                      deliveryFee: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Free Delivery Minimum ($)</Label>
                <Input
                  type="number"
                  value={deliverySettings.freeDeliveryMinimum}
                  onChange={(e) =>
                    setDeliverySettings((prev) => ({
                      ...prev,
                      freeDeliveryMinimum: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle className="font-display text-sm tracking-[0.1em] text-destructive">
                DANGER ZONE
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div>
              <p className="font-medium text-sm">Pause All Orders</p>
              <p className="text-xs text-muted-foreground">
                Temporarily stop accepting new orders
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Pause Orders
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div>
              <p className="font-medium text-sm">Clear All Data</p>
              <p className="text-xs text-muted-foreground">
                Delete all orders, customers, and menu data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
