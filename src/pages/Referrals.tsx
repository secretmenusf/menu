import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Gift, Copy, Check, Twitter, Mail, MessageCircle } from 'lucide-react';

const Referrals = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const firstName = profile?.name ? profile.name.split(' ')[0].toUpperCase() : 'FRIEND';
  const referralCode = firstName + Math.random().toString(36).substring(2, 6).toUpperCase();
  const referralLink = 'https://sfsecretmenu.com/signup?ref=' + referralCode;

  const stats = {
    totalReferrals: 3,
    pendingReferrals: 1,
    completedReferrals: 2,
    freeMealsEarned: 2,
  };

  const referredFriends = [
    { name: 'Alex Johnson', status: 'completed', date: '2026-01-05', reward: 'Earned' },
    { name: 'Sam Williams', status: 'completed', date: '2025-12-20', reward: 'Earned' },
    { name: 'Jordan Lee', status: 'pending', date: '2026-01-08', reward: 'Pending' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Referral link copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (platform: string) => {
    const text = 'Join me on SF Secret Menu and get exclusive chef-crafted meals delivered! Use my code: ' + referralCode;
    const urls: Record<string, string> = {
      twitter: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(referralLink),
      whatsapp: 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + referralLink),
      email: 'mailto:?subject=Join SF Secret Menu&body=' + encodeURIComponent(text + '\n\n' + referralLink),
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <Users className="mx-auto h-12 w-12 text-foreground mb-4" />
            <h1 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-2">
              REFERRAL HUB
            </h1>
            <p className="font-body text-muted-foreground">
              Share the secret. Earn free meals.
            </p>
          </div>

          <div className="mb-12 p-6 border border-foreground/30 rounded-lg bg-gradient-to-r from-card/50 to-card/20 text-center">
            <Gift className="mx-auto h-8 w-8 text-mystical mb-3" />
            <h2 className="font-display text-xl tracking-[0.15em] text-foreground mb-2">
              1 FREE MEAL FOR EVERY FRIEND
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              When your friend signs up and places their first order, you both get a free meal!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 border border-border/30 rounded-lg bg-card/30 text-center">
              <p className="font-display text-3xl text-mystical">{stats.totalReferrals}</p>
              <p className="font-body text-xs text-muted-foreground">Total Referrals</p>
            </div>
            <div className="p-4 border border-border/30 rounded-lg bg-card/30 text-center">
              <p className="font-display text-3xl text-foreground">{stats.pendingReferrals}</p>
              <p className="font-body text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="p-4 border border-border/30 rounded-lg bg-card/30 text-center">
              <p className="font-display text-3xl text-foreground">{stats.completedReferrals}</p>
              <p className="font-body text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="p-4 border border-border/30 rounded-lg bg-card/30 text-center">
              <p className="font-display text-3xl text-green-500">{stats.freeMealsEarned}</p>
              <p className="font-body text-xs text-muted-foreground">Free Meals Earned</p>
            </div>
          </div>

          <div className="mb-12 p-6 border border-border/30 rounded-lg bg-card/30">
            <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">YOUR REFERRAL LINK</h3>
            <div className="flex gap-2 mb-4">
              <Input value={referralLink} readOnly className="bg-transparent font-mono text-sm" />
              <Button onClick={copyLink} variant="outline" className="shrink-0">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-body text-sm text-muted-foreground">Your code:</span>
              <code className="px-2 py-1 bg-muted rounded font-mono text-foreground">{referralCode}</code>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => shareVia('twitter')} className="flex-1">
                <Twitter size={16} className="mr-2" /> Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={() => shareVia('whatsapp')} className="flex-1">
                <MessageCircle size={16} className="mr-2" /> WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => shareVia('email')} className="flex-1">
                <Mail size={16} className="mr-2" /> Email
              </Button>
            </div>
          </div>

          <div className="border border-border/30 rounded-lg bg-card/30">
            <div className="p-4 border-b border-border/30">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground">REFERRED FRIENDS</h3>
            </div>
            <div className="divide-y divide-border/30">
              {referredFriends.map((friend, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-body text-foreground">{friend.name}</p>
                    <p className="font-body text-xs text-muted-foreground">Referred {friend.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-display tracking-wider ${
                    friend.status === 'completed'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {friend.reward}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Referrals;
