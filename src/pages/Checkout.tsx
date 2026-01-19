import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StripePayment from '@/components/payment/StripePayment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  User,
  MapPin,
  Wallet,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PAYMENT_ADDRESSES = {
  zelle: 'pay@sfsecretmenu.com',
  venmo: '@sfsecretmenu',
  cashapp: '$sfsecretmenu',
};

type Step = 'contact' | 'delivery' | 'payment';

const Checkout = () => {
  const { cart, total, clearCart } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Current step
  const [step, setStep] = useState<Step>('contact');

  // Contact info
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');

  // Delivery info
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Optional account
  const [saveInfo, setSaveInfo] = useState(false);
  const [password, setPassword] = useState('');

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'delivery', label: 'Delivery', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: Wallet },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: 'Copied', description: `${type} address copied` });
  };

  const validateContact = () => {
    if (!firstName.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: 'Required fields',
        description: 'Please fill in your name, email, and phone',
        variant: 'destructive',
      });
      return false;
    }
    // Basic email validation
    if (!email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const validateDelivery = () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: 'Address required',
        description: 'Please enter your delivery address',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 'contact' && validateContact()) {
      setStep('delivery');
    } else if (step === 'delivery' && validateDelivery()) {
      setStep('payment');
    }
  };

  const handleBack = () => {
    if (step === 'delivery') setStep('contact');
    else if (step === 'payment') setStep('delivery');
  };

  const handlePaymentSuccess = async (result: { token?: string; status?: string; [key: string]: unknown }) => {
    console.log('Payment successful:', result);

    // Optionally create account
    if (saveInfo && password) {
      // Here you would call your auth service to create account
      console.log('Creating account for:', email);
    }

    toast({
      title: 'Order confirmed!',
      description: 'Your meal is being prepared with care',
    });

    clearCart();
    navigate('/my-orders');
  };

  const handlePaymentError = (error: { message?: string; code?: string; [key: string]: unknown }) => {
    console.error('Payment failed:', error);
    toast({
      title: 'Payment failed',
      description: 'Please try again or contact support',
      variant: 'destructive',
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Build WhatsApp message for non-card payments
    const message = `🍽️ *SECRET MENU ORDER*

👤 *Customer:* ${firstName} ${lastName}
📧 *Email:* ${email}
📱 *Phone:* ${phone}

📦 *Items:*
${cart.map((item) => `• ${item.name} x${item.quantity} - $${item.price * item.quantity}`).join('\n')}

💰 *Total: $${total}*
💳 *Payment: ${paymentMethod.toUpperCase()}*

📍 *Delivery Address:*
${deliveryAddress}

${deliveryNotes ? `📝 *Notes:* ${deliveryNotes}` : ''}`;

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
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              CHECKOUT
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              No account required • Guest checkout
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isComplete = idx < currentStepIndex;

              return (
                <div key={s.id} className="flex items-center">
                  <button
                    onClick={() => idx < currentStepIndex && setStep(s.id)}
                    disabled={idx > currentStepIndex}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
                      isActive && 'bg-primary text-primary-foreground',
                      isComplete && 'bg-emerald-500/20 text-emerald-400 cursor-pointer',
                      !isActive && !isComplete && 'bg-card/30 text-muted-foreground'
                    )}
                  >
                    {isComplete ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="font-display text-xs tracking-wider hidden sm:inline">
                      {s.label.toUpperCase()}
                    </span>
                  </button>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Form - takes 3 cols */}
            <div className="lg:col-span-3 space-y-6">
              {/* Step 1: Contact Info */}
              {step === 'contact' && (
                <div className="border border-border/30 rounded-lg p-6 bg-card/30 animate-fade-in">
                  <h2 className="font-display text-sm tracking-[0.2em] text-foreground mb-6">
                    CONTACT INFORMATION
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider text-muted-foreground">
                          FIRST NAME *
                        </Label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jane"
                          className="bg-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider text-muted-foreground">
                          LAST NAME
                        </Label>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider text-muted-foreground">
                        EMAIL *
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="bg-transparent"
                      />
                      <p className="text-xs text-muted-foreground">
                        For order confirmation and updates
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider text-muted-foreground">
                        PHONE *
                      </Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(415) 555-0123"
                        className="bg-transparent"
                      />
                      <p className="text-xs text-muted-foreground">
                        For delivery coordination
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full mt-6 h-12 font-display tracking-wider"
                  >
                    CONTINUE TO DELIVERY
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Delivery */}
              {step === 'delivery' && (
                <div className="border border-border/30 rounded-lg p-6 bg-card/30 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-sm tracking-[0.2em] text-foreground">
                      DELIVERY ADDRESS
                    </h2>
                    <button
                      onClick={handleBack}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider text-muted-foreground">
                        STREET ADDRESS *
                      </Label>
                      <Textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="123 Market St, Apt 4B&#10;San Francisco, CA 94102"
                        className="bg-transparent resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider text-muted-foreground">
                        DELIVERY NOTES
                      </Label>
                      <Textarea
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="Gate code, leave at door, call on arrival..."
                        className="bg-transparent resize-none"
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full mt-6 h-12 font-display tracking-wider"
                  >
                    CONTINUE TO PAYMENT
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-sm tracking-[0.2em] text-foreground">
                      PAYMENT
                    </h2>
                    <button
                      onClick={handleBack}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <StripePayment
                      amount={total}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      loading={loading}
                      customerInfo={{
                        email,
                        phone,
                        name: `${firstName} ${lastName}`.trim(),
                        address: deliveryAddress,
                      }}
                    />
                  ) : (
                    <div className="border border-border/30 rounded-lg p-6 bg-card/30">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="space-y-3">
                          <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                            <RadioGroupItem value="card" />
                            <CreditCard size={20} />
                            <span className="font-body">Credit/Debit Card</span>
                            <span className="ml-auto text-xs text-primary">Recommended</span>
                          </Label>

                          <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                            <RadioGroupItem value="zelle" />
                            <span className="font-body">Zelle</span>
                          </Label>

                          <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                            <RadioGroupItem value="venmo" />
                            <span className="font-body">Venmo</span>
                          </Label>

                          <Label className="flex items-center gap-3 p-4 border border-border/30 rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                            <RadioGroupItem value="cashapp" />
                            <span className="font-body">CashApp</span>
                          </Label>
                        </div>
                      </RadioGroup>

                      {/* Payment instructions */}
                      {paymentMethod !== 'card' && (
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

                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-6 h-12 font-display tracking-wider"
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
                    </div>
                  )}

                  {/* Optional: Save info / Create account */}
                  {!user && (
                    <div className="border border-border/30 rounded-lg p-6 bg-card/30">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="save-info"
                          checked={saveInfo}
                          onCheckedChange={(checked) => setSaveInfo(checked === true)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="save-info"
                            className="text-sm font-body cursor-pointer"
                          >
                            Save my info for faster checkout next time
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Create an optional account to track orders and earn rewards
                          </p>
                        </div>
                      </div>

                      {saveInfo && (
                        <div className="mt-4 space-y-2 animate-fade-in">
                          <Label className="text-xs tracking-wider text-muted-foreground">
                            CREATE PASSWORD
                          </Label>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="bg-transparent"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary - takes 2 cols */}
            <div className="lg:col-span-2">
              <div className="border border-border/30 rounded-lg p-6 bg-card/30 sticky top-32">
                <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-6">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="font-body text-sm text-foreground">{item.name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-display text-sm text-foreground">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/30 pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-display text-sm">${total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Delivery</span>
                    <span className="font-display text-sm text-emerald-400">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/30">
                    <span className="font-display tracking-wider">TOTAL</span>
                    <span className="font-display text-xl text-mystical">${total}</span>
                  </div>
                </div>

                {/* Contact summary when past step 1 */}
                {currentStepIndex > 0 && (
                  <div className="mt-6 pt-4 border-t border-border/30">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{firstName} {lastName}</p>
                      <p>{email}</p>
                      <p>{phone}</p>
                    </div>
                  </div>
                )}

                {/* Delivery summary when past step 2 */}
                {currentStepIndex > 1 && deliveryAddress && (
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <p className="text-xs text-muted-foreground whitespace-pre-line">
                      {deliveryAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
