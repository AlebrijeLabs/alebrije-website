// src/pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import "./HomePage.css"; // ✅ Make sure this is included
import { useWallet } from "@solana/wallet-adapter-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGithub, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { TestBurnModal, TestTransferModal, TestHistoryModal } from '../components/TestModeModals';
import DynamicWalletButton from '../components/DynamicWalletButton';

const HomePage: React.FC = () => {
    const { connected, publicKey, disconnect } = useWallet();
    
    // Test mode detection from URL parameter
    const [isTestMode, setIsTestMode] = useState(false);
    
    // Array of all 12 ALBJ images
    const floatingImages = [
        'Crab-Dragonfly.png',
        'Sheep-Coyote.png', 
        'Cat-Chameleon.png',
        'Horse-Phoenix.png',
        'Snake-Quetzal.png',
        'Turtle-Bat.png',
        'Wolf-Fish.png',
        'Eagle-Lizard.png',
        'Frog-Hummingbird.png',
        'Owl-Serpent.png',
        'Dragon-Jaguar.png',
        'Fox-Butterfly.png'
    ];

    // State for FAQ accordion
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    
    // State for newsletter signup
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    
    // State for countdown timer
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // State for wallet dashboard
    const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);
    const [showPreLaunchModal, setShowPreLaunchModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [addressCopied, setAddressCopied] = useState(false);

    // State for language selector
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // State for test mode modals
    const [showTestBurnModal, setShowTestBurnModal] = useState(false);
    const [showTestTransferModal, setShowTestTransferModal] = useState(false);
    const [showTestHistoryModal, setShowTestHistoryModal] = useState(false);

    // Check for test mode on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const testMode = urlParams.get('testmode') === 'true';
        setIsTestMode(testMode);
        
        if (testMode) {
            console.log('🧪 TEST MODE ACTIVATED');
            console.log('⚠️  You are now in devnet testing mode');
            console.log('🔗 Real token operations enabled');
        }
    }, []);

    // Countdown timer effect
    useEffect(() => {
        const launchDate = new Date('2025-06-12T00:00:00Z').getTime();
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;
            
            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // FAQ toggle function
    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    // Newsletter signup function
    const handleNewsletterSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            // Here you would integrate with your email service
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    // Wallet dashboard functions
    const toggleDashboard = () => {
        setIsDashboardExpanded(!isDashboardExpanded);
    };

    const copyAddress = async () => {
        if (publicKey) {
            try {
                await navigator.clipboard.writeText(publicKey.toString());
                setAddressCopied(true);
                setTimeout(() => setAddressCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy address:', err);
            }
        }
    };

    const handlePreLaunchAction = (action: string) => {
        // In test mode, show actual functionality modals
        if (isTestMode && connected) {
            switch (action) {
                case 'burn':
                    setShowTestBurnModal(true);
                    break;
                case 'transfer':
                    setShowTestTransferModal(true);
                    break;
                case 'history':
                    setShowTestHistoryModal(true);
                    break;
                case 'settings':
                    // For settings, still show pre-launch modal even in test mode
                    const settingsMessage = '⚙️ Advanced wallet settings will be available after launch. Stay tuned for powerful management tools!';
                    setModalMessage(settingsMessage);
                    setShowPreLaunchModal(true);
                    break;
                default:
                    break;
            }
        } else {
            // Normal pre-launch behavior
            const messages = {
                burn: '🔥 Token burning will be available after ALBJ launches on June 12, 2025! Get ready to reduce supply and increase scarcity.',
                transfer: '🚀 Token transfers will be enabled when ALBJ goes live! Connect early to be ready for launch day.',
                history: '📋 Transaction history will track all your ALBJ activities post-launch. Your journey starts June 12th!',
                settings: '⚙️ Advanced wallet settings will be available after launch. Stay tuned for powerful management tools!'
            };
            setModalMessage(messages[action as keyof typeof messages] || 'This feature will be available at launch!');
            setShowPreLaunchModal(true);
        }
    };

    const closeModal = () => {
        setShowPreLaunchModal(false);
        setModalMessage('');
    };

    const handleLanguageClick = () => {
        setShowLanguageModal(true);
    };

    const closeLanguageModal = () => {
        setShowLanguageModal(false);
    };

    const handleDisconnect = async () => {
        try {
            console.log('=== DISCONNECT ATTEMPT START ===');
            console.log('Current connected state:', connected);
            console.log('Current publicKey:', publicKey?.toString());
            
            // Method 1: Standard wallet adapter disconnect
            console.log('Attempting standard disconnect...');
            await disconnect();
            console.log('Standard disconnect completed');
            
            // Method 2: Force refresh wallet state if still connected
            if (connected) {
                console.log('Still connected, trying force refresh...');
                window.location.reload();
                return;
            }
            
            console.log('=== DISCONNECT SUCCESS ===');
        } catch (error) {
            console.error('=== DISCONNECT ERROR ===');
            const errorObj = error as Error;
            console.error('Error type:', errorObj.name);
            console.error('Error message:', errorObj.message);
            console.error('Full error:', error);
            
            // Fallback: Try direct Phantom disconnect
            try {
                console.log('Trying Phantom direct disconnect...');
                if (window.solana && window.solana.isPhantom) {
                    await window.solana.disconnect();
                    console.log('Phantom direct disconnect successful');
                    window.location.reload(); // Force page refresh
                }
            } catch (phantomError) {
                console.error('Phantom direct disconnect failed:', phantomError);
                // Ultimate fallback - force page refresh
                console.log('Force refreshing page as final fallback...');
                window.location.reload();
            }
        }
    };

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // FAQ data
    const faqData = [
        {
            question: "What is ALBJ Token?",
            answer: "ALBJ is a culturally inspired meme coin that fuses global folklore, ancestral traditions, and decentralized finance. It draws from spirit creatures like Alebrijes, Greek Chimeras, Egyptian Sphinxes, and Japanese Yōkai to create a unique blockchain experience."
        },
        {
            question: "When does ALBJ launch?",
            answer: "ALBJ launches on June 12, 2025 (VI·XII·MMXXV). 50% of the supply will be burned at launch, and the SpiritBridge will open for trading."
        },
        {
            question: "What blockchain is ALBJ on?",
            answer: "ALBJ is built on Solana, offering fast transactions and low fees. You'll need a Solana-compatible wallet like Phantom or Solflare to interact with ALBJ."
        },
        {
            question: "What is the total supply?",
            answer: "ALBJ has a total supply of 9 billion tokens. 50% (4.5 billion) will be burned at launch, with the remaining distributed among community airdrops, liquidity, marketing, ecosystem development, and founders."
        },
        {
            question: "How can I buy ALBJ?",
            answer: "After launch, you can buy ALBJ on Solana DEXs like Raydium and Jupiter. Get a Solana wallet, add SOL, connect to a DEX, and swap SOL for ALBJ using our contract address."
        },
        {
            question: "What are the transaction fees?",
            answer: "ALBJ has a 5% buy/sell tax: 3% goes to liquidity pool, 1% to marketing/development, 1% to charity, and 1% is burned for ongoing deflation."
        },
        {
            question: "Will there be NFTs?",
            answer: "Yes! Phase 1 includes launching Dreammint Spirit NFTs, which will be unique digital art pieces inspired by global spirit creatures and folklore."
        },
        {
            question: "Is ALBJ audited?",
            answer: "The contracts are currently community-tested, with a formal audit planned post-launch. All founder tokens are locked and vested for transparency."
        }
    ];

    return (
        <div className="home-container">
            {/* Navigation Header */}
            <nav className="nav-header">
                <div className="nav-content">
                    <div className="nav-logo">
                        <img src="/logo.png" alt="ALBJ" className="nav-logo-img" />
                        <span className="nav-brand">ALBJ</span>
                    </div>
                    <ul className="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#countdown">Launch</a></li>
                        <li><a href="#tokenomics">Tokenomics</a></li>
                        <li><a href="#how-to-buy">How to Buy</a></li>
                        <li><a href="#roadmap">Roadmap</a></li>
                        <li><a href="#faq">FAQ</a></li>
                        <li><a href="/whitepaper.pdf" target="_blank">Whitepaper</a></li>
                    </ul>
                    <div className="nav-language">
                        <button className="language-button" onClick={handleLanguageClick}>
                            🌐 EN
                        </button>
                    </div>
                    <div className="nav-wallet">
                        <DynamicWalletButton />
                    </div>
                </div>
            </nav>

            {/* Address Copied Notification */}
            {addressCopied && (
                <div className="copy-notification">
                    ✅ Address copied to clipboard!
                </div>
            )}

            {/* Test Mode Indicator */}
            {isTestMode && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                    color: '#000000',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    zIndex: 9998,
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                    animation: 'pulse 2s infinite'
                }}>
                    🧪 TEST MODE ACTIVE
                </div>
            )}

            {/* Pre-Launch Modal */}
            {showPreLaunchModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🚀 Coming Soon!</h3>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>{modalMessage}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn" onClick={closeModal}>
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Mode Modals */}
            <TestBurnModal 
                isOpen={showTestBurnModal} 
                onClose={() => setShowTestBurnModal(false)} 
            />
            <TestTransferModal 
                isOpen={showTestTransferModal} 
                onClose={() => setShowTestTransferModal(false)} 
            />
            <TestHistoryModal 
                isOpen={showTestHistoryModal} 
                onClose={() => setShowTestHistoryModal(false)} 
            />

            {/* Language Modal */}
            {showLanguageModal && (
                <div className="modal-overlay" onClick={closeLanguageModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🌍 Global Expansion Coming Soon!</h3>
                            <button className="modal-close" onClick={closeLanguageModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>🎭 ALBJ will soon speak the languages of global folklore!</p>
                            <br />
                            <p><strong>Coming Post-Launch:</strong></p>
                            <div className="language-list">
                                <p>🇪🇸 Español (Spanish) - Honoring Alebrije origins</p>
                                <p>🇯🇵 日本語 (Japanese) - Celebrating Yōkai spirits</p>
                                <p>🇨🇳 中文 (Chinese) - Embracing ancient mythology</p>
                                <p>🇰🇷 한국어 (Korean) - And more languages to come!</p>
                            </div>
                            <br />
                            <p>Join our global community as we bridge cultures through the universal language of spirit creatures! 🔮</p>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-btn" onClick={closeLanguageModal}>
                                ¡Perfecto!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating ALBJ Images */}
            <div className="floating-images-container">
                {floatingImages.map((image, index) => (
                    <img
                        key={index}
                        src={`/Images/${image}`}
                        alt={`ALBJ ${image.replace('.png', '').replace('-', ' ')}`}
                        className={`floating-image floating-image-${index + 1}`}
                    />
                ))}
            </div>

            <div id="home" className="hero-section">
                <img src="/logo.png" alt="ALBJ Logo" className="logo" />
                <h1 className="main-title">
                    Welcome to ALBJ Token
                </h1>

                <p className="subtitle">
                    A vibrant global folk art-inspired meme coin on Solana
                </p>
            </div>

            {/* Launch Countdown Timer */}
            <div id="countdown" className="countdown-section">
                <h2 className="countdown-title">🚀 Launch Countdown</h2>
                <p className="countdown-subtitle">The portal opens June 12, 2025</p>
                <div className="countdown-timer">
                    <div className="countdown-item">
                        <span className="countdown-number">{timeLeft.days}</span>
                        <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-item">
                        <span className="countdown-number">{timeLeft.hours}</span>
                        <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-item">
                        <span className="countdown-number">{timeLeft.minutes}</span>
                        <span className="countdown-label">Minutes</span>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-item">
                        <span className="countdown-number">{timeLeft.seconds}</span>
                        <span className="countdown-label">Seconds</span>
                    </div>
                </div>
                
                {/* Newsletter Signup */}
                <div className="newsletter-signup">
                    <h3 className="newsletter-title">Get Notified on Launch Day</h3>
                    <p className="newsletter-description">Be the first to know when ALBJ goes live!</p>
                    <form onSubmit={handleNewsletterSignup} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="newsletter-input"
                            required
                        />
                        <button type="submit" className="newsletter-button">
                            🔔 Notify Me
                        </button>
                    </form>
                    {isSubscribed && (
                        <div className="newsletter-success">
                            ✅ Thanks! You'll be notified when ALBJ launches!
                        </div>
                    )}
                </div>
            </div>

            <div className="story-section">
                <p className="story-text">
                    ALBJ is a culturally inspired meme coin that fuses global folklore, ancestral traditions, dream-world symbology, and decentralized finance into a powerful new digital asset. Drawing from the vibrant and inter-dimensional realm of spirit-creatures — beings that combine elemental and animal forms — ALBJ bridges humanity's timeless myths with the future-facing realities of Web3 ecosystems.
                </p>
                <p className="story-text">
                    Hybrid and chimera-like creatures have appeared throughout humanity's oldest civilizations, from Greek mythology's Chimera to Egyptian Sphinxes, Japanese Yōkai, and the colorful spirit-creatures known as Alebrijes in Mexico. By tapping into these universal archetypes, ALBJ becomes a global guide of imagination, resilience, and cultural storytelling for the blockchain era.
                </p>
                <p className="story-text highlight">
                    ALBJ honors and continues this ancient tradition, acting as a spirit token that transcends boundaries and speaks to the universal human need for guidance across dimensions.
                </p>
                <p className="story-text">
                    This token serves as a modern spirit guide for users navigating the ever-shifting landscapes of DeFi, NFTs, digital identity, and the interdimensional layers of blockchain reality.
                </p>
            </div>

            {/* Tokenomics Section */}
            <div id="tokenomics" className="info-section">
                <h2 className="section-title">💰 Tokenomics</h2>
                <div className="tokenomics-grid">
                    <div className="tokenomics-card">
                        <h3>Total Supply</h3>
                        <p className="big-number">9,000,000,000 ALBJ</p>
                    </div>
                    <div className="tokenomics-card">
                        <h3>Launch Burn</h3>
                        <p className="big-number">50%</p>
                        <p className="small-text">4.5B ALBJ burned at launch</p>
                    </div>
                    <div className="tokenomics-breakdown">
                        <h3>Token Distribution</h3>
                        <div className="breakdown-item">
                            <span>🔥 Burn at Launch</span>
                            <span>50%</span>
                        </div>
                        <div className="breakdown-item">
                            <span>🎁 Community Airdrops</span>
                            <span>10%</span>
                        </div>
                        <div className="breakdown-item">
                            <span>💧 Liquidity Pool</span>
                            <span>20%</span>
                        </div>
                        <div className="breakdown-item">
                            <span>📈 Marketing & Growth</span>
                            <span>10%</span>
                        </div>
                        <div className="breakdown-item">
                            <span>🛠️ Ecosystem Development</span>
                            <span>5%</span>
                        </div>
                        <div className="breakdown-item">
                            <span>👥 Founders & Advisors</span>
                            <span>5%</span>
                        </div>
                    </div>
                    <div className="transaction-mechanics">
                        <h3>Transaction Mechanics</h3>
                        <p><strong>Max Wallet:</strong> 2% of supply</p>
                        <p><strong>Buy/Sell Tax:</strong> 5% total</p>
                        <div className="tax-breakdown">
                            <div>3% → Liquidity Pool</div>
                            <div>1% → Marketing/Development</div>
                            <div>1% → Charity</div>
                            <div>1% → Ongoing Burn</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Buy Section */}
            <div id="how-to-buy" className="info-section">
                <h2 className="section-title">🛒 How to Buy ALBJ</h2>
                <div className="how-to-buy">
                    <div className="buy-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Get a Solana Wallet</h3>
                            <p>Download Phantom, Solflare, or another Solana-compatible wallet</p>
                        </div>
                    </div>
                    <div className="buy-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Add SOL</h3>
                            <p>Purchase SOL from an exchange and transfer to your wallet</p>
                        </div>
                    </div>
                    <div className="buy-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Connect to DEX</h3>
                            <p>Use Raydium, Jupiter, or other Solana DEXs</p>
                        </div>
                    </div>
                    <div className="buy-step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Swap SOL for ALBJ</h3>
                            <p>Enter the contract address and swap your SOL for ALBJ tokens</p>
                        </div>
                    </div>
                </div>
                <div className="launch-notice">
                    <h3>🚀 Launch Date: June 12, 2025</h3>
                    <p>The portal opens on VI·XII·MMXXV - When the spirits awaken!</p>
                </div>
            </div>

            {/* Wallet Dashboard - Only shows when connected */}
            {connected && (
                <div className="wallet-dashboard">
                    <div className="dashboard-header" onClick={toggleDashboard}>
                        <div className="dashboard-title">
                            <span className="dashboard-icon">💼</span>
                            <span>Wallet Dashboard</span>
                        </div>
                        <FontAwesomeIcon 
                            icon={isDashboardExpanded ? faChevronUp : faChevronDown} 
                            className="dashboard-toggle"
                        />
                    </div>
                    
                    {isDashboardExpanded && (
                        <div className="dashboard-content">
                            <div className="dashboard-info">
                                <div className="wallet-status">
                                    <span className="status-indicator">✅</span>
                                    <span className="status-text">Connected</span>
                                </div>
                                
                                <div className="wallet-network">
                                    <span className="network-label">Network:</span>
                                    <span className="network-value">🌐 Solana Mainnet</span>
                                </div>
                                
                                <div className="wallet-address">
                                    <span className="address-label">Account:</span>
                                    <div className="address-display">
                                        <span className="address-value">
                                            {publicKey ? truncateAddress(publicKey.toString()) : 'N/A'}
                                        </span>
                                        <button 
                                            className="copy-button" 
                                            onClick={copyAddress}
                                            title="Copy Address"
                                        >
                                            <FontAwesomeIcon icon={faCopy} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="wallet-balance">
                                    <span className="balance-label">ALBJ Balance:</span>
                                    <span className="balance-value">Available June 12, 2025</span>
                                </div>
                            </div>
                            
                            <div className="dashboard-actions">
                                <div className="action-buttons">
                                    <button 
                                        className="action-btn burn-btn-dash"
                                        onClick={() => handlePreLaunchAction('burn')}
                                    >
                                        🔥 Burn Tokens
                                    </button>
                                    <button 
                                        className="action-btn transfer-btn-dash"
                                        onClick={() => handlePreLaunchAction('transfer')}
                                    >
                                        🚀 Transfer
                                    </button>
                                    <button 
                                        className="action-btn history-btn-dash"
                                        onClick={() => handlePreLaunchAction('history')}
                                    >
                                        📋 History
                                    </button>
                                    <button 
                                        className="action-btn settings-btn-dash"
                                        onClick={() => handlePreLaunchAction('settings')}
                                    >
                                        ⚙️ Settings
                                    </button>
                                </div>
                                
                                <button 
                                    className="disconnect-btn"
                                    onClick={handleDisconnect}
                                >
                                    ❌ Disconnect Wallet
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Roadmap Section */}
            <div id="roadmap" className="info-section">
                <h2 className="section-title">🗺️ Roadmap</h2>
                <div className="roadmap">
                    <div className="roadmap-phase">
                        <div className="phase-header">
                            <h3>Phase 0: Origin</h3>
                            <span className="phase-time">Q1 2025</span>
                        </div>
                        <ul>
                            <li>✅ Whitepaper & branding development</li>
                            <li>✅ Website and social media launch</li>
                            <li>✅ Initial lore reveal and teaser campaigns</li>
                        </ul>
                    </div>
                    <div className="roadmap-phase">
                        <div className="phase-header">
                            <h3>Phase 1: Awakening</h3>
                            <span className="phase-time">Q2 2025</span>
                        </div>
                        <ul>
                            <li>🎨 Launch Dreammint Spirit NFTs</li>
                            <li>🏛️ Activate Guardian Guilds DAO</li>
                            <li>🌉 Deploy SpiritBridge cross-chain protocol</li>
                        </ul>
                    </div>
                    <div className="roadmap-phase">
                        <div className="phase-header">
                            <h3>Phase 2: Expansion</h3>
                            <span className="phase-time">Q3 2025</span>
                        </div>
                        <ul>
                            <li>🎮 Launch Path of the Alebrije learning quests</li>
                            <li>🏦 Listing on Tier 2 centralized exchanges</li>
                            <li>🌍 Global Lore Awakening Campaign</li>
                        </ul>
                    </div>
                    <div className="roadmap-phase">
                        <div className="phase-header">
                            <h3>Phase 3: Ascension</h3>
                            <span className="phase-time">Q4 2025</span>
                        </div>
                        <ul>
                            <li>🌌 Beta launch of AlebrijeVerse dApp</li>
                            <li>🎪 Global Festival of the Spirits</li>
                            <li>🗳️ Community-governed lore expansion</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Contract Address Section */}
            <div id="contract" className="info-section">
                <h2 className="section-title">📋 Contract Address</h2>
                <div className="contract-section">
                    <div className="contract-placeholder">
                        <h3>🚀 Coming June 12, 2025</h3>
                        <p>The contract address will be revealed when the portal opens!</p>
                        <p className="warning-text">⚠️ Beware of fake tokens before launch date</p>
                    </div>
                    <div className="pre-launch-info">
                        <h3>Pre-Launch Security</h3>
                        <p>✅ Community-tested contracts</p>
                        <p>🔍 Formal audit planned post-launch</p>
                        <p>🔒 Founder tokens locked & vested</p>
                        <p>🔥 50% supply burned at launch</p>
                    </div>
                </div>
            </div>

            <div className="button-group">
                <a
                    href="https://albj.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                >
                    <img src="/logo.png" alt="ALBJ" className="button-logo" />
                    Visit albj.io
                </a>
                <a
                    href="/whitepaper.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitepaper-link"
                >
                    📄 View Whitepaper
                </a>
            </div>

            <div className="social-links">
                <a href="https://x.com/ALBJToken" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                    <FontAwesomeIcon icon={faTwitter} />
                    <span>X</span>
                </a>
                <a href="https://github.com/AlebrijeLabs" target="_blank" rel="noopener noreferrer" className="social-link github">
                    <FontAwesomeIcon icon={faGithub} />
                    <span>GitHub</span>
                </a>
                <a href="https://t.me/ALBJTokenBot" target="_blank" rel="noopener noreferrer" className="social-link telegram">
                    <FontAwesomeIcon icon={faTelegram} />
                    <span>Telegram</span>
                </a>
                <a href="https://discord.gg/vrBnKB68" target="_blank" rel="noopener noreferrer" className="social-link discord">
                    <FontAwesomeIcon icon={faDiscord} />
                    <span>Discord</span>
                </a>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="info-section">
                <h2 className="section-title">❓ FAQ</h2>
                <div className="faq-container">
                    {faqData.map((faq, index) => (
                        <div key={index} className={`faq-item ${openFAQ === index ? 'open' : ''}`} onClick={() => toggleFAQ(index)}>
                            <div className="faq-question">
                                <span>{faq.question}</span>
                                <span className="faq-toggle">{openFAQ === index ? '−' : '+'}</span>
                            </div>
                            <div className="faq-answer">
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Section */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>ALBJ Token</h3>
                        <p>Global folk art-inspired meme coin bridging ancient wisdom with DeFi innovation.</p>
                        <div className="footer-social">
                            <a href="https://x.com/ALBJToken" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a href="https://t.me/ALBJTokenBot" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faTelegram} />
                            </a>
                            <a href="https://discord.gg/vrBnKB68" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faDiscord} />
                            </a>
                            <a href="https://github.com/AlebrijeLabs" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#tokenomics">Tokenomics</a></li>
                            <li><a href="#roadmap">Roadmap</a></li>
                            <li><a href="#how-to-buy">How to Buy</a></li>
                            <li><a href="/whitepaper.pdf" target="_blank">Whitepaper</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Resources</h3>
                        <ul className="footer-links">
                            <li><a href="https://github.com/AlebrijeLabs" target="_blank">Documentation</a></li>
                            <li><a href="https://github.com/AlebrijeLabs" target="_blank">Source Code</a></li>
                            <li><a href="mailto:contact@albj.io">Contact Us</a></li>
                            <li><a href="https://albj.io" target="_blank">Official Website</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <p>&copy; 2025 ALBJ Token. All rights reserved.</p>
                            <p>Guiding spirit creatures into the multiverse since 2025.</p>
                        </div>
                        <div className="legal-links">
                            <a href="/whitepaper.pdf" target="_blank">Legal Disclaimer</a>
                            <span>•</span>
                            <a href="/whitepaper.pdf" target="_blank">Privacy Policy</a>
                            <span>•</span>
                            <a href="mailto:admin@albj.io">Contact</a>
                        </div>
                    </div>
                    <div className="footer-disclaimer">
                        <p className="disclaimer-text">
                            ⚠️ <strong>Risk Warning:</strong> ALBJ is a meme token with no intrinsic value or utility. It is not a financial product. Interacting with ALBJ (including burning or transferring tokens) carries financial risk. Cryptocurrency markets are highly volatile — only use what you can afford to lose. This site does not offer investment advice. Always do your own research (DYOR).
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;




