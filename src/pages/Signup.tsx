import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Gift } from 'lucide-react';
import { getPlanById } from '@/data/plans';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const selectedPlan = planId ? getPlanById(planId) : null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are identical',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name, referralCode || undefined);

    if (error) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSuccess(true);
      toast({
        title: 'Welcome to the order',
        description: 'Check your email to confirm your entry',
      });
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-md text-center">
            <h1 className="font-display text-3xl tracking-[0.2em] text-mystical mb-4">
              INITIATION BEGUN
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Check your email at <span className="text-foreground">{email}</span> to confirm your
              entry into the order.
            </p>
            <Link to="/login">
              <Button variant="outline" className="font-display tracking-wider">
                RETURN TO LOGIN
              </Button>
            </Link>
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
        <div className="container mx-auto px-6 max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-foreground text-3xl mb-4 block">❂</span>
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              JOIN THE ORDER
            </h1>
            <p className="font-body text-muted-foreground">
              Begin your journey into culinary alchemy
            </p>
          </div>

          {/* Selected Plan */}
          {selectedPlan && (
            <div className="mb-8 p-4 border border-foreground/30 rounded-lg bg-card/50 text-center">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-1">SELECTED PLAN</p>
              <p className="font-display text-xl tracking-[0.15em] text-foreground">{selectedPlan.name.toUpperCase()}</p>
              <p className="font-body text-muted-foreground">${selectedPlan.price}/mo · {selectedPlan.mealsPerWeek} meals/week</p>
            </div>
          )}

          {/* Signup Form */}
          <div className="border border-border/30 rounded-lg p-8 bg-card/30">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-display text-xs tracking-wider">
                  NAME
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10 bg-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-display text-xs tracking-wider">
                  EMAIL
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-display text-xs tracking-wider">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-transparent"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-display text-xs tracking-wider">
                  CONFIRM PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral" className="font-display text-xs tracking-wider">
                  REFERRAL CODE <span className="text-muted-foreground">(optional)</span>
                </Label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="referral"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code"
                    className="pl-10 bg-transparent"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-display tracking-wider"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    INITIATING...
                  </>
                ) : (
                  'SEEK ENTRY'
                )}
              </Button>
            </form>

            <p className="text-center mt-6 font-body text-xs text-muted-foreground">
              By joining, you agree to our{' '}
              <Link to="/terms" className="text-foreground hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-foreground hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Login Link */}
          <p className="text-center mt-8 font-body text-muted-foreground">
            Already initiated?{' '}
            <Link to="/login" className="text-foreground hover:underline">
              Enter here
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
