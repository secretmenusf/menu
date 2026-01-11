import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useReferrals from '@/hooks/useReferrals';
import {
  Users, Gift, Copy, Check, RefreshCw,
  Utensils, Award, AlertCircle, Lock, Loader2,
  Twitter, Mail, MessageCircle
} from 'lucide-react';

const MAX_INVITES = 10;

const Referrals = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Use real referral data from hook
  const {
    referralData,
    referralCode,
    referralLink,
    invitesRemaining,
    canInvite,
    isLoading,
    copyReferralLink,
    copyReferralCode,
    shareVia: shareViaPlatform,
  } = useReferrals();

  // Derived stats from real data
  const invitesUsed = MAX_INVITES - invitesRemaining;

  const copyLink = async () => {
    const success = await copyReferralLink();
    if (success) {
      setCopied(true);
      toast({ title: 'Link copied!', description: 'Share it with your friends' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyCode = async () => {
    const success = await copyReferralCode();
    if (success) {
      setCodeCopied(true);
      toast({ title: 'Code copied!', description: referralCode });
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const shareVia = (platform: 'whatsapp' | 'twitter' | 'email' | 'sms') => {
    if (!canInvite) {
      toast({
        title: 'No invites remaining',
        description: 'You have used all 10 of your invitations.',
        variant: 'destructive'
      });
      return;
    }
    shareViaPlatform(platform);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="font-body text-muted-foreground">Loading referral data...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <p className="font-body text-muted-foreground mb-4">
              Every 10 meals they order = 1 free meal for you
            </p>

            {/* Invite Counter */}
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-full ${
              canInvite
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-amber-500/10 border border-amber-500/30'
            }`}>
              <div className="flex items-center gap-1.5">
                {[...Array(MAX_INVITES)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i < invitesUsed
                        ? 'bg-green-500'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className={`font-display text-sm tracking-wider ${
                canInvite ? 'text-green-500' : 'text-amber-500'
              }`}>
                {invitesRemaining}/{MAX_INVITES} INVITES LEFT
              </span>
              {!canInvite && <Lock size={14} className="text-amber-500" />}
            </div>
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
                <p className="font-display text-3xl text-foreground">{referralData.totalReferrals}</p>
                <p className="font-body text-xs text-muted-foreground">Friends Invited</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-display text-3xl text-foreground">{referralData.completedReferrals}</p>
                <p className="font-body text-xs text-muted-foreground">Active Friends</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-display text-3xl text-green-500">{referralData.freeMealsEarned}</p>
                <p className="font-body text-xs text-muted-foreground">Free Meals Earned</p>
              </div>
            </div>
          </div>

          {/* No Invites Warning */}
          {!canInvite && (
            <div className="mb-8 p-4 border border-amber-500/30 rounded-xl bg-amber-500/5 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <p className="font-display text-sm tracking-wider text-amber-500">ALL INVITES USED</p>
                <p className="font-body text-xs text-muted-foreground">
                  You've used all 10 of your friend invitations. Your active referrals will continue earning you free meals.
                </p>
              </div>
            </div>
          )}

          {/* Referral Progress */}
          {referralData.pendingReferrals > 0 && (
            <div className="mb-8 p-6 border border-border/30 rounded-2xl bg-card/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground">PENDING REFERRALS</h3>
                <span className="font-body text-xs text-muted-foreground">
                  {referralData.pendingReferrals} friends waiting to complete first order
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${(referralData.pendingReferrals / referralData.totalReferrals) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-amber-500">
                  {referralData.completedReferrals}/{referralData.totalReferrals} completed
                </span>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Users className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
              <p className="font-display text-2xl text-foreground">{referralData.totalReferrals}</p>
              <p className="font-body text-xs text-muted-foreground">Invited</p>
            </div>
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Utensils className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
              <p className="font-display text-2xl text-foreground">{referralData.completedReferrals}</p>
              <p className="font-body text-xs text-muted-foreground">Active</p>
            </div>
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Gift className="mx-auto h-5 w-5 text-green-500 mb-2" />
              <p className="font-display text-2xl text-green-500">{referralData.freeMealsEarned}</p>
              <p className="font-body text-xs text-muted-foreground">Earned</p>
            </div>
            <div className="p-4 border border-border/30 rounded-xl bg-card/30 text-center">
              <Award className="mx-auto h-5 w-5 text-amber-400 mb-2" />
              <p className="font-display text-2xl text-amber-400">{referralData.freeMealsAvailable}</p>
              <p className="font-body text-xs text-muted-foreground">Available</p>
            </div>
          </div>

          {/* Share Section */}
          <div className={`mb-8 p-6 border rounded-2xl ${
            canInvite
              ? 'border-border/30 bg-card/30'
              : 'border-amber-500/20 bg-amber-500/5'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground">YOUR REFERRAL LINK</h3>
              {!canInvite && (
                <span className="flex items-center gap-1 text-xs text-amber-500">
                  <Lock size={12} /> No invites remaining
                </span>
              )}
            </div>
            <div className="flex gap-2 mb-4">
              <Input
                value={referralLink}
                readOnly
                className="bg-background/50 font-mono text-sm"
                disabled={!canInvite}
              />
              <Button
                onClick={copyLink}
                variant="outline"
                className="shrink-0 px-4"
                disabled={!canInvite}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-sm text-muted-foreground">Your code:</span>
              <button
                onClick={copyCode}
                disabled={!canInvite}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  canInvite
                    ? 'bg-muted/50 hover:bg-muted'
                    : 'bg-muted/20 opacity-50 cursor-not-allowed'
                }`}
              >
                <code className="font-mono text-lg text-foreground tracking-wider">{referralCode}</code>
                {codeCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-muted-foreground" />}
              </button>
              {canInvite && <span className="font-body text-xs text-green-500">$25 off for them</span>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                onClick={() => shareVia('twitter')}
                className="w-full"
                disabled={!canInvite}
              >
                <Twitter size={16} className="mr-2" /> Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => shareVia('whatsapp')}
                className="w-full"
                disabled={!canInvite}
              >
                <MessageCircle size={16} className="mr-2" /> WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => shareVia('email')}
                className="w-full"
                disabled={!canInvite}
              >
                <Mail size={16} className="mr-2" /> Email
              </Button>
              <Button
                variant="outline"
                onClick={() => shareVia('sms')}
                className="w-full"
                disabled={!canInvite}
              >
                <MessageCircle size={16} className="mr-2" /> SMS
              </Button>
            </div>
          </div>

          {/* Referred Friends */}
          <div className="border border-border/30 rounded-2xl bg-card/30 overflow-hidden mb-8">
            <div className="p-4 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-display text-xs tracking-[0.2em] text-muted-foreground">YOUR FRIENDS</h3>
              <span className="font-body text-xs text-muted-foreground">
                {referralData.completedReferrals} active · {referralData.pendingReferrals} pending
              </span>
            </div>
            {referralData.referredFriends.length > 0 ? (
              <div className="divide-y divide-border/20">
                {referralData.referredFriends.map((friend) => {
                  const isActive = friend.status === 'first_order' || friend.status === 'active';
                  const displayName = friend.name || friend.email || 'Anonymous';
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <div key={friend.id} className="p-4 flex items-center justify-between hover:bg-card/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-foreground font-display text-sm ${
                          isActive ? 'bg-green-500/20' : 'bg-muted'
                        }`}>
                          {initial}
                        </div>
                        <div>
                          <p className="font-body text-foreground">{displayName}</p>
                          <p className="font-body text-xs text-muted-foreground">
                            {isActive
                              ? `Active since ${friend.firstOrderAt?.toLocaleDateString()}`
                              : friend.status === 'signed_up'
                                ? 'Signed up · Waiting for first order'
                                : `Invited ${friend.referredAt.toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isActive ? (
                          <span className="px-3 py-1 rounded-full text-xs font-display tracking-wider bg-green-500/20 text-green-500">
                            Active
                          </span>
                        ) : friend.status === 'signed_up' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-display tracking-wider bg-blue-500/20 text-blue-500">
                            Signed Up
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-display tracking-wider bg-yellow-500/20 text-yellow-500">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="font-body text-muted-foreground mb-2">No friends invited yet</p>
                <p className="font-body text-xs text-muted-foreground/70">
                  Share your referral link to start earning free meals!
                </p>
              </div>
            )}
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
