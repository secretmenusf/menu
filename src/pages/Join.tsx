/**
 * Join Page
 * Email + ZIP capture to start onboarding flow
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, Clock, Bot, ChefHat, Truck, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EmailZipCapture } from '@/components/onboarding/EmailZipCapture';
import { SEOHead, pageSEO } from '@/components/seo/SEOHead';

const Join = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Join SF Secret Menu | Start Your Membership"
        description="Join SF Secret Menu for chef-crafted organic meals delivered weekly. Starting at $29/mo with Chef AI included."
        url="https://secretmenusf.com/join"
      />

      <Header />

      <main className="pt-32 pb-24">
        {/* Back link */}
        <div className="container mx-auto px-6 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>
        </div>

        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Form */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl tracking-[0.08em] text-foreground mb-4">
                JOIN THE
                <span className="block text-mystical">SECRET MENU</span>
              </h1>

              <p className="font-body text-lg text-muted-foreground mb-8">
                Weekly drops curated by Chef Antje. Members get access first.
                When a dish sells out, it's gone.
              </p>

              {/* Email + ZIP Capture */}
              <div className="mb-8">
                <EmailZipCapture variant="modal" />
              </div>

              {/* Already a member */}
              <p className="text-sm text-muted-foreground">
                Already a member?{' '}
                <Link to="/login" className="text-mystical hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Right - Benefits */}
            <div className="bg-card/30 border border-border/30 rounded-xl p-8">
              <h2 className="font-display text-lg tracking-wider mb-6">
                WHAT YOU GET
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-mystical" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm tracking-wider mb-1">WEEKLY DROPS</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      New dishes every week, limited availability
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-mystical" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm tracking-wider mb-1">ORDER AHEAD</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      Order for next week (fresh sourcing, real prep time)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-mystical" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm tracking-wider mb-1">CHEF AI INCLUDED</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      Recipes, swaps, nutrition, meal plans
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-mystical/20 border border-mystical/30 flex items-center justify-center flex-shrink-0">
                    <Truck size={18} className="text-mystical" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm tracking-wider mb-1">SF BAY AREA DELIVERY</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      Order by Friday, delivered next week
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing hint */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm tracking-wider">Starting at</p>
                    <p className="font-display text-2xl text-mystical">$29/mo</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check size={12} className="text-green-500" />
                      Cancel anytime
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check size={12} className="text-green-500" />
                      Chef AI included
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Join;
