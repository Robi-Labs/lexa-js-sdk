import {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2Content,
  LanguageModelV2FinishReason,
  LanguageModelV2Prompt,
  LanguageModelV2StreamPart,
  LanguageModelV2Usage,
  LanguageModelV2CallWarning,
} from '@ai-sdk/provider';
import {
  APICallError,
  TooManyRequestsError,
} from '@ai-sdk/provider-utils';
import {
  LexaProviderConfig,
  LexaProviderSettings,
  LexaMessage,
  LexaResponse,
  LexaStreamChunk,
  LexaTool,
} from './types';

export class LexaLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = 'v2';
  readonly provider = 'lexa';

  constructor(
    private readonly modelId: string,
    private readonly settings: LexaProviderSettings,
    private readonly config: LexaProviderConfig,
  ) {}

  get providerMetadata() {
    return {
      lexa: {
        model: this.modelId,
        baseURL: this.config.baseURL || 'https://www.lexa.chat/api',
      },
    };
  }

  async doGenerate(options: LanguageModelV2CallOptions): Promise<{
    content: LanguageModelV2Content[];
    finishReason: LanguageModelV2FinishReason;
    usage: LanguageModelV2Usage;
    providerMetadata?: Record<string, Record<string, unknown>>;
    warnings: LanguageModelV2CallWarning[];
  }> {
    const { args, warnings } = this.getArgs(options);

    try {
      // Make API call
      const response = await fetch(`${this.config.baseURL || 'https://www.lexa.chat/api'}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(args),
        signal: options.abortSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json() as LexaResponse;

      // Convert provider response to AI SDK format
      const content: LanguageModelV2Content[] = [];

      // Extract text content
      if (responseData.choices[0].message.content) {
        const messageContent = responseData.choices[0].message.content;
        if (typeof messageContent === 'string') {
          content.push({
            type: 'text',
            text: messageContent,
          });
        } else if (Array.isArray(messageContent)) {
          for (const part of messageContent) {
            if (part.type === 'text' && part.text) {
              content.push({
                type: 'text',
                text: part.text,
              });
            } else if (part.type === 'tool_call' && part.tool_call) {
              content.push({
                type: 'tool-call',
                toolCallId: part.tool_call.id,
                toolName: part.tool_call.function.name,
                input: part.tool_call.function.arguments,
              });
            }
          }
        }
      }

      return {
        content,
        finishReason: this.mapFinishReason(responseData.choices[0].finish_reason),
        usage: {
          inputTokens: responseData.usage?.prompt_tokens,
          outputTokens: responseData.usage?.completion_tokens,
          totalTokens: responseData.usage?.total_tokens,
        },
        warnings,
      } as any; // Type assertion to bypass complex type compatibility
    } catch (error) {
      this.handleError(error);
    }
  }

  async doStream(options: LanguageModelV2CallOptions): Promise<{
    stream: ReadableStream<LanguageModelV2StreamPart>;
  }> {
    const { args, warnings } = this.getArgs(options);

    try {
      // Create streaming request
      const response = await fetch(`${this.config.baseURL || 'https://www.lexa.chat/api'}/chat/completions`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...args, stream: true }),
        signal: options.abortSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Transform stream to AI SDK format
      const stream = response
        .body!
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(this.createParser())
        .pipeThrough(this.createTransformer(warnings));

      return { stream };
    } catch (error) {
      this.handleError(error);
    }
  }

  // Convert AI SDK messages to provider format
  private convertToProviderMessages(prompt: LanguageModelV2Prompt): LexaMessage[] {
    return prompt.map((message) => {
      switch (message.role) {
        case 'system':
          return { 
            role: 'system', 
            content: message.content 
          };

        case 'user':
          return {
            role: 'user',
            content: message.content.map((part) => {
              if (part.type === 'text') {
                return { type: 'text', text: part.text };
              } else if (part.type === 'file') {
                return { type: 'image_url', image_url: { url: part.data } };
              } else {
                throw new Error(`Unsupported part type: ${(part as any).type}`);
              }
            }),
          };

        case 'assistant':
          return {
            role: 'assistant',
            content: message.content.map((part) => {
              if (part.type === 'text') {
                return { type: 'text', text: part.text };
              } else if (part.type === 'tool-call') {
                return {
                  type: 'tool_call',
                  tool_call: {
                    id: part.toolCallId,
                    function: {
                      name: part.toolName,
                      arguments: part.input,
                    },
                  },
                };
              } else {
                throw new Error(`Unsupported part type: ${(part as any).type}`);
              }
            }),
          };

        default:
          throw new Error(`Unsupported message role: ${(message as any).role}`);
      }
    });
  }

  private getArgs(options: LanguageModelV2CallOptions): {
    args: any;
    warnings: LanguageModelV2CallWarning[];
  } {
    const warnings: LanguageModelV2CallWarning[] = [];

    // Convert prompt to provider format
    const messages = this.convertToProviderMessages(options.prompt);

    // Prepare tools if provided
    const tools = options.tools ? this.prepareTools(options.tools) : undefined;

    const args = {
      model: this.modelId,
      messages,
      temperature: options.temperature ?? this.settings.temperature ?? 0.7,
      max_tokens: options.maxOutputTokens ?? this.settings.maxOutputTokens ?? 1000,
      stream: false,
      tools,
      tool_choice: options.toolChoice,
    };

    return { args, warnings };
  }

  private prepareTools(tools: any[]): LexaTool[] {
    return tools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...this.config.headers,
    };
  }

  private mapFinishReason(reason: string): LanguageModelV2FinishReason {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'tool_calls':
        return 'tool-calls';
      default:
        return 'unknown';
    }
  }

  private createParser(): TransformStream<string, LexaStreamChunk> {
    return new TransformStream({
      transform(chunk, controller) {
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              controller.enqueue({ type: 'finish' });
            } else {
              try {
                const parsed = JSON.parse(data);
                controller.enqueue(parsed);
              } catch (error) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      },
    });
  }

  private createTransformer(warnings: LanguageModelV2CallWarning[]): TransformStream<LexaStreamChunk, LanguageModelV2StreamPart> {
    return new TransformStream({
      transform(chunk, controller) {
        if (chunk.type === 'finish') {
          controller.enqueue({
            type: 'finish',
            usage: chunk.usage,
            warnings,
          });
        } else if (chunk.choices?.[0]?.delta?.content) {
          controller.enqueue({
            type: 'text-delta',
            delta: chunk.choices[0].delta.content,
          });
        }
      },
    });
  }

  private handleError(error: any): never {
    if (error instanceof Response) {
      if (error.status === 429) {
        const retryAfter = error.headers.get('retry-after');
        throw new TooManyRequestsError({
          message: 'Rate limited by Lexa API',
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
        });
      }

      throw new APICallError({
        message: `Lexa API error: ${error.status} ${error.statusText}`,
        statusCode: error.status,
        responseHeaders: Object.fromEntries(error.headers.entries()),
        responseBody: error.body,
        cause: error,
      });
    }

    if (error instanceof APICallError || error instanceof TooManyRequestsError) {
      throw error;
    }

    throw new APICallError({
      message: `Unexpected error: ${error.message}`,
      cause: error,
    });
  }
}
