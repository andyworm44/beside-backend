#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Beside Backend Setup');
console.log('======================\n');

// 檢查 .env 文件是否存在
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Copy your Project URL and API keys to .env file');
console.log('3. Run the SQL schema in Supabase SQL Editor');
console.log('4. Test the backend with: npm run dev');
console.log('\n🔧 Required Environment Variables:');
console.log('- SUPABASE_URL=your_supabase_url');
console.log('- SUPABASE_ANON_KEY=your_supabase_anon_key');
console.log('- SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
console.log('- PORT=3001');
console.log('- NODE_ENV=development');
console.log('- JWT_SECRET=your_jwt_secret_key');
console.log('- CORS_ORIGIN=http://localhost:8081');

console.log('\n📁 Files created:');
console.log('- .env (environment variables)');
console.log('- database/schema.sql (database structure)');
console.log('- README.md (documentation)');

console.log('\n🎯 Ready to start development!');
console.log('Run: npm run dev');
