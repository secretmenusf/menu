import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Bitcoin, MessageCircle, Copy, Check } from 'lucide-react';

const PAYMENT_ADDRESSES = {
  zelle: 'pay@sfsecretmenu.com',
  venmo: '@sfsecretmenu',
  cashapp: '$sfsecretmenu',
};

const Checkout = () => {
  const { cart, total, clearCart } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: 'Copied', description: `${type} address copied` });
  };

  const handleSubmit = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: 'Address required',
        description: 'Please enter your delivery address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Build WhatsApp message
    const message = `🍽️ *SECRET MENU ORDER*

📦 *Items:*
${cart.map((item) => `• ${item.name} x${item.quantity} - $${item.price * item.quantity}`).join('\n')}

💰 *Total: $${total}*
💳 *Payment: ${paymentMethod.toUpperCase()}*

📍 *Delivery Address:*
${deliveryAddress}

${deliveryNotes ? `📝 *Notes:* ${deliveryNotes}` : ''}

${user?.email ? `👤 *Account:* ${user.email}` : ''}`;

    const whatsappUrl = `https://wa.me/14153732496?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: 'Order submitted',
      description: 'Complete payment via WhatsApp to confirm',
    });

    clearCart();
    setLoading(false);
    navigate('/my-orders');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-md text-center">
            <h1 className="font-display text-3xl tracking-[0.2em] text-mystical mb-4">
              CART EMPTY
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Your order awaits creation
            </p>
            <Button onClick={() => navigate('/order')} className="font-display tracking-wider">
              BUILD YOUR MENU
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              COMPLETE YOUR ORDER
            </h1>
            <p className="font-body text-muted-foreground">
              The final step of your journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="border border-border/30 rounded-lg p-6 bg-card/30">
              <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <p className="font-body text-foreground">{item.name}</p>
                      <p className="font-body text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-display text-foreground">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/30 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-muted-foreground">Subtotal</span>
                  <span className="font-display text-foreground">${total}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-muted-foreground">Gratuity (20%)</span>
                  <span className="font-display text-foreground">Included</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/30">
                  <span className="font-display tracking-wider">TOTAL</span>
                  <span className="font-display text-2xl text-mystical">${total}</span>
                </div>
              </div>
            </div>

            {/* Payment & Delivery */}
            <div className="space-y-6">
              {/* Delivery */}
              <div className="border border-border/30 rounded-lg p-6 bg-card/30">
                <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-6">
                  DELIVERY
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-display text-xs tracking-wider">ADDRESS</Label>
                    <Textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full delivery address"
                      className="bg-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-display text-xs tracking-wider">
                      NOTES <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Textarea
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Gate code, special instructions..."
                      className="bg-transparent resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="border border-border/30 rounded-lg p-6 bg-card/30">
                <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-6">
                  PAYMENT METHOD
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                      <RadioGroupItem value="crypto" />
                      <Bitcoin size={20} />
                      <span className="font-body">Crypto (ETH, USDC, USDT)</span>
                    </Label>

                    <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                      <RadioGroupItem value="zelle" />
                      <CreditCard size={20} />
                      <span className="font-body">Zelle</span>
                    </Label>

                    <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                      <RadioGroupItem value="venmo" />
                      <CreditCard size={20} />
                      <span className="font-body">Venmo</span>
                    </Label>

                    <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                      <RadioGroupItem value="cashapp" />
                      <CreditCard size={20} />
                      <span className="font-body">CashApp</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Fiat payment info */}
                {paymentMethod !== 'crypto' && (
                  <div className="mt-4 p-4 bg-background/50 rounded-lg">
                    <p className="font-body text-sm text-muted-foreground mb-2">
                      Send payment to:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-foreground flex-1">
                        {PAYMENT_ADDRESSES[paymentMethod as keyof typeof PAYMENT_ADDRESSES]}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(
                            PAYMENT_ADDRESSES[paymentMethod as keyof typeof PAYMENT_ADDRESSES],
                            paymentMethod
                          )
                        }
                      >
                        {copied === paymentMethod ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-14 font-display tracking-wider text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    CONFIRM VIA WHATSAPP
                  </>
                )}
              </Button>

              <p className="font-body text-xs text-muted-foreground text-center">
                You'll be redirected to WhatsApp to complete your order
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
