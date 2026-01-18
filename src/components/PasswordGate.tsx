import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SeedOfLife3D from './SeedOfLife3D';
import { useTheme } from '@/components/theme-provider';

interface PasswordGateProps {
  onSuccess: () => void;
}

const PasswordGate = ({ onSuccess }: PasswordGateProps) => {
  const [phase, setPhase] = useState<'black' | 'logo' | 'password'>('black');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);
  const autoTypeStartedRef = useRef(false);
  const { theme, setTheme } = useTheme();

  const trackTimeout = (id: number) => {
    timersRef.current.push(id);
  };

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  // Auto-type password character by character
  const startAutoType = () => {
    if (autoTypeStartedRef.current) return;
    autoTypeStartedRef.current = true;
    setPassword('');
    inputRef.current?.focus();

    const secret = 'ilovesecrets';
    let index = 0;

    const typeChar = () => {
      if (index < secret.length) {
        setPassword(secret.slice(0, index + 1));
        index++;
        trackTimeout(window.setTimeout(typeChar, 80 + Math.random() * 60));
      } else {
        // Auto submit after typing
        trackTimeout(window.setTimeout(() => {
          // Start theme transition
          setTheme('light');
          setTimeout(() => onSuccess(), 800);
        }, 1000));
      }
    };

    trackTimeout(window.setTimeout(typeChar, 200));
  };

  useEffect(() => {
    // Phase 1: Complete black for 1 second
    const timer1 = window.setTimeout(() => setPhase('logo'), 1000);
    // Phase 2: Logo animates in, then password after 2 more seconds
    const timer2 = window.setTimeout(() => {
      setPhase('password');
      trackTimeout(window.setTimeout(() => {
        inputRef.current?.focus();
        startAutoType();
      }, 500));
    }, 3000);
    trackTimeout(timer1);
    trackTimeout(timer2);

    return () => {
      clearTimers();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === 'ilovesecrets') {
      // Start theme transition to light mode
      setTimeout(() => setTheme('light'), 100);
      setTimeout(() => onSuccess(), 800);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 500);
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
