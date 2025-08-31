import { ProviderV2, LanguageModelV2, EmbeddingModelV2, ImageModelV2 } from '@ai-sdk/provider';
import { LexaLanguageModel } from './lexa-language-model';
import { LexaProviderConfig, LexaProviderSettings } from './types';

export class LexaProvider implements ProviderV2 {
  private config: LexaProviderConfig;
  private settings: LexaProviderSettings;

  constructor(config: LexaProviderConfig, settings: LexaProviderSettings = {}) {
    this.config = config;
    this.settings = settings;
  }

  languageModel(modelId: string): LanguageModelV2 {
    return new LexaLanguageModel(modelId, this.settings, this.config);
  }

  textEmbeddingModel(modelId: string): EmbeddingModelV2<string> {
    throw new Error('Text embedding models are not yet supported by LexaProvider');
  }

  imageModel(modelId: string): ImageModelV2 {
    throw new Error('Image models are not yet supported by LexaProvider');
  }
}

// Factory function for easier instantiation
export function createLexaProvider(
  config: LexaProviderConfig,
  settings?: LexaProviderSettings,
): LexaProvider {
  return new LexaProvider(config, settings);
}

// Predefined model configurations
export const LEXA_MODELS = {
  'lexa-mml': {
    name: 'Lexa MML',
    description: 'Lexa MML - Multimodal model with vision capabilities',
    contextWindow: 8192,
    maxTokens: 4096,
  },
  'lexa-x1': {
    name: 'Lexa X1',
    description: 'Lexa X1 - Fast, lightweight text-based model',
    contextWindow: 4096,
    maxTokens: 2048,
  },
  'lexa-rho': {
    name: 'Lexa Rho',
    description: 'Lexa Rho - Reasoning model with enhanced capabilities',
    contextWindow: 16384,
    maxTokens: 8192,
  },
} as const;

export type LexaModelId = keyof typeof LEXA_MODELS;
