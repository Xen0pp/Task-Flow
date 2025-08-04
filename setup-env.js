#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 TaskFlow Pro - Environment Setup');
console.log('===================================');
console.log('');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupEnvironment() {
  console.log('This script will help you create a .env file for local development.');
  console.log('For production deployment, add these variables to your Vercel dashboard.');
  console.log('');

  // Generate JWT Secret
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  console.log('✅ Generated secure JWT secret');

  // Ask for MongoDB URI
  const mongoUri = await askQuestion('Enter your MongoDB Atlas connection string: ');
  
  if (!mongoUri || mongoUri.includes('username:password')) {
    console.log('❌ Please provide a valid MongoDB connection string');
    process.exit(1);
  }

  // Ask for client URL (optional for local dev)
  const clientUrl = await askQuestion('Enter your client URL (press Enter for localhost:3000): ') || 'http://localhost:3000';

  // Create .env content
  const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=${mongoUri}

# JWT Secret - Generated securely
JWT_SECRET=${jwtSecret}

# Client URL for CORS
CLIENT_URL=${clientUrl}

# Environment
NODE_ENV=development
PORT=5000
`;

  // Write .env file
  fs.writeFileSync('.env', envContent);
  console.log('');
  console.log('✅ Created .env file successfully!');
  console.log('');
  console.log('🔒 Security reminders:');
  console.log('- Never commit the .env file to version control');
  console.log('- Keep your MongoDB credentials secure');
  console.log('- Use the same JWT_SECRET in production');
  console.log('');
  console.log('🚀 You can now run: npm run dev');

  rl.close();
}

setupEnvironment().catch(console.error);
