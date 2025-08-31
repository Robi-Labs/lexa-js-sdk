// OpenAI-style usage example
// Run with: node examples/openai-style-usage.js

// Note: Set your API key in environment variable LEXA_API_KEY
// or pass it directly to the constructor

// Import like OpenAI
const Lexa = require('@robilabs/lexa');

async function openaiStyleExample() {
  console.log('🚀 OpenAI-style Lexa Usage Example\n');

  // Initialize like OpenAI
  const lexa = new Lexa(process.env.LEXA_API_KEY);

  // Example 1: Simple chat completion
  console.log('📝 Example 1: Simple Chat Completion');
  try {
    const completion = await lexa.chat({
      messages: [
        { role: 'user', content: 'Hello! Can you tell me a joke?' }
      ],
      model: 'lexa-mml',
      temperature: 0.7,
      max_tokens: 100
    });

    console.log('✅ Response:', completion.choices[0].message.content);
    console.log('📊 Usage:', completion.usage);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('');

  // Example 2: Conversation with system message
  console.log('💬 Example 2: Conversation with System Message');
  try {
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

    console.log('✅ Response:', completion.choices[0].message.content);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('');

  // Example 3: Streaming response
  console.log('🌊 Example 3: Streaming Response');
  try {
    const completion = await lexa.chat({
      messages: [
        { role: 'user', content: 'Write a short poem about coding.' }
      ],
      model: 'lexa-rho',
      temperature: 0.8,
      stream: true
    });

    console.log('✅ Streaming response:');
    const reader = completion.stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value.type === 'text-delta') {
        process.stdout.write(value.delta);
      } else if (value.type === 'finish') {
        console.log('\n📊 Usage:', value.usage);
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('');

  // Example 4: List available models
  console.log('📋 Example 4: List Available Models');
  try {
    const models = await lexa.models();
    console.log('✅ Available models:');
    models.data.forEach(model => {
      console.log(`   - ${model.id} (${model.owned_by})`);
    });
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🎉 OpenAI-style examples complete!');
}

// Run the examples
openaiStyleExample().catch(console.error);
