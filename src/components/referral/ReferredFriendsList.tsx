import { Clock, UserCheck, ShoppingBag, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReferredFriend, ReferralStatus } from '@/hooks/useReferrals';

interface ReferredFriendsListProps {
  friends: ReferredFriend[];
}

const statusConfig: Record<
  ReferralStatus,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending_signup: {
    label: 'PENDING SIGNUP',
    icon: Clock,
    color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  },
  signed_up: {
    label: 'SIGNED UP',
    icon: UserCheck,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  },
  first_order: {
    label: 'FIRST ORDER',
    icon: ShoppingBag,
    color: 'text-green-500 bg-green-500/10 border-green-500/30',
  },
  active: {
    label: 'ACTIVE',
    icon: Gift,
    color: 'text-primary bg-primary/10 border-primary/30',
  },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function FriendCard({ friend }: { friend: ReferredFriend }) {
  const config = statusConfig[friend.status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <span className="font-display text-sm text-muted-foreground">
            {friend.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium text-foreground">{friend.name}</p>
          <p className="text-xs text-muted-foreground">{friend.email}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Referred {formatDate(friend.referredAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {/* Status Badge */}
        <Badge
          variant="outline"
          className={`font-display text-[9px] tracking-[0.15em] ${config.color}`}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>

        {/* Reward Status */}
        {friend.rewardEarned && (
          <span className="text-[10px] text-green-500 flex items-center gap-1">
            <Gift className="h-3 w-3" />
            Free meal earned!
          </span>
        )}
      </div>
    </div>
  );
}

export function ReferredFriendsList({ friends }: ReferredFriendsListProps) {
  if (friends.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.2em] text-muted-foreground">
            REFERRED FRIENDS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-sm tracking-[0.15em] text-foreground mb-2">
              NO REFERRALS YET
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Share your referral link with friends and earn a free meal when
              they place their first order!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-0">
        <CardTitle className="font-display text-sm tracking-[0.2em] text-muted-foreground">
          REFERRED FRIENDS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="divide-y divide-border">
          {friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ReferredFriendsList;
