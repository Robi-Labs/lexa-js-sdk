# Lexa AI SDK

[![npm version](https://img.shields.io/npm/v/@robilabs/lexa.svg)](https://www.npmjs.com/package/@robilabs/lexa)
[![npm downloads](https://img.shields.io/npm/dm/@robilabs/lexa.svg)](https://www.npmjs.com/package/@robilabs/lexa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

OpenAI-style SDK for Lexa AI - Simple, powerful, and easy to use.

## 🚀 Quick Start

### Installation

```bash
npm install @robilabs/lexa@latest
```

### Basic Usage

```javascript
import Lexa from '@robilabs/lexa';

const lexa = new Lexa('your-api-key');

const completion = await lexa.chat({
  messages: [
    { role: 'user', content: 'Hello! How are you?' }
  ],
  model: 'lexa-mml',
  temperature: 0.7,
  max_tokens: 100
});

console.log(completion.choices[0].message.content);
```

## 📖 Features

- **OpenAI-style API** - Familiar interface, easy migration
- **Real Lexa Models** - Access to lexa-mml, lexa-x1, lexa-rho
- **TypeScript Support** - Full type definitions included
- **Streaming Support** - Real-time text generation
- **Multimodal Capabilities** - Vision and text processing
- **Simple Setup** - Just install and start using

## 🎯 Available Models

The SDK provides access to the following Lexa models:

- **`lexa-mml`**: Multimodal model with vision capabilities (8192 context window)
- **`lexa-x1`**: Fast, lightweight text-based model (4096 context window)
- **`lexa-rho`**: Reasoning model with enhanced capabilities (16384 context window)

## 📚 Usage Examples

### Basic Chat Completion

```javascript
import Lexa from '@robilabs/lexa';

const lexa = new Lexa('your-api-key');

const completion = await lexa.chat({
  messages: [
    { role: 'user', content: 'Hello! Can you tell me a joke?' }
  ],
  model: 'lexa-mml',
  temperature: 0.7,
  max_tokens: 100
});

console.log(completion.choices[0].message.content);
```

### Conversation with System Message

```javascript
const completion = await lexa.chat({
  messages: [
    { 
      role: 'system', 
      content: 'You are a helpful assistant that speaks like a pirate.' 
    },
    { 
      role: 'user', 
      content: 'What is the weather like today?' 
    }
  ],
  model: 'lexa-x1',
  temperature: 0.9
});
```

### Streaming Response

```javascript
const completion = await lexa.chat({
  messages: [
    { role: 'user', content: 'Write a short story.' }
  ],
  model: 'lexa-rho',
  stream: true
});

// Handle streaming response
for await (const chunk of completion.stream) {
  console.log(chunk);
}
```

### List Available Models

```javascript
const models = await lexa.models();
console.log(models.data);
// Output: [
//   { id: 'lexa-mml', object: 'model', owned_by: 'lexa' },
//   { id: 'lexa-x1', object: 'model', owned_by: 'lexa' },
//   { id: 'lexa-rho', object: 'model', owned_by: 'lexa' }
// ]
```

## 🔧 API Reference

### Constructor

```javascript
const lexa = new Lexa(apiKey, config);
```

**Parameters:**
- `apiKey` (string): Your Lexa API key
- `config` (object, optional): Configuration options
  - `baseURL` (string): Custom base URL (default: 'https://www.lexa.chat/api')

### Chat Completion

```javascript
const completion = await lexa.chat(options);
```

**Options:**
- `messages` (array): Array of message objects
- `model` (string): Model to use (default: 'lexa-mml')
- `temperature` (number, optional): Controls randomness (0-2)
- `max_tokens` (number, optional): Maximum tokens to generate
- `stream` (boolean, optional): Enable streaming response

### List Models

```javascript
const models = await lexa.models();
```

Returns available models with their metadata.

## 🔑 Getting Your API Key

1. Visit [Lexa Chat](https://www.lexa.chat)
2. Sign up or log in to your account
3. Navigate to your Account settings
4. Generate a new API key
5. Use the key in your application

## 🤝 Migration from OpenAI

If you're currently using OpenAI's SDK, migrating to Lexa is straightforward:

**Before (OpenAI):**
```javascript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: 'your-key' });

const completion = await openai.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-3.5-turbo'
});
```

**After (Lexa):**
```javascript
import Lexa from '@robilabs/lexa';
const lexa = new Lexa('your-key');

const completion = await lexa.chat({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'lexa-mml'
});
```

## 📦 Installation

```bash
# Using npm
npm install @robilabs/lexa@latest

# Using yarn
yarn add @robilabs/lexa

# Using pnpm
pnpm add @robilabs/lexa
```

## 🔗 Links

- **NPM Package**: https://www.npmjs.com/package/@robilabs/lexa
- **Lexa Chat**: https://lexa.chat
- **Documentation**: https://docs.lexa.chat/
- **GitHub**: https://github.com/Robi-Labs/lexa-js-sdk

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Issues**: https://github.com/Robi-Labs/lexa-js-sdk/issues
- **Email**: lexa@robiai.com
- **Community**: https://community.robiai.com/

---

Made with ❤️ by [Robi Labs](https://labs.robiai.com)

