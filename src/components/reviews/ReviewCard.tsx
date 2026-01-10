import { Star, Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';
import type { Review } from '@/data/reviews';

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const PlatformIcon = review.platform ? platformIcons[review.platform] : null;

  return (
    <div className="flex-shrink-0 w-[320px] md:w-auto p-6 border border-border/30 rounded-lg bg-card/30 hover:border-border/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-display text-sm">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-display text-sm tracking-wider text-foreground">{review.name}</p>
            {review.socialHandle && (
              <a
                href={review.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {PlatformIcon && <PlatformIcon size={12} />}
                {review.socialHandle}
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? 'fill-foreground text-foreground' : 'text-muted-foreground/30'}
            />
          ))}
        </div>
      </div>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
        "{review.text}"
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground/60">
        <span>{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        {PlatformIcon && (
          <div className="flex items-center gap-1">
            <PlatformIcon size={12} />
            <span className="capitalize">{review.platform}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
