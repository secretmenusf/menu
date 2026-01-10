import { Users, Gift, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReferralStatsProps {
  totalReferrals: number;
  freeMealsEarned: number;
  pendingReferrals: number;
}

export function ReferralStats({
  totalReferrals,
  freeMealsEarned,
  pendingReferrals,
}: ReferralStatsProps) {
  const stats = [
    {
      label: 'FRIENDS REFERRED',
      value: totalReferrals,
      icon: Users,
      description: 'Total friends invited',
    },
    {
      label: 'FREE MEALS EARNED',
      value: freeMealsEarned,
      icon: Gift,
      description: 'Ready to use',
      highlight: freeMealsEarned > 0,
    },
    {
      label: 'PENDING REWARDS',
      value: pendingReferrals,
      icon: Clock,
      description: 'Awaiting first order',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`bg-card border-border ${
            stat.highlight ? 'border-primary/50 bg-primary/5' : ''
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
                <p
                  className={`text-4xl font-light mt-2 ${
                    stat.highlight ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div
                className={`p-2 rounded-full ${
                  stat.highlight ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                <stat.icon
                  className={`h-5 w-5 ${
                    stat.highlight ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ReferralStats;
