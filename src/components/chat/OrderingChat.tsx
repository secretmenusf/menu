/**
 * SF Secret Menu - AI Ordering Chat Component
 *
 * Floating chat widget that provides:
 * - AI-powered menu recommendations
 * - Order building assistance
 * - Questions about service/chef/pricing
 * - WhatsApp order completion
 */

import { useState, useCallback } from 'react';
import {
  MessageCircle,
  X,
  ExternalLink,
  ShoppingBag,
  Utensils,
  ChefHat,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type AssistantAction,
} from '@/services/orderingAssistant';
import { useNavigate } from 'react-router-dom';
import chefAntje from '@/assets/chef-antje.jpg';

const WHATSAPP_NUMBER = '14153732496';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const AI_WELCOME =
  "Welcome! I'm Antje, your AI culinary guide. Explore the menu, start an order, or reach me directly on WhatsApp.";

export function OrderingChat() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // Handle action buttons
  const handleAction = useCallback((action: AssistantAction) => {
    switch (action.type) {
      case 'SEND_ORDER':
        // Open WhatsApp with pre-filled order message
        if (action.orderItems) {
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
      case 'ADD_TO_CART':
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
      default:
        break;
    }
  }, [navigate]);

  const quickActions: AssistantAction[] = [
    { type: 'VIEW_MENU' },
    { type: 'START_ORDER' },
    { type: 'CONTACT_WHATSAPP' },
    { type: 'VIEW_CHEF' },
  ];

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

          {/* AI Concierge */}
          <div className="flex-1 p-4 space-y-4">
            <div className="bg-muted/50 rounded-2xl px-4 py-3 text-foreground">
              <p className="text-sm whitespace-pre-wrap">{AI_WELCOME}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, idx) => (
                <ActionButton
                  key={idx}
                  action={action}
                  onClick={() => handleAction(action)}
                />
              ))}
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
    SEND_ORDER: {
      label: 'Complete Order',
      icon: MessageCircle,
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600 text-white',
    },
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
      icon: MessageCircle,
      variant: 'outline' as const,
    },
    VIEW_CHEF: {
      label: 'Meet the Chef',
      icon: ChefHat,
      variant: 'outline' as const,
    },
    VIEW_REVIEWS: {
      label: 'Read Reviews',
      icon: MessageCircle,
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
