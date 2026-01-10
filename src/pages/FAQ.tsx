import { useState } from 'react';
import { Search, ChevronDown, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    category: 'ORDERING',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Navigate to our Order page, select your meals for the week, choose your delivery preferences, and complete payment via crypto or fiat. You can also reach out via WhatsApp for personalized ordering.',
      },
      {
        q: 'What is the minimum order?',
        a: 'Our minimum order is $900, which typically covers a week of premium chef-crafted meals for a household.',
      },
      {
        q: 'Can I customize my meals?',
        a: 'Absolutely. Contact us via WhatsApp to discuss dietary restrictions, allergies, or specific preferences. Our chef creates each menu with intention and can adapt to your needs.',
      },
      {
        q: 'How far in advance should I order?',
        a: 'We recommend placing orders at least 48 hours before your desired delivery. For large events or special requests, please contact us 1 week in advance.',
      },
    ],
  },
  {
    category: 'DELIVERY',
    questions: [
      {
        q: 'What areas do you serve?',
        a: 'We deliver throughout the San Francisco Bay Area, including SF, Oakland, Berkeley, Marin County, and the Peninsula. Contact us for areas further afield.',
      },
      {
        q: 'What are your delivery hours?',
        a: 'Delivery is available daily from 8am to 1am. Select your preferred time window during checkout.',
      },
      {
        q: 'Is there a delivery fee?',
        a: 'Delivery is complimentary for orders within San Francisco. A small fee applies for outlying areas, calculated at checkout based on your zip code.',
      },
      {
        q: 'How is the food packaged?',
        a: 'All meals arrive in eco-friendly, insulated containers that maintain optimal temperature. Reheating instructions are included with each dish.',
      },
    ],
  },
  {
    category: 'PAYMENT',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept cryptocurrency (ETH, USDC, USDT on Base and Ethereum), Zelle (pay@sfsecretmenu.com), Venmo (@sfsecretmenu), and CashApp ($sfsecretmenu).',
      },
      {
        q: 'Is gratuity included?',
        a: 'Yes, a 20% gratuity is included in all orders to ensure our team is well compensated for their craft.',
      },
      {
        q: 'Can I get a refund?',
        a: 'We offer refunds for undelivered orders or quality issues. Contact us within 24 hours of delivery. See our Refund Policy for details.',
      },
    ],
  },
  {
    category: 'SUBSCRIPTIONS',
    questions: [
      {
        q: 'What subscription plans are available?',
        a: 'We offer Essential ($395/mo, 3 meals/week), Standard ($595/mo, 5 meals/week), and Premium ($895/mo, 7 meals/week with priority access).',
      },
      {
        q: 'Can I pause or cancel my subscription?',
        a: 'Yes, you can pause or cancel anytime from your account. Changes take effect for the following week.',
      },
      {
        q: 'Do subscribers get priority access?',
        a: 'Premium subscribers receive priority booking for special events and first access to limited edition menus.',
      },
    ],
  },
  {
    category: 'THE EXPERIENCE',
    questions: [
      {
        q: 'What makes Secret Menu different?',
        a: 'Every meal is crafted with intention by our culinary artist, Antje. We source organic, seasonal ingredients and treat cooking as a sacred practice of nourishment.',
      },
      {
        q: 'Do you cater events?',
        a: 'Yes, we offer private dining experiences and event catering. Contact us via WhatsApp to discuss your vision.',
      },
      {
        q: 'Can I meet the chef?',
        a: 'Premium subscribers and select events offer opportunities to dine with Antje and experience the ritual of her kitchen.',
      },
    ],
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-foreground text-3xl mb-4 block">?</span>
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
              SACRED KNOWLEDGE
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Answers to the mysteries most frequently sought
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-16">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search the archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-card/50 border-border/50 focus:border-foreground/50"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {filteredCategories.map((category) => (
              <div key={category.category}>
                <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-4">
                  <span>{category.category}</span>
                  <div className="flex-1 h-px bg-border/30" />
                </h2>

                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`${category.category}-${idx}`}
                      className="border border-border/30 rounded-lg bg-card/30 px-6"
                    >
                      <AccordionTrigger className="font-body text-left hover:no-underline py-5">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-muted-foreground pb-5">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-muted-foreground">
                No answers found for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-20 text-center border-t border-border/30 pt-16">
            <h3 className="font-display text-xl tracking-[0.15em] text-foreground mb-4">
              STILL SEEKING?
            </h3>
            <p className="font-body text-muted-foreground mb-8">
              Some questions require a more personal touch
            </p>
            <a
              href="https://wa.me/14153732496"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-display text-xs tracking-[0.2em] text-foreground border border-border px-8 py-4 rounded-full hover:bg-foreground/10 transition-all"
            >
              <MessageCircle size={16} />
              SPEAK WITH US
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
