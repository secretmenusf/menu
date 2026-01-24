import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Headphones, 
  HelpCircle, 
  Loader2,
  Bot,
  Send
} from 'lucide-react';

const Support = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await emailService.sendContactForm(
        contactForm.name,
        contactForm.email,
        contactForm.subject,
        contactForm.message
      );

      if (success) {
        toast({
          title: "Message sent successfully!",
          description: "Our support team will get back to you within 24 hours.",
        });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Unable to send message",
        description: "Please try again or email us directly at support@secretmenusf.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiChat = async () => {
    if (!aiQuestion.trim()) return;
    
    setIsAiLoading(true);
    try {
      // Simulate AI response - in production, integrate with your AI service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = {
        "menu": "Our current weekly menu features artisanal dishes made with fresh, local ingredients. Check our Menu page for this week's offerings, or I can help you with specific dietary preferences!",
        "delivery": "We deliver throughout the SF Bay Area weekly. Order by Friday for delivery the following week - fresh sourced, real prep time! Would you like to check if we deliver to your area?",
        "payment": "We accept credit cards (preferred), Zelle, Venmo, CashApp. All payments are secure and processed instantly.",
        "subscription": "Our meal plans range from $89-299/week. Essential (2 meals), Standard (3 meals), or Premium (5 meals). Cancel anytime!",
        "default": "I'd be happy to help! For detailed assistance, I can connect you with our support team at support@secretmenusf.com or you can start a live chat."
      };
      
      const keyword = aiQuestion.toLowerCase().includes('menu') ? 'menu' :
                     aiQuestion.toLowerCase().includes('deliver') ? 'delivery' :
                     aiQuestion.toLowerCase().includes('payment') || aiQuestion.toLowerCase().includes('pay') ? 'payment' :
                     aiQuestion.toLowerCase().includes('subscription') || aiQuestion.toLowerCase().includes('plan') ? 'subscription' :
                     'default';
                     
      setAiResponse(responses[keyword]);
      
      // Auto-send email to support with the question
      await emailService.sendContactForm(
        'AI Chat User',
        'ai-chat@secretmenusf.com',
        `AI Chat Question: ${aiQuestion}`,
        `User asked: "${aiQuestion}"\n\nAI Response: "${responses[keyword]}"\n\nPlease follow up if needed.`
      );
      
    } catch (error) {
      console.error('AI Chat error:', error);
      setAiResponse("I'm having trouble right now. Please contact our support team directly at support@secretmenusf.com");
    } finally {
      setIsAiLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our team',
      action: 'Start Chat',
      href: '#chat',
      primary: true,
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@secretmenusf.com',
      action: 'Send Email',
      href: 'mailto:support@secretmenusf.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: '(415) 373-2496',
      action: 'Call Us',
      href: 'tel:+14153732496',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick messaging support',
      action: 'Message',
      href: 'https://wa.me/14153732496',
    },
  ];

  const faqs = [
    {
      question: 'How does the weekly menu work?',
      answer: 'Each week, our chef creates a new curated menu. View the current offerings on our Menu page and place orders for delivery. The menu refreshes every Monday at midnight with fresh, seasonal selections.',
    },
    {
      question: 'What are your delivery hours?',
      answer: 'We deliver from 10:30am to 3pm daily throughout the San Francisco Bay Area.',
    },
    {
      question: 'Do you accommodate dietary restrictions?',
      answer: 'Yes! Each menu item is clearly labeled for vegetarian (🌿) and gluten-free (✧) options. For severe allergies or specific dietary needs, contact us directly before ordering.',
    },
    {
      question: 'How do subscriptions work?',
      answer: 'Subscribe to access Chef Antje\'s weekly menus. Access ($29/mo) unlocks the menu, ordering, and Chef AI. Plus ($79/mo) includes a meal credit. Solo Dev ($399/mo) is for power users with $350 in credits. Hacker House ($999/mo) is for teams with $900 in credits. SF Bay Area delivery. Cancel or pause anytime.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, Zelle, Venmo, CashApp, and crypto wallets. Card payments are processed securely through Square for the best experience.',
    },
    {
      question: 'Can I modify or cancel my order?',
      answer: 'Orders can be modified or cancelled up to 2 hours before scheduled delivery. Contact support or manage orders through your account dashboard.',
    },
    {
      question: 'What is your refund policy?',
      answer: 'Not satisfied? Contact us within 24 hours of delivery for a full refund or credit. Refunds typically process within 3-5 business days to your original payment method.',
    },
    {
      question: 'How do I track my delivery?',
      answer: 'You\'ll receive real-time updates via SMS and email once your order is confirmed. Our delivery team will contact you 15-30 minutes before arrival.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card/30 border border-border/30 mb-6">
              <Headphones className="w-8 h-8 text-mystical" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-mystical mb-4">
              SUPPORT CENTER
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help with any questions about your orders or subscription
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <Card 
                key={index} 
                className={`relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] border-border/30 bg-card/20 backdrop-blur-sm ${
                  method.primary ? 'ring-2 ring-mystical/30 bg-card/40' : ''
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors ${
                    method.primary 
                      ? 'bg-mystical/20 text-mystical' 
                      : 'bg-card/50 text-muted-foreground group-hover:text-foreground'
                  }`}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg tracking-[0.1em] text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {method.description}
                  </p>
                  <Button
                    asChild
                    variant={method.primary ? 'default' : 'outline'}
                    size="sm"
                    className="w-full font-display tracking-wider"
                  >
                    <a href={method.href}>
                      {method.action}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="font-display text-2xl tracking-[0.15em] text-foreground mb-4">
                  SEND MESSAGE
                </h2>
                <p className="font-body text-muted-foreground">
                  Can't find what you're looking for? Drop us a message and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card className="border-border/30 bg-card/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                          NAME
                        </label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Your name"
                          required
                          className="bg-transparent border-border/50 focus:border-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                          EMAIL
                        </label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                          className="bg-transparent border-border/50 focus:border-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                        SUBJECT
                      </label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="What's this about?"
                        required
                        className="bg-transparent border-border/50 focus:border-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                        MESSAGE
                      </label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        required
                        rows={5}
                        className="bg-transparent border-border/50 focus:border-foreground resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full font-display tracking-wider h-12"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          SENDING...
                        </>
                      ) : (
                        'SEND MESSAGE'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Quick Info & Hours */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="font-display text-2xl tracking-[0.15em] text-foreground mb-4">
                  QUICK INFO
                </h2>
                <p className="font-body text-muted-foreground">
                  Essential information at a glance
                </p>
              </div>

              <div className="space-y-6">
                {/* Hours */}
                <Card className="border-border/30 bg-card/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-mystical" />
                      <h3 className="font-display text-lg tracking-[0.1em] text-foreground">
                        SUPPORT HOURS
                      </h3>
                    </div>
                    <div className="space-y-2 font-body text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="text-foreground">9AM - 9PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday - Sunday</span>
                        <span className="text-foreground">10AM - 6PM PST</span>
                      </div>
                      <div className="pt-2 border-t border-border/30">
                        <span className="text-xs">Response time: Within 24 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Area */}
                <Card className="border-border/30 bg-card/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-mystical" />
                      <h3 className="font-display text-lg tracking-[0.1em] text-foreground">
                        DELIVERY AREA
                      </h3>
                    </div>
                    <div className="space-y-2 font-body text-sm text-muted-foreground">
                      <p>San Francisco Bay Area</p>
                      <p>Order by Friday for next week</p>
                      <div className="pt-2 border-t border-border/30 text-xs">
                        <span>Free delivery on orders over $75</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency */}
                <Card className="border-border/30 bg-card/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <HelpCircle className="w-5 h-5 text-mystical" />
                      <h3 className="font-display text-lg tracking-[0.1em] text-foreground">
                        URGENT ISSUES
                      </h3>
                    </div>
                    <div className="space-y-3 font-body text-sm text-muted-foreground">
                      <p>For delivery emergencies or food safety concerns:</p>
                      <Button 
                        asChild 
                        size="sm" 
                        className="w-full font-display tracking-wider"
                      >
                        <a href="tel:+14153732496">
                          CALL (415) 373-2496
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* AI Chat Assistant Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card/30 border border-border/30 mb-6">
                <Bot className="w-8 h-8 text-mystical" />
              </div>
              <h2 className="font-display text-3xl tracking-[0.2em] text-foreground mb-4">
                AI SUPPORT ASSISTANT
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                Get instant answers to your questions with our AI-powered assistant
              </p>
            </div>

            <Card className="max-w-2xl mx-auto border-border/30 bg-card/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-[0.1em] text-foreground flex items-center gap-3">
                  <Bot className="w-6 h-6 text-mystical" />
                  Ask Chef's AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                      YOUR QUESTION
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder="Ask about menu, delivery, payments..."
                        className="bg-transparent border-border/50 focus:border-foreground"
                        onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                      />
                      <Button 
                        onClick={handleAiChat}
                        disabled={isAiLoading || !aiQuestion.trim()}
                        size="lg"
                        className="font-display tracking-wider shrink-0"
                      >
                        {isAiLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Question Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {['Menu this week?', 'Delivery times?', 'Payment options?', 'Subscription plans?'].map((question) => (
                      <Button
                        key={question}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAiQuestion(question);
                          setAiResponse('');
                        }}
                        className="font-display text-xs tracking-wider border border-border/30 hover:bg-card/50"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>

                  {/* AI Response */}
                  {aiResponse && (
                    <Card className="border-mystical/30 bg-mystical/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mystical/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-mystical" />
                          </div>
                          <div className="flex-1">
                            <p className="font-body text-foreground leading-relaxed">
                              {aiResponse}
                            </p>
                            <div className="mt-3 pt-3 border-t border-border/30">
                              <p className="font-display text-xs tracking-wider text-muted-foreground">
                                💌 This conversation has been sent to our support team for follow-up
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="text-center text-xs text-muted-foreground font-body">
                    AI responses are sent to our support team at support@secretmenusf.com for quality assurance
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl tracking-[0.2em] text-foreground mb-4">
                FREQUENTLY ASKED
              </h2>
              <p className="font-body text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="border border-border/30 rounded-lg bg-card/20 backdrop-blur-sm px-6 data-[state=open]:bg-card/40"
                  >
                    <AccordionTrigger className="font-display text-sm tracking-[0.1em] text-foreground hover:text-mystical transition-colors py-6 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center">
            <Card className="border-border/30 bg-card/20 backdrop-blur-sm">
              <CardContent className="p-12">
                <h3 className="font-display text-2xl tracking-[0.15em] text-foreground mb-4">
                  STILL NEED HELP?
                </h3>
                <p className="font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Our support team is standing by to provide personalized assistance with your order.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="font-display tracking-wider">
                    <a href="mailto:support@secretmenusf.com">
                      <Mail className="mr-2 h-5 w-5" />
                      EMAIL CONCIERGE
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="font-display tracking-wider">
                    <a href="https://wa.me/14153732496">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WHATSAPP CHAT
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
