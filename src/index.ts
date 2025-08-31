// Main exports
export { LexaProvider, createLexaProvider, LEXA_MODELS } from './lexa-provider';
export { LexaLanguageModel } from './lexa-language-model';

// Type exports
export type {
  LexaProviderConfig,
  LexaProviderSettings,
  LexaMessage,
  LexaMessageContent,
  LexaTool,
  LexaRequest,
  LexaResponse,
  LexaStreamChunk,
} from './types';

// Re-export AI SDK types for convenience
export type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2Content,
  LanguageModelV2Prompt,
  LanguageModelV2StreamPart,
} from '@ai-sdk/provider';

// OpenAI-like interface
import { createLexaProvider } from './lexa-provider';
import type { LexaProviderConfig, LexaProviderSettings } from './types';

class Lexa {
  private provider: any;
  private config: LexaProviderConfig;

  constructor(apiKey: string, config: Partial<LexaProviderConfig> = {}) {
    this.config = {
      apiKey,
      provider: 'lexa',
      baseURL: 'https://www.lexa.chat/api',
      ...config,
    };
    this.provider = createLexaProvider(this.config);
  }

  // OpenAI-like chat completion
  async chat(options: {
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }) {
               const model = this.provider.languageModel(options.model || 'lexa-mml');
    
    // Convert OpenAI format to AI SDK format
    const prompt = options.messages.map(msg => ({
      role: msg.role,
      content: [{ type: 'text' as const, text: msg.content }]
    }));

    if (options.stream) {
      const { stream } = await model.doStream({
        prompt,
        temperature: options.temperature,
        maxOutputTokens: options.max_tokens,
      });
      return { stream };
    } else {
      const result = await model.doGenerate({
        prompt,
        temperature: options.temperature,
        maxOutputTokens: options.max_tokens,
      });
      
      // Convert back to OpenAI-like format
      return {
        choices: [{
          message: {
            role: 'assistant',
            content: result.content.find((c: any) => c.type === 'text')?.text || '',
          },
          finish_reason: result.finishReason,
        }],
        usage: result.usage,
      };
    }
  }

  // OpenAI-like models list
  async models() {
    return {
      data: [
                       {
                 id: 'lexa-mml',
                 object: 'model',
                 created: Date.now(),
                 owned_by: 'lexa',
               },
               {
                 id: 'lexa-x1',
                 object: 'model',
                 created: Date.now(),
                 owned_by: 'lexa',
               },
               {
                 id: 'lexa-rho',
                 object: 'model',
                 created: Date.now(),
                 owned_by: 'lexa',
               },
               {
                 id: 'linkedin-post-writer',
                 object: 'model',
                 created: Date.now(),
                 owned_by: 'lexa',
               },
      ],
    };
  }
}

// Default export for OpenAI-like usage
export default Lexa;

// Named exports for advanced usage
export { Lexa };
