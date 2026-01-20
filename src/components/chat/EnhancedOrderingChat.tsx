/**
 * Enhanced Ordering Chat with AI and Email Support
 * 
 * Features:
 * - AI-powered chat conversations
 * - Seamless handoff to human support via email
 * - Contact form integration
 * - Chat history export to support team
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  User,
  Mail,
  Phone,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  orderingAssistant,
  parseActions,
  cleanResponse,
  type AssistantAction,
} from '@/services/orderingAssistant';
import { emailService } from '@/services/emailService';
import { useNavigate } from 'react-router-dom';
import chefAntje from '@/assets/chef-antje.jpg';

const WHATSAPP_NUMBER = '14153732496';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: AssistantAction[];
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function EnhancedOrderingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'contact' | 'success'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: generateId(),
          role: 'assistant',
          content: "Hi! I'm Chef Antje's AI assistant. I can help you explore our menu, answer questions, or connect you with our support team. What can I help you with today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Handle AI chat message
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await orderingAssistant.sendMessage(inputMessage.trim());
      const actions = parseActions(response.content);
      const cleanedContent = cleanResponse(response.content);

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: cleanedContent,
        timestamp: new Date(),
        actions,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-execute certain actions
      if (actions.some(a => a.type === 'SEND_ORDER')) {
        const sendOrderAction = actions.find(a => a.type === 'SEND_ORDER') as { type: 'SEND_ORDER'; orderItems: string };
        if (sendOrderAction) {
          handleAction(sendOrderAction);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'system',
        content: "I'm having trouble connecting right now. Would you like me to send your question to our support team instead?",
        timestamp: new Date(),
        actions: [{ type: 'CONTACT_SUPPORT' }],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [inputMessage, isLoading]);

  // Handle action buttons
  const handleAction = useCallback((action: AssistantAction | { type: 'CONTACT_SUPPORT' | 'SEND_CHAT_TO_SUPPORT' }) => {
    switch (action.type) {
      case 'SEND_ORDER':
        if ('orderItems' in action) {
          const orderMessage = encodeURIComponent(
            `Hi Chef Antje! I'd like to order:\n\n${action.orderItems}\n\nPlease let me know the total and delivery details!`
          );
          window.open(`${WHATSAPP_URL}?text=${orderMessage}`, '_blank');
        }
        break;
      case 'VIEW_MENU':
        navigate('/menu');
        setIsOpen(false);
        break;
      case 'VIEW_PLANS':
        navigate('/pricing');
        setIsOpen(false);
        break;
      case 'CONTACT_WHATSAPP':
        window.open(WHATSAPP_URL, '_blank');
        break;
      case 'START_ORDER':
        navigate('/order');
        setIsOpen(false);
        break;
      case 'VIEW_GALLERY':
        navigate('/');
        setIsOpen(false);
        setTimeout(() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }), 100);
        break;
      case 'VIEW_CHEF':
        navigate('/chef');
        setIsOpen(false);
        break;
      case 'VIEW_REVIEWS':
        navigate('/reviews');
        setIsOpen(false);
        break;
      case 'CONTACT_SUPPORT':
        setCurrentView('contact');
        break;
      case 'SEND_CHAT_TO_SUPPORT':
        handleSendChatToSupport();
        break;
      default:
        break;
    }
  }, [navigate]);

  // Send chat conversation to support
  const handleSendChatToSupport = async () => {
    const customerEmail = user?.email || contactForm.email || 'anonymous@sfsecretmenu.com';
    const customerName = user?.user_metadata?.name || contactForm.name || 'Anonymous';
    
    const conversation = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));

    setIsSubmittingContact(true);
    try {
      const success = await emailService.sendChatConversation(
        customerEmail,
        customerName,
        conversation,
        'Customer requested human support'
      );

      if (success) {
        setCurrentView('success');
        toast({
          title: 'Conversation sent to support',
          description: 'Our team will review your chat and get back to you within 24 hours.',
        });
      } else {
        throw new Error('Failed to send conversation');
      }
    } catch (error) {
      console.error('Failed to send chat to support:', error);
      toast({
        title: 'Unable to send conversation',
        description: 'Please try the contact form instead.',
        variant: 'destructive',
      });
      setCurrentView('contact');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      const success = await emailService.sendContactForm(
        contactForm.name,
        contactForm.email,
        contactForm.subject,
        contactForm.message
      );

      if (success) {
        setCurrentView('success');
        toast({
          title: 'Message sent successfully',
          description: 'Our support team will get back to you within 24 hours.',
        });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: 'Unable to send message',
        description: 'Please try again or contact us directly at support@sfsecretmenu.com',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Quick action suggestions
  const quickSuggestions = [
    "What's on this week's menu?",
    "I'm vegetarian, what do you recommend?",
    "Tell me about subscription plans",
    "Help me place an order",
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-black/30 hover:scale-110 transition-all duration-200 ring-2 ring-mystical/50 hover:ring-mystical"
        >
          <img src={chefAntje} alt="Chat with Chef Antje" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[650px] max-h-[calc(100vh-100px)] bg-background border border-border/50 rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-gradient-to-r from-mystical/10 to-mystical/5">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-mystical/30">
              <img src={chefAntje} alt="Chef Antje" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-sm tracking-wider text-foreground">
                {currentView === 'chat' ? 'AI ASSISTANT' : 'SUPPORT'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {currentView === 'chat' ? 'Powered by Chef Antje' : 'Human support team'}
              </p>
            </div>
            <div className="flex gap-2">
              {currentView !== 'chat' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCurrentView('chat')}
                  className="p-2"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Chat View */}
          {currentView === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role !== 'user' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-foreground/10">
                        {message.role === 'assistant' ? (
                          <img src={chefAntje} alt="Chef Antje" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-mystical text-background ml-auto'
                          : message.role === 'system'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-muted/80 text-foreground'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.actions.map((action, idx) => (
                            <ActionButton
                              key={idx}
                              action={action}
                              onClick={() => handleAction(action)}
                            />
                          ))}
                          {message.role === 'system' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction({ type: 'CONTACT_SUPPORT' })}
                              className="h-7 text-xs"
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Contact Support
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-foreground/10">
                      <img src={chefAntje} alt="Chef Antje" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-muted/80 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputMessage(suggestion)}
                        className="text-xs bg-muted/50 hover:bg-muted px-2 py-1 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-border/30 p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="bg-transparent border-border/50 focus:border-mystical"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="sm"
                    className="px-3"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction({ type: 'SEND_CHAT_TO_SUPPORT' })}
                    className="text-xs h-6 px-2"
                    disabled={isSubmittingContact}
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Send to Support
                  </Button>
                  <div className="flex gap-2">
                    <a
                      href={`tel:+1${WHATSAPP_NUMBER}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="w-3 h-3 inline mr-1" />
                      Call
                    </a>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-500 hover:text-green-400 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 inline mr-1" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contact Form View */}
          {currentView === 'contact' && (
            <form onSubmit={handleContactSubmit} className="flex-1 flex flex-col p-4">
              <div className="space-y-4 flex-1">
                <div className="text-center mb-4">
                  <Mail className="w-8 h-8 text-mystical mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Send a message to our support team
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-display tracking-wider text-muted-foreground">
                      NAME
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="bg-transparent border-border/50 focus:border-mystical"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-display tracking-wider text-muted-foreground">
                      EMAIL
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="bg-transparent border-border/50 focus:border-mystical"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-display tracking-wider text-muted-foreground">
                    SUBJECT
                  </label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="What's this about?"
                    required
                    className="bg-transparent border-border/50 focus:border-mystical"
                  />
                </div>

                <div className="space-y-1 flex-1">
                  <label className="text-xs font-display tracking-wider text-muted-foreground">
                    MESSAGE
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can we help you?"
                    required
                    rows={4}
                    className="bg-transparent border-border/50 focus:border-mystical resize-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmittingContact}
                className="w-full mt-4"
              >
                {isSubmittingContact ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Success View */}
          {currentView === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="font-display text-lg tracking-wider text-foreground mb-2">
                MESSAGE SENT
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our support team will get back to you within 24 hours at the email you provided.
              </p>
              <div className="space-y-2 w-full">
                <Button
                  onClick={() => {
                    setCurrentView('chat');
                    setMessages([]);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Start New Chat
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Need urgent help?</p>
                <a href={`tel:+1${WHATSAPP_NUMBER}`} className="text-foreground hover:text-mystical">
                  Call (415) 373-2496
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Action Button Component (same as before but with new action type)
function ActionButton({
  action,
  onClick,
}: {
  action: AssistantAction;
  onClick: () => void;
}) {
  const config = {
    SEND_ORDER: {
      label: 'Send Order',
      icon: MessageCircle,
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600 text-white',
    },
    VIEW_MENU: {
      label: 'View Menu',
      icon: ExternalLink,
      variant: 'outline' as const,
    },
    VIEW_PLANS: {
      label: 'See Plans',
      icon: ExternalLink,
      variant: 'outline' as const,
    },
    CONTACT_WHATSAPP: {
      label: 'WhatsApp',
      icon: MessageCircle,
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600 text-white',
    },
    ADD_TO_CART: {
      label: 'Add to Cart',
      icon: ExternalLink,
      variant: 'outline' as const,
    },
    START_ORDER: {
      label: 'Start Order',
      icon: ExternalLink,
      variant: 'default' as const,
      className: 'bg-mystical hover:bg-mystical/90 text-background',
    },
    VIEW_GALLERY: {
      label: 'Gallery',
      icon: ExternalLink,
      variant: 'outline' as const,
    },
    VIEW_CHEF: {
      label: 'Meet Chef',
      icon: ExternalLink,
      variant: 'outline' as const,
    },
    VIEW_REVIEWS: {
      label: 'Reviews',
      icon: ExternalLink,
      variant: 'outline' as const,
    },
  };

  const c = config[action.type as keyof typeof config];
  if (!c) return null;

  const Icon = c.icon;

  return (
    <Button
      size="sm"
      variant={c.variant}
      onClick={onClick}
      className={cn('h-7 text-xs gap-1.5', c.className)}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </Button>
  );
}

export default EnhancedOrderingChat;