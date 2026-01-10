import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AccountSettings } from '@/components/profile/AccountSettings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SettingsContent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-xl">
          {/* Back button */}
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </button>

          <h1 className="font-display text-2xl tracking-[0.15em] mb-8">
            ACCOUNT SETTINGS
          </h1>

          <AccountSettings />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
