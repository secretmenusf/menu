import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPassword } from './ForgotPassword';
import SeedOfLife3D from '@/components/SeedOfLife3D';

type AuthView = 'login' | 'signup' | 'forgot-password';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: AuthView;
}

export function AuthModal({ open, onOpenChange, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView);

  const handleSuccess = () => {
    onOpenChange(false);
    setView('login');
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset to login view after modal closes
    setTimeout(() => setView('login'), 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>
            {view === 'login' && 'Sign In'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot-password' && 'Reset Password'}
          </DialogTitle>
        </VisuallyHidden>

        {/* Decorative header */}
        <div className="relative h-24 bg-gradient-to-b from-background to-card flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 sacred-geometry opacity-30" />
          <div className="relative">
            <SeedOfLife3D size={64} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          {view === 'login' && (
            <LoginForm
              onForgotPassword={() => setView('forgot-password')}
              onSignUp={() => setView('signup')}
              onSuccess={handleSuccess}
            />
          )}
          {view === 'signup' && (
            <SignUpForm
              onLogin={() => setView('login')}
              onSuccess={handleSuccess}
            />
          )}
          {view === 'forgot-password' && (
            <ForgotPassword onBack={() => setView('login')} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
