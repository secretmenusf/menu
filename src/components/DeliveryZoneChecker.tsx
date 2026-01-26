import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Mail, Check, X, Loader2, ArrowRight, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

// SF Bay Area ZIP prefixes
const coveredZipPrefixes = [
  '941', // San Francisco
  '940', // Peninsula + Daly City/South SF
  '943', // Palo Alto
  '944', // San Mateo
  '950', // South Bay
  '951', // San Jose
  '949', // North Bay (Petaluma/Marin)
  '945', // East Bay + Tri-Valley
  '946', // Oakland
  '947', // Berkeley
  '948', // Richmond
];

interface DeliveryZoneCheckerProps {
  className?: string;
  compact?: boolean;
}

type CheckStatus = 'idle' | 'checking' | 'yes' | 'no';

export function DeliveryZoneChecker({ className, compact = false }: DeliveryZoneCheckerProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isInDeliveryZone = (zipCode: string) => {
    return coveredZipPrefixes.some(prefix => zipCode.startsWith(prefix));
  };

  const handleCheck = async () => {
    setError(null);

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    // Validate ZIP
    if (zip.length !== 5 || !/^\d{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit ZIP');
      return;
    }

    setStatus('checking');
    await new Promise(resolve => setTimeout(resolve, 600));

    if (isInDeliveryZone(zip)) {
      setStatus('yes');
      // Store for onboarding and redirect
      localStorage.setItem('onboarding_email', email);
      localStorage.setItem('onboarding_zip', zip);
      setTimeout(() => {
        navigate('/onboarding', { state: { email, zip } });
      }, 800);
    } else {
      setStatus('no');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleJoinWaitlist = () => {
    localStorage.setItem('onboarding_email', email);
    localStorage.setItem('onboarding_zip', zip);
    navigate('/global', { state: { email, zip, fromOnboarding: true } });
  };

  if (compact) {
    return (
      <div className={cn('w-full max-w-md', className)}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>
            <div className="relative w-24">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ZIP"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onKeyDown={handleKeyDown}
                maxLength={5}
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>
            <Button
              onClick={handleCheck}
              disabled={status === 'checking'}
              className="font-display tracking-wider"
            >
              {status === 'checking' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'GO'
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {status === 'yes' && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span className="text-sm">We deliver to you! Redirecting...</span>
          </div>
        )}

        {status === 'no' && (
          <div className="mt-3 p-3 rounded-lg bg-zinc-500/10 border border-zinc-500/30">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <X className="h-4 w-4" />
              <span className="text-sm">Not in delivery area yet</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleJoinWaitlist}
              className="w-full text-xs"
            >
              Join Waitlist
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="text-center mb-10">
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">
          DELIVERY
        </p>
        <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-foreground mb-3">
          CHECK YOUR AREA
        </h2>
        <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
          Enter your email and ZIP code to see if we deliver to you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus('idle');
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              className="pl-11 h-12 rounded-full bg-card/50 border-border/30 text-sm"
            />
          </div>
          <div className="relative sm:w-36">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ZIP code"
              value={zip}
              onChange={(e) => {
                setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
                setStatus('idle');
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              maxLength={5}
              className="pl-11 h-12 rounded-full bg-card/50 border-border/30 text-sm"
            />
          </div>
          <Button
            onClick={handleCheck}
            disabled={status === 'checking' || !email || !zip}
            className="h-12 px-8 rounded-full font-display text-xs tracking-[0.2em]"
          >
            {status === 'checking' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                CHECK DELIVERY
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

        {status === 'yes' && (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
            <div className="p-2 rounded-full bg-emerald-500/20">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-display text-sm tracking-[0.15em] text-emerald-400 mb-0.5">
                WE DELIVER TO YOU
              </p>
              <p className="font-body text-sm text-muted-foreground">
                Redirecting to set up your meal plan...
              </p>
            </div>
          </div>
        )}

        {status === 'no' && (
          <div className="mt-6 p-5 rounded-2xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-full bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-sm tracking-[0.15em] text-foreground mb-0.5">
                  NOT IN DELIVERY AREA YET
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  We're expanding soon. Join the waitlist to get notified.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleJoinWaitlist}
              className="w-full rounded-full font-display text-xs tracking-[0.2em]"
            >
              JOIN WAITLIST
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground/60" />
            <span className="font-body text-xs text-muted-foreground/60">SF Bay Area</span>
          </div>
          <span className="text-muted-foreground/30">·</span>
          <span className="font-body text-xs text-muted-foreground/60">Order by Friday for next week delivery</span>
        </div>
      </div>
    </div>
  );
}

export default DeliveryZoneChecker;
