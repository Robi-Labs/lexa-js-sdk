export interface LexaProviderConfig {
  /**
   * The base URL for the Lexa API
   */
  baseURL?: string;
  
  /**
   * API key for authentication
   */
  apiKey: string;
  
  /**
   * Provider name for identification
   */
  provider: string;
  
  /**
   * Default headers to include in requests
   */
  headers?: Record<string, string>;
}

export interface LexaProviderSettings {
  /**
   * Default temperature for text generation
   */
  temperature?: number;
  
  /**
   * Default maximum output tokens
   */
  maxOutputTokens?: number;
  
  /**
   * Default stop sequences
   */
  stopSequences?: string[];
  
  /**
   * Whether to enable streaming by default
   */
  enableStreaming?: boolean;
}

export interface LexaMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | LexaMessageContent[];
}

export interface LexaMessageContent {
  type: 'text' | 'image_url' | 'tool_call' | 'tool_result';
  text?: string;
  image_url?: {
    url: string;
  };
  tool_call?: {
    id: string;
    function: {
      name: string;
      arguments: string;
    };
  };
  tool_result?: {
    tool_call_id: string;
    content: string;
  };
}

export interface LexaTool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
}

export interface LexaRequest {
  model: string;
  messages: LexaMessage[];
  temperature?: number;
  max_tokens?: number;
  stop?: string[];
  tools?: LexaTool[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  stream?: boolean;
}

export interface LexaResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: LexaMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface LexaStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: Partial<LexaMessage>;
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
