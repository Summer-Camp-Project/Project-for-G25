// OpenAI API Connection Test
const OpenAI = require('openai');
require('dotenv').config();

console.log('🧪 Testing OpenAI API Connection...\n');

async function testOpenAI() {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_real_openai_api_key_here') {
      console.log('❌ OpenAI API Key not configured properly');
      console.log('');
      console.log('🔧 To fix this:');
      console.log('1. Run: node get-openai-key.js');
      console.log('2. Follow the instructions to get your API key');
      console.log('3. Update your .env file with the real key');
      console.log('4. Run this test again');
      return;
    }

    console.log('✅ API Key found in environment');
    console.log(`Key: ${process.env.OPENAI_API_KEY.substring(0, 20)}...`);
    console.log('');

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('📡 Testing connection to OpenAI...');

    // Test with a simple request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for EthioHeritage360, an Ethiopian heritage platform."
        },
        {
          role: "user",
          content: "Hello! Can you tell me about Ethiopian heritage?"
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    console.log('✅ SUCCESS! OpenAI API is working!');
    console.log('');
    console.log('📝 Test Response:');
    console.log('=' .repeat(50));
    console.log(completion.choices[0]?.message?.content);
    console.log('=' .repeat(50));
    console.log('');
    console.log('💰 Usage Info:');
    console.log(`- Tokens used: ${completion.usage?.total_tokens || 'Unknown'}`);
    console.log(`- Model: ${completion.model || 'gpt-3.5-turbo'}`);
    console.log('');
    console.log('🎉 Your chatbot will now work perfectly!');
    console.log('🚀 You can now deploy to Render with confidence!');

  } catch (error) {
    console.log('❌ OpenAI API Error:', error.message);
    console.log('');
    
    if (error.code === 'invalid_api_key') {
      console.log('🔑 Invalid API Key Error');
      console.log('Solutions:');
      console.log('1. Check your API key is correct');
      console.log('2. Make sure it starts with "sk-"');
      console.log('3. Verify billing is set up on OpenAI account');
      console.log('4. Run: node get-openai-key.js for help');
    } else if (error.code === 'insufficient_quota') {
      console.log('💳 Billing/Quota Error');
      console.log('Solutions:');
      console.log('1. Add billing information to your OpenAI account');
      console.log('2. Check your usage limits');
      console.log('3. Add credits to your account');
    } else if (error.code === 'rate_limit_exceeded') {
      console.log('⏰ Rate Limit Error');
      console.log('Solution: Wait a moment and try again');
    } else {
      console.log('🔧 Other Error');
      console.log('Check your internet connection and try again');
    }
    
    console.log('');
    console.log('📋 Full error details:');
    console.log(error);
  }
}

// Run the test
testOpenAI();
