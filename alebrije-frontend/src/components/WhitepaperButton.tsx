import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface WhitepaperButtonProps {
  buttonText: string;
  filePath: string;
  fileName: string;
}

const WhitepaperButton: React.FC<WhitepaperButtonProps> = ({ 
  buttonText, 
  filePath, 
  fileName 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    toast.info('Opening whitepaper...', { autoClose: 2000 });
    
    try {
      // Open the new dedicated whitepaper site in a new tab
      window.open('https://alebrije-whitepaper.netlify.app/', '_blank');
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error opening whitepaper:', error);
      toast.error('Could not open the whitepaper. Please try again.', {
        autoClose: 5000
      });
      
      setIsLoading(false);
    }
  };

  // CSS for animations
  const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Add the animation style to the document head
  React.useEffect(() => {
    // Only add the style if it doesn't exist yet
    if (!document.getElementById('whitepaper-button-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'whitepaper-button-styles';
      styleElement.innerHTML = spinAnimation;
      document.head.appendChild(styleElement);
    }

    // Clean up when component unmounts
    return () => {
      const styleElement = document.getElementById('whitepaper-button-styles');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={handleClick}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: isLoading ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          outline: 'none',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          margin: '0',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transform: isLoading ? 'scale(0.98)' : 'scale(1)',
          position: 'relative',
          overflow: 'hidden',
          minWidth: '200px'
        }}
        onMouseOver={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }
        }}
        onMouseOut={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          }
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
        disabled={isLoading}
      >
        {/* Button text */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isLoading ? (
            <>
              <svg 
                style={{ 
                  animation: 'spin 1.5s linear infinite',
                  marginRight: '8px',
                  height: '16px',
                  width: '16px'
                }} 
                viewBox="0 0 24 24"
              >
                <path 
                  fill="currentColor" 
                  d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" 
                />
              </svg>
              Opening...
            </>
          ) : (
            <>
              📄 {buttonText}
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default WhitepaperButton; 