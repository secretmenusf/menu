# AI-Assisted Chat & Email Support System

## 🤖 Overview

SF Secret Menu now features a comprehensive AI-powered chat system that seamlessly integrates with email support, ensuring every customer inquiry reaches the support team at `support@sfsecretmenu.com`.

## 🚀 Features

### AI Chat Assistant
- **Chef Antje AI** - Intelligent ordering assistant powered by Chef Antje's personality
- **Menu recommendations** based on dietary preferences and restrictions  
- **Order building** with direct WhatsApp integration
- **Real-time conversation** with streaming responses
- **Action buttons** for quick navigation and order completion

### Email Integration
- **Automatic support ticket creation** from chat conversations
- **Contact form integration** with professional email templates
- **Chat history export** to support team
- **Multiple fallback methods** (EmailJS + webhook backup)
- **Professional HTML emails** with conversation context

### Seamless Handoff
- **One-click support transfer** from AI chat to human support
- **Context preservation** - full chat history included in emails
- **Contact form integration** for direct support requests
- **Emergency contact options** for urgent issues

## 🔧 Technical Implementation

### Core Components

#### 1. Enhanced Ordering Chat (`EnhancedOrderingChat.tsx`)
- **Multi-view interface**: Chat, Contact Form, Success
- **Real-time AI conversations** with Chef Antje personality
- **Action-driven interactions** with clickable buttons
- **Smart conversation management** with history preservation
- **Responsive design** with mobile optimization

#### 2. Email Service (`emailService.ts`)
- **EmailJS integration** for client-side email sending
- **Webhook fallback** for reliable delivery
- **Professional email templates** with SF Secret Menu branding
- **Support ticket system** with conversation history
- **Multiple sending methods** for high reliability

#### 3. AI Ordering Assistant (`orderingAssistant.ts`)
- **Chef Antje personality** with menu knowledge
- **Context-aware responses** based on current menu
- **Action parsing** for interactive elements
- **Conversation history management**
- **Order completion flow** to WhatsApp

### Email Flow Architecture

```
Customer Chat → AI Assistant → [Need Human Support?] → Email Service → support@sfsecretmenu.com
     ↓                           ↓                         ↓
Contact Form → Form Validation → Email Service → support@sfsecretmenu.com
     ↓                           ↓                         ↓  
Support Page → Contact Form → Email Service → support@sfsecretmenu.com
```

## 📧 Email System Configuration

### EmailJS Setup (Primary Method)
```env
VITE_EMAILJS_SERVICE_ID="service_sfsm2026"
VITE_EMAILJS_TEMPLATE_ID="template_support"  
VITE_EMAILJS_PUBLIC_KEY="user_XXXXXXXXXXXXXXXX"
```

### Webhook Backup (Secondary Method)
```env
VITE_EMAIL_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/XXXXX/XXXXX"
```

### Email Template Structure

#### Support Ticket Email
- **Professional HTML design** with SF Secret Menu branding
- **Customer information** (name, email, subject, source)
- **Full conversation history** with timestamps and roles
- **Technical details** (URL, user agent, timestamp)
- **Reply-to setup** for direct customer responses

#### Email Content Types
1. **Chat Conversations** - Full AI chat export with context
2. **Contact Forms** - Direct customer inquiries
3. **AI Assistance Requests** - When AI needs human intervention
4. **Emergency Support** - Urgent customer issues

## 🎯 User Experience Flow

### AI Chat Experience
1. **Customer clicks Chef Antje** floating button
2. **Welcome message** appears with quick suggestions
3. **AI conversation** helps with menu, ordering, questions
4. **Smart actions** provide quick navigation to menu/order pages
5. **Order completion** via WhatsApp with pre-filled details
6. **Human handoff** available at any time with one click

### Support Request Flow
1. **Customer needs human help** during chat or via support page
2. **Contact form** appears with customer details pre-filled
3. **Conversation history** automatically attached (if from chat)
4. **Email sent** to support@sfsecretmenu.com with full context
5. **Success confirmation** with follow-up expectations
6. **Multiple contact options** for urgent needs

## 🛠️ Configuration Requirements

### Environment Variables
```env
# EmailJS (Primary email method)
VITE_EMAILJS_SERVICE_ID="service_sfsm2026"
VITE_EMAILJS_TEMPLATE_ID="template_support"
VITE_EMAILJS_PUBLIC_KEY="user_XXXXXXXXXXXXXXXX"

# Webhook backup (Optional)
VITE_EMAIL_WEBHOOK_URL="https://your-webhook-url"
```

### EmailJS Template Setup
Create an EmailJS template with these variables:
- `{{to_email}}` - Always support@sfsecretmenu.com
- `{{from_email}}` - hello@sfsecretmenu.com  
- `{{reply_to}}` - Customer's email address
- `{{subject}}` - Support ticket subject
- `{{message}}` - Plain text message
- `{{html_content}}` - Rich HTML content with conversation

### Webhook Alternative
For backup email delivery, set up a webhook that accepts:
```json
{
  "to": "support@sfsecretmenu.com",
  "subject": "[SF Secret Menu Support] ...",
  "html": "...",
  "text": "...",
  "replyTo": "customer@email.com",
  "timestamp": "2026-01-17T07:30:00Z",
  "source": "sfsecretmenu-frontend"
}
```

## 🔍 Support Email Categories

### 1. Chat Conversations
**Subject**: `[SF Secret Menu Support] Chat Conversation - [Reason]`
**Content**: Customer chat history with AI assistant, includes full context

### 2. Contact Form Submissions  
**Subject**: `[SF Secret Menu Support] [Customer Subject]`
**Content**: Direct customer inquiry from support page or chat contact form

### 3. AI Assistance Requests
**Subject**: `[SF Secret Menu Support] AI Assistance Request - [Issue]`  
**Content**: When AI needs human intervention or escalation

### 4. Emergency Support
**Subject**: `[SF Secret Menu Support] URGENT - [Issue]`
**Content**: Critical delivery or food safety issues

## 📱 Mobile Optimization

### Chat Widget
- **Responsive sizing** adapts to mobile screens
- **Touch-friendly** buttons and inputs
- **Optimized scrolling** for conversation history
- **Quick actions** easily accessible on mobile

### Contact Forms
- **Mobile-first design** with proper input spacing
- **Keyboard-friendly** with appropriate input types
- **Progressive enhancement** for better mobile UX

## 🔐 Privacy & Security

### Data Handling
- **Minimal data collection** - only necessary for support
- **Secure transmission** via HTTPS and encrypted email
- **No persistent storage** of conversations client-side
- **GDPR compliance** with clear data usage

### Email Security
- **Reply-to protection** prevents email spoofing
- **Rate limiting** prevents abuse (client-side throttling)
- **Input validation** sanitizes all form inputs
- **Fallback methods** ensure delivery reliability

## 📊 Support Team Benefits

### Comprehensive Context
- **Full conversation history** from AI chat included
- **Customer information** clearly presented
- **Technical details** for debugging
- **Source identification** (chat vs form vs emergency)

### Professional Presentation
- **Branded email templates** with SF Secret Menu styling
- **Structured information** easy to parse and respond to
- **Clear action items** and customer expectations set
- **Reply-to setup** for direct customer communication

### Efficient Workflows
- **Categorized requests** with clear subjects
- **Priority identification** (chat vs emergency)
- **Context preservation** eliminates back-and-forth questions
- **Multiple contact methods** reduce frustration

## 🚀 Future Enhancements

### Planned Features
- **Support ticket tracking** system with unique IDs
- **Auto-response** emails confirming receipt
- **Support team dashboard** for ticket management  
- **AI escalation triggers** for complex queries
- **Customer satisfaction** follow-up emails

### Integration Opportunities
- **CRM integration** for customer history
- **Help desk software** for ticket management
- **Analytics tracking** for support optimization
- **Chatbot learning** from support interactions

The system ensures every customer interaction, whether through AI chat or direct contact, results in proper support ticket creation and timely human response. The seamless integration between AI assistance and human support creates a professional, comprehensive customer service experience.