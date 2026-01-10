import { useState, useEffect } from 'react';
import { Copy, Check, Share2, MessageCircle, Mail, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReferralLinkProps {
  referralCode: string;
  referralLink: string;
  onCopyLink: () => Promise<boolean>;
  onCopyCode: () => Promise<boolean>;
  onShare: (platform: 'whatsapp' | 'twitter' | 'email' | 'sms') => void;
}

// Simple QR code component using a public API
function QRCodeDisplay({ value }: { value: string }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}&bgcolor=0d0d0d&color=ffffff`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-white rounded-lg">
        <img
          src={qrUrl}
          alt="Referral QR Code"
          className="w-48 h-48"
          style={{ filter: 'invert(1)' }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Scan to sign up with your referral
      </p>
    </div>
  );
}

export function ReferralLink({
  referralCode,
  referralLink,
  onCopyLink,
  onCopyCode,
  onShare,
}: ReferralLinkProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = async () => {
    const success = await onCopyLink();
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = async () => {
    const success = await onCopyCode();
    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // X (Twitter) icon
  const XIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-display text-sm tracking-[0.2em] text-muted-foreground">
          YOUR REFERRAL CODE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Code Display */}
        <div className="text-center">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl" />
              <button
                onClick={handleCopyCode}
                className="relative px-8 py-4 bg-background border border-primary/30 rounded-lg hover:border-primary/50 transition-colors group"
              >
                <span className="font-display text-2xl tracking-[0.3em] text-foreground group-hover:text-primary transition-colors">
                  {referralCode}
                </span>
                <span className="absolute -top-2 -right-2 p-1 bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedCode ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  )}
                </span>
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {copiedCode ? 'Copied!' : 'Click to copy your code'}
          </p>
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
            SHARE LINK
          </label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-muted/50 border-border text-sm font-mono"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copiedLink ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copiedLink ? 'Copied!' : 'Copy link'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <label className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">
            QUICK SHARE
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('whatsapp')}
              className="flex-1 min-w-[100px] gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="font-display text-[10px] tracking-[0.1em]">
                WHATSAPP
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('twitter')}
              className="flex-1 min-w-[100px] gap-2"
            >
              <XIcon />
              <span className="font-display text-[10px] tracking-[0.1em]">
                POST
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('email')}
              className="flex-1 min-w-[100px] gap-2"
            >
              <Mail className="h-4 w-4" />
              <span className="font-display text-[10px] tracking-[0.1em]">
                EMAIL
              </span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[100px] gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  <span className="font-display text-[10px] tracking-[0.1em]">
                    QR CODE
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-sm tracking-[0.2em] text-center">
                    SCAN TO JOIN
                  </DialogTitle>
                </DialogHeader>
                <QRCodeDisplay value={referralLink} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReferralLink;
