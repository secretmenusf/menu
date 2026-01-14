import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Check, X, Loader2, Clock, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const coveredCityKeywords = [
  'san francisco',
  'sf',
  'daly city',
  'south san francisco',
  'san bruno',
  'millbrae',
  'burlingame',
  'san mateo',
  'foster city',
  'redwood city',
  'menlo park',
  'palo alto',
  'mountain view',
  'sunnyvale',
  'santa clara',
  'cupertino',
  'los altos',
  'los gatos',
  'saratoga',
  'campbell',
  'san jose',
  'petaluma',
  'novato',
  'san rafael',
  'mill valley',
  'sausalito',
  'tiburon',
  'larkspur',
  'corte madera',
  'san anselmo',
  'fairfax',
  'oakland',
  'emeryville',
  'berkeley',
  'albany',
  'el cerrito',
  'richmond',
  'alameda',
  'san leandro',
  'piedmont',
];

const coveredZipPrefixes = [
  '941', // San Francisco (includes 94155 PO Boxes)
  '940', // Peninsula + Daly City/South SF
  '943', // Palo Alto
  '944', // San Mateo
  '950', // South Bay
  '951', // San Jose
  '949', // North Bay (Petaluma/Marin)
  '945', // East Bay + Tri-Valley + Contra Costa
  '946', // Oakland
  '947', // Berkeley
  '948', // Richmond
];

interface DeliveryZoneCheckerProps {
  className?: string;
  compact?: boolean;
}

type CheckStatus = 'idle' | 'checking' | 'yes' | 'no' | 'maybe';

export function DeliveryZoneChecker({ className, compact = false }: DeliveryZoneCheckerProps) {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [message, setMessage] = useState('');

  const checkDelivery = async () => {
    if (!address.trim()) return;

    setStatus('checking');

    // Simulate API check
    await new Promise(resolve => setTimeout(resolve, 800));

    const input = address.toLowerCase().trim();

    const hasZipPrefixMatch = coveredZipPrefixes.some(prefix => input.includes(prefix));
    const hasCityMatch = coveredCityKeywords.some((city) => {
      if (city === 'sf') return /\bsf\b/.test(input);
      return input.includes(city);
    });

    if (hasZipPrefixMatch || hasCityMatch) {
      setStatus('yes');
      setMessage('Great news! We deliver across the Bay Area, from Petaluma to San Jose and throughout the East Bay. Same-day delivery available.');
    } else {
      setStatus('no');
      setMessage('We currently deliver across the Bay Area only. Check back soon!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkDelivery();
    }
  };

  if (compact) {
    return (
      <div className={cn('w-full max-w-md', className)}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter your address or zip code"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setStatus('idle');
              }}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>
          <Button
            onClick={checkDelivery}
            disabled={status === 'checking' || !address.trim()}
            className="font-display tracking-wider"
          >
            {status === 'checking' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'CHECK'
            )}
          </Button>
        </div>

        {status !== 'idle' && status !== 'checking' && (
          <div className={cn(
            'mt-3 p-3 rounded-lg text-sm flex items-start gap-2',
            status === 'yes' && 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
            status === 'maybe' && 'bg-amber-500/10 border border-amber-500/30 text-amber-400',
            status === 'no' && 'bg-zinc-500/10 border border-zinc-500/30 text-zinc-400'
          )}>
            {status === 'yes' && <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {status === 'maybe' && <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {status === 'no' && <X className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-xl mx-auto', className)}>
      <div className="p-6 border border-border/30 rounded-xl bg-card/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-amber-500/10">
            <Truck className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wider text-foreground">
              CHECK DELIVERY AVAILABILITY
            </h3>
            <p className="text-xs text-muted-foreground">
              Same-day delivery • 8am - 1am daily
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter your address or zip code"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setStatus('idle');
              }}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-background/50"
            />
          </div>
          <Button
            onClick={checkDelivery}
            disabled={status === 'checking' || !address.trim()}
            className="font-display tracking-wider px-6"
          >
            {status === 'checking' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'CHECK'
            )}
          </Button>
        </div>

        {status !== 'idle' && status !== 'checking' && (
          <div className={cn(
            'mt-4 p-4 rounded-lg flex items-start gap-3',
            status === 'yes' && 'bg-emerald-500/10 border border-emerald-500/30',
            status === 'maybe' && 'bg-amber-500/10 border border-amber-500/30',
            status === 'no' && 'bg-zinc-500/10 border border-zinc-500/30'
          )}>
            <div className={cn(
              'p-1 rounded-full',
              status === 'yes' && 'bg-emerald-500/20',
              status === 'maybe' && 'bg-amber-500/20',
              status === 'no' && 'bg-zinc-500/20'
            )}>
              {status === 'yes' && <Check className="h-4 w-4 text-emerald-500" />}
              {status === 'maybe' && <Clock className="h-4 w-4 text-amber-500" />}
              {status === 'no' && <X className="h-4 w-4 text-zinc-500" />}
            </div>
            <div>
              <p className={cn(
                'font-display text-sm tracking-wider mb-1',
                status === 'yes' && 'text-emerald-400',
                status === 'maybe' && 'text-amber-400',
                status === 'no' && 'text-zinc-400'
              )}>
                {status === 'yes' && 'WE DELIVER TO YOU!'}
                {status === 'maybe' && 'COMING SOON'}
                {status === 'no' && 'NOT YET AVAILABLE'}
              </p>
              <p className="text-sm text-muted-foreground">
                {message}
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground/60 text-center mt-4">
          Currently serving the entire Bay Area
        </p>
      </div>
    </div>
  );
}

export default DeliveryZoneChecker;
