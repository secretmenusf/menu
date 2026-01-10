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
import { Gift, Mail, Calendar, Printer } from 'lucide-react';

const GIFT_AMOUNTS = [50, 100, 200, 500];

const GiftCards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('email');

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  const handlePurchase = () => {
    if (!recipientName || !recipientEmail || !senderName) {
      toast({ title: 'Missing information', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Gift card added', description: `$${finalAmount} gift card ready for checkout` });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <Gift className="mx-auto h-12 w-12 text-foreground mb-4" />
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              GIFT CARDS
            </h1>
            <p className="font-body text-muted-foreground">
              Share the gift of culinary excellence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gift Card Preview */}
            <div className="border border-border/30 rounded-lg p-8 bg-gradient-to-br from-card/50 to-card/20">
              <div className="aspect-[1.6/1] border border-foreground/20 rounded-lg bg-gradient-to-br from-background to-card flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <span className="font-display text-xs tracking-[0.3em] text-muted-foreground">SECRET MENU</span>
                  <span className="text-foreground text-2xl">✧</span>
                </div>
                <div>
                  <p className="font-display text-4xl text-mystical mb-2">${finalAmount}</p>
                  <p className="font-body text-sm text-muted-foreground">
                    {recipientName ? `For ${recipientName}` : 'Gift Card'}
                  </p>
                </div>
              </div>
              {message && (
                <div className="mt-4 p-4 border border-border/30 rounded-lg bg-card/30">
                  <p className="font-body text-sm text-muted-foreground italic">"{message}"</p>
                  <p className="font-display text-xs tracking-wider text-foreground mt-2">— {senderName || 'Your name'}</p>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Amount Selection */}
              <div className="space-y-3">
                <Label className="font-display text-xs tracking-wider">AMOUNT</Label>
                <div className="grid grid-cols-4 gap-2">
                  {GIFT_AMOUNTS.map((a) => (
                    <Button
                      key={a}
                      variant={amount === a && !customAmount ? 'default' : 'outline'}
                      onClick={() => { setAmount(a); setCustomAmount(''); }}
                      className="font-display"
                    >
                      ${a}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="bg-transparent"
                />
              </div>

              {/* Recipient */}
              <div className="space-y-3">
                <Label className="font-display text-xs tracking-wider">RECIPIENT</Label>
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

              {/* Message */}
              <div className="space-y-3">
                <Label className="font-display text-xs tracking-wider">MESSAGE (OPTIONAL)</Label>
                <Textarea
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Delivery Method */}
              <div className="space-y-3">
                <Label className="font-display text-xs tracking-wider">DELIVERY</Label>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <Label className="flex items-center gap-3 p-3 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50">
                    <RadioGroupItem value="email" />
                    <Mail size={16} />
                    <span className="font-body text-sm">Email now</span>
                  </Label>
                  <Label className="flex items-center gap-3 p-3 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50">
                    <RadioGroupItem value="schedule" />
                    <Calendar size={16} />
                    <span className="font-body text-sm">Schedule for later</span>
                  </Label>
                  <Label className="flex items-center gap-3 p-3 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50">
                    <RadioGroupItem value="print" />
                    <Printer size={16} />
                    <span className="font-body text-sm">Print at home</span>
                  </Label>
                </RadioGroup>
              </div>

              <Button onClick={handlePurchase} className="w-full h-14 font-display tracking-wider text-lg rounded-full">
                PURCHASE ${finalAmount} GIFT CARD
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftCards;
