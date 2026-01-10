import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PreferencesForm } from '@/components/profile/PreferencesForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function PreferencesContent() {
  const navigate = useNavigate();

  const handleSave = async (preferences: any) => {
    // In a real app, save to database
    // For now, just store in localStorage
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
  };

  // Load existing preferences
  const savedPreferences = localStorage.getItem('user_preferences');
  const preferences = savedPreferences ? JSON.parse(savedPreferences) : undefined;

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
            PREFERENCES
          </h1>

          <PreferencesForm preferences={preferences} onSave={handleSave} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Preferences() {
  return (
    <ProtectedRoute>
      <PreferencesContent />
    </ProtectedRoute>
  );
}
