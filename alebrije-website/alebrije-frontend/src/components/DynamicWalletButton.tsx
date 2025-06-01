import React, { useState, useRef, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faSignOutAlt, faChevronDown, faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import './DynamicWalletButton.css';

// Wallet icon mapping
const walletIcons = {
  phantom: '👻',
  solflare: '☀️', 
  backpack: '🎒',
  glow: '✨',
  slope: '📱',
  coinbase: '💙',
  trust: '🛡️',
  default: '💼'
};

// Additional wallet logo URLs (for more professional look)
const walletLogos = {
  phantom: 'https://phantom.app/img/meta/phantom.png',
  solflare: 'https://solflare.com/assets/solflare.svg',
  backpack: 'https://backpack.app/logo.png',
  glow: 'https://glow.app/logo.png',
  default: null
};

const DynamicWalletButton: React.FC = () => {
  const { connected, wallet, connecting, publicKey, disconnect } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get wallet name and normalize it
  const getWalletName = () => {
    if (!wallet?.adapter?.name) return 'default';
    return wallet.adapter.name.toLowerCase();
  };

  // Get wallet icon based on connected wallet
  const getWalletIcon = () => {
    const walletName = getWalletName();
    
    // Check for specific wallet names
    if (walletName.includes('phantom')) return walletIcons.phantom;
    if (walletName.includes('solflare')) return walletIcons.solflare;
    if (walletName.includes('backpack')) return walletIcons.backpack;
    if (walletName.includes('glow')) return walletIcons.glow;
    if (walletName.includes('slope')) return walletIcons.slope;
    if (walletName.includes('coinbase')) return walletIcons.coinbase;
    if (walletName.includes('trust')) return walletIcons.trust;
    
    return walletIcons.default;
  };

  // Get wallet display name
  const getWalletDisplayName = () => {
    if (!wallet?.adapter?.name) return 'Wallet';
    
    const name = wallet.adapter.name;
    // Capitalize first letter and clean up name
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/wallet/i, '').trim();
  };

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Copy address to clipboard
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

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Disconnect error:', error);
      // Fallback: Force page refresh
      window.location.reload();
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (connected && publicKey) {
    return (
      <div className="dynamic-wallet-connected" ref={dropdownRef}>
        <button className="wallet-button-connected" onClick={toggleDropdown}>
          <div className="wallet-info">
            <div className="wallet-icon">{getWalletIcon()}</div>
            <div className="wallet-details">
              <div className="wallet-name">{getWalletDisplayName()}</div>
              <div className="wallet-address">{truncateAddress(publicKey.toString())}</div>
            </div>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="wallet-dropdown">
            <div className="dropdown-header">
              <div className="dropdown-wallet-info">
                <div className="dropdown-icon">{getWalletIcon()}</div>
                <div className="dropdown-details">
                  <div className="dropdown-wallet-name">{getWalletDisplayName()}</div>
                  <div className="dropdown-address">{publicKey.toString()}</div>
                </div>
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-actions">
              <button className="dropdown-action" onClick={copyAddress}>
                <FontAwesomeIcon icon={faCopy} />
                <span>{addressCopied ? 'Copied!' : 'Copy Address'}</span>
              </button>
              
              <button className="dropdown-action disconnect-action" onClick={handleDisconnect}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}

        {/* Copy notification */}
        {addressCopied && (
          <div className="copy-notification-wallet">
            ✅ Address copied!
          </div>
        )}
      </div>
    );
  }

  // When connecting
  if (connecting) {
    return (
      <div className="dynamic-wallet-connecting">
        <div className="connecting-spinner"></div>
        <span>Connecting...</span>
      </div>
    );
  }

  // When not connected - show the standard multi-button but with custom styling
  return (
    <div className="dynamic-wallet-button">
      <WalletMultiButton>
        <div className="connect-wallet-content">
          <FontAwesomeIcon icon={faWallet} className="wallet-icon-default" />
          <span>Connect Wallet</span>
        </div>
      </WalletMultiButton>
    </div>
  );
};

export default DynamicWalletButton; 