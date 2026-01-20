import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeedOfLife3D from '@/components/SeedOfLife3D';
import { Button } from '@/components/ui/button';
import { Gift, Share2, Copy, Check, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';

const Invite = () => {
  const [copied, setCopied] = useState(false);
  const [inviteCode] = useState(() => {
    // Generate a random invite code or retrieve from user's profile
    return 'SM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  });

  const inviteUrl = `https://secretmenusf.com/invite?ref=${inviteCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}&bgcolor=0a0a0a&color=fafafa`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Secret Menu - Premium Organic Meals',
          text: 'Try Secret Menu! Get a free sample - just pay for delivery.',
          url: inviteUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <SeedOfLife3D size={64} />
            </div>
            <h1 className="font-display font-semibold text-4xl md:text-5xl tracking-[0.15em] mb-6">
              SHARE THE SECRET
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-xl mx-auto">
              Give your friends a free sample meal. They just pay for delivery + tip.
            </p>
          </div>

          {/* QR Code Section */}
          <section className="mb-16">
            <div className="p-12 border border-border rounded-3xl bg-card/30 text-center">
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Gift className="w-4 h-4 text-emerald-500" />
                <span className="font-display text-xs tracking-wider text-emerald-500">FREE SAMPLE FOR FRIENDS</span>
              </div>

              {/* QR Code */}
              <div className="mb-8">
                <div className="inline-block p-6 bg-foreground rounded-2xl">
                  <img
                    src={qrCodeUrl}
                    alt="Invite QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              <p className="font-display text-sm tracking-wider text-muted-foreground mb-2">YOUR INVITE CODE</p>
              <p className="font-display text-3xl tracking-[0.2em] text-foreground mb-8">{inviteCode}</p>

              {/* Invite URL */}
              <div className="flex items-center gap-2 justify-center mb-8">
                <div className="px-4 py-3 bg-background/50 border border-border rounded-xl font-body text-sm text-muted-foreground max-w-md truncate">
                  {inviteUrl}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              {/* Share Button */}
              <Button
                size="lg"
                className="font-display tracking-wider"
                onClick={shareInvite}
              >
                <Share2 className="w-4 h-4 mr-2" />
                SHARE INVITE
              </Button>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-8 text-center">HOW IT WORKS</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-2xl bg-card/30 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="font-display text-lg">1</span>
                </div>
                <h3 className="font-display text-sm tracking-wider mb-2">SHARE YOUR CODE</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Send your unique QR code or link to friends and family.
                </p>
              </div>
              <div className="p-6 border border-border rounded-2xl bg-card/30 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="font-display text-lg">2</span>
                </div>
                <h3 className="font-display text-sm tracking-wider mb-2">THEY TRY A MEAL</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Your friend gets a free sample meal. They only pay for delivery.
                </p>
              </div>
              <div className="p-6 border border-border rounded-2xl bg-card/30 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="font-display text-lg">3</span>
                </div>
                <h3 className="font-display text-sm tracking-wider mb-2">YOU EARN REWARDS</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Earn 1 free meal for every 10 meals your referrals order.
                </p>
              </div>
            </div>
          </section>

          {/* Rewards Info */}
          <section className="text-center p-12 border border-border rounded-3xl bg-card/30">
            <h2 className="font-display text-2xl tracking-[0.1em] mb-4">REFERRAL REWARDS</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              The more you share, the more you earn. Track your referrals and rewards in your account.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="p-4 border border-border rounded-xl">
                <p className="font-display text-2xl text-foreground mb-1">10</p>
                <p className="font-body text-xs text-muted-foreground">Meals = 1 Free</p>
              </div>
              <div className="p-4 border border-border rounded-xl">
                <p className="font-display text-2xl text-foreground mb-1">50</p>
                <p className="font-body text-xs text-muted-foreground">Meals = VIP</p>
              </div>
              <div className="p-4 border border-border rounded-xl">
                <p className="font-display text-2xl text-emerald-500 mb-1">∞</p>
                <p className="font-body text-xs text-muted-foreground">No Limits</p>
              </div>
            </div>
            <Button variant="outline" size="lg" className="font-display tracking-wider" asChild>
              <a href="/referrals">VIEW MY REFERRALS</a>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Invite;
