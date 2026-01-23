/**
 * Email + ZIP Capture Component
 * Shows on landing/menu pages when user is logged out
 * First step in onboarding funnel
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// SF Bay Area ZIP codes (sample - expand as needed)
const SF_BAY_ZIPS = [
  '94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110',
  '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94121',
  '94122', '94123', '94124', '94127', '94129', '94130', '94131', '94132',
  '94133', '94134', '94158', // SF
  '94010', '94014', '94015', '94044', '94066', '94080', '94401', '94402', '94403', '94404', // Peninsula
  '94025', '94027', '94028', '94061', '94062', '94063', '94301', '94303', '94304', '94305', '94306', // Palo Alto area
  '94085', '94086', '94087', '94089', '95014', '95050', '95051', '95054', // South Bay
  '94501', '94502', '94536', '94538', '94539', '94555', '94560', '94566', '94568', '94577', '94578', '94579', '94580', '94586', '94587', '94588', // East Bay
  '94601', '94602', '94603', '94605', '94606', '94607', '94608', '94609', '94610', '94611', '94612', '94618', '94619', // Oakland
  '94702', '94703', '94704', '94705', '94706', '94707', '94708', '94709', '94710', '94720', // Berkeley
];

interface EmailZipCaptureProps {
  className?: string;
  variant?: 'hero' | 'inline' | 'modal';
  onComplete?: (data: { email: string; zip: string }) => void;
}

export function EmailZipCapture({ className, variant = 'hero', onComplete }: EmailZipCaptureProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isInServiceArea = (zipCode: string) => {
    return SF_BAY_ZIPS.includes(zipCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate ZIP
    if (zip.length !== 5 || !/^\d{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    // Check service area
    if (!isInServiceArea(zip)) {
      toast({
        title: 'Not in delivery area yet',
        description: 'We\'re currently only delivering to the SF Bay Area. Join the waitlist to be notified when we expand.',
      });
      // Still proceed to capture the lead
      navigate('/global', { state: { email, zip, fromOnboarding: true } });
      return;
    }

    setIsLoading(true);

    try {
      // Store in localStorage for the onboarding flow
      localStorage.setItem('onboarding_email', email);
      localStorage.setItem('onboarding_zip', zip);

      if (onComplete) {
        onComplete({ email, zip });
      } else {
        // Navigate to onboarding wizard
        navigate('/onboarding', { state: { email, zip } });
      }
    } catch (err) {
      console.error('Error starting onboarding:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className={cn('w-full max-w-xl mx-auto', className)}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex bg-background border border-border/50 rounded-full overflow-hidden focus-within:border-mystical/50 transition-colors">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-full px-6"
              required
            />
            <div className="flex items-center border-l border-border/30 px-2">
              <MapPin size={16} className="text-muted-foreground mr-1" />
              <Input
                type="text"
                placeholder="ZIP"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="w-20 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-1"
                maxLength={5}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="rounded-full font-display tracking-wider px-8 bg-mystical text-background hover:bg-mystical/90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                GET STARTED
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={cn('w-full', className)}>
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg"
            required
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ZIP Code"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="pl-9 rounded-lg"
                maxLength={5}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg font-display tracking-wider"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  START
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>
    );
  }

  // Modal variant
  return (
    <form onSubmit={handleSubmit} className={cn('w-full space-y-4', className)}>
      <div>
        <label className="font-display text-xs tracking-wider text-muted-foreground mb-2 block">
          EMAIL
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg"
          required
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wider text-muted-foreground mb-2 block">
          ZIP CODE
        </label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="94102"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="pl-9 rounded-lg"
            maxLength={5}
            required
          />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg font-display tracking-wider"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            GET STARTED
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export default EmailZipCapture;
