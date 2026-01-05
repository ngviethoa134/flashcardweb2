// Quick script to check if .env variables are loaded
// Run with: node check-env.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  
  console.log('\n=== .env File Check ===\n');
  console.log('File exists: ✅');
  console.log('\nFile contents:');
  console.log(envContent);
  
  const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const hasUrl = lines.some(line => line.includes('VITE_SUPABASE_URL') && line.split('=')[1]?.trim());
  const hasKey = lines.some(line => line.includes('VITE_SUPABASE_ANON_KEY') && line.split('=')[1]?.trim());
  
  console.log('\n=== Validation ===');
  console.log('VITE_SUPABASE_URL set:', hasUrl ? '✅' : '❌');
  console.log('VITE_SUPABASE_ANON_KEY set:', hasKey ? '✅' : '❌');
  
  if (!hasUrl || !hasKey) {
    console.log('\n⚠️  Make sure both variables have values (not empty)');
  } else {
    console.log('\n✅ .env file looks good!');
  }
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  console.log('\nMake sure .env file exists in the project root directory');
}

