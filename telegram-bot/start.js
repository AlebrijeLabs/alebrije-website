#!/usr/bin/env node

/**
 * ALBJ Bot Startup Script
 * Starts both the main bot and daily updates scheduler
 */

const { spawn } = require('child_process');

console.log('🚀 Starting ALBJ Bot System...');

// Start the main bot
console.log('🤖 Starting main bot...');
const bot = spawn('node', ['bot.js'], {
  stdio: 'inherit',
  detached: false
});

// Wait a moment for bot to initialize
setTimeout(() => {
  console.log('📅 Starting daily updates scheduler...');
  const dailyUpdates = spawn('node', ['daily-updates.js', 'schedule'], {
    stdio: 'inherit',
    detached: false
  });

  dailyUpdates.on('error', (err) => {
    console.error('❌ Daily updates error:', err);
  });

  dailyUpdates.on('exit', (code) => {
    console.log(`📅 Daily updates exited with code ${code}`);
  });
}, 3000);

bot.on('error', (err) => {
  console.error('❌ Bot error:', err);
});

bot.on('exit', (code) => {
  console.log(`🤖 Bot exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down ALBJ Bot System...');
  bot.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down ALBJ Bot System...');
  bot.kill('SIGINT');  
  process.exit(0);
}); 