/**
 * SF Secret Menu - AI Ordering Chat Component
 *
 * Floating chat widget that provides:
 * - AI-powered menu recommendations
 * - Order building assistance
 * - Questions about service/chef/pricing
 * - WhatsApp order completion
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  ExternalLink,
  ShoppingBag,
  Utensils,
  Image,
  ChefHat,
  Star,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  orderingAssistant,
  parseActions,
  cleanResponse,
  type Message,
  type AssistantAction,
} from '@/services/orderingAssistant';
import { useNavigate } from 'react-router-dom';
import chefAntje from '@/assets/chef-antje.jpg';

const WHATSAPP_NUMBER = '14153732496';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Welcome message from Chef Antje
const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Welcome! I'm Antje, your personal culinary guide. I'd love to help you explore my menu, find dishes that match your taste, or answer any questions about our service. What sounds good to you today?",
  timestamp: new Date(),
};

export function OrderingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const navigate = useNavigate();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle action buttons
  const handleAction = useCallback((action: AssistantAction) => {
    switch (action.type) {
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
      case 'ADD_TO_CART':
      case 'START_ORDER':
        navigate('/entry');
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
      default:
        break;
    }
  }, [navigate]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;

    setShowSuggestions(false);

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStreamingContent('');

    abortControllerRef.current = new AbortController();

    try {
      let fullResponse = '';

      for await (const chunk of orderingAssistant.chat(
        content.trim(),
        abortControllerRef.current.signal
      )) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      const actions = parseActions(fullResponse);
      const cleanedContent = cleanResponse(fullResponse);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: cleanedContent,
        timestamp: new Date(),
        actions: actions.filter(a => a.type !== 'NONE'),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. You can reach us directly on WhatsApp at (415) 373-2496!",
          timestamp: new Date(),
          actions: [{ type: 'CONTACT_WHATSAPP' }],
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
      setStreamingContent('');
      abortControllerRef.current = null;
    }
  }, [isTyping]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Quick suggestions
  const suggestions = orderingAssistant.getQuickSuggestions();

  return (
    <>
      {/* Chat Toggle Button - Chef Antje's photo */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-black/30 hover:scale-110 transition-all duration-200 ring-2 ring-amber-500/50 hover:ring-amber-500"
        >
          <img src={chefAntje} alt="Chat with Chef Antje" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-background border border-border/50 rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header - Chef Antje */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/30">
              <img src={chefAntje} alt="Chef Antje" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-sm tracking-wider text-foreground">CHEF ANTJE</h3>
              <p className="text-xs text-muted-foreground">Your culinary guide</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-amber-500 text-white'
                      : 'bg-muted/50 text-foreground'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actions.map((action, idx) => (
                        <ActionButton
                          key={idx}
                          action={action}
                          onClick={() => handleAction(action)}
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] mt-2 opacity-50">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted/50 text-foreground">
                  <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
                  <span className="inline-block w-2 h-4 ml-1 bg-amber-500 animate-pulse" />
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && !streamingContent && (
              <div className="flex justify-start">
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="px-3 py-1.5 text-xs bg-muted/50 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/30">
            <div className="flex items-end gap-2 bg-muted/30 rounded-xl px-3 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about the menu..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-sm resize-none max-h-20"
                rows={1}
                style={{ minHeight: '24px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 80) + 'px';
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Ready to order?</span>
              <span className="text-green-500 font-medium">WhatsApp us</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// Action Button Component
function ActionButton({
  action,
  onClick,
}: {
  action: AssistantAction;
  onClick: () => void;
}) {
  const config = {
    VIEW_MENU: {
      label: 'View Menu',
      icon: Utensils,
      variant: 'outline' as const,
    },
    VIEW_PLANS: {
      label: 'See Plans',
      icon: ShoppingBag,
      variant: 'outline' as const,
    },
    CONTACT_WHATSAPP: {
      label: 'WhatsApp',
      icon: MessageCircle,
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600 text-white',
    },
    ADD_TO_CART: {
      label: 'Build Order',
      icon: ShoppingBag,
      variant: 'outline' as const,
    },
    START_ORDER: {
      label: 'Start Order',
      icon: ShoppingCart,
      variant: 'default' as const,
      className: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    VIEW_GALLERY: {
      label: 'See Gallery',
      icon: Image,
      variant: 'outline' as const,
    },
    VIEW_CHEF: {
      label: 'Meet the Chef',
      icon: ChefHat,
      variant: 'outline' as const,
    },
    VIEW_REVIEWS: {
      label: 'Read Reviews',
      icon: Star,
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

export default OrderingChat;
