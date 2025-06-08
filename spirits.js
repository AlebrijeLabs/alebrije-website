// ALBJ Alebrije Spirits Collection
const config = require('./config');

const alebrijeSpirits = {
  'dragon-jaguar': {
    name: 'Dragon-Jaguar',
    emoji: '🐉',
    element: 'Fire',
    rarity: 'Legendary',
    color: '#ff4500',
    powers: [
      '🔥 Inner Strength Amplification',
      '💎 Courage Manifestation', 
      '🛡️ Protection of Sacred Values',
      '⚡ Leadership Energy'
    ],
    personality: 'Fierce protector with unwavering courage and inner strength',
    elements: ['Fire', 'Earth'],
    description: `🐉 **Dragon-Jaguar**

**Element:** Fire & Earth 🔥🌍
**Rarity:** Legendary 💎
**Origin:** Fusion of Chinese Dragon wisdom and Aztec Jaguar strength

This magnificent creature combines the raw power of the jaguar with the mystical might of the dragon. Dragon-Jaguar represents inner strength, courage in the face of adversity, and the fierce protection of what matters most.

*"In the realm of spirit creatures, Dragon-Jaguar stands as guardian of courage, reminding us that true strength comes from within."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Dragon-Jaguar.png`,
    greeting: 'Feel the fire of courage burning within! 🔥💪',
    dailyMessage: 'Today, channel your inner strength and face challenges with the courage of the Dragon-Jaguar!'
  },

  'owl-serpent': {
    name: 'Owl-Serpent',
    emoji: '🦉',
    element: 'Air',
    rarity: 'Epic',
    color: '#4169e1',
    powers: [
      '🧠 Ancient Wisdom Access',
      '🔮 Mystical Knowledge',
      '🌙 Night Vision Enhancement',
      '📚 Learning Acceleration'
    ],
    personality: 'Wise sage with deep understanding and mystical insight',
    elements: ['Air', 'Spirit'],
    description: `🦉 **Owl-Serpent**

**Element:** Air & Spirit 🌬️✨
**Rarity:** Epic 💜
**Origin:** Merger of Owl wisdom and Serpent transformation knowledge

This wise creature merges the owl's ancient wisdom with the serpent's knowledge of transformation. Owl-Serpent guides seekers through the mysteries of knowledge and the depths of understanding.

*"When the night is darkest, Owl-Serpent's wisdom illuminates the path forward."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Owl-Serpent.png`,
    greeting: 'Wisdom flows through those who seek it! 🦉✨',
    dailyMessage: 'Let the Owl-Serpent guide you to new insights and deeper understanding today!'
  },

  'fox-butterfly': {
    name: 'Fox-Butterfly',
    emoji: '🦋',
    element: 'Air',
    rarity: 'Rare',
    color: '#ff69b4',
    powers: [
      '🦋 Transformation Magic',
      '🎨 Creative Inspiration',
      '🧭 Curious Exploration',
      '💫 Joy Manifestation'
    ],
    personality: 'Playful and curious with transformative creative energy',
    elements: ['Air', 'Light'],
    description: `🦋 **Fox-Butterfly**

**Element:** Air & Light 🌬️💫
**Rarity:** Rare 💎
**Origin:** Fusion of Fox cleverness and Butterfly transformation

This delightful creature embodies the fox's clever curiosity and the butterfly's transformative beauty. Fox-Butterfly encourages exploration, learning, and finding joy in life's endless possibilities.

*"With wings of wonder and eyes of curiosity, Fox-Butterfly dances through the realms of possibility."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Fox-Butterfly.png`,
    greeting: 'Let curiosity be your guide to transformation! 🦋🌟',
    dailyMessage: 'Embrace change and let your creative spirit soar with Fox-Butterfly today!'
  },

  'frog-hummingbird': {
    name: 'Frog-Hummingbird',
    emoji: '🐸',
    element: 'Water',
    rarity: 'Uncommon',
    color: '#00ff7f',
    powers: [
      '🌊 Emotional Flow Mastery',
      '⚡ Quick Adaptation',
      '🎵 Harmonic Vibration',
      '💚 Healing Energy'
    ],
    personality: 'Adaptable healer with swift emotional intelligence',
    elements: ['Water', 'Air'],
    description: `🐸 **Frog-Hummingbird**

**Element:** Water & Air 💧🌬️
**Rarity:** Uncommon 💚
**Origin:** Combination of Frog adaptability and Hummingbird agility

This graceful creature merges the frog's ability to live between worlds with the hummingbird's swift precision. Frog-Hummingbird teaches us about emotional flow and quick adaptation to life's changes.

*"Like ripples on water, every small action creates waves of transformation."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Frog-Hummingbird.png`,
    greeting: 'Flow with life like water, swift like the wind! 🐸💨',
    dailyMessage: 'Adapt quickly to new opportunities with the grace of Frog-Hummingbird!'
  },

  'eagle-lizard': {
    name: 'Eagle-Lizard',
    emoji: '🦅',
    element: 'Air',
    rarity: 'Epic',
    color: '#8b4513',
    powers: [
      '🦅 High Perspective Vision',
      '🌞 Solar Energy Absorption',
      '🎯 Focused Determination',
      '🏔️ Mountain Climbing Spirit'
    ],
    personality: 'Visionary leader with grounded wisdom and soaring ambition',
    elements: ['Air', 'Earth'],
    description: `🦅 **Eagle-Lizard**

**Element:** Air & Earth 🌬️🌍
**Rarity:** Epic 💜
**Origin:** Fusion of Eagle vision and Lizard earth wisdom

This majestic creature combines the eagle's soaring perspective with the lizard's grounded wisdom. Eagle-Lizard represents clear vision, strategic thinking, and the balance between ambition and practicality.

*"From the highest peaks, Eagle-Lizard sees both the journey and the destination."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Eagle-Lizard.png`,
    greeting: 'Soar high while staying grounded in wisdom! 🦅🌍',
    dailyMessage: 'See the bigger picture with Eagle-Lizard\'s clarity and vision!'
  },

  'wolf-fish': {
    name: 'Wolf-Fish',
    emoji: '🐺',
    element: 'Water',
    rarity: 'Rare',
    color: '#4682b4',
    powers: [
      '🐺 Pack Unity Strength',
      '🌊 Emotional Depth Navigation',
      '🎯 Instinct Sharpening',
      '🤝 Loyalty Bonding'
    ],
    personality: 'Loyal pack leader with deep emotional intelligence',
    elements: ['Water', 'Spirit'],
    description: `🐺 **Wolf-Fish**

**Element:** Water & Spirit 💧✨
**Rarity:** Rare 💎
**Origin:** Merger of Wolf pack wisdom and Fish fluid intelligence

This loyal creature embodies the wolf's pack loyalty with the fish's fluid adaptability. Wolf-Fish teaches us about community bonds, emotional intelligence, and navigating life's deeper currents.

*"In the depths of unity, Wolf-Fish finds strength in the collective current."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Wolf-Fish.png`,
    greeting: 'Strength flows through unity and loyalty! 🐺🌊',
    dailyMessage: 'Build stronger connections and trust your instincts with Wolf-Fish guidance!'
  },

  'turtle-bat': {
    name: 'Turtle-Bat',
    emoji: '🐢',
    element: 'Earth',
    rarity: 'Uncommon',
    color: '#556b2f',
    powers: [
      '🐢 Ancient Patience Wisdom',
      '🦇 Night Navigation',
      '🕰️ Time Mastery',
      '🛡️ Protective Shell Energy'
    ],
    personality: 'Patient guardian with timeless wisdom and protective instincts',
    elements: ['Earth', 'Air'],
    description: `🐢 **Turtle-Bat**

**Element:** Earth & Air 🌍🌬️
**Rarity:** Uncommon 💚
**Origin:** Combination of Turtle longevity and Bat perception

This ancient creature merges the turtle's patient wisdom with the bat's keen perception. Turtle-Bat represents the power of patience, the wisdom of time, and the ability to navigate through darkness.

*"Time reveals all truths to those who wait with the patience of Turtle-Bat."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Turtle-Bat.png`,
    greeting: 'Patience and perception guide the wise path! 🐢🦇',
    dailyMessage: 'Trust in timing and let Turtle-Bat\'s wisdom guide your patience today!'
  },

  'snake-quetzal': {
    name: 'Snake-Quetzal',
    emoji: '🐦',
    element: 'Air',
    rarity: 'Legendary',
    color: '#00ced1',
    powers: [
      '🐍 Transformation Mastery',
      '🌈 Rainbow Bridge Creation',
      '🦅 Divine Flight Ability',
      '🎭 Shape-shifting Magic'
    ],
    personality: 'Mystical transformer with divine connection and shape-shifting abilities',
    elements: ['Air', 'Spirit'],
    description: `🐦 **Snake-Quetzal**

**Element:** Air & Spirit 🌬️✨
**Rarity:** Legendary 💎
**Origin:** Sacred fusion of Serpent wisdom and Quetzal divinity

This divine creature combines the snake's transformative power with the quetzal's sacred beauty. Snake-Quetzal represents spiritual transformation, divine connection, and the bridge between earthly and celestial realms.

*"Through transformation and flight, Snake-Quetzal connects all realms of existence."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Snake-Quetzal.png`,
    greeting: 'Transform and ascend to new spiritual heights! 🐍🌈',
    dailyMessage: 'Embrace transformation and connect with your higher self through Snake-Quetzal!'
  },

  'horse-phoenix': {
    name: 'Horse-Phoenix',
    emoji: '🐴',
    element: 'Fire',
    rarity: 'Mythic',
    color: '#ff6347',
    powers: [
      '🔥 Rebirth Flames',
      '🐴 Freedom Spirit',
      '🌅 Dawn Resurrection',
      '💫 Eternal Life Force'
    ],
    personality: 'Free spirit with rebirth powers and eternal optimism',
    elements: ['Fire', 'Light'],
    description: `🐴 **Horse-Phoenix**

**Element:** Fire & Light 🔥💫
**Rarity:** Mythic ⭐
**Origin:** Legendary fusion of Horse freedom and Phoenix rebirth

This mythical creature embodies the horse's wild freedom with the phoenix's rebirth power. Horse-Phoenix represents liberation, renewal, and the eternal cycle of transformation and growth.

*"From the ashes of the old, Horse-Phoenix gallops toward infinite possibilities."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Horse-Phoenix.png`,
    greeting: 'Rise from challenges stronger than before! 🐴🔥',
    dailyMessage: 'Embrace renewal and let Horse-Phoenix carry you to new beginnings!'
  },

  'cat-chameleon': {
    name: 'Cat-Chameleon',
    emoji: '🐱',
    element: 'Earth',
    rarity: 'Common',
    color: '#9acd32',
    powers: [
      '🐱 Nine Lives Resilience',
      '🦎 Environment Adaptation',
      '👁️ Color-shifting Camouflage',
      '🎭 Personality Flexibility'
    ],
    personality: 'Adaptable survivor with flexible nature and keen observation',
    elements: ['Earth', 'Spirit'],
    description: `🐱 **Cat-Chameleon**

**Element:** Earth & Spirit 🌍✨
**Rarity:** Common 💚
**Origin:** Blend of Cat independence and Chameleon adaptability

This clever creature combines the cat's independent nature with the chameleon's adaptive abilities. Cat-Chameleon teaches us about flexibility, observation, and the art of blending in while maintaining our unique identity.

*"In adaptation lies survival, in observation lies wisdom - Cat-Chameleon knows both."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Cat-Chameleon.png`,
    greeting: 'Adapt and observe - wisdom lies in flexibility! 🐱🦎',
    dailyMessage: 'Stay flexible and observant with Cat-Chameleon\'s adaptive wisdom!'
  },

  'sheep-coyote': {
    name: 'Sheep-Coyote',
    emoji: '🐑',
    element: 'Earth',
    rarity: 'Uncommon',
    color: '#daa520',
    powers: [
      '🐑 Community Harmony',
      '🐺 Wild Instinct Access',
      '🌾 Pastoral Peace Energy',
      '🎭 Dual Nature Balance'
    ],
    personality: 'Peaceful yet wild, balancing community needs with individual freedom',
    elements: ['Earth', 'Air'],
    description: `🐑 **Sheep-Coyote**

**Element:** Earth & Air 🌍🌬️
**Rarity:** Uncommon 💚
**Origin:** Balance of Sheep community and Coyote wildness

This balanced creature merges the sheep's community spirit with the coyote's wild independence. Sheep-Coyote represents the harmony between belonging to a group and maintaining individual freedom.

*"In the balance of wild and tame, Sheep-Coyote finds the perfect harmony."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Sheep-Coyote.png`,
    greeting: 'Find balance between community and independence! 🐑🌾',
    dailyMessage: 'Balance your social connections with personal freedom using Sheep-Coyote wisdom!'
  },

  'crab-dragonfly': {
    name: 'Crab-Dragonfly',
    emoji: '🦀',
    element: 'Water',
    rarity: 'Rare',
    color: '#20b2aa',
    powers: [
      '🦀 Sideways Problem Solving',
      '🦋 Multi-dimensional Vision',
      '🌊 Tidal Flow Mastery',
      '✨ Iridescent Energy Weaving'
    ],
    personality: 'Creative problem-solver with unique perspectives and fluid grace',
    elements: ['Water', 'Air'],
    description: `🦀 **Crab-Dragonfly**

**Element:** Water & Air 💧🌬️
**Rarity:** Rare 💎
**Origin:** Fusion of Crab sideways thinking and Dragonfly vision

This innovative creature combines the crab's lateral thinking with the dragonfly's multifaceted vision. Crab-Dragonfly teaches us to approach problems from unique angles and see situations from multiple perspectives.

*"When the direct path is blocked, Crab-Dragonfly reveals the side roads to success."*`,
    imageUrl: `${config.ALBJ_WEBSITE_URL}/Images/Crab-Dragonfly.png`,
    greeting: 'Think outside the box and see all angles! 🦀✨',
    dailyMessage: 'Approach challenges creatively with Crab-Dragonfly\'s unique perspective!'
  }
};

// Utility functions
function getRandomSpirit() {
  const spiritKeys = Object.keys(alebrijeSpirits);
  const randomKey = spiritKeys[Math.floor(Math.random() * spiritKeys.length)];
  return alebrijeSpirits[randomKey];
}

function getSpiritByName(name) {
  const normalizedName = name.toLowerCase().replace(/[^a-z]/g, '-');
  return alebrijeSpirits[normalizedName] || null;
}

function getAllSpirits() {
  return Object.values(alebrijeSpirits);
}

function getSpiritsByElement(element) {
  return Object.values(alebrijeSpirits).filter(spirit => 
    spirit.elements.includes(element)
  );
}

function getSpiritsByRarity(rarity) {
  return Object.values(alebrijeSpirits).filter(spirit => 
    spirit.rarity === rarity
  );
}

function getTodaysSpirit() {
  // Get a "random" spirit based on the day of year for consistency
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const spiritKeys = Object.keys(alebrijeSpirits);
  const spiritIndex = dayOfYear % spiritKeys.length;
  return alebrijeSpirits[spiritKeys[spiritIndex]];
}

module.exports = {
  alebrijeSpirits,
  getRandomSpirit,
  getSpiritByName,
  getAllSpirits,
  getSpiritsByElement,
  getSpiritsByRarity,
  getTodaysSpirit
}; 