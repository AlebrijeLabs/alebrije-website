import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.about': 'About',
      'nav.tokenomics': 'Tokenomics',
      'nav.roadmap': 'Roadmap',
      'nav.community': 'Community',
      
      // Hero Section
      'hero.title': 'ALBJ Token',
      'hero.subtitle': 'Guiding Spirit Creatures and Meme coins into the Multiverse',
      'hero.launch': 'Launching June 12, 2025 (VI·XII·MMXXV)',
      'hero.tokenomics': 'Tokenomics',
      'hero.joinDiscord': 'Join Discord',
      
      // About Section
      'about.title': 'What is ALBJ?',
      'about.paragraph1': 'ALBJ is a culturally inspired meme coin that fuses global folklore, ancestral traditions, dream-world symbology, and decentralized finance into a powerful new digital asset. Drawing from the vibrant and inter-dimensional realm of spirit-creatures — beings that combine elemental and animal forms — ALBJ bridges humanity\'s timeless myths with the future-facing realities of Web3 ecosystems.',
      'about.paragraph2': 'Hybrid and chimera-like creatures have appeared throughout humanity\'s oldest civilizations, from Greek mythology\'s Chimera to Egyptian Sphinxes, Japanese Yōkai, and the colorful spirit-creatures known as Alebrijes in Mexico. By tapping into these universal archetypes, ALBJ becomes a global guide of imagination, resilience, and cultural storytelling for the blockchain era.',
      'about.paragraph3': 'This token serves as a modern spirit guide for users navigating the ever-shifting landscapes of DeFi, NFTs, digital identity, and the interdimensional layers of blockchain reality.',
      'about.launchTitle': 'Launch Significance',
      'about.launchText': 'The portal opens on June 12, 2025 (VI·XII·MMXXV), a date chosen for its spiritual significance:',
      'about.launchItems': {
        'item1': '6: Represents harmony, balance, responsibility, and community',
        'item2': '1: Symbolizes leadership and initiation',
        'item3': '2: Resonates with partnership and duality',
        'item4': '5: Indicates transformation, freedom, and creativity'
      },
      
      // Tokenomics Section
      'tokenomics.title': 'Tokenomics',
      'tokenomics.tokenInfo': 'Token Information',
      'tokenomics.name': 'Name:',
      'tokenomics.symbol': 'Symbol:',
      'tokenomics.supply': 'Total Supply:',
      'tokenomics.walletLimit': 'Max Wallet Limit:',
      'tokenomics.distribution': 'Token Distribution',
      'tokenomics.tax': 'Transaction Tax',
      'tokenomics.taxText': 'Every transaction incurs a 5% tax, distributed as follows:',
      'tokenomics.features': 'Key Features',
      
      // Community Section
      'community.title': 'Join Our Community',
      'community.twitter': {
        'title': 'Twitter',
        'text': 'Follow us for the latest updates'
      },
      'community.discord': {
        'title': 'Discord',
        'text': 'Join our vibrant community'
      },
      'community.telegram': {
        'title': 'Telegram',
        'text': 'Chat with fellow Alebrije enthusiasts'
      },
      
      // Footer
      'footer.description': 'The vibrant global folk art-inspired meme coin on Solana',
      'footer.quickLinks': 'Quick Links',
      'footer.connect': 'Connect With Us',
      'footer.copyright': '© 2025 Alebrije Token. All rights reserved.',
      
      // Roadmap Section
      'roadmap.title': 'Roadmap',
      'roadmap.phase0': 'Phase 0: Origin (Q1 2025)',
      'roadmap.phase0Items': {
        'item1': 'Whitepaper, branding, and contract development',
        'item2': 'Website and social media launch',
        'item3': 'Initial lore reveal and teaser campaigns'
      },
      'roadmap.phase1': 'Phase 1: Awakening (Q2 2025)',
      'roadmap.phase1Items': {
        'item1': 'Launch Dreammint Spirit NFTs',
        'item2': 'Activate Guardian Guilds DAO',
        'item3': 'Deploy SpiritBridge cross-chain protocol'
      },
      'roadmap.phase2': 'Phase 2: Expansion (Q3 2025)',
      'roadmap.phase2Items': {
        'item1': 'Launch Path of the Alebrije learning quests',
        'item2': 'Listing on Tier 2 centralized exchanges',
        'item3': 'Global Lore Awakening Campaign across Latin America, Asia, and Europe'
      },
      'roadmap.phase3': 'Phase 3: Ascension (Q4 2025)',
      'roadmap.phase3Items': {
        'item1': 'Beta launch of AlebrijeVerse dApp (Spirit World Metaverse)',
        'item2': 'Global Festival of the Spirits (IRL and Metaverse)',
        'item3': 'Community-governed lore expansion through token voting'
      }
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.about': 'Acerca de',
      'nav.tokenomics': 'Tokenomics',
      'nav.roadmap': 'Hoja de Ruta',
      'nav.community': 'Comunidad',
      
      // Hero Section
      'hero.title': 'Token ALBJ',
      'hero.subtitle': 'Guiando Criaturas Espirituales y Meme coins hacia el Multiverso',
      'hero.launch': 'Lanzamiento 12 de Junio, 2025 (VI·XII·MMXXV)',
      'hero.tokenomics': 'Tokenomics',
      'hero.joinDiscord': 'Unirse a Discord',
      
      // About Section
      'about.title': '¿Qué es ALBJ?',
      'about.paragraph1': 'ALBJ es una moneda meme cultural inspirada en la leyenda que fusiona la cultura global, las tradiciones ancestrales, la simbología del mundo de los sueños y la economía descentralizada en una nueva inversión digital poderosa. Dibujando de los reinos vibrantes y multidimensionales de criaturas espirituales — seres que combinan formas elementales y animales — ALBJ une las mitologías inmortales de la humanidad con las realidades futuras de los ecosistemas Web3.',
      'about.paragraph2': 'Las criaturas hibridas y chimeras han aparecido a lo largo de las antiguas civilizaciones de la humanidad, desde la Chimera de la mitología griega hasta los Sphinxes egipcios, los Yōkai japoneses y las criaturas espirituales coloridas conocidas como Alebrijes en México. Al sumergirse en estos arquetipos universales, ALBJ se convierte en un guía global de la imaginación, la resiliencia y la narración cultural para la era blockchain.',
      'about.paragraph3': 'Este token sirve como guía espiritual moderna para los usuarios que navegan por los paisajes cambiantes de DeFi, NFTs, identidad digital y las capas interdimensionales de la realidad blockchain.',
      'about.launchTitle': 'Significado del Lanzamiento',
      'about.launchText': 'El portal se abre el 12 de junio de 2025 (VI·XII·MMXXV), una fecha elegida por su significado espiritual:',
      'about.launchItems': {
        'item1': '6: Representa la armonía, el equilibrio, la responsabilidad y la comunidad',
        'item2': '1: Simboliza la liderazgo y la iniciación',
        'item3': '2: Resonó con la asociación y la dualidad',
        'item4': '5: Indica la transformación, la libertad y la creatividad'
      },
      
      // Tokenomics Section
      'tokenomics.title': 'Tokenomics',
      'tokenomics.tokenInfo': 'Información del Token',
      'tokenomics.name': 'Nombre:',
      'tokenomics.symbol': 'Símbolo:',
      'tokenomics.supply': 'Oferta Total:',
      'tokenomics.walletLimit': 'Límite de Billetera Máxima:',
      'tokenomics.distribution': 'Distribución del Token',
      'tokenomics.tax': 'Impuesto de Transacción',
      'tokenomics.taxText': 'Cada transacción incurre en un impuesto del 5%, distribuido de la siguiente manera:',
      'tokenomics.features': 'Características Clave',
      
      // Community Section
      'community.title': 'Únete a Nuestra Comunidad',
      'community.twitter': {
        'title': 'Twitter',
        'text': 'Síguenos para las últimas actualizaciones'
      },
      'community.discord': {
        'title': 'Discord',
        'text': 'Únete a nuestra comunidad vibrante'
      },
      'community.telegram': {
        'title': 'Telegram',
        'text': 'Chatea con otros entusiastas de Alebrije'
      },
      
      // Footer
      // Add more Spanish translations...
    }
  },
  ja: {
    translation: {
      // Navigation
      'nav.about': '概要',
      'nav.tokenomics': 'トークノミクス',
      'nav.roadmap': 'ロードマップ',
      'nav.community': 'コミュニティ',
      
      // Hero Section
      'hero.title': 'ALBJトークン',
      'hero.subtitle': 'スピリットクリーチャーとミームコインをマルチバースへ導く',
      'hero.launch': '2025年6月12日ローンチ (VI·XII·MMXXV)',
      'hero.tokenomics': 'トークノミクス',
      'hero.joinDiscord': 'Discordに参加',
      
      // Add more Japanese translations...
    }
  },
  de: {
    translation: {
      // Navigation
      'nav.about': 'Über uns',
      'nav.tokenomics': 'Tokenomics',
      'nav.roadmap': 'Roadmap',
      'nav.community': 'Community',
      
      // Hero Section
      'hero.title': 'ALBJ Token',
      'hero.subtitle': 'Führt Geisterwesen und Meme-Coins ins Multiversum',
      'hero.launch': 'Start am 12. Juni 2025 (VI·XII·MMXXV)',
      'hero.tokenomics': 'Tokenomics',
      'hero.joinDiscord': 'Discord beitreten',
      
      // Add more German translations...
    }
  },
  el: {
    translation: {
      // Navigation
      'nav.about': 'Σχετικά',
      'nav.tokenomics': 'Tokenomics',
      'nav.roadmap': 'Χάρτης Πορείας',
      'nav.community': 'Κοινότητα',
      
      // Hero Section
      'hero.title': 'ALBJ Token',
      'hero.subtitle': 'Οδηγώντας Πνευματικά Πλάσματα και Meme coins στο Πολυσύμπαν',
      'hero.launch': 'Εκκίνηση 12 Ιουνίου 2025 (VI·XII·MMXXV)',
      'hero.tokenomics': 'Tokenomics',
      'hero.joinDiscord': 'Συμμετοχή στο Discord',
      
      // Add more Greek translations...
    }
  },
  ar: {
    translation: {
      // Navigation
      'nav.about': 'حول',
      'nav.tokenomics': 'الاقتصاد الرمزي',
      'nav.roadmap': 'خريطة الطريق',
      'nav.community': 'المجتمع',
      
      // Hero Section
      'hero.title': 'رمز ALBJ',
      'hero.subtitle': 'توجيه المخلوقات الروحية وعملات الميم إلى الكون المتعدد',
      'hero.launch': 'الإطلاق في 12 يونيو 2025 (VI·XII·MMXXV)',
      'hero.tokenomics': 'الاقتصاد الرمزي',
      'hero.joinDiscord': 'انضم إلى Discord',
      
      // Add more Arabic translations...
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 