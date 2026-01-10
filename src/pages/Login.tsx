import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { signIn, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      navigate('/');
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
              className="w-full font-display tracking-wider"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              MAGIC LINK
            </Button>
          </div>

          {/* Signup Link */}
          <p className="text-center mt-8 font-body text-muted-foreground">
            New to the order?{' '}
            <Link to="/signup" className="text-foreground hover:underline">
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
