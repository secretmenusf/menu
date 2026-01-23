import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Gift, Check, Calendar } from 'lucide-react';
import { subscriptionPlans } from '@/data/plans';

const GIFT_DURATIONS = [
  { months: 1, label: '1 Month', discount: 0 },
  { months: 3, label: '3 Months', discount: 5 },
  { months: 6, label: '6 Months', discount: 10 },
  { months: 12, label: '1 Year', discount: 15 },
];

const GiftMealPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
  const [duration, setDuration] = useState(3);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');

  const plan = subscriptionPlans.find(p => p.id === selectedPlan) || subscriptionPlans[1];
  const durationOption = GIFT_DURATIONS.find(d => d.months === duration) || GIFT_DURATIONS[1];
  const subtotal = plan.price * duration;
  const discount = Math.round(subtotal * (durationOption.discount / 100));
  const total = subtotal - discount;

  const handlePurchase = () => {
    if (!recipientName || !recipientEmail || !senderName) {
      toast({ title: 'Missing information', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Gift subscription added', description: `${durationOption.label} ${plan.name} plan ready for checkout` });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <Gift className="mx-auto h-12 w-12 text-foreground mb-4" />
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              GIFT A MEAL PLAN
            </h1>
            <p className="font-body text-muted-foreground">
              Give the gift of chef-crafted meals delivered weekly
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Plan Selection */}
            <div className="lg:col-span-3 space-y-8">
              {/* Choose Plan */}
              <div className="space-y-4">
                <Label className="font-display text-xs tracking-wider">SELECT PLAN</Label>
                <div className="grid gap-4">
                  {subscriptionPlans.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`text-left p-4 border rounded-lg transition-all ${
                        selectedPlan === p.id 
                          ? 'border-foreground bg-card/50' 
                          : 'border-border/30 hover:border-border/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-display text-sm tracking-wider text-foreground">{p.name.toUpperCase()}</p>
                          <p className="font-body text-xs text-muted-foreground">{p.description}</p>
                        </div>
                        <p className="font-display text-lg text-foreground">${p.price}/mo</p>
                      </div>
                      <ul className="grid grid-cols-2 gap-1">
                        {p.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Check size={12} className="text-foreground" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4">
                <Label className="font-display text-xs tracking-wider">GIFT DURATION</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GIFT_DURATIONS.map((d) => (
                    <button
                      key={d.months}
                      onClick={() => setDuration(d.months)}
                      className={`p-3 border rounded-lg transition-all text-center ${
                        duration === d.months 
                          ? 'border-foreground bg-card/50' 
                          : 'border-border/30 hover:border-border/50'
                      }`}
                    >
                      <p className="font-display text-sm tracking-wider text-foreground">{d.label}</p>
                      {d.discount > 0 && (
                        <p className="font-body text-xs text-green-500 mt-1">Save {d.discount}%</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Info */}
              <div className="space-y-4">
                <Label className="font-display text-xs tracking-wider">RECIPIENT</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="bg-transparent"
                  />
                  <Input
                    type="email"
                    placeholder="Recipient's email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="bg-transparent"
                  />
                </div>
              </div>

              {/* Sender */}
              <div className="space-y-3">
                <Label className="font-display text-xs tracking-wider">FROM</Label>
                <Input
                  placeholder="Your name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="bg-transparent"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-3">
                <Label className="font-display text-xs tracking-wider">START DATE</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  Leave empty to start immediately after purchase
                </p>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <Label className="font-display text-xs tracking-wider">PERSONAL MESSAGE (OPTIONAL)</Label>
                <Textarea
                  placeholder="Add a personal message to your gift..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-32 border border-border/30 rounded-lg p-6 bg-card/30">
                <h3 className="font-display text-sm tracking-wider mb-6">GIFT SUMMARY</h3>
                
                {/* Gift Preview Card */}
                <div className="aspect-[1.6/1] border border-foreground/20 rounded-lg bg-gradient-to-br from-background to-card flex flex-col justify-between p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">SECRET MENU</span>
                    <span className="text-foreground text-lg">✧</span>
                  </div>
                  <div>
                    <p className="font-display text-xs tracking-wider text-muted-foreground mb-1">{plan.name.toUpperCase()} · {durationOption.label}</p>
                    <p className="font-display text-2xl text-mystical">${total}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      {recipientName ? `For ${recipientName}` : 'Gift Subscription'}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-muted-foreground">{plan.name} × {duration} months</span>
                    <span className="font-body text-foreground">${subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-body text-green-500">{durationOption.discount}% discount</span>
                      <span className="font-body text-green-500">-${discount}</span>
                    </div>
                  )}
                  <div className="border-t border-border/30 pt-3 flex justify-between">
                    <span className="font-display text-sm tracking-wider">TOTAL</span>
                    <span className="font-display text-xl text-foreground">${total}</span>
                  </div>
                </div>

                <Button onClick={handlePurchase} className="w-full h-14 font-display tracking-wider rounded-full">
                  PURCHASE GIFT
                </Button>

                <p className="font-body text-xs text-muted-foreground text-center mt-4">
                  Recipient will receive an email with redemption instructions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftMealPlan;
