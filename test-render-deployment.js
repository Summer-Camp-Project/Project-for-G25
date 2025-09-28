#!/usr/bin/env node

const https = require('https');

const API_BASE = 'https://ethioheritage360-ethiopian-heritage.onrender.com/api';

console.log('🚀 Testing Render Deployment for EthioHeritage360...\n');

function testEndpoint(path, description) {
    return new Promise((resolve) => {
        https.get(API_BASE + path, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`${res.statusCode === 200 ? '✅' : '❌'} ${description}: ${res.statusCode}`);
                resolve(res.statusCode === 200);
            });
        }).on('error', (err) => {
            console.log(`❌ ${description}: Error - ${err.message}`);
            resolve(false);
        });
    });
}

async function runTests() {
    console.log('🔍 Testing core endpoints...\n');
    
    const tests = [
        { path: '/health', desc: 'Health Check' },
        { path: '/downloads/health', desc: 'Downloads Service' },
        { path: '/openai/status', desc: 'OpenAI Status (needs auth)' },
        { path: '/', desc: 'Root API Info' }
    ];

    let passed = 0;
    
    for (const test of tests) {
        const success = await testEndpoint(test.path, test.desc);
        if (success) passed++;
    }
    
    console.log(`\n📊 Results: ${passed}/${tests.length} tests passed`);
    
    if (passed === tests.length) {
        console.log('\n🎉 All core endpoints are working!');
    } else {
        console.log('\n⚠️  Some endpoints need attention');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Add OpenAI API key to Render environment variables');
    console.log('2. Set up persistent disk for file storage');
    console.log('3. Test file downloads and uploads');
    console.log('4. Verify AI features are working');
    
    console.log('\n🛠️  Setup Instructions:');
    console.log('• OpenAI: Get API key from https://platform.openai.com/api-keys');
    console.log('• Render: Add OPENAI_API_KEY environment variable');
    console.log('• Storage: Add persistent disk at /opt/render/project/src/server/uploads');
}

runTests().catch(console.error);
