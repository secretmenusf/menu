import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SeedOfLife from './SeedOfLife';
import { MessageCircle, X } from 'lucide-react';

interface PasswordGateProps {
  onSuccess: () => void;
}

const hints = [
  "Think about what the initiated already know...",
  "It's a phrase, not a word.",
  "Four letters. An acronym of sorts.",
  "If you know, you know...",
];

const PasswordGate = ({ onSuccess }: PasswordGateProps) => {
  const [phase, setPhase] = useState<'black' | 'logo' | 'password'>('black');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Phase 1: Complete black for 1 second
    const timer1 = setTimeout(() => setPhase('logo'), 1000);
    // Phase 2: Logo animates in, then password after 2 more seconds
    const timer2 = setTimeout(() => setPhase('password'), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (phase === 'password' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [phase]);

  useEffect(() => {
    // Show hint bubble after 10 seconds on password phase, or after 2 failed attempts
    if (phase === 'password') {
      if (failedAttempts >= 2) {
        setShowHint(true);
      } else {
        const timer = setTimeout(() => setShowHint(true), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, failedAttempts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === 'iykyk') {
      onSuccess();
    } else {
      setError(true);
      setFailedAttempts(prev => prev + 1);
      setPassword('');
      setTimeout(() => setError(false), 500);
    }
  };

  const nextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Logo container */}
      <div className={`transition-all duration-1000 ${phase === 'black' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        <div className="flex flex-col items-center gap-8">
          {/* Animated Seed of Life Logo */}
          <div className={`transition-all duration-1000 ${phase === 'logo' ? 'animate-pulse-slow' : ''}`}>
            <SeedOfLife size={120} className="text-foreground" />
          </div>
          
          {/* Brand name */}
          <div className={`transition-all duration-700 delay-500 ${phase !== 'black' ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="font-display text-2xl tracking-[0.4em] text-foreground">SECRET MENU</h1>
          </div>
          
          {/* Password input */}
          <form 
            onSubmit={handleSubmit}
            className={`mt-8 transition-all duration-700 ${phase === 'password' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <div className="flex flex-col items-center gap-4">
              <p className="font-body text-sm text-muted-foreground tracking-wider mb-2">
                speak the passphrase
              </p>
              <Input
                ref={inputRef}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="..."
                className={`w-64 text-center font-body tracking-widest bg-transparent border-foreground/50 focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 transition-all ${error ? 'animate-shake border-destructive' : ''}`}
              />
              <Button 
                type="submit" 
                variant="outline"
                className="font-display text-xs tracking-[0.2em] border-border hover:bg-foreground hover:text-background transition-all"
              >
                ENTER
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Hint bubble */}
      {showHint && phase === 'password' && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="relative">
            {/* Chat bubble */}
            <div className="bg-card p-5 pt-8 rounded-3xl max-w-xs shadow-lg">
              <button 
                onClick={() => setShowHint(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
              <p className="font-body text-sm text-foreground/80 pr-4">
                {hints[hintIndex]}
              </p>
              {hintIndex < hints.length - 1 && (
                <button 
                  onClick={nextHint}
                  className="mt-3 font-display text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  need more help?
                </button>
              )}
            </div>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-card transform rotate-45 rounded-sm" />
          </div>
          
          {/* Floating icon when collapsed */}
          <button 
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            onClick={() => setShowHint(true)}
          >
            <MessageCircle size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordGate;
