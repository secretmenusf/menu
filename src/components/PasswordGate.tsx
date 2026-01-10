import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SeedOfLife3D from './SeedOfLife3D';
import { MessageCircle, X } from 'lucide-react';

interface PasswordGateProps {
  onSuccess: () => void;
}

const hints = [
  "Some doors only open for those who truly desire what's behind them...",
  "Whisper your devotion to the unseen...",
  "Three words that unlock everything hidden...",
  "Say it: I... love... secrets",
  "Type: ilovesecrets ✨",
];

const PasswordGate = ({ onSuccess }: PasswordGateProps) => {
  const [phase, setPhase] = useState<'black' | 'logo' | 'password'>('black');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [autoRevealCountdown, setAutoRevealCountdown] = useState<number | null>(null);
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoRevealTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-type password character by character
  const startAutoType = () => {
    if (isAutoTyping) return;
    setIsAutoTyping(true);
    setPassword('');
    inputRef.current?.focus();

    const secret = 'ilovesecrets';
    let index = 0;

    const typeChar = () => {
      if (index < secret.length) {
        setPassword(secret.slice(0, index + 1));
        index++;
        setTimeout(typeChar, 80 + Math.random() * 60); // Random delay for natural feel
      } else {
        // Pause then auto-submit
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    };

    setTimeout(typeChar, 200);
  };

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

  // Auto-reveal timer - starts when password phase begins
  useEffect(() => {
    if (phase === 'password') {
      // Start 5 minute countdown (300 seconds)
      autoRevealTimerRef.current = setTimeout(() => {
        // Auto-type the password
        setPassword('ilovesecrets');
        setAutoRevealCountdown(3);
      }, 300000); // 5 minutes
      
      return () => {
        if (autoRevealTimerRef.current) {
          clearTimeout(autoRevealTimerRef.current);
        }
      };
    }
  }, [phase]);

  // Auto-submit after countdown
  useEffect(() => {
    if (autoRevealCountdown !== null && autoRevealCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoRevealCountdown(autoRevealCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRevealCountdown === 0) {
      onSuccess();
    }
  }, [autoRevealCountdown, onSuccess]);

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
    if (password.toLowerCase().trim() === 'ilovesecrets') {
      // Clear auto-reveal timer on success
      if (autoRevealTimerRef.current) {
        clearTimeout(autoRevealTimerRef.current);
      }
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
      <div className={`transition-opacity duration-1000 ${phase === 'black' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-8">
          {/* 3D Seed of Life Logo */}
          <div className="flex items-center justify-center">
            <SeedOfLife3D size={240} />
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
                enter secret password
              </p>
              <Input
                ref={inputRef}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-64 text-center font-body tracking-widest bg-transparent border-foreground/50 focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 transition-all ${error ? 'animate-shake border-destructive' : ''}`}
              />
              <Button 
                type="submit" 
                variant="outline"
                className="font-display text-xs tracking-[0.2em] border-border hover:bg-foreground hover:text-background transition-all"
              >
                ENTER
              </Button>
              
              {/* Auto-reveal countdown message */}
              {autoRevealCountdown !== null && (
                <p className="font-body text-xs text-muted-foreground mt-2">
                  Entering in {autoRevealCountdown}...
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Hint system - always show after trigger */}
      {phase === 'password' && (
        <>
          {/* Chat bubble - shown when open */}
          {showHint && (
            <div className="fixed bottom-20 right-6 z-[60] animate-fade-in">
              <div className="relative">
                <div className="bg-card border border-border p-5 pt-8 rounded-3xl max-w-xs shadow-lg">
                  <button 
                    onClick={() => setShowHint(false)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                  {hintIndex === hints.length - 1 ? (
                    <button
                      onClick={startAutoType}
                      disabled={isAutoTyping}
                      className="font-body text-sm text-foreground/80 pr-4 hover:text-primary transition-colors cursor-pointer text-left disabled:opacity-50"
                    >
                      {hints[hintIndex]}
                    </button>
                  ) : (
                    <p className="font-body text-sm text-foreground/80 pr-4">
                      {hints[hintIndex]}
                    </p>
                  )}
                  {hintIndex < hints.length - 1 ? (
                    <button
                      onClick={nextHint}
                      className="mt-3 font-display text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      need more help?
                    </button>
                  ) : (
                    <a
                      href="https://wa.me/14155551234?text=Hi%20Secret%20Menu!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block font-display text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors border-t border-border/30 pt-3"
                    >
                      chat with us →
                    </a>
                  )}
                </div>
                {/* Bubble tail pointing to icon */}
                <div className="absolute -bottom-2 right-8 w-3 h-3 bg-card border-r border-b border-border transform rotate-45" />
              </div>
            </div>
          )}
          
          {/* Floating chat icon - always visible */}
          <button
            className="fixed bottom-6 right-6 z-[70] w-11 h-11 bg-foreground text-background rounded-md flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? <X size={18} /> : <MessageCircle size={18} />}
          </button>
        </>
      )}
    </div>
  );
};

export default PasswordGate;
