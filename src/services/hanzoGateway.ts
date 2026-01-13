/**
 * Hanzo AI Gateway Service for SF Secret Menu
 *
 * Provides AI chat capabilities for:
 * - Menu recommendations
 * - Order assistance
 * - Answering questions about the service
 * - Guiding users to complete orders
 */

// Types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

// Gateway URLs to try in order (production first)
const GATEWAY_URLS = [
  'https://gateway.hanzo.ai',
  'http://localhost:3001',
  'http://localhost:9550',
];

class HanzoGatewayService {
  private activeUrl: string | null = null;

  /**
   * Find a working gateway URL
   */
  private async findWorkingGateway(): Promise<string | null> {
    if (this.activeUrl) {
      try {
        const response = await fetch(`${this.activeUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) return this.activeUrl;
      } catch {
        this.activeUrl = null;
      }
    }

    for (const url of GATEWAY_URLS) {
      try {
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
          this.activeUrl = url;
          console.log(`Hanzo Gateway connected: ${url}`);
          return url;
        }
      } catch {
        // Try next URL
      }
    }

    return null;
  }

  /**
   * Check if gateway is available
   */
  async isAvailable(): Promise<boolean> {
    const url = await this.findWorkingGateway();
    return url !== null;
  }

  /**
   * Send a streaming chat completion request
   */
  async *chatCompletionStream(
    request: ChatCompletionRequest,
    signal?: AbortSignal
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const baseUrl = await this.findWorkingGateway();
    if (!baseUrl) {
      throw new Error('No Hanzo Gateway available');
    }

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Gateway error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;

          try {
            const chunk: StreamChunk = JSON.parse(data);
            yield chunk;
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  /**
   * Streaming chat helper
   */
  async *chatStream(
    userMessage: string,
    options?: {
      model?: string;
      systemPrompt?: string;
      conversationHistory?: ChatMessage[];
      temperature?: number;
      maxTokens?: number;
      signal?: AbortSignal;
    }
  ): AsyncGenerator<string, void, unknown> {
    const messages: ChatMessage[] = [];

    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    if (options?.conversationHistory) {
      messages.push(...options.conversationHistory);
    }

    messages.push({ role: 'user', content: userMessage });

    for await (const chunk of this.chatCompletionStream(
      {
        model: options?.model || 'llama3.3-70b-instruct',
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        stream: true,
      },
      options?.signal
    )) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  /**
   * Non-streaming chat
   */
  async chat(
    userMessage: string,
    options?: {
      model?: string;
      systemPrompt?: string;
      conversationHistory?: ChatMessage[];
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    const baseUrl = await this.findWorkingGateway();
    if (!baseUrl) {
      throw new Error('No Hanzo Gateway available');
    }

    const messages: ChatMessage[] = [];

    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    if (options?.conversationHistory) {
      messages.push(...options.conversationHistory);
    }

    messages.push({ role: 'user', content: userMessage });

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options?.model || 'llama3.3-70b-instruct',
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Gateway error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}

// Export singleton instance
export const hanzoGateway = new HanzoGatewayService();
