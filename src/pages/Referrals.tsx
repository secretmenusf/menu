import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users, Gift, Copy, Check, RefreshCw,
  TrendingUp, Utensils, Award,
  Twitter, Mail, MessageCircle, Facebook
} from 'lucide-react';

const Referrals = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Generate consistent referral code from profile
  const firstName = profile?.name ? profile.name.split(' ')[0].toUpperCase() : 'FRIEND';
  const referralCode = useMemo(() => {
    const hash = profile?.id ? profile.id.substring(0, 4).toUpperCase() : Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${firstName}${hash}`;
  }, [profile?.id, firstName]);

  const referralLink = `https://sfsecretmenu.com/signup?ref=${referralCode}`;

  // Mock stats - in production these would come from backend
  const stats = {
    activeFriends: 7,
    totalMealsOrdered: 156,        // Total meals ordered by all friends ever
    freeMealsEarned: 15,           // 156 / 10 = 15 free meals earned
    freeMealsUsed: 8,
    freeMealsAvailable: 7,
    thisMonthFriendMeals: 42,      // Meals ordered this month by friends
    thisMonthFreeEarned: 4,        // Free meals earned this month
  };

  const referredFriends = [
    { name: 'Alex J.', status: 'active', mealsThisMonth: 8, totalMeals: 32, freeMealsGenerated: 3 },
    { name: 'Sam W.', status: 'active', mealsThisMonth: 6, totalMeals: 28, freeMealsGenerated: 2 },
    { name: 'Jordan L.', status: 'active', mealsThisMonth: 10, totalMeals: 24, freeMealsGenerated: 2 },
    { name: 'Taylor S.', status: 'active', mealsThisMonth: 8, totalMeals: 36, freeMealsGenerated: 3 },
    { name: 'Morgan C.', status: 'active', mealsThisMonth: 4, totalMeals: 20, freeMealsGenerated: 2 },
    { name: 'Casey B.', status: 'active', mealsThisMonth: 6, totalMeals: 16, freeMealsGenerated: 1 },
    { name: 'Riley D.', status: 'pending', mealsThisMonth: 0, totalMeals: 0, freeMealsGenerated: 0 },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Link copied!', description: 'Share it with your friends' });
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCodeCopied(true);
    toast({ title: 'Code copied!', description: referralCode });
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const shareVia = (platform: string) => {
    const text = `Join me on SF Secret Menu! Chef-crafted organic meals delivered weekly. Use my code ${referralCode} for $25 off your first order!`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}&hashtags=SFSecretMenu`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${referralLink}`)}`,
      email: `mailto:?subject=${encodeURIComponent('You have to try SF Secret Menu!')}&body=${encodeURIComponent(`${text}\n\n${referralLink}`)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Gift className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              INVITE FRIENDS
            </h1>
            <p className="font-body text-muted-foreground">
              Every 10 meals they order = 1 free meal for you
            </p>
          </div>

          {/* Main Value Prop */}
          <div className="mb-8 p-8 border border-green-500/20 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <RefreshCw className="h-5 w-5 text-green-500" />
              <span className="font-display text-xs tracking-[0.3em] text-green-500">ONGOING REWARDS</span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl tracking-[0.1em] text-foreground mb-4">
              10 Friend Meals = 1 Free Meal
            </h2>

            <p className="font-body text-muted-foreground max-w-lg mx-auto mb-6">
              For every <span className="text-foreground font-semibold">10 meals</span> your friends order,
              you get <span className="text-green-500 font-semibold">1 free meal</span>.
              As long as they keep ordering, you keep earning. Forever.
            </p>

            {/* Current earnings */}
            <div className="inline-flex items-center gap-6 p-4 bg-background/50 rounded-xl">
              <div className="text-center">
                <p className="font-display text-3xl text-foreground">{stats.activeFriends}</p>
                <p className="font-body text-xs text-muted-foreground">Active Friends</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-display text-3xl text-foreground">{stats.totalMealsOrdered}</p>
                <p className="font-body text-xs text-muted-foreground">Their Meals</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-display text-3xl text-green-500">{stats.freeMealsEarned}</p>
                <p className="font-body text-xs text-muted-foreground">Your Free Meals</p>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="mb-8 p-6 border border-border/30 rounded-2xl bg-card/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground">THIS MONTH</h3>
              <span className="font-body text-xs text-muted-foreground">
                {stats.thisMonthFriendMeals} friend meals → {stats.thisMonthFreeEarned} free for you
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(stats.thisMonthFriendMeals % 10) * 10}%` }}
                />
              </div>
              <span className="font-mono text-sm text-muted-foreground">
                {stats.thisMonthFriendMeals % 10}/10 to next free meal
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Users className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
              <p className="font-display text-2xl text-foreground">{stats.activeFriends}</p>
              <p className="font-body text-xs text-muted-foreground">Friends</p>
            </div>
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Utensils className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
              <p className="font-display text-2xl text-foreground">{stats.totalMealsOrdered}</p>
              <p className="font-body text-xs text-muted-foreground">Their Meals</p>
            </div>
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Gift className="mx-auto h-5 w-5 text-green-500 mb-2" />
              <p className="font-display text-2xl text-green-500">{stats.freeMealsEarned}</p>
              <p className="font-body text-xs text-muted-foreground">Earned</p>
            </div>
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Award className="mx-auto h-5 w-5 text-amber-400 mb-2" />
              <p className="font-display text-2xl text-amber-400">{stats.freeMealsAvailable}</p>
              <p className="font-body text-xs text-muted-foreground">Available</p>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-8 p-6 border border-border/30 rounded-2xl bg-card/30">
            <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">YOUR REFERRAL LINK</h3>
            <div className="flex gap-2 mb-4">
              <Input
                value={referralLink}
                readOnly
                className="bg-background/50 font-mono text-sm"
              />
              <Button onClick={copyLink} variant="outline" className="shrink-0 px-4">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-sm text-muted-foreground">Your code:</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full hover:bg-muted transition-colors"
              >
                <code className="font-mono text-lg text-foreground tracking-wider">{referralCode}</code>
                {codeCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-muted-foreground" />}
              </button>
              <span className="font-body text-xs text-green-500">$25 off for them</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" onClick={() => shareVia('twitter')} className="w-full">
                <Twitter size={16} className="mr-2" /> Twitter
              </Button>
              <Button variant="outline" onClick={() => shareVia('facebook')} className="w-full">
                <Facebook size={16} className="mr-2" /> Facebook
              </Button>
              <Button variant="outline" onClick={() => shareVia('whatsapp')} className="w-full">
                <MessageCircle size={16} className="mr-2" /> WhatsApp
              </Button>
              <Button variant="outline" onClick={() => shareVia('email')} className="w-full">
                <Mail size={16} className="mr-2" /> Email
              </Button>
            </div>
          </div>

          {/* Referred Friends */}
          <div className="border border-border/30 rounded-2xl bg-card/30 overflow-hidden mb-8">
            <div className="p-4 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground">YOUR FRIENDS</h3>
              <span className="font-body text-xs text-muted-foreground">
                {stats.activeFriends} active
              </span>
            </div>
            <div className="divide-y divide-border/20">
              {referredFriends.map((friend, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-card/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-foreground font-display text-sm ${
                      friend.status === 'active' ? 'bg-green-500/20' : 'bg-muted'
                    }`}>
                      {friend.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-body text-foreground">{friend.name}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {friend.status === 'active'
                          ? `${friend.totalMeals} meals total · ${friend.mealsThisMonth} this month`
                          : 'Waiting for first order'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {friend.status === 'active' ? (
                      <>
                        <p className="font-display text-sm text-green-500">+{friend.freeMealsGenerated} free</p>
                        <p className="font-body text-xs text-muted-foreground">meals for you</p>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-display tracking-wider bg-yellow-500/20 text-yellow-500">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="p-6 border border-border/30 rounded-2xl bg-card/30">
            <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-6 text-center">HOW IT WORKS</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display text-lg text-foreground">1</span>
                </div>
                <p className="font-display text-sm tracking-wider text-foreground mb-1">Share Your Link</p>
                <p className="font-body text-xs text-muted-foreground">Friends get $25 off their first order</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display text-lg text-foreground">2</span>
                </div>
                <p className="font-display text-sm tracking-wider text-foreground mb-1">They Order</p>
                <p className="font-body text-xs text-muted-foreground">Every meal they order counts toward yours</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <RefreshCw size={20} className="text-green-500" />
                </div>
                <p className="font-display text-sm tracking-wider text-green-500 mb-1">You Earn</p>
                <p className="font-body text-xs text-muted-foreground">10 of their meals = 1 free meal for you</p>
              </div>
            </div>

            {/* Examples */}
            <div className="p-4 bg-background/50 rounded-xl">
              <p className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-3 text-center">EXAMPLE EARNINGS</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">3 friends × 10 meals/mo</p>
                  <p className="font-display text-lg text-green-500">3 free/mo</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">5 friends × 10 meals/mo</p>
                  <p className="font-display text-lg text-green-500">5 free/mo</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">10 friends × 10 meals/mo</p>
                  <p className="font-display text-lg text-green-500">10 free/mo</p>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground text-center mt-4">
                As long as they keep ordering, you keep earning.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Referrals;
