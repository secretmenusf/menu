/**
 * Email Service for SF Secret Menu
 * 
 * Handles email sending through various providers:
 * - EmailJS for client-side sending
 * - Backup webhooks for critical communications
 * - Support ticket creation
 */

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface SupportTicketData {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: 'chat' | 'form' | 'whatsapp' | 'phone';
  userAgent?: string;
  url?: string;
  userId?: string;
  conversationHistory?: Array<{role: 'user' | 'assistant'; content: string; timestamp: Date}>;
}

class EmailService {
  private readonly SUPPORT_EMAIL = 'support@sfsecretmenu.com';
  private readonly FROM_EMAIL = 'hello@sfsecretmenu.com';
  
  // EmailJS configuration - should be in environment variables
  private readonly EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_sfsm2026';
  private readonly EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_support';
  private readonly EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  /**
   * Initialize EmailJS if available
   */
  async initializeEmailJS() {
    if (typeof window === 'undefined' || !this.EMAILJS_PUBLIC_KEY) {
      console.warn('EmailJS not configured - falling back to webhook method');
      return false;
    }

    try {
      const emailjs = await import('@emailjs/browser');
      emailjs.init(this.EMAILJS_PUBLIC_KEY);
      return true;
    } catch (error) {
      console.warn('EmailJS not available - falling back to webhook method');
      return false;
    }
  }

  /**
   * Send support ticket email
   */
  async sendSupportTicket(ticketData: SupportTicketData): Promise<boolean> {
    const emailData: EmailData = {
      to: this.SUPPORT_EMAIL,
      subject: `[SF Secret Menu Support] ${ticketData.subject}`,
      html: this.generateSupportEmailHTML(ticketData),
      text: this.generateSupportEmailText(ticketData),
      replyTo: ticketData.email,
      from: this.FROM_EMAIL,
    };

    return this.sendEmail(emailData);
  }

  /**
   * Send chat conversation to support
   */
  async sendChatConversation(
    customerEmail: string,
    customerName: string,
    conversation: Array<{role: 'user' | 'assistant'; content: string; timestamp: Date}>,
    reason: string = 'Chat assistance needed'
  ): Promise<boolean> {
    const ticketData: SupportTicketData = {
      name: customerName,
      email: customerEmail,
      subject: `Chat Conversation - ${reason}`,
      message: `Customer requested human support during chat conversation.`,
      source: 'chat',
      conversationHistory: conversation,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    return this.sendSupportTicket(ticketData);
  }

  /**
   * Send AI assistance request
   */
  async sendAIAssistanceRequest(
    issue: string,
    context: string,
    userEmail?: string,
    userName?: string
  ): Promise<boolean> {
    const ticketData: SupportTicketData = {
      name: userName || 'Anonymous',
      email: userEmail || 'no-email@sfsecretmenu.com',
      subject: `AI Assistance Request - ${issue}`,
      message: `AI assistant needs human support:\n\nIssue: ${issue}\n\nContext: ${context}`,
      source: 'chat',
      url: window.location.href,
    };

    return this.sendSupportTicket(ticketData);
  }

  /**
   * Core email sending method
   */
  private async sendEmail(emailData: EmailData): Promise<boolean> {
    // Try EmailJS first
    if (await this.sendViaEmailJS(emailData)) {
      return true;
    }

    // Fallback to webhook
    return this.sendViaWebhook(emailData);
  }

  /**
   * Send via EmailJS (client-side)
   */
  private async sendViaEmailJS(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.EMAILJS_PUBLIC_KEY) return false;

      const emailjs = await import('@emailjs/browser');
      
      const templateParams = {
        to_email: emailData.to,
        from_email: emailData.from || this.FROM_EMAIL,
        reply_to: emailData.replyTo || emailData.from || this.FROM_EMAIL,
        subject: emailData.subject,
        message: emailData.text || this.stripHTML(emailData.html),
        html_content: emailData.html,
      };

      const response = await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent via EmailJS:', response);
      return response.status === 200;
    } catch (error) {
      console.warn('EmailJS sending failed:', error);
      return false;
    }
  }

  /**
   * Send via webhook (fallback method)
   */
  private async sendViaWebhook(emailData: EmailData): Promise<boolean> {
    try {
      const webhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;
      if (!webhookUrl) {
        console.warn('No email webhook configured');
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...emailData,
          timestamp: new Date().toISOString(),
          source: 'sfsecretmenu-frontend',
        }),
      });

      console.log('Email sent via webhook:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Webhook sending failed:', error);
      return false;
    }
  }

  /**
   * Generate HTML email for support tickets
   */
  private generateSupportEmailHTML(ticketData: SupportTicketData): string {
    const conversationHTML = ticketData.conversationHistory
      ? `
        <h3>Conversation History:</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
          ${ticketData.conversationHistory.map(msg => `
            <div style="margin-bottom: 15px; padding: 10px; background: ${msg.role === 'user' ? '#e3f2fd' : '#f3e5f5'}; border-radius: 5px;">
              <strong>${msg.role === 'user' ? '👤 Customer' : '🤖 AI Assistant'}:</strong> 
              <span style="float: right; font-size: 12px; color: #666;">
                ${msg.timestamp.toLocaleString()}
              </span><br>
              <div style="margin-top: 5px;">${msg.content.replace(/\n/g, '<br>')}</div>
            </div>
          `).join('')}
        </div>
      `
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SF Secret Menu - Support Ticket</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; max-width: 600px; margin: 0 auto; }
          .info-box { background: #f9f9f9; border-left: 4px solid #d4af37; padding: 15px; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>🍽️ SF SECRET MENU - Support Ticket</h2>
          <p>New ${ticketData.source} inquiry received</p>
        </div>
        
        <div class="content">
          <div class="info-box">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${ticketData.name}</p>
            <p><strong>Email:</strong> ${ticketData.email}</p>
            <p><strong>Subject:</strong> ${ticketData.subject}</p>
            <p><strong>Source:</strong> ${ticketData.source.toUpperCase()}</p>
            ${ticketData.url ? `<p><strong>Page:</strong> ${ticketData.url}</p>` : ''}
            ${ticketData.userId ? `<p><strong>User ID:</strong> ${ticketData.userId}</p>` : ''}
          </div>

          <h3>Message:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${ticketData.message.replace(/\n/g, '<br>')}
          </div>

          ${conversationHTML}

          ${ticketData.userAgent ? `
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; font-size: 12px; color: #666;">
              <strong>Technical Info:</strong><br>
              User Agent: ${ticketData.userAgent}<br>
              Timestamp: ${new Date().toISOString()}
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>SF Secret Menu Support System • support@sfsecretmenu.com</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate plain text email for support tickets
   */
  private generateSupportEmailText(ticketData: SupportTicketData): string {
    let text = `SF SECRET MENU - Support Ticket\n\n`;
    text += `Customer: ${ticketData.name} (${ticketData.email})\n`;
    text += `Subject: ${ticketData.subject}\n`;
    text += `Source: ${ticketData.source.toUpperCase()}\n`;
    if (ticketData.url) text += `Page: ${ticketData.url}\n`;
    text += `\nMessage:\n${ticketData.message}\n`;

    if (ticketData.conversationHistory) {
      text += `\n--- CONVERSATION HISTORY ---\n`;
      ticketData.conversationHistory.forEach(msg => {
        text += `\n[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}\n`;
      });
    }

    return text;
  }

  /**
   * Strip HTML tags from content
   */
  private stripHTML(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Quick method for contact form submissions
   */
  async sendContactForm(
    name: string,
    email: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    const ticketData: SupportTicketData = {
      name,
      email,
      subject,
      message,
      source: 'form',
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    return this.sendSupportTicket(ticketData);
  }
}

// Export singleton instance
export const emailService = new EmailService();
export { EmailService };
export type { SupportTicketData, EmailData };