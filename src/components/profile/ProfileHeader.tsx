import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function ProfileHeader() {
  const { user, profile } = useAuth();

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

  // Format member since date
  const memberSince = user?.created_at
    ? format(new Date(user.created_at), 'MMMM yyyy')
    : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={undefined} alt={profile?.name || 'User'} />
          <AvatarFallback className="bg-muted text-foreground text-2xl font-display">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        {/* Decorative ring */}
        <div className="absolute -inset-1 rounded-full border border-primary/20 animate-pulse-slow" />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <h1 className="font-display text-2xl tracking-[0.15em] text-foreground">
            {profile?.name || 'Member'}
          </h1>
          <Badge variant="secondary" className="font-display text-[10px] tracking-[0.1em]">
            INITIATE
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {user?.email}
        </p>

        {memberSince && (
          <p className="text-xs text-muted-foreground">
            Member since {memberSince}
          </p>
        )}
      </div>
    </div>
  );
}
