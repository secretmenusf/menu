import { ReactNode, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  showModal?: boolean;
}

export function ProtectedRoute({
  children,
  redirectTo = '/',
  showModal = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground font-display tracking-[0.15em]">
            VERIFYING ACCESS...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated
  if (!user) {
    if (showModal) {
      // Show auth modal and render nothing behind it
      return (
        <>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Please sign in to access this page
              </p>
            </div>
          </div>
          <AuthModal
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                // Navigate back if modal is closed without auth
                window.history.back();
              }
              setShowAuthModal(open);
            }}
            defaultView="login"
          />
        </>
      );
    }
    // Redirect to specified route
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
