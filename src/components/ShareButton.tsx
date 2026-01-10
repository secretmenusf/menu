import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Mail, MessageCircle, Facebook, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const ShareButton = ({
  title,
  text,
  url,
  hashtags = ['SFSecretMenu'],
  variant = 'outline',
  size = 'sm',
  className = '',
}: ShareButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const hashtagString = hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');

  // Check if native share is available
  const canNativeShare = typeof navigator !== 'undefined' && navigator.share;

  const shareNative = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch (err) {
      // User cancelled or error
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: 'Link copied!', description: 'Share it with your friends' });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (platform: string) => {
    const fullText = `${text} ${hashtagString}`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
      sms: `sms:?body=${encodeURIComponent(`${text} ${url}`)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 size={16} className={size !== 'icon' ? 'mr-2' : ''} />
          {size !== 'icon' && 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canNativeShare && (
          <>
            <DropdownMenuItem onClick={shareNative} className="cursor-pointer">
              <Share2 size={16} className="mr-2" />
              Share...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => shareVia('twitter')} className="cursor-pointer">
          <Twitter size={16} className="mr-2" />
          Twitter / X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareVia('facebook')} className="cursor-pointer">
          <Facebook size={16} className="mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareVia('whatsapp')} className="cursor-pointer">
          <MessageCircle size={16} className="mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareVia('telegram')} className="cursor-pointer">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareVia('sms')} className="cursor-pointer">
          <MessageCircle size={16} className="mr-2" />
          SMS
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareVia('email')} className="cursor-pointer">
          <Mail size={16} className="mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
          {copied ? <Check size={16} className="mr-2" /> : <Link2 size={16} className="mr-2" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
