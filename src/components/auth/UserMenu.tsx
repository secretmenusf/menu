import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Package,
  MapPin,
  LogOut,
  CreditCard,
  ChevronDown,
  Gift,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserMenu() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const openLogin = () => {
    navigate('/login');
  };

  const openSignUp = () => {
    navigate('/join');
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
    );
  }

  // Not logged in - show sign in button
  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="font-display text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground"
            onClick={openLogin}
          >
            SIGN IN
          </Button>
          <Button
            size="sm"
            className="font-display text-xs tracking-[0.15em]"
            onClick={openSignUp}
          >
            JOIN
          </Button>
        </div>

        <AuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          defaultView={authView}
        />
      </>
    );
  }

  // Logged in - show user dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 gap-2 px-2 hover:bg-accent"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={undefined} alt={profile?.name || 'User'} />
            <AvatarFallback className="bg-muted text-foreground text-xs font-display">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm font-medium max-w-[120px] truncate">
            {profile?.name || user.email?.split('@')[0]}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-card border-border"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.name || 'Member'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={() => navigate('/profile')}
          className="cursor-pointer focus:bg-accent"
        >
          <User className="mr-2 h-4 w-4" />
          <span className="font-display text-xs tracking-[0.1em]">PROFILE</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate('/orders')}
          className="cursor-pointer focus:bg-accent"
        >
          <Package className="mr-2 h-4 w-4" />
          <span className="font-display text-xs tracking-[0.1em]">ORDERS</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate('/addresses')}
          className="cursor-pointer focus:bg-accent"
        >
          <MapPin className="mr-2 h-4 w-4" />
          <span className="font-display text-xs tracking-[0.1em]">ADDRESSES</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate('/subscription')}
          className="cursor-pointer focus:bg-accent"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span className="font-display text-xs tracking-[0.1em]">SUBSCRIPTION</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate('/referrals')}
          className="cursor-pointer focus:bg-accent"
        >
          <Gift className="mr-2 h-4 w-4" />
          <span className="font-display text-xs tracking-[0.1em]">REFER & EARN</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={() => navigate('/profile/settings')}
          className="cursor-pointer focus:bg-accent"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span className="font-display text-xs tracking-[0.1em]">SETTINGS</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer focus:bg-accent text-muted-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-display text-xs tracking-[0.1em]">SIGN OUT</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
