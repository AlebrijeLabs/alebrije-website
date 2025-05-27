import React from 'react';
import { useTranslation } from 'react-i18next';
import { WalletButton } from './WalletButton.jsx';
import AnimatedGallery from './AnimatedGallery.jsx';
import './LandingPage.css';

function LandingPage() {
  const { t } = useTranslation();

  return (
    <div>
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img src="/Logo.png/logo.png" alt="ALBJ Logo" height="40" className="logo-img" />
              ALBJ
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#about">{t('nav.about')}</a></li>
                <li className="nav-item"><a className="nav-link" href="#tokenomics">{t('nav.tokenomics')}</a></li>
                <li className="nav-item"><a className="nav-link" href="#roadmap">{t('nav.roadmap')}</a></li>
                <li className="nav-item"><a className="nav-link" href="#community">{t('nav.community')}</a></li>
                <li className="nav-item"><WalletButton /></li>
              </ul>
            </div>
          </div>
        </nav>
        
        <div className="hero">
          <div className="container text-center">
            <h1>{t('hero.title')}</h1>
            <p className="lead">{t('hero.subtitle')}</p>
            <p className="launch-countdown">{t('hero.launch')}</p>
            <div className="hero-buttons">
              <a href="#tokenomics" className="btn btn-primary btn-lg">{t('hero.tokenomics')}</a>
              <a href="https://discord.gg/alebrije" className="btn btn-outline-light btn-lg">{t('hero.joinDiscord')}</a>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* About Section */}
        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">{t('about.title')}</h2>
            <div className="row">
              <div className="col-lg-3">
                <AnimatedGallery side="left" />
              </div>
              <div className="col-lg-6">
                <p>{t('about.paragraph1')}</p>
                <p>{t('about.paragraph2')}</p>
                <p>{t('about.paragraph3')}</p>
                <div className="launch-info mt-4">
                  <h3>{t('about.launchTitle')}</h3>
                  <p>{t('about.launchText')}</p>
                  <ul>
                    <li>{t('about.launchItems.item1')}</li>
                    <li>{t('about.launchItems.item2')}</li>
                    <li>{t('about.launchItems.item3')}</li>
                    <li>{t('about.launchItems.item4')}</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <AnimatedGallery side="right" />
              </div>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section id="tokenomics" className="section bg-light">
          <div className="container">
            <h2 className="section-title">{t('tokenomics.title')}</h2>
            <div className="row">
              <div className="col-lg-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <h3 className="card-title">{t('tokenomics.tokenInfo')}</h3>
                    <div className="token-info">
                      <div className="token-info-item">
                        <span className="token-info-label">{t('tokenomics.name')}:</span>
                        <span>ALBJ</span>
                      </div>
                      <div className="token-info-item">
                        <span className="token-info-label">{t('tokenomics.symbol')}:</span>
                        <span>ALBJ</span>
                      </div>
                      <div className="token-info-item">
                        <span className="token-info-label">{t('tokenomics.supply')}:</span>
                        <span>9,000,000,000 ALBJ</span>
                      </div>
                      <div className="token-info-item">
                        <span className="token-info-label">{t('tokenomics.walletLimit')}:</span>
                        <span>2% of supply</span>
                      </div>
                    </div>
                    <h3 className="card-title mt-4">{t('tokenomics.distribution')}</h3>
                    <div className="tokenomics-chart">
                      <div className="distribution-bar">
                        <div className="bar-segment burn" style={{width: '50%'}}>
                          <span>{t('tokenomics.burn')}</span>
                        </div>
                        <div className="bar-segment liquidity" style={{width: '20%'}}>
                          <span>{t('tokenomics.liquidity')}</span>
                        </div>
                        <div className="bar-segment airdrops" style={{width: '10%'}}>
                          <span>{t('tokenomics.airdrops')}</span>
                        </div>
                        <div className="bar-segment marketing" style={{width: '10%'}}>
                          <span>{t('tokenomics.marketing')}</span>
                        </div>
                        <div className="bar-segment ecosystem" style={{width: '5%'}}>
                          <span>{t('tokenomics.ecosystem')}</span>
                        </div>
                        <div className="bar-segment founders" style={{width: '5%'}}>
                          <span>{t('tokenomics.founders')}</span>
                        </div>
                      </div>
                    </div>
                    <ul className="tokenomics-list">
                      <li><span className="badge bg-danger">50%</span> {t('tokenomics.burnAmount')}</li>
                      <li><span className="badge bg-primary">20%</span> {t('tokenomics.liquidity')}</li>
                      <li><span className="badge bg-success">10%</span> {t('tokenomics.airdrops')}</li>
                      <li><span className="badge bg-warning">10%</span> {t('tokenomics.marketing')}</li>
                      <li><span className="badge bg-info">5%</span> {t('tokenomics.ecosystem')}</li>
                      <li><span className="badge bg-secondary">5%</span> {t('tokenomics.founders')} (Locked 1 month, vested over 3 months)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">{t('tokenomics.tax')}</h3>
                    <p>{t('tokenomics.taxText')}</p>
                    <ul className="tax-list">
                      <li><span className="badge bg-primary">3%</span> {t('tokenomics.liquidity')}</li>
                      <li><span className="badge bg-warning">1%</span> {t('tokenomics.marketing')}</li>
                      <li><span className="badge bg-success">1%</span> {t('tokenomics.charity')}</li>
                      <li><span className="badge bg-danger">1%</span> {t('tokenomics.burn')}</li>
                    </ul>
                    <div className="mt-4">
                      <h4>{t('tokenomics.features')}</h4>
                      <ul className="feature-list">
                        <li>{t('tokenomics.deflationary')}</li>
                        <li>{t('tokenomics.maxWallet')}</li>
                        <li>{t('tokenomics.liquidityGen')}</li>
                        <li>{t('tokenomics.community')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="section">
          <div className="container">
            <h2 className="section-title">{t('roadmap.title')}</h2>
            <div className="roadmap">
              <div className="roadmap-item">
                <div className="roadmap-content">
                  <h3>{t('roadmap.phase0')}</h3>
                  <ul>
                    <li>{t('roadmap.phase0Items.item1')}</li>
                    <li>{t('roadmap.phase0Items.item2')}</li>
                    <li>{t('roadmap.phase0Items.item3')}</li>
                  </ul>
                </div>
              </div>
              <div className="roadmap-item">
                <div className="roadmap-content">
                  <h3>{t('roadmap.phase1')}</h3>
                  <ul>
                    <li>{t('roadmap.phase1Items.item1')}</li>
                    <li>{t('roadmap.phase1Items.item2')}</li>
                    <li>{t('roadmap.phase1Items.item3')}</li>
                  </ul>
                </div>
              </div>
              <div className="roadmap-item">
                <div className="roadmap-content">
                  <h3>{t('roadmap.phase2')}</h3>
                  <ul>
                    <li>{t('roadmap.phase2Items.item1')}</li>
                    <li>{t('roadmap.phase2Items.item2')}</li>
                    <li>{t('roadmap.phase2Items.item3')}</li>
                  </ul>
                </div>
              </div>
              <div className="roadmap-item">
                <div className="roadmap-content">
                  <h3>{t('roadmap.phase3')}</h3>
                  <ul>
                    <li>{t('roadmap.phase3Items.item1')}</li>
                    <li>{t('roadmap.phase3Items.item2')}</li>
                    <li>{t('roadmap.phase3Items.item3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Timeline Section */}
            <div className="detailed-timeline mt-5">
              <h3 className="text-center mb-4">30-Day Launch Timeline</h3>
              <div className="timeline-container">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-date">May 12-15</div>
                    <div className="timeline-content">
                      <h4>Finalize Token Contract</h4>
                      <p>Complete token supply and mint contract with burn and tax mechanisms</p>
                      <span className="timeline-owner">Dev Team</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">May 15-17</div>
                    <div className="timeline-content">
                      <h4>NFT Preparation</h4>
                      <p>Upload NFT images and metadata to IPFS</p>
                      <span className="timeline-owner">NFT Lead</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">May 18</div>
                    <div className="timeline-content">
                      <h4>Spirit NFT Gallery</h4>
                      <p>Release sneak peek of the Spirit NFT gallery</p>
                      <span className="timeline-owner">Design Team</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">May 20</div>
                    <div className="timeline-content">
                      <h4>Teaser Site Launch</h4>
                      <p>Launch teaser site with countdown timer</p>
                      <span className="timeline-owner">Web Team</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">May 21-24</div>
                    <div className="timeline-content">
                      <h4>Documentation Release</h4>
                      <p>Publish whitepaper thread and Medium article</p>
                      <span className="timeline-owner">Marketing</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">May 24-27</div>
                    <div className="timeline-content">
                      <h4>Community Engagement</h4>
                      <p>Begin community airdrop and lore contest</p>
                      <span className="timeline-owner">Community</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">May 27-30</div>
                    <div className="timeline-content">
                      <h4>Security Audit</h4>
                      <p>Send audit request to CertiK and add GitHub repository</p>
                      <span className="timeline-owner">Dev Team</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">May 30</div>
                    <div className="timeline-content">
                      <h4>DAO Announcement</h4>
                      <p>Announce DAO structure and voting preview</p>
                      <span className="timeline-owner">Ops Lead</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">June 3</div>
                    <div className="timeline-content">
                      <h4>DAO Deployment</h4>
                      <p>Push DAO contract to testnet</p>
                      <span className="timeline-owner">Dev Team</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">June 5-7</div>
                    <div className="timeline-content">
                      <h4>Final Audit</h4>
                      <p>Complete final audit and freeze contract</p>
                      <span className="timeline-owner">Dev Team</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">June 8</div>
                    <div className="timeline-content">
                      <h4>Token Finalization</h4>
                      <p>Final ALBJ token burn and disable mint authority</p>
                      <span className="timeline-owner">Dev Team</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">June 10</div>
                    <div className="timeline-content">
                      <h4>Final Marketing Push</h4>
                      <p>Final marketing push and PR with influencers and podcasts</p>
                      <span className="timeline-owner">Marketing</span>
                    </div>
                  </div>
                  <div className="timeline-item highlight">
                    <div className="timeline-date">June 11</div>
                    <div className="timeline-content">
                      <h4>🎉 ALBJ Launch Day</h4>
                      <p>The official launch of ALBJ Token</p>
                      <span className="timeline-owner">Everyone</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <a href="/ALBJ_30-Day_Roadmap.csv" className="btn btn-outline-primary" download>
                  <i className="fas fa-download me-2"></i>Download Detailed Timeline
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="section bg-light">
          <div className="container">
            <h2 className="section-title">{t('community.title')}</h2>
            <div className="row text-center">
              <div className="col-md-4">
                <div className="community-item">
                  <i className="fab fa-twitter fa-3x"></i>
                  <h3>{t('community.twitter.title')}</h3>
                  <p>Join our Twitter community for real-time updates, memes, and community events. Follow us to stay updated on the latest Alebrije news and announcements!</p>
                  <div className="social-stats">
                    <span><i className="fas fa-users"></i> Growing Community</span>
                    <span><i className="fas fa-bolt"></i> Daily Updates</span>
                  </div>
                  <a href="https://twitter.com/AlebrijeSol" className="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter me-2"></i>Follow @AlebrijeSol
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="community-item">
                  <i className="fab fa-discord fa-3x"></i>
                  <h3>{t('community.discord.title')}</h3>
                  <p>Join our Discord server to connect with the Alebrije community, participate in discussions, and get exclusive access to NFT previews and community events!</p>
                  <div className="social-stats">
                    <span><i className="fas fa-shield-alt"></i> Verified Server</span>
                    <span><i className="fas fa-star"></i> Exclusive Content</span>
                  </div>
                  <a href="https://discord.gg/alebrije" className="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-discord me-2"></i>Join Discord
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="community-item">
                  <i className="fab fa-telegram fa-3x"></i>
                  <h3>{t('community.telegram.title')}</h3>
                  <p>Join our Telegram channel for instant updates, trading discussions, and direct communication with the Alebrije team. Be the first to know about new developments!</p>
                  <div className="social-stats">
                    <span><i className="fas fa-bell"></i> Instant Updates</span>
                    <span><i className="fas fa-comments"></i> Active Chat</span>
                  </div>
                  <a href="https://t.me/AlebrijeToken" className="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-telegram me-2"></i>Join Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <img src="/Logo.png/logo.png" alt="ALBJ Logo" height="40" className="logo-img" />
              <p>{t('footer.description')}</p>
            </div>
            <div className="col-md-4">
              <h4>{t('footer.quickLinks')}</h4>
              <ul className="footer-links">
                <li><a href="#about">{t('nav.about')}</a></li>
                <li><a href="#tokenomics">{t('nav.tokenomics')}</a></li>
                <li><a href="#roadmap">{t('nav.roadmap')}</a></li>
                <li><a href="#community">{t('nav.community')}</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h4>{t('footer.connect')}</h4>
              <div className="social-links">
                <a href="https://twitter.com/AlebrijeSol"><i className="fab fa-twitter"></i></a>
                <a href="https://discord.gg/alebrije"><i className="fab fa-discord"></i></a>
                <a href="https://t.me/AlebrijeToken"><i className="fab fa-telegram"></i></a>
                <a href="https://github.com/alebrije-token"><i className="fab fa-github"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Alebrije Token. {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 