import { reviews } from '@/data/reviews';
import { ReviewCard } from './ReviewCard';

export const ReviewsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-mystical mb-4">
            WHAT THEY'RE SAYING
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Hear from our community of culinary enthusiasts
          </p>
        </div>
        <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
