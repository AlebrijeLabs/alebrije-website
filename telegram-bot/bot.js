const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const userData = require('./userdata');

// Create bot instance
const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

console.log('🤖 ALBJ Token Bot is starting...');

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function calculateDaysUntilLaunch() {
  const launchDate = new Date('2025-06-12T00:00:00Z');
  const now = new Date();
  const timeDiff = launchDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function getCreatureImageUrl(creatureName) {
  // Map creature names to image URLs
  const imageMap = {
    'dragon-jaguar': `${config.ALBJ_WEBSITE_URL}/Images/Dragon-Jaguar.png`,
    'owl-serpent': `${config.ALBJ_WEBSITE_URL}/Images/Owl-Serpent.png`,
    'fox-butterfly': `${config.ALBJ_WEBSITE_URL}/Images/Fox-Butterfly.png`,
    'frog-hummingbird': `${config.ALBJ_WEBSITE_URL}/Images/Frog-Hummingbird.png`,
    'eagle-lizard': `${config.ALBJ_WEBSITE_URL}/Images/Eagle-Lizard.png`,
    'wolf-fish': `${config.ALBJ_WEBSITE_URL}/Images/Wolf-Fish.png`,
    'turtle-bat': `${config.ALBJ_WEBSITE_URL}/Images/Turtle-Bat.png`,
    'snake-quetzal': `${config.ALBJ_WEBSITE_URL}/Images/Snake-Quetzal.png`,
    'horse-phoenix': `${config.ALBJ_WEBSITE_URL}/Images/Horse-Phoenix.png`,
    'cat-chameleon': `${config.ALBJ_WEBSITE_URL}/Images/Cat-Chameleon.png`,
    'sheep-coyote': `${config.ALBJ_WEBSITE_URL}/Images/Sheep-Coyote.png`,
    'crab-dragonfly': `${config.ALBJ_WEBSITE_URL}/Images/Crab-Dragonfly.png`
  };

  return imageMap[creatureName] || null;
}

// ===================
// BASIC COMMANDS
// ===================

// Welcome message and start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Friend';
  
  const welcomeKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌐 Visit Website', url: config.ALBJ_WEBSITE_URL },
          { text: '📄 Whitepaper', url: `${config.ALBJ_WEBSITE_URL}/whitepaper.pdf` }
        ],
        [
          { text: '🎨 View Spirits', callback_data: 'spirits' },
          { text: '🗓️ Launch Date', callback_data: 'launch_info' }
        ],
        [
          { text: '📊 Token Info', callback_data: 'token_info' },
          { text: '🔗 Social Links', callback_data: 'social_links' }
        ],
        [
          { text: '❓ Help', callback_data: 'help' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, `👋 Hello ${userName}!\n\n${config.WELCOME_MESSAGE}`, {
    parse_mode: 'Markdown',
    ...welcomeKeyboard
  });
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.HELP_MESSAGE, { parse_mode: 'Markdown' });
});

// Hello command
bot.onText(/\/hello/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Friend';
  const greetings = [
    `Hello ${userName}! 🎭 Ready to explore the magical world of ALBJ?`,
    `Greetings ${userName}! 🌟 The spirit creatures welcome you!`,
    `Hey there ${userName}! 🦋 What adventure shall we embark on today?`,
    `Welcome back ${userName}! 🐉 The Alebrijes are excited to see you!`
  ];
  
  const helloKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🎨 View Spirits', callback_data: 'spirits' },
          { text: '📊 Token Info', callback_data: 'token_info' }
        ],
        [
          { text: '🎯 Take Quiz', callback_data: 'new_quiz' },
          { text: '😂 Tell Joke', callback_data: 'joke' }
        ],
        [
          { text: '🗓️ Launch Countdown', callback_data: 'launch_info' },
          { text: '🎁 NFT Preview', callback_data: 'nft' }
        ],
        [
          { text: '❓ All Commands', callback_data: 'help' }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, `${getRandomElement(greetings)}\n\n✨ **What would you like to explore?**`, {
    parse_mode: 'Markdown',
    ...helloKeyboard
  });
});

// Fun fact command
bot.onText(/\/funfact/, (msg) => {
  const chatId = msg.chat.id;
  const funFact = getRandomElement(config.FUNFACTS);
  
  bot.sendMessage(chatId, `💡 **ALBJ Fun Fact**\n\n${funFact}`, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🎲 Another Fact!', callback_data: 'funfact' }
      ]]
    }
  });
});

// ===================
// TOKEN INFORMATION
// ===================

// Token information command
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.TOKEN_INFO, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌐 Website', url: config.ALBJ_WEBSITE_URL },
          { text: '📄 Whitepaper', url: `${config.ALBJ_WEBSITE_URL}/whitepaper.pdf` }
        ]
      ]
    }
  });
});

// Price command (disabled until launch)
bot.onText(/\/price/, (msg) => {
  const chatId = msg.chat.id;
  const daysUntilLaunch = calculateDaysUntilLaunch();
  
  bot.sendMessage(chatId, `📊 **ALBJ Price Check**

⚠️ ALBJ token has not launched yet!

**Launch Date**: June 12, 2025
**Days Remaining**: ${daysUntilLaunch} days

Price tracking will be available after launch. Stay tuned! 🚀`, {
    parse_mode: 'Markdown'
  });
});

// Holders command
bot.onText(/\/holders/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, `👥 **ALBJ Token Holders**

🚫 **Not launched yet!**

**Launch Date**: June 12, 2025

Holder statistics will be available after token launch. Currently building our amazing community of folklore enthusiasts!

**Pre-Launch Community:**
📱 Telegram members: Growing daily
🎮 Discord members: Active discussions
📧 Newsletter subscribers: Thousands signed up

Join us early! 🌟`, {
    parse_mode: 'Markdown'
  });
});

// Roadmap command
bot.onText(/\/roadmap/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.ROADMAP_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🌐 View on Website', url: config.ALBJ_WEBSITE_URL }
      ]]
    }
  });
});

// Countdown command
bot.onText(/\/countdown/, (msg) => {
  const chatId = msg.chat.id;
  const daysUntilLaunch = calculateDaysUntilLaunch();
  
  bot.sendMessage(chatId, `⏰ **ALBJ Launch Countdown**

🚀 **${daysUntilLaunch} DAYS TO GO!**

**Launch Date**: June 12, 2025
**Launch Time**: 00:00 UTC

**What happens at launch:**
🔥 50% token burn (4.5B ALBJ destroyed)
💧 Liquidity pool goes live
🎁 Community airdrops begin
📈 Trading starts on DEXs
🎨 First NFT reveals

**Get Ready:**
✅ Set up Solana wallet
✅ Join our communities
✅ Follow social media
✅ Read the whitepaper

The spirit creatures are ready! Are you? 🎭`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '⏰ Live Countdown', url: config.ALBJ_WEBSITE_URL }
      ]]
    }
  });
});

// Launch information command
bot.onText(/\/launch/, (msg) => {
  const chatId = msg.chat.id;
  const daysUntilLaunch = calculateDaysUntilLaunch();
  
  const launchMessage = `🗓️ **ALBJ Token Launch**

**Launch Date**: June 12, 2025
**Launch Time**: 00:00 UTC
**Days Remaining**: ${daysUntilLaunch} days

**Launch Events:**
🔥 **The Great Burn**: 4.5B tokens (50%) destroyed forever
💧 **Liquidity Pool**: DEX trading begins
🎁 **Community Rewards**: Airdrop campaign starts
🎨 **NFT Reveals**: First spirit creatures unveiled
📈 **Price Discovery**: Market determines value

**Where to Trade:**
• Jupiter Exchange
• Raydium
• Other major Solana DEXs

**Launch Week Activities:**
• Live launch ceremony
• AMA sessions with team
• Community celebrations
• Spirit creature reveals

**Countdown is live on our website!**`;

  bot.sendMessage(chatId, launchMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '⏰ View Live Countdown', url: config.ALBJ_WEBSITE_URL }
        ],
        [
          { text: '🎉 Join Launch Events', callback_data: 'events' }
        ]
      ]
    }
  });
});

// Tokenomics command
bot.onText(/\/tokenomics/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.TOKEN_INFO, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '📊 View Charts', url: config.ALBJ_WEBSITE_URL }
      ]]
    }
  });
});

// ===================
// NFT & COMMUNITY
// ===================

// NFT collection command
bot.onText(/\/nft/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.NFT_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🎨 View Spirits', callback_data: 'spirits' }
        ],
        [
          { text: '🌐 Visit Gallery', url: config.ALBJ_WEBSITE_URL }
        ]
      ]
    }
  });
});

// Spirits command
bot.onText(/\/spirits/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.SPIRITS_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🐉 Dragon-Jaguar', callback_data: 'alebrije_dragon-jaguar' },
          { text: '🦉 Owl-Serpent', callback_data: 'alebrije_owl-serpent' }
        ],
        [
          { text: '🦊 Fox-Butterfly', callback_data: 'alebrije_fox-butterfly' },
          { text: '🐸 Frog-Hummingbird', callback_data: 'alebrije_frog-hummingbird' }
        ],
        [
          { text: '🦅 Eagle-Lizard', callback_data: 'alebrije_eagle-lizard' },
          { text: '🐺 Wolf-Fish', callback_data: 'alebrije_wolf-fish' }
        ],
        [
          { text: '🌐 View All', url: config.ALBJ_WEBSITE_URL }
        ]
      ]
    }
  });
});

// Events command
bot.onText(/\/events/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.EVENTS_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🗓️ Add to Calendar', url: `${config.ALBJ_WEBSITE_URL}/calendar` }
        ],
        [
          { text: '🎮 Join Discord', url: 'https://discord.gg/vrBnKB68' }
        ]
      ]
    }
  });
});

// Community command
bot.onText(/\/community/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.COMMUNITY_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🐦 Twitter/X', url: 'https://twitter.com/ALBJToken' },
          { text: '🎮 Discord', url: 'https://discord.gg/vrBnKB68' }
        ],
        [
          { text: '👩‍💻 GitHub', url: 'https://github.com/AlebrijeLabs' },
          { text: '🌐 Website', url: config.ALBJ_WEBSITE_URL }
        ]
      ]
    }
  });
});

// Team command
bot.onText(/\/team/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.TEAM_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '💼 View Careers', callback_data: 'careers' }
      ]]
    }
  });
});

// Careers command
bot.onText(/\/careers/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.CAREERS_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '📧 Apply Now', url: 'mailto:careers@albj.io' }
      ]]
    }
  });
});

// Culture command
bot.onText(/\/culture/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.CULTURE_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🎨 View Spirits', callback_data: 'spirits' }
        ],
        [
          { text: '📚 Learn More', url: config.ALBJ_WEBSITE_URL }
        ]
      ]
    }
  });
});

// ===================
// SUPPORT
// ===================

// Support command
bot.onText(/\/support/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.SUPPORT_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '❓ FAQ', callback_data: 'faq' }
        ],
        [
          { text: '🎮 Discord Support', url: 'https://discord.gg/vrBnKB68' }
        ]
      ]
    }
  });
});

// FAQ command
bot.onText(/\/faq/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.FAQ_MESSAGE, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🆘 More Support', callback_data: 'support' }
        ],
        [
          { text: '🌐 Website FAQ', url: `${config.ALBJ_WEBSITE_URL}/faq` }
        ]
      ]
    }
  });
});

// ===================
// SOCIAL MEDIA
// ===================

// Social links command
bot.onText(/\/social/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.SOCIAL_LINKS, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🐦 Twitter/X', url: 'https://twitter.com/ALBJToken' },
          { text: '🎮 Discord', url: 'https://discord.gg/vrBnKB68' }
        ],
        [
          { text: '👩‍💻 GitHub', url: 'https://github.com/AlebrijeLabs' },
          { text: '🌐 Website', url: config.ALBJ_WEBSITE_URL }
        ]
      ]
    }
  });
});

// ===================
// FUN STUFF
// ===================

// Quote command
bot.onText(/\/quote/, (msg) => {
  const chatId = msg.chat.id;
  const quote = getRandomElement(config.QUOTES);
  
  bot.sendMessage(chatId, `💭 **Inspirational Quote**\n\n${quote}`, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '✨ Another Quote', callback_data: 'quote' }
      ]]
    }
  });
});

// Joke command
bot.onText(/\/joke/, (msg) => {
  const chatId = msg.chat.id;
  const joke = getRandomElement(config.JOKES);
  
  bot.sendMessage(chatId, `😂 **ALBJ Joke**\n\n${joke}`, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🎭 Another Joke', callback_data: 'joke' }
      ]]
    }
  });
});

// Meme command
bot.onText(/\/meme/, (msg) => {
  const chatId = msg.chat.id;
  const memes = [
    "🎭 When you realize ALBJ combines culture AND crypto: 🤯 MIND = BLOWN",
    "🐉 Dragon-Jaguar: 'I don't always HODL, but when I do, it's ALBJ' 💎🙌",
    "🦉 Owl-Serpent: 'Who?' You: 'ALBJ holders!' 🚀",
    "🔥 50% burn at launch? That's not a rug pull, that's a FIRE SALE! 🔥💰"
  ];
  
  const meme = getRandomElement(memes);
  
  bot.sendMessage(chatId, `🎭 **ALBJ Meme**\n\n${meme}`, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '😂 Another Meme', callback_data: 'meme' }
      ]]
    }
  });
});

// Quiz command
bot.onText(/\/quiz/, (msg) => {
  const chatId = msg.chat.id;
  const question = getRandomElement(config.QUIZ_QUESTIONS);
  
  const keyboard = question.answers.map((answer, index) => [{
    text: answer,
    callback_data: `quiz_${index}_${question.correct}`
  }]);
  
  bot.sendMessage(chatId, `🧠 **ALBJ Quiz**\n\n${question.question}`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// ===================
// TOOLS
// ===================

// Price alert command
bot.onText(/\/pricealert/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, `🚨 **Price Alerts**

⚠️ **Coming after launch!**

**Launch Date**: June 12, 2025

Price alert features will be available once ALBJ token launches and trading begins. You'll be able to set:

• Target price alerts
• Percentage change notifications  
• Volume spike alerts
• News and announcement alerts

**For now, stay updated:**
📱 Follow our social media
🔔 Enable Telegram notifications
🎮 Join Discord announcements

We'll notify the community when price alerts go live! 🚀`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔔 Join Updates', url: 'https://discord.gg/vrBnKB68' }
        ],
        [
          { text: '📱 Follow Twitter', url: 'https://twitter.com/ALBJToken' }
        ]
      ]
    }
  });
});

// ===================
// ALEBRIJE COMMANDS
// ===================

// Individual Alebrije commands
bot.onText(/\/alebrije (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const creatureName = match[1].toLowerCase().trim();
  
  if (config.ALEBRIJES[creatureName]) {
    const creature = config.ALEBRIJES[creatureName];
    const imageUrl = getCreatureImageUrl(creatureName);
    
    if (imageUrl) {
      // Send photo with description as caption
      bot.sendPhoto(chatId, imageUrl, {
        caption: creature.description,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🎨 View All Spirits', callback_data: 'spirits' }
            ],
            [
              { text: '🖼️ NFT Collection', callback_data: 'nft' }
            ]
          ]
        }
      });
    } else {
      // Fallback to text if image not found
      bot.sendMessage(chatId, creature.description, { 
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🎨 View All Spirits', callback_data: 'spirits' }
            ],
            [
              { text: '🖼️ NFT Collection', callback_data: 'nft' }
            ]
          ]
        }
      });
    }
  } else {
    bot.sendMessage(chatId, `❌ **Spirit creature "${creatureName}" not found!**

**Available creatures:**
🐉 dragon-jaguar
🦉 owl-serpent  
🦊 fox-butterfly
🐸 frog-hummingbird
🦅 eagle-lizard
🐺 wolf-fish
🐢 turtle-bat
🐍 snake-quetzal
🐎 horse-phoenix
🐈 cat-chameleon
🐑 sheep-coyote
🦀 crab-dragonfly

**Usage:** /alebrije dragon-jaguar
**Or:** Use /spirits to see all creatures`, {
      parse_mode: 'Markdown'
    });
  }
});

// ===================
// CALLBACK HANDLERS
// ===================

// Handle callback queries from inline keyboards
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const data = callbackQuery.data;

  // Handle different callback types
  switch (data) {
    case 'token_info':
      bot.sendMessage(chatId, config.TOKEN_INFO, { parse_mode: 'Markdown' });
      break;
    
    case 'launch_info':
      const daysUntilLaunch = calculateDaysUntilLaunch();
      bot.sendMessage(chatId, `🗓️ **Launch Countdown**\n\n**${daysUntilLaunch} days** until ALBJ Token launches!\n\n**Date**: June 12, 2025\n**Time**: 00:00 UTC`, {
        parse_mode: 'Markdown'
      });
      break;
    
    case 'social_links':
      bot.sendMessage(chatId, config.SOCIAL_LINKS, { parse_mode: 'Markdown' });
      break;
    
    case 'help':
      bot.sendMessage(chatId, config.HELP_MESSAGE, { parse_mode: 'Markdown' });
      break;
      
    case 'spirits':
      bot.sendMessage(chatId, config.SPIRITS_MESSAGE, { parse_mode: 'Markdown' });
      break;
      
    case 'nft':
      bot.sendMessage(chatId, config.NFT_MESSAGE, { parse_mode: 'Markdown' });
      break;
      
    case 'events':
      bot.sendMessage(chatId, config.EVENTS_MESSAGE, { parse_mode: 'Markdown' });
      break;
      
    case 'support':
      bot.sendMessage(chatId, config.SUPPORT_MESSAGE, { parse_mode: 'Markdown' });
      break;
      
    case 'faq':
      bot.sendMessage(chatId, config.FAQ_MESSAGE, { parse_mode: 'Markdown' });
      break;
      
    case 'careers':
      bot.sendMessage(chatId, config.CAREERS_MESSAGE, { parse_mode: 'Markdown' });
      break;
      
    case 'funfact':
      const funFact = getRandomElement(config.FUNFACTS);
      bot.sendMessage(chatId, `💡 **ALBJ Fun Fact**\n\n${funFact}`, { parse_mode: 'Markdown' });
      break;
      
    case 'quote':
      const quote = getRandomElement(config.QUOTES);
      bot.sendMessage(chatId, `💭 **Inspirational Quote**\n\n${quote}`, { parse_mode: 'Markdown' });
      break;
      
    case 'joke':
      const joke = getRandomElement(config.JOKES);
      bot.sendMessage(chatId, `😂 **ALBJ Joke**\n\n${joke}`, { parse_mode: 'Markdown' });
      break;
      
    case 'meme':
      const memes = [
        "🎭 When you realize ALBJ combines culture AND crypto: 🤯 MIND = BLOWN",
        "🐉 Dragon-Jaguar: 'I don't always HODL, but when I do, it's ALBJ' 💎🙌",
        "🦉 Owl-Serpent: 'Who?' You: 'ALBJ holders!' 🚀",
        "🔥 50% burn at launch? That's not a rug pull, that's a FIRE SALE! 🔥💰"
      ];
      const meme = getRandomElement(memes);
      bot.sendMessage(chatId, `🎭 **ALBJ Meme**\n\n${meme}`, { parse_mode: 'Markdown' });
      break;
  }

  // Handle Alebrije creature callbacks
  if (data.startsWith('alebrije_')) {
    const creatureName = data.replace('alebrije_', '');
    if (config.ALEBRIJES[creatureName]) {
      const creature = config.ALEBRIJES[creatureName];
      
      // Get image URL
      const imageUrl = getCreatureImageUrl(creatureName);
      
      if (imageUrl) {
        // Send photo with description as caption
        bot.sendPhoto(chatId, imageUrl, {
          caption: creature.description,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🎨 View All Spirits', callback_data: 'spirits' }
              ],
              [
                { text: '🖼️ NFT Collection', callback_data: 'nft' }
              ]
            ]
          }
        });
      } else {
        // Fallback to text if image not found
        bot.sendMessage(chatId, creature.description, { 
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🎨 View All Spirits', callback_data: 'spirits' }
              ],
              [
                { text: '🖼️ NFT Collection', callback_data: 'nft' }
              ]
            ]
          }
        });
      }
    }
  }

  // Handle quiz callbacks
  if (data.startsWith('quiz_')) {
    const [, selectedAnswer, correctAnswer] = data.split('_');
    const isCorrect = parseInt(selectedAnswer) === parseInt(correctAnswer);
    
    if (isCorrect) {
      bot.sendMessage(chatId, `✅ **Correct!** 🎉\n\nYou know your ALBJ facts! Want to try another question?`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🧠 Another Quiz', callback_data: 'new_quiz' }
          ]]
        }
      });
    } else {
      bot.sendMessage(chatId, `❌ **Incorrect!** 😅\n\nNo worries! Keep learning about ALBJ and try again!`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🧠 Try Again', callback_data: 'new_quiz' }
            ],
            [
              { text: '📚 Learn More', url: config.ALBJ_WEBSITE_URL }
            ]
          ]
        }
      });
    }
  }

  // Handle new quiz request
  if (data === 'new_quiz') {
    const question = getRandomElement(config.QUIZ_QUESTIONS);
    const keyboard = question.answers.map((answer, index) => [{
      text: answer,
      callback_data: `quiz_${index}_${question.correct}`
    }]);
    
    bot.sendMessage(chatId, `🧠 **ALBJ Quiz**\n\n${question.question}`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  }

  // Handle check-in callbacks
  if (data === 'checkin_action') {
    // Simulate /checkin command
    const userId = message.from?.id || callbackQuery.from.id;
    const username = message.from?.username || callbackQuery.from.username || '';
    const firstName = message.from?.first_name || callbackQuery.from.first_name || '';
    
    userData.updateUserActivity(userId, username, firstName);
    const result = userData.performCheckIn(userId);
    
    if (result.alreadyChecked) {
      bot.sendMessage(chatId, config.CHECKIN_MESSAGES.ALREADY_CHECKED(result.streak, result.nextCheckIn), {
        parse_mode: 'Markdown'
      });
    } else if (result.success) {
      const rewardMessage = config.CHECKIN_MESSAGES.SUCCESS(
        result.streak,
        result.reward.description,
        result.reward.specialMessage || "The spirits smile upon your dedication! 🌟"
      ).replace('{totalPoints}', result.spiritPoints);
      
      bot.sendMessage(chatId, rewardMessage, {
        parse_mode: 'Markdown'
      });
    }
  }

  // Handle mystats callback
  if (data === 'mystats') {
    const userId = callbackQuery.from.id;
    const userStats = userData.getUserStats(userId);
    const user = userStats.checkIn;
    const stats = userStats.stats;
    
    const badgesList = user.badges.length > 0 
      ? user.badges.map(badge => `🏆 ${badge.name}`).join('\n')
      : '🚫 No badges yet - keep checking in!';
    
    const statsMessage = `📊 **Your ALBJ Spirit Journey** 📊

👤 **Profile:**
• Spirit Name: ${userStats.firstName || 'Anonymous Spirit'}
• Journey Started: ${new Date(userStats.joinDate).toLocaleDateString()}
• Days in Realm: ${stats.daysSinceJoin}

🔥 **Check-in Progress:**
• Current Streak: ${user.streak} days
• Record Streak: ${user.streakRecord} days
• Total Check-ins: ${user.totalCheckins}
• Check-in Rate: ${stats.checkInRate}%

✨ **Spirit Energy:**
• Spirit Points: ${user.spiritPoints}
• Badges Earned: ${stats.badgeCount}
• Next Milestone: ${stats.nextMilestone} days

🏆 **Badges Earned:**
${badgesList}

⏰ **Next Check-in:** ${userData.getNextCheckInTime(userId)}

Keep connecting with the spirits! 🎭`;

    bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
  }

  // Handle notification toggles
  if (data.startsWith('notify_toggle_')) {
    const notificationType = data.replace('notify_toggle_', '');
    const userId = callbackQuery.from.id;
    
    const currentPrefs = userData.getNotificationPreferences(userId);
    const newState = !currentPrefs[notificationType];
    userData.updateNotificationPreference(userId, notificationType, newState);
    
    const typeName = config.NOTIFICATION_TYPES[notificationType.toUpperCase()]?.name || notificationType;
    const message = newState 
      ? config.NOTIFICATION_MESSAGES.SUBSCRIBED(typeName)
      : config.NOTIFICATION_MESSAGES.UNSUBSCRIBED(typeName);
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  // Handle notification menu
  if (data === 'notifications_menu') {
    const userId = callbackQuery.from.id;
    const preferences = userData.getNotificationPreferences(userId);
    
    const subscriptions = Object.entries(preferences)
      .map(([key, enabled]) => {
        const type = config.NOTIFICATION_TYPES[key.toUpperCase()];
        if (type) {
          return `${enabled ? '✅' : '❌'} ${type.name}`;
        }
        return null;
      })
      .filter(item => item !== null)
      .join('\n');
    
    const message = config.NOTIFICATION_MESSAGES.MENU.replace('{subscriptions}', subscriptions);
    
    const keyboard = Object.entries(config.NOTIFICATION_TYPES).map(([key, type]) => {
      const currentState = preferences[type.id];
      return [{
        text: `${currentState ? '🔕' : '🔔'} ${type.name}`,
        callback_data: `notify_toggle_${type.id}`
      }];
    });
    
    bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  }

  // Handle notification save
  if (data === 'notify_save') {
    bot.sendMessage(chatId, config.NOTIFICATION_MESSAGES.SETTINGS_UPDATED, { parse_mode: 'Markdown' });
  }

  // Answer the callback query
  bot.answerCallbackQuery(callbackQuery.id);
});

// ===================
// NEW ENGAGEMENT FEATURES
// ===================

// Daily Check-in command
bot.onText(/\/checkin/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || '';
  const firstName = msg.from.first_name || '';
  
  // Update user activity
  userData.updateUserActivity(userId, username, firstName);
  
  // Perform check-in
  const result = userData.performCheckIn(userId);
  
  if (result.alreadyChecked) {
    bot.sendMessage(chatId, config.CHECKIN_MESSAGES.ALREADY_CHECKED(result.streak, result.nextCheckIn), {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 My Stats', callback_data: 'mystats' }
          ],
          [
            { text: '🎨 View Spirits', callback_data: 'spirits' }
          ]
        ]
      }
    });
  } else if (result.success) {
    const rewardMessage = config.CHECKIN_MESSAGES.SUCCESS(
      result.streak,
      result.reward.description,
      result.reward.specialMessage || "The spirits smile upon your dedication! 🌟"
    ).replace('{totalPoints}', result.spiritPoints);
    
    bot.sendMessage(chatId, rewardMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 My Stats', callback_data: 'mystats' },
            { text: '🎁 View Rewards', callback_data: 'rewards_info' }
          ],
          [
            { text: '🎨 Meet a Spirit', callback_data: 'spirits' }
          ]
        ]
      }
    });
    
    // Send bonus content for special streaks
    if (result.streak === 3 || result.streak % 7 === 0) {
      setTimeout(() => {
        const funFact = getRandomElement(config.FUNFACTS);
        bot.sendMessage(chatId, `🎁 **Bonus Reward!**\n\n💡 **Special ALBJ Fact:**\n${funFact}`, {
          parse_mode: 'Markdown'
        });
      }, 1000);
    }
  }
});

// User Stats command
bot.onText(/\/mystats/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const userStats = userData.getUserStats(userId);
  const user = userStats.checkIn;
  const stats = userStats.stats;
  
  const badgesList = user.badges.length > 0 
    ? user.badges.map(badge => `🏆 ${badge.name}`).join('\n')
    : '🚫 No badges yet - keep checking in!';
  
  const statsMessage = `📊 **Your ALBJ Spirit Journey** 📊

👤 **Profile:**
• Spirit Name: ${userStats.firstName || 'Anonymous Spirit'}
• Journey Started: ${new Date(userStats.joinDate).toLocaleDateString()}
• Days in Realm: ${stats.daysSinceJoin}

🔥 **Check-in Progress:**
• Current Streak: ${user.streak} days
• Record Streak: ${user.streakRecord} days
• Total Check-ins: ${user.totalCheckins}
• Check-in Rate: ${stats.checkInRate}%

✨ **Spirit Energy:**
• Spirit Points: ${user.spiritPoints}
• Badges Earned: ${stats.badgeCount}
• Next Milestone: ${stats.nextMilestone} days

🏆 **Badges Earned:**
${badgesList}

⏰ **Next Check-in:** ${userData.getNextCheckInTime(userId)}

Keep connecting with the spirits! 🎭`;

  bot.sendMessage(chatId, statsMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🎯 Check In', callback_data: 'checkin_action' },
          { text: '🔔 Notifications', callback_data: 'notifications_menu' }
        ],
        [
          { text: '🎨 View Spirits', callback_data: 'spirits' }
        ]
      ]
    }
  });
});

// Notifications command
bot.onText(/\/notifications|\/alerts/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const preferences = userData.getNotificationPreferences(userId);
  
  // Create subscription list
  const subscriptions = Object.entries(preferences)
    .map(([key, enabled]) => {
      const type = config.NOTIFICATION_TYPES[key.toUpperCase()];
      if (type) {
        return `${enabled ? '✅' : '❌'} ${type.name}`;
      }
      return null;
    })
    .filter(item => item !== null)
    .join('\n');
  
  const message = config.NOTIFICATION_MESSAGES.MENU.replace('{subscriptions}', subscriptions);
  
  // Create keyboard for notification preferences
  const keyboard = Object.entries(config.NOTIFICATION_TYPES).map(([key, type]) => {
    const currentState = preferences[type.id];
    return [{
      text: `${currentState ? '🔕' : '🔔'} ${type.name}`,
      callback_data: `notify_toggle_${type.id}`
    }];
  });
  
  keyboard.push([{ text: '✅ Save Settings', callback_data: 'notify_save' }]);
  
  bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// ===================
// ERROR HANDLING
// ===================

// Handle errors
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// ===================
// STARTUP & SHUTDOWN
// ===================

// Log when bot is ready
bot.getMe().then((botInfo) => {
  console.log(`✅ Bot @${botInfo.username} is running!`);
  console.log(`🔗 Bot URL: https://t.me/${botInfo.username}`);
  console.log('🎭 ALBJ Token Bot is ready to serve the community!');
  console.log('\n🌟 Available Commands:');
  console.log('📊 Basic: /start /help /hello /funfact');
  console.log('💰 Token: /info /price /holders /roadmap /countdown /launch /tokenomics');
  console.log('🎨 NFT: /nft /spirits /events /community /team /careers /culture');
  console.log('🆘 Support: /support /faq');
  console.log('🔗 Social: /social');
  console.log('🎭 Fun: /quote /joke /meme /quiz');
  console.log('🛠️ Tools: /pricealert');
  console.log('🐉 Spirits: /alebrije [creature-name]');
  console.log('🎭 Check-in: /checkin');
  console.log('📊 My Stats: /mystats');
  console.log('🎁 Notifications: /notifications');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ALBJ Token Bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down ALBJ Token Bot...');
  bot.stopPolling();
  process.exit(0); 
}); 