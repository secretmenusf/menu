import { useState } from 'react';
import { Calendar as CalendarIcon, Mail, Printer, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { deliveryOptions, giftMessages } from '@/data/giftCards';

interface GiftFormProps {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  deliveryMethod: string;
  scheduledDate?: Date;
  onRecipientNameChange: (value: string) => void;
  onRecipientEmailChange: (value: string) => void;
  onSenderNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onDeliveryMethodChange: (value: string) => void;
  onScheduledDateChange: (value: Date | undefined) => void;
  showDeliveryOptions?: boolean;
}

const GiftForm = ({
  recipientName,
  recipientEmail,
  senderName,
  message,
  deliveryMethod,
  scheduledDate,
  onRecipientNameChange,
  onRecipientEmailChange,
  onSenderNameChange,
  onMessageChange,
  onDeliveryMethodChange,
  onScheduledDateChange,
  showDeliveryOptions = true,
}: GiftFormProps) => {
  const [showMessageSuggestions, setShowMessageSuggestions] = useState(false);

  const getDeliveryIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return <Mail size={18} />;
      case 'calendar':
        return <Clock size={18} />;
      case 'printer':
        return <Printer size={18} />;
      default:
        return <Mail size={18} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Recipient Details */}
      <div className="space-y-4">
        <h3 className="font-display text-sm tracking-[0.2em] text-foreground">
          RECIPIENT DETAILS
        </h3>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipientName" className="font-display text-xs tracking-wider text-muted-foreground">
              Recipient Name
            </Label>
            <Input
              id="recipientName"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="Enter recipient's name"
              className="bg-card/30 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientEmail" className="font-display text-xs tracking-wider text-muted-foreground">
              Recipient Email
            </Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => onRecipientEmailChange(e.target.value)}
              placeholder="Enter recipient's email"
              className="bg-card/30 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Sender Details */}
      <div className="space-y-4">
        <h3 className="font-display text-sm tracking-[0.2em] text-foreground">
          YOUR DETAILS
        </h3>

        <div className="space-y-2">
          <Label htmlFor="senderName" className="font-display text-xs tracking-wider text-muted-foreground">
            Your Name
          </Label>
          <Input
            id="senderName"
            value={senderName}
            onChange={(e) => onSenderNameChange(e.target.value)}
            placeholder="Enter your name"
            className="bg-card/30 border-border/50"
          />
        </div>
      </div>

      {/* Personal Message */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm tracking-[0.2em] text-foreground">
            PERSONAL MESSAGE
          </h3>
          <button
            type="button"
            onClick={() => setShowMessageSuggestions(!showMessageSuggestions)}
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showMessageSuggestions ? 'Hide suggestions' : 'Need inspiration?'}
          </button>
        </div>

        {showMessageSuggestions && (
          <div className="flex flex-wrap gap-2 mb-2">
            {giftMessages.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onMessageChange(suggestion)}
                className="px-3 py-1.5 text-xs font-body text-muted-foreground bg-card/50 border border-border/30 rounded-full hover:border-foreground/30 hover:text-foreground transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message" className="font-display text-xs tracking-wider text-muted-foreground">
            Message (optional)
          </Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Add a personal message..."
            maxLength={200}
            rows={3}
            className="flex w-full rounded-lg border border-input bg-card/30 px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-shadow duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
          />
          <p className="text-xs text-muted-foreground/60 text-right">
            {message.length}/200 characters
          </p>
        </div>
      </div>

      {/* Delivery Options */}
      {showDeliveryOptions && (
        <div className="space-y-4">
          <h3 className="font-display text-sm tracking-[0.2em] text-foreground">
            DELIVERY METHOD
          </h3>

          <div className="grid gap-3">
            {deliveryOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onDeliveryMethodChange(option.id)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border transition-all text-left',
                  deliveryMethod === option.id
                    ? 'border-foreground/50 bg-card/50'
                    : 'border-border/30 bg-card/20 hover:border-border/50'
                )}
              >
                <div className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border',
                  deliveryMethod === option.id
                    ? 'border-foreground/50 text-foreground'
                    : 'border-border/50 text-muted-foreground'
                )}>
                  {getDeliveryIcon(option.icon)}
                </div>
                <div>
                  <p className="font-display text-xs tracking-[0.15em] text-foreground">
                    {option.label.toUpperCase()}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Schedule Date Picker */}
          {deliveryMethod === 'email-scheduled' && (
            <div className="pt-4">
              <Label className="font-display text-xs tracking-wider text-muted-foreground block mb-2">
                Delivery Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-body bg-card/30 border-border/50 rounded-lg',
                      !scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : 'Select a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={onScheduledDateChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GiftForm;
