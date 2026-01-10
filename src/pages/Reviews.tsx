import { Star, Twitter, Instagram, Facebook, Linkedin, Quote, ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { reviews } from '@/data/reviews';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/ShareButton';

// Platform icons mapping
const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

// Platform colors for accent
const platformColors = {
  twitter: 'text-sky-400',
  instagram: 'text-pink-400',
  facebook: 'text-blue-500',
  linkedin: 'text-blue-400',
};

// Calculate stats
const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
const totalReviews = reviews.length;
const fiveStarCount = reviews.filter(r => r.rating === 5).length;

const Reviews = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span className="font-body text-sm">Back to Home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
              REVIEWS
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              What our community says about their Secret Menu experience
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="font-display text-4xl text-foreground">{averageRating.toFixed(1)}</span>
                  <Star size={24} className="fill-foreground text-foreground" />
                </div>
                <p className="font-body text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-foreground mb-2">{totalReviews}</div>
                <p className="font-body text-sm text-muted-foreground">Total Reviews</p>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-foreground mb-2">{Math.round((fiveStarCount / totalReviews) * 100)}%</div>
                <p className="font-body text-sm text-muted-foreground">5-Star Reviews</p>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews.map((review) => {
              const PlatformIcon = review.platform ? platformIcons[review.platform] : null;
              const platformColor = review.platform ? platformColors[review.platform] : '';

              return (
                <div
                  key={review.id}
                  className="group p-6 border border-border/30 rounded-2xl bg-card/30 hover:border-border/50 hover:bg-card/50 transition-all duration-300"
                >
                  {/* Quote icon */}
                  <Quote size={24} className="text-muted-foreground/20 mb-4" />

                  {/* Review text */}
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    "{review.text}"
                  </p>

                  {/* Meals ordered */}
                  {review.mealsOrdered && review.mealsOrdered.length > 0 && (
                    <div className="mb-4">
                      <p className="font-display text-[10px] tracking-[0.15em] text-muted-foreground/60 uppercase mb-2">Ordered</p>
                      <div className="flex flex-wrap gap-1.5">
                        {review.mealsOrdered.map((meal, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs font-body text-muted-foreground bg-muted/50 rounded-full"
                          >
                            {meal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-foreground text-foreground' : 'text-muted-foreground/30'}
                      />
                    ))}
                  </div>

                  {/* Author info */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-display text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display text-sm tracking-wider text-foreground">{review.name}</p>
                        <p className="text-xs text-muted-foreground/60">
                          {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Social link */}
                      {review.socialUrl && PlatformIcon && (
                        <a
                          href={review.socialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1.5 text-xs ${platformColor} hover:opacity-80 transition-opacity`}
                        >
                          <PlatformIcon size={16} />
                          <span className="hidden sm:inline">{review.socialHandle}</span>
                        </a>
                      )}
                      {/* Share button */}
                      <ShareButton
                        title={`Review from ${review.name}`}
                        text={`"${review.text.substring(0, 100)}${review.text.length > 100 ? '...' : ''}" - ${review.name} on SF Secret Menu`}
                        url={`https://sfsecretmenu.com/reviews#${review.id}`}
                        hashtags={['SFSecretMenu', 'FoodDelivery', 'SanFrancisco']}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social proof section */}
          <div className="text-center py-12 border-t border-border/30">
            <h2 className="font-display text-2xl tracking-[0.2em] text-foreground mb-4">
              JOIN OUR COMMUNITY
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Follow us on social media for behind-the-scenes content, weekly menu previews, and more
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://instagram.com/sfsecretmenu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-muted-foreground hover:text-pink-400 hover:border-pink-400/50 transition-colors"
              >
                <Instagram size={18} />
                <span className="font-display text-xs tracking-wider">INSTAGRAM</span>
              </a>
              <a
                href="https://x.com/sfsecretmenu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-muted-foreground hover:text-sky-400 hover:border-sky-400/50 transition-colors"
              >
                <Twitter size={18} />
                <span className="font-display text-xs tracking-wider">X / TWITTER</span>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-12">
            <p className="font-body text-muted-foreground mb-6">
              Ready to experience it yourself?
            </p>
            <Link to="/entry">
              <Button size="lg" className="px-12 font-display tracking-wider">
                START YOUR JOURNEY
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;
