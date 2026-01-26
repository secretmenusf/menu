import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const suggestedAmounts = [25, 50, 100, 250, 500, 1000];
const IRS_LETTER_URL = '/zoo-ngo/zoolabs-irs-letter.jpg';

const Donate = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast({
        title: 'Thank you for your donation!',
        description: 'Your contribution to The Zoolabs Foundation has been received. A receipt will be emailed to you.',
      });
      setSearchParams({}, { replace: true });
    } else if (status === 'cancelled') {
      toast({
        title: 'Donation cancelled',
        description: 'No charge was made. You can try again anytime.',
      });
      setSearchParams({}, { replace: true });
    }
  }, []);

  const handlePresetClick = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      setAmount(parsed);
    }
  };

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: 'Enter a valid amount',
        description: 'Please choose a suggested amount or enter a custom amount.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-donation-session', {
        body: {
          amount,
          currency: 'usd',
          email: email || undefined,
          success_url: `${window.location.origin}/donate?status=success`,
          cancel_url: `${window.location.origin}/donate?status=cancelled`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error('Donation checkout URL missing');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Checkout unavailable',
        description: 'Please try again or contact us for alternate donation methods.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28 pb-28">
        <section className="container mx-auto px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-5">
            <p className="font-display text-xs tracking-[0.5em] text-muted-foreground">
              SECRET MENU x ZOO NGO
            </p>
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.12em]">DONATE TO THE MISSION</h1>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your gift powers healthy, healing, and medicinal food access for underserved communities through our
              partner, The Zoolabs Foundation — a legal 501(c)(3) tax-exempt nonprofit based in San Francisco, CA.
            </p>
            <p className="text-sm text-muted-foreground">
              100% of your donation is tax deductible. EIN #883538992.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            <div className="rounded-[32px] border border-border bg-card/30 p-10 space-y-8">
              <div className="space-y-4">
                <h2 className="font-display text-2xl tracking-[0.12em]">CHOOSE AN AMOUNT</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {suggestedAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handlePresetClick(value)}
                      className={`rounded-2xl border px-4 py-4 text-sm font-medium transition ${
                        amount === value && !customAmount
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-transparent text-foreground hover:border-foreground/50'
                      }`}
                    >
                      ${value}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Custom amount</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(event) => handleCustomChange(event.target.value)}
                    className="rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Email (optional)</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-2xl"
                />
              </div>

              <Button
                size="lg"
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                onClick={handleDonate}
                disabled={isLoading}
              >
                {isLoading ? 'Starting checkout...' : 'Donate now'}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-border bg-card/30 p-8 space-y-4">
                <h3 className="font-display text-xl tracking-[0.12em]">WHERE YOUR DONATION GOES</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>Land acquisition and regenerative farm infrastructure.</li>
                  <li>Chef-led meal distribution for food-insecure households.</li>
                  <li>Community education on holistic diet and self-sustaining farming.</li>
                </ul>
              </div>

              <Button asChild variant="outline" className="w-full rounded-full border-foreground/20">
                <a href={IRS_LETTER_URL} target="_blank" rel="noreferrer">
                  View IRS 501(c)(3) approval letter
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
