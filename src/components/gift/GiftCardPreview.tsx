import { Sparkles } from 'lucide-react';
import SeedOfLife3D from '@/components/SeedOfLife3D';

interface GiftCardPreviewProps {
  amount: number;
  recipientName: string;
  senderName: string;
  message: string;
}

const GiftCardPreview = ({
  amount,
  recipientName,
  senderName,
  message,
}: GiftCardPreviewProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Card container with mystical glow */}
      <div className="relative aspect-[1.6/1] rounded-2xl overflow-hidden bg-gradient-to-br from-card via-background to-card border border-border/50 shadow-[0_0_60px_rgba(255,255,255,0.08)]">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-foreground/20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-foreground/20" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-foreground/20" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-foreground/20" />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }} />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <SeedOfLife3D size={32} />
              <div>
                <span className="font-display text-[10px] tracking-[0.3em] text-foreground/80 block">
                  SECRET MENU
                </span>
                <span className="font-display text-[8px] tracking-[0.2em] text-muted-foreground">
                  SAN FRANCISCO
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground block">
                GIFT CARD
              </span>
              <Sparkles size={14} className="text-foreground/60 ml-auto mt-1" />
            </div>
          </div>

          {/* Amount */}
          <div className="text-center">
            <span className="font-display text-4xl md:text-5xl tracking-wider text-mystical">
              ${amount}
            </span>
          </div>

          {/* Footer */}
          <div className="space-y-2">
            {recipientName && (
              <div className="text-center">
                <span className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                  FOR
                </span>
                <p className="font-body text-lg text-foreground mt-1 truncate">
                  {recipientName}
                </p>
              </div>
            )}
            {message && (
              <p className="font-body text-xs text-muted-foreground text-center italic line-clamp-2">
                "{message}"
              </p>
            )}
            {senderName && (
              <p className="font-body text-[10px] text-muted-foreground/60 text-center">
                From {senderName}
              </p>
            )}
          </div>
        </div>

        {/* Holographic shimmer effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-foreground/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Reflection effect */}
      <div className="h-8 bg-gradient-to-b from-foreground/5 to-transparent rounded-b-2xl transform scale-y-[-1] opacity-30" />
    </div>
  );
};

export default GiftCardPreview;
