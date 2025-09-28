#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'https://ethioheritage360-ethiopian-heritage.onrender.com/api';
// For local testing: const API_BASE = 'http://localhost:5000/api';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Get auth token (you'll need to login first)
let authToken = '';

async function login() {
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@ethioheritage360.com',
      password: 'AdminPassword123!'
    });

    if (loginResponse.data.success) {
      authToken = loginResponse.data.token;
      log('✅ Successfully logged in for OpenAI testing', colors.green);
      return true;
    }
  } catch (error) {
    log('❌ Login failed - using public endpoints only', colors.yellow);
    return false;
  }
}

async function testOpenAIStatus() {
  try {
    log('\n🔍 Testing OpenAI Status...', colors.cyan);
    
    const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
    
    const response = await axios.get(`${API_BASE}/openai/status`, {
      headers,
      timeout: 10000
    });

    if (response.data.success) {
      log('✅ OpenAI Status Retrieved!', colors.green);
      console.log('   Configuration:', JSON.stringify(response.data.data, null, 2));
      return response.data.data.configured;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      log('ℹ️  OpenAI status requires authentication', colors.yellow);
    } else {
      log(`❌ OpenAI status check failed: ${error.message}`, colors.red);
    }
    return false;
  }
}

async function testOpenAIConnection() {
  try {
    log('\n🧪 Testing OpenAI Connection...', colors.cyan);
    
    if (!authToken) {
      log('⚠️  Skipping connection test (requires authentication)', colors.yellow);
      return false;
    }

    const response = await axios.get(`${API_BASE}/openai/test`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      timeout: 15000
    });

    if (response.data.success) {
      log('✅ OpenAI Connection Test SUCCESSFUL!', colors.green);
      console.log('   Response:', response.data.data.message);
      console.log('   Model:', response.data.data.model);
      return true;
    }
  } catch (error) {
    log(`❌ OpenAI connection test failed: ${error.response?.data?.error || error.message}`, colors.red);
    return false;
  }
}

async function testArtifactDescriptionGeneration() {
  try {
    log('\n🏺 Testing Artifact Description Generation...', colors.cyan);
    
    if (!authToken) {
      log('⚠️  Skipping artifact description test (requires authentication)', colors.yellow);
      return false;
    }

    const testData = {
      artifactName: 'Ethiopian Coffee Ceremony Set',
      category: 'Cultural Artifact',
      historicalPeriod: 'Traditional Era'
    };

    console.log(`   Generating description for: ${testData.artifactName}`);

    const response = await axios.post(`${API_BASE}/openai/generate-artifact-description`, testData, {
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });

    if (response.data.success) {
      log('✅ Artifact Description Generated Successfully!', colors.green);
      console.log('\n📝 Generated Description:');
      console.log(response.data.data.description);
      return true;
    }
  } catch (error) {
    log(`❌ Artifact description generation failed: ${error.response?.data?.error || error.message}`, colors.red);
    return false;
  }
}

async function testChatbot() {
  try {
    log('\n💬 Testing AI Chatbot (Public Access)...', colors.cyan);
    
    const testMessage = {
      message: 'Tell me about Ethiopian cultural heritage and museums.',
      context: 'User is interested in learning about Ethiopian culture'
    };

    console.log(`   User message: "${testMessage.message}"`);

    const response = await axios.post(`${API_BASE}/openai/chat`, testMessage, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });

    if (response.data.success) {
      log('✅ AI Chatbot Response Generated!', colors.green);
      console.log('\n🤖 AI Response:');
      console.log(response.data.data.response);
      return true;
    }
  } catch (error) {
    log(`❌ Chatbot test failed: ${error.response?.data?.error || error.message}`, colors.red);
    return false;
  }
}

async function testEducationalContentGeneration() {
  try {
    log('\n📚 Testing Educational Content Generation...', colors.cyan);
    
    if (!authToken) {
      log('⚠️  Skipping educational content test (requires authentication)', colors.yellow);
      return false;
    }

    const testData = {
      topic: 'Ancient Ethiopian Civilizations',
      difficulty: 'intermediate',
      contentType: 'summary'
    };

    console.log(`   Generating ${testData.contentType} about: ${testData.topic}`);

    const response = await axios.post(`${API_BASE}/openai/generate-educational-content`, testData, {
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 25000
    });

    if (response.data.success) {
      log('✅ Educational Content Generated Successfully!', colors.green);
      console.log('\n📖 Generated Content:');
      console.log(response.data.data.content.substring(0, 300) + '...');
      return true;
    }
  } catch (error) {
    log(`❌ Educational content generation failed: ${error.response?.data?.error || error.message}`, colors.red);
    return false;
  }
}

async function testTranslation() {
  try {
    log('\n🌐 Testing Content Translation...', colors.cyan);
    
    if (!authToken) {
      log('⚠️  Skipping translation test (requires authentication)', colors.yellow);
      return false;
    }

    const testData = {
      content: 'Welcome to EthioHeritage360, your gateway to Ethiopian cultural heritage!',
      targetLanguage: 'Amharic'
    };

    console.log(`   Translating to: ${testData.targetLanguage}`);

    const response = await axios.post(`${API_BASE}/openai/translate`, testData, {
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    if (response.data.success) {
      log('✅ Translation Generated Successfully!', colors.green);
      console.log('\n🔄 Translation Result:');
      console.log(`   Original: ${testData.content}`);
      console.log(`   Translated: ${response.data.data.translatedContent}`);
      return true;
    }
  } catch (error) {
    log(`❌ Translation test failed: ${error.response?.data?.error || error.message}`, colors.red);
    return false;
  }
}

async function runOpenAITests() {
  log('🚀 EthioHeritage360 OpenAI Integration Tests', colors.cyan);
  log('Testing AI-powered features for Ethiopian heritage platform...', colors.blue);
  
  const results = {
    login: false,
    status: false,
    connection: false,
    artifactDescription: false,
    chatbot: false,
    educationalContent: false,
    translation: false
  };

  try {
    // Test authentication
    results.login = await login();

    // Test OpenAI status
    results.status = await testOpenAIStatus();

    // Test OpenAI connection
    results.connection = await testOpenAIConnection();

    // Test artifact description generation
    results.artifactDescription = await testArtifactDescriptionGeneration();

    // Test chatbot (public access)
    results.chatbot = await testChatbot();

    // Test educational content generation
    results.educationalContent = await testEducationalContentGeneration();

    // Test translation
    results.translation = await testTranslation();

    // Generate report
    log('\n' + '='.repeat(60), colors.cyan);
    log('📋 OPENAI INTEGRATION TEST REPORT', colors.cyan);
    log('='.repeat(60), colors.cyan);

    console.log('\n📊 Test Results:');
    console.log(`   Authentication:          ${results.login ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   OpenAI Status:           ${results.status ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}`);
    console.log(`   Connection Test:         ${results.connection ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`   Artifact Descriptions:   ${results.artifactDescription ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`   AI Chatbot:              ${results.chatbot ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`   Educational Content:     ${results.educationalContent ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`   Translation:             ${results.translation ? '✅ WORKING' : '❌ FAILED'}`);

    const workingFeatures = Object.values(results).filter(Boolean).length;
    const totalFeatures = Object.keys(results).length;
    const percentage = Math.round((workingFeatures / totalFeatures) * 100);

    console.log('');
    if (percentage >= 85) {
      log('🎉 EXCELLENT! OpenAI integration is working perfectly!', colors.green);
      log('✅ AI-powered features are ready to enhance your heritage platform!', colors.green);
    } else if (percentage >= 60) {
      log('👍 GOOD! Most OpenAI features are working!', colors.yellow);
      log('⚠️  Some features may need additional configuration', colors.yellow);
    } else {
      log('⚠️  NEEDS ATTENTION! OpenAI integration requires setup', colors.red);
      log('🔧 Check your OpenAI API key and configuration', colors.red);
    }

    console.log('');
    log(`📈 Integration Health: ${workingFeatures}/${totalFeatures} features working (${percentage}%)`, 
      percentage >= 85 ? colors.green : percentage >= 60 ? colors.yellow : colors.red);

    console.log('');
    console.log('🔗 Available OpenAI Endpoints:');
    console.log(`   Status:      GET  ${API_BASE}/openai/status`);
    console.log(`   Test:        GET  ${API_BASE}/openai/test`);
    console.log(`   Chat:        POST ${API_BASE}/openai/chat`);
    console.log(`   Artifacts:   POST ${API_BASE}/openai/generate-artifact-description`);
    console.log(`   Education:   POST ${API_BASE}/openai/generate-educational-content`);
    console.log(`   Translate:   POST ${API_BASE}/openai/translate`);

    if (results.status && results.connection) {
      console.log('');
      log('🎯 OpenAI Features Available:', colors.green);
      log('   • AI-powered artifact descriptions', colors.blue);
      log('   • Educational content generation', colors.blue);
      log('   • Multi-language translation', colors.blue);
      log('   • Interactive chatbot for visitors', colors.blue);
      log('   • Personalized recommendations', colors.blue);
      log('   • Tour guide content creation', colors.blue);
    }

  } catch (error) {
    log(`❌ OpenAI tests failed: ${error.message}`, colors.red);
  }

  return results;
}

// Run the tests
console.log('Starting EthioHeritage360 OpenAI integration tests...');
runOpenAITests()
  .then((results) => {
    const success = results.status || results.chatbot;
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
