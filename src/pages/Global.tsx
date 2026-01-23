import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  MapPin,
  CheckCircle,
  Clock,
  Vote,
  ThumbsUp,
  Mail,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { expansionCities, City } from '@/data/plans';
import { SEOHead, schemas } from '@/components/seo/SEOHead';

// City card component
const CityCard = ({
  city,
  onVote,
  hasVoted,
}: {
  city: City;
  onVote: (city: City) => void;
  hasVoted: boolean;
}) => {
  const statusConfig = {
    active: {
      icon: CheckCircle,
      label: 'LIVE NOW',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    coming_soon: {
      icon: Clock,
      label: city.launchDate || 'COMING SOON',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    voting: {
      icon: Vote,
      label: 'VOTE',
      color: 'text-mystical',
      bgColor: 'bg-mystical/10',
      borderColor: 'border-mystical/30',
    },
  };

  const config = statusConfig[city.status];
  const Icon = config.icon;

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${config.borderColor} ${config.bgColor}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-display text-lg tracking-wide text-foreground">
            {city.name}
          </h3>
          <p className="font-body text-xs text-muted-foreground">{city.country}</p>
        </div>
        <Badge variant="outline" className={`${config.color} border-current text-[10px]`}>
          <Icon size={10} className="mr-1" />
          {config.label}
        </Badge>
      </div>

      {city.status === 'voting' && (
        <div className="mt-3">
          <Button
            size="sm"
            variant={hasVoted ? 'secondary' : 'outline'}
            className={`w-full rounded-full text-xs ${hasVoted ? 'bg-mystical/20 text-mystical' : ''}`}
            onClick={() => onVote(city)}
            disabled={hasVoted}
          >
            <ThumbsUp size={12} className="mr-1" />
            {hasVoted ? 'VOTED!' : 'VOTE FOR THIS CITY'}
          </Button>
          {city.votes !== undefined && city.votes > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {city.votes.toLocaleString()} votes
            </p>
          )}
        </div>
      )}

      {city.status === 'active' && (
        <Button
          asChild
          size="sm"
          className="w-full mt-3 rounded-full text-xs bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/30"
        >
          <Link to="/menu">
            <MapPin size={12} className="mr-1" />
            VIEW MENU
          </Link>
        </Button>
      )}
    </div>
  );
};

// Waitlist modal
const WaitlistModal = ({
  open,
  onOpenChange,
  selectedCity,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCity: City | null;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'You\'re on the list!',
      description: `We'll notify you when Secret Menu launches in ${selectedCity?.name}.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-mystical/30">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-wider text-center">
            {selectedCity?.name} WAITLIST
          </DialogTitle>
          <DialogDescription className="text-center">
            Be the first to know when we launch in {selectedCity?.name}. We'll send you early access.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-full text-center"
          />
          <Button
            type="submit"
            className="w-full rounded-full font-display tracking-wider bg-mystical text-background hover:bg-mystical/90"
            disabled={isSubmitting}
          >
            <Mail size={14} className="mr-2" />
            {isSubmitting ? 'JOINING...' : 'JOIN WAITLIST'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Global = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'active' | 'coming_soon' | 'voting'>('all');
  const [votedCities, setVotedCities] = useState<string[]>([]);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Filter and sort cities
  const filteredCities = useMemo(() => {
    let cities = [...expansionCities];

    if (filter !== 'all') {
      cities = cities.filter((city) => city.status === filter);
    }

    // Sort: active first, then coming_soon by date, then voting by votes
    return cities.sort((a, b) => {
      const statusOrder = { active: 0, coming_soon: 1, voting: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (a.status === 'voting' && b.status === 'voting') {
        return (b.votes || 0) - (a.votes || 0);
      }
      return 0;
    });
  }, [filter]);

  const handleVote = (city: City) => {
    if (!user) {
      toast({
        title: 'Sign in to vote',
        description: 'Create an account to vote for your city.',
        variant: 'destructive',
      });
      return;
    }

    setVotedCities([...votedCities, city.name]);
    setSelectedCity(city);
    setShowWaitlist(true);

    toast({
      title: 'Vote recorded!',
      description: `Thanks for voting for ${city.name}. Join the waitlist to get notified.`,
    });
  };

  // Stats
  const activeCities = expansionCities.filter((c) => c.status === 'active').length;
  const comingSoonCities = expansionCities.filter((c) => c.status === 'coming_soon').length;
  const votingCities = expansionCities.filter((c) => c.status === 'voting').length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Global Expansion - Secret Menu | Coming to 100 Cities"
        description="Secret Menu is expanding worldwide. See where we're launching next, vote for your city, and join the waitlist for early access."
        url="https://secretmenu.vip/global"
        schema={schemas.breadcrumb([
          { name: 'Home', url: 'https://secretmenu.vip' },
          { name: 'Global', url: 'https://secretmenu.vip/global' },
        ])}
      />

      <Header />

      <main className="pt-32 pb-24">
        {/* Back link */}
        <div className="container mx-auto px-6 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>
        </div>

        {/* Hero section */}
        <div className="container mx-auto px-6 max-w-4xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mystical/30 bg-mystical/5 mb-6">
            <Globe size={16} className="text-mystical" />
            <span className="font-display text-xs tracking-wider text-mystical">
              SECRETMENU.VIP
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-6">
            GOING GLOBAL
          </h1>

          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Chef Antje's secret menu is expanding to 100 cities worldwide.
            Vote for your city, join the waitlist, and be first to experience
            curated culinary excellence when we arrive.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="font-display text-3xl text-green-500">{activeCities}</div>
              <div className="font-body text-xs text-muted-foreground">LIVE</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-yellow-500">{comingSoonCities}</div>
              <div className="font-body text-xs text-muted-foreground">COMING SOON</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-mystical">{votingCities}</div>
              <div className="font-body text-xs text-muted-foreground">VOTE OPEN</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="container mx-auto px-6 max-w-6xl mb-8">
          <div className="flex justify-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setFilter('all')}
            >
              All Cities
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setFilter('active')}
            >
              <CheckCircle size={12} className="mr-1" />
              Live Now
            </Button>
            <Button
              variant={filter === 'coming_soon' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setFilter('coming_soon')}
            >
              <Clock size={12} className="mr-1" />
              Coming Soon
            </Button>
            <Button
              variant={filter === 'voting' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setFilter('voting')}
            >
              <Vote size={12} className="mr-1" />
              Vote Open
            </Button>
          </div>
        </div>

        {/* Cities grid */}
        <div className="container mx-auto px-6 max-w-6xl mb-16">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCities.map((city) => (
              <CityCard
                key={`${city.name}-${city.country}`}
                city={city}
                onVote={handleVote}
                hasVoted={votedCities.includes(city.name)}
              />
            ))}
          </div>
        </div>

        {/* Request a city */}
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center border border-mystical/20 rounded-lg p-8 bg-gradient-to-b from-mystical/5 to-transparent">
            <Sparkles size={24} className="mx-auto text-mystical mb-4" />
            <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-3">
              DON'T SEE YOUR CITY?
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              We're always looking for new markets. Request your city and help us decide where to go next.
            </p>
            <Button
              variant="outline"
              className="rounded-full font-display tracking-wider"
              onClick={() => {
                toast({
                  title: 'Request submitted',
                  description: 'Thanks! We\'ll consider your city for future expansion.',
                });
              }}
            >
              <MapPin size={14} className="mr-2" />
              REQUEST A CITY
            </Button>
          </div>
        </div>

        {/* Global value prop */}
        <div className="container mx-auto px-6 max-w-4xl mt-16">
          <div className="border border-border/30 rounded-lg p-8 md:p-12 bg-card/20">
            <h2 className="font-display text-xl tracking-[0.2em] text-foreground text-center mb-8">
              AVAILABLE EVERYWHERE
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-sm tracking-wider mb-2 text-mystical">
                  NOT IN A DELIVERY CITY?
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  The $9/mo Explorer plan gives you full access to Chef Antje's weekly menus and AI cooking
                  assistant. Get recipes, nutrition advice, and learn to cook each dish at home—no matter where
                  you are in the world.
                </p>
              </div>
              <div>
                <h3 className="font-display text-sm tracking-wider mb-2 text-mystical">
                  WHEN WE LAUNCH IN YOUR CITY
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  Waitlist members get early access and exclusive launch pricing. Upgrade to Member ($29/mo)
                  when we arrive to unlock delivery. Your Explorer subscription credits transfer automatically.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button asChild className="rounded-full font-display tracking-wider bg-mystical text-background hover:bg-mystical/90">
                <Link to="/pricing">
                  <Sparkles size={14} className="mr-2" />
                  START WITH EXPLORER - $9/MO
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Waitlist modal */}
      <WaitlistModal
        open={showWaitlist}
        onOpenChange={setShowWaitlist}
        selectedCity={selectedCity}
      />
    </div>
  );
};

export default Global;
