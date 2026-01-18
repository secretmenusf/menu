import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';

interface ThemeTransitionProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

export function ThemeTransition({ children, onComplete }: ThemeTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Start with dark theme, then transition to light after password gate
    const savedTheme = localStorage.getItem('sfsecretmenu-ui-theme');
    const hasAccess = sessionStorage.getItem('secretmenu_access');
    
    if (hasAccess === 'true' && (!savedTheme || savedTheme === 'dark')) {
      // Trigger transition to light mode after successful login
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setTheme('light');
          setTimeout(() => {
            setIsTransitioning(false);
            onComplete?.();
          }, 500);
        }, 200);
      }, 1000);
    }
  }, [setTheme, onComplete]);

  return (
    <div className={`theme-transition ${isTransitioning ? 'animate-theme-transition' : ''}`}>
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-mystical/5 to-background pointer-events-none animate-pulse" />
      )}
      {children}
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}