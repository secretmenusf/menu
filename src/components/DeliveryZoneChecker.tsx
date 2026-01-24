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
    <div className={cn('w-full max-w-xl mx-auto', className)}>
      <div className="p-6 border border-border/30 rounded-xl bg-card/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-mystical/10">
            <Truck className="h-5 w-5 text-mystical" />
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wider text-foreground">
              GET STARTED
            </h3>
            <p className="text-xs text-muted-foreground">
              Enter your email and ZIP to check delivery
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              className="pl-10 bg-background/50"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                className="pl-10 bg-background/50"
              />
            </div>
            <Button
              onClick={handleCheck}
              disabled={status === 'checking' || !email || !zip}
              className="font-display tracking-wider px-6"
            >
              {status === 'checking' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  CHECK
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {status === 'yes' && (
          <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
            <div className="p-1 rounded-full bg-emerald-500/20">
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="font-display text-sm tracking-wider text-emerald-400 mb-1">
                WE DELIVER TO YOU!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to set up your meal plan...
              </p>
            </div>
          </div>
        )}

        {status === 'no' && (
          <div className="mt-4 p-4 rounded-lg bg-zinc-500/10 border border-zinc-500/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-1 rounded-full bg-zinc-500/20">
                <X className="h-4 w-4 text-zinc-500" />
              </div>
              <div>
                <p className="font-display text-sm tracking-wider text-zinc-400 mb-1">
                  NOT IN DELIVERY AREA YET
                </p>
                <p className="text-sm text-muted-foreground">
                  We're currently serving the SF Bay Area. Join the waitlist to be notified when we expand.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleJoinWaitlist}
              className="w-full font-display tracking-wider"
            >
              JOIN WAITLIST
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground/60 text-center mt-4">
          SF Bay Area • Order by Friday for next week delivery
        </p>
      </div>
    </div>
  );
}

export default DeliveryZoneChecker;
