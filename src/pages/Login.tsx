import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PasswordGate from '@/components/PasswordGate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, Lock, Sparkles, Phone, Wallet } from 'lucide-react';

const Login = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { signIn, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/';

  // Check if user has passed the password gate
  useEffect(() => {
    const access = sessionStorage.getItem('secretmenu_access');
    if (access === 'true') {
      setHasAccess(true);
    }
  }, []);

  const handleGateSuccess = () => {
    sessionStorage.setItem('secretmenu_access', 'true');
    setHasAccess(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Entry denied',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back',
        description: 'The sanctum awaits',
      });
      navigate(redirectTo);
    }

    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Enter your email to receive a magic link',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await signInWithMagicLink(email);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setMagicLinkSent(true);
      toast({
        title: 'Magic link sent',
        description: 'Check your email for the sacred passage',
      });
    }

    setLoading(false);
  };

  // Show password gate if user hasn't passed it yet
  if (!hasAccess) {
    return <PasswordGate onSuccess={handleGateSuccess} />;
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-md text-center">
            <h1 className="font-display text-3xl tracking-[0.2em] text-mystical mb-4">
              CHECK YOUR INBOX
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              We've sent a magic link to <span className="text-foreground">{email}</span>.
              Click the link to enter the sanctum.
            </p>
            <Button
              variant="outline"
              onClick={() => setMagicLinkSent(false)}
              className="font-display tracking-wider"
            >
              SEND AGAIN
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
        <div className="container mx-auto px-6 max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-foreground text-3xl mb-4 block">◯</span>
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              ENTER
            </h1>
            <p className="font-body text-muted-foreground">
              Return to the inner circle
            </p>
          </div>

          {/* Login Form */}
          <div className="border border-border/30 rounded-lg p-8 bg-card/30">
            <form onSubmit={handleLogin} className="space-y-6">
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
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-display tracking-wider"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ENTERING...
                  </>
                ) : (
                  'ENTER THE SANCTUM'
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/30 px-4 font-body text-xs text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleMagicLink}
              disabled={loading}
              className="w-full font-display tracking-wider mb-3"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              MAGIC LINK
            </Button>

            {/* Alternative login methods - ordered for user friendliness */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                className="w-full font-display tracking-wider text-muted-foreground hover:text-foreground"
              >
                <Phone className="mr-2 h-4 w-4" />
                SIGN IN WITH PHONE
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                className="w-full font-display tracking-wider text-muted-foreground hover:text-foreground"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                CONTINUE WITH GOOGLE
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                className="w-full font-display tracking-wider text-muted-foreground hover:text-foreground"
              >
                <Wallet className="mr-2 h-4 w-4" />
                CONNECT WALLET
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card/30 px-4 font-body text-xs text-muted-foreground">
                    Advanced
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                className="w-full font-display tracking-wider text-muted-foreground hover:text-foreground opacity-70"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                CRYPTO WALLET
              </Button>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center mt-8 font-body text-muted-foreground">
            New to the order?{' '}
            <Link
              to={redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : '/signup'}
              className="text-foreground hover:underline"
            >
              Seek entry
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
