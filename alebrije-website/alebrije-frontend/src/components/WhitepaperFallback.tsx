import React, { useState } from 'react';
import { toast } from 'react-toastify';

const WhitepaperFallback: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOptionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    toast.info('Opening whitepaper...');
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        📑 Access Options
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>ALEBRIJE Whitepaper Access Options</h2>
            <p>
              Choose from these options to access our whitepaper:
            </p>

            <div style={{ margin: '20px 0' }}>
              <h3>Option 1: Interactive Whitepaper Viewer</h3>
              <p>Our dedicated whitepaper site with multiple viewing options:</p>
              <a
                href="https://alebrije-whitepaper.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOptionClick}
                style={{
                  display: 'block',
                  padding: '10px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  color: '#333',
                  margin: '10px 0',
                }}
              >
                <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>✓ RECOMMENDED</span> - View Enhanced Whitepaper Viewer
              </a>
            </div>

            <div style={{ margin: '20px 0' }}>
              <h3>Option 2: Specific Viewer Options</h3>
              <p>Choose your preferred viewing method:</p>
              <a
                href="https://alebrije-whitepaper.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOptionClick}
                style={{
                  display: 'block',
                  padding: '10px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  color: '#333',
                  margin: '10px 0',
                }}
              >
                Default PDF Viewer
              </a>
              <a
                href="https://docs.google.com/viewer?url=https://alebrije-whitepaper.netlify.app/whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOptionClick}
                style={{
                  display: 'block',
                  padding: '10px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  color: '#333',
                  margin: '10px 0',
                }}
              >
                Google Docs Viewer
              </a>
            </div>

            <div style={{ margin: '20px 0' }}>
              <h3>Option 3: Direct Download</h3>
              <p>Download the PDF file directly:</p>
              <a
                href="https://alebrije-whitepaper.netlify.app/whitepaper.pdf"
                download="ALEBRIJE_Whitepaper.pdf"
                onClick={handleOptionClick}
                style={{
                  display: 'block',
                  padding: '10px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  color: '#333',
                  margin: '10px 0',
                }}
              >
                Download PDF
              </a>
            </div>

            <div style={{ margin: '20px 0' }}>
              <h3>Option 4: Request by Email</h3>
              <p>
                If you're still having trouble accessing the whitepaper, email us at{' '}
                <a href="mailto:whitepaper@alebrije-inu.com" style={{ color: '#0066cc' }}>
                  whitepaper@alebrije-inu.com
                </a>{' '}
                and we'll send you a copy directly.
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'block',
                margin: '20px auto 0',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhitepaperFallback; 