import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function ProfileContent() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'EDIT PROFILE', path: '/profile/edit', description: 'Update your personal information' },
    { label: 'ADDRESSES', path: '/addresses', description: 'Manage delivery addresses' },
    { label: 'ORDER HISTORY', path: '/orders', description: 'View past orders and receipts' },
    { label: 'SUBSCRIPTION', path: '/subscription', description: 'Manage your weekly subscription' },
    { label: 'PREFERENCES', path: '/profile/preferences', description: 'Dietary preferences and notifications' },
    { label: 'ACCOUNT SETTINGS', path: '/profile/settings', description: 'Email, password, and security' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Stats */}
          <div className="mt-8">
            <ProfileStats />
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Button
              onClick={() => navigate('/order')}
              className="h-auto py-6 font-display tracking-[0.15em]"
            >
              <div className="text-center">
                <div className="text-sm">ORDER THIS WEEK</div>
                <div className="text-xs text-primary-foreground/70 mt-1">
                  View the current menu
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/menu')}
              className="h-auto py-6 font-display tracking-[0.15em]"
            >
              <div className="text-center">
                <div className="text-sm">VIEW MENU</div>
                <div className="text-xs text-muted-foreground mt-1">
                  See what's cooking
                </div>
              </div>
            </Button>
          </div>

          {/* Menu Items */}
          <Card className="mt-8 bg-card border-border">
            <CardHeader className="pb-0">
              <CardTitle className="font-display text-sm tracking-[0.2em] text-muted-foreground">
                ACCOUNT
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <div className="divide-y divide-border">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
                  >
                    <div>
                      <div className="font-display text-xs tracking-[0.15em] text-foreground">
                        {item.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
