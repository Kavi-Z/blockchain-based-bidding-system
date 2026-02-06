import React, { useState, useEffect } from 'react';
import './disclaimer.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

function Disclaimer() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', title: 'General Disclaimer', icon: '⚠️' },
    { id: 'investment', title: 'Investment Risk', icon: '💰' },
    { id: 'technical', title: 'Technical Risks', icon: '⚙️' },
    { id: 'liability', title: 'Limitation of Liability', icon: '🛡️' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));

      const scrollPosition = window.scrollY + 150;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="disclaimer-page">
      <Navbar2 />
      
      <div className="disclaimer-container">
        <aside className="disclaimer-sidebar">
          <h3>Contents</h3>
          <nav>
            {sections.map(section => (
              <button
                key={section.id}
                className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                <span className="section-icon">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        <main className="disclaimer-content">
          <header className="disclaimer-header">
            <h1>Disclaimer</h1>
            <p className="header-subtitle">Last Updated: February 5, 2026</p>
          </header>

          {/* General Disclaimer */}
          <section id="general" className="disclaimer-section">
            <h2>
              <span className="section-icon">⚠️</span>
              General Disclaimer
            </h2>
            <div className="section-content">
              <p>
                The information provided on CryptOps is for general informational purposes only. While we strive 
                to keep the information up to date and accurate, we make no representations or warranties of any 
                kind, express or implied, about the completeness, accuracy, reliability, or availability of the platform.
              </p>

              <div className="warning-box">
                <h3>⚠️ Important Notice</h3>
                <p>
                  CryptOps is a decentralized platform built on blockchain technology. Users are solely responsible 
                  for their actions and transactions on the platform. By using CryptOps, you acknowledge and accept 
                  all risks associated with blockchain technology, cryptocurrency transactions, and NFT trading.
                </p>
              </div>

              <div className="disclaimer-points">
                <h3>Key Points:</h3>
                <ul>
                  <li>Use of the platform is entirely at your own risk</li>
                  <li>We do not provide financial, legal, or investment advice</li>
                  <li>All transactions are final and cannot be reversed</li>
                  <li>Platform availability and performance are not guaranteed</li>
                  <li>You are responsible for complying with applicable laws in your jurisdiction</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Investment Risk */}
          <section id="investment" className="disclaimer-section">
            <h2>
              <span className="section-icon">💰</span>
              Investment Risk Disclaimer
            </h2>
            <div className="section-content">
              <p>
                Trading NFTs and participating in blockchain auctions involves substantial risk of loss. The value 
                of digital assets can be highly volatile and unpredictable.
              </p>

              <div className="risk-grid">
                <div className="risk-card">
                  <div className="risk-icon">📉</div>
                  <h3>Market Volatility</h3>
                  <p>NFT prices can fluctuate dramatically. Past performance does not guarantee future results.</p>
                </div>

                <div className="risk-card">
                  <div className="risk-icon">🔄</div>
                  <h3>No Refunds</h3>
                  <p>All blockchain transactions are irreversible. There are no refunds or chargebacks.</p>
                </div>

                <div className="risk-card">
                  <div className="risk-icon">⚖️</div>
                  <h3>Not Financial Advice</h3>
                  <p>CryptOps does not provide investment advice. Conduct your own research before trading.</p>
                </div>

                <div className="risk-card">
                  <div className="risk-icon">💸</div>
                  <h3>Risk of Loss</h3>
                  <p>You may lose some or all of your investment. Only invest what you can afford to lose.</p>
                </div>
              </div>

              <div className="info-box">
                <p>
                  <strong>Recommendation:</strong> Before participating in any auction or transaction, carefully 
                  evaluate your financial situation, investment objectives, and risk tolerance. Consider consulting 
                  with a qualified financial advisor.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Risks */}
          <section id="technical" className="disclaimer-section">
            <h2>
              <span className="section-icon">⚙️</span>
              Technical Risks
            </h2>
            <div className="section-content">
              <p>
                Using blockchain technology and smart contracts involves inherent technical risks that users should 
                be aware of:
              </p>

              <div className="tech-risks">
                <div className="tech-risk-item">
                  <div className="tech-number">1</div>
                  <div className="tech-content">
                    <h3>Smart Contract Risks</h3>
                    <p>
                      While our smart contracts are audited, vulnerabilities may still exist. Smart contracts are 
                      immutable once deployed, meaning errors cannot be fixed without deploying new contracts.
                    </p>
                  </div>
                </div>

                <div className="tech-risk-item">
                  <div className="tech-number">2</div>
                  <div className="tech-content">
                    <h3>Network Congestion</h3>
                    <p>
                      Ethereum network congestion can cause delays and high gas fees. Transactions may fail or 
                      take longer than expected during peak times.
                    </p>
                  </div>
                </div>

                <div className="tech-risk-item">
                  <div className="tech-number">3</div>
                  <div className="tech-content">
                    <h3>Wallet Security</h3>
                    <p>
                      You are responsible for securing your wallet and private keys. Loss of private keys results 
                      in permanent loss of access to your assets.
                    </p>
                  </div>
                </div>

                <div className="tech-risk-item">
                  <div className="tech-number">4</div>
                  <div className="tech-content">
                    <h3>Platform Availability</h3>
                    <p>
                      CryptOps may experience downtime due to maintenance, updates, or technical issues. We do 
                      not guarantee uninterrupted access to the platform.
                    </p>
                  </div>
                </div>

                <div className="tech-risk-item">
                  <div className="tech-number">5</div>
                  <div className="tech-content">
                    <h3>Third-Party Services</h3>
                    <p>
                      We rely on third-party services (MetaMask, IPFS, etc.) which may have their own risks and 
                      limitations beyond our control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="liability" className="disclaimer-section">
            <h2>
              <span className="section-icon">🛡️</span>
              Limitation of Liability
            </h2>
            <div className="section-content">
              <p>
                To the maximum extent permitted by law, CryptOps and its team members, employees, and affiliates 
                shall not be liable for any damages arising from the use of or inability to use the platform.
              </p>

              <div className="liability-box">
                <h3>We Are Not Liable For:</h3>
                <div className="liability-grid">
                  <div className="liability-item">
                    <span className="liability-icon">❌</span>
                    <p>Loss of funds or digital assets</p>
                  </div>
                  <div className="liability-item">
                    <span className="liability-icon">❌</span>
                    <p>Failed or delayed transactions</p>
                  </div>
                  <div className="liability-item">
                    <span className="liability-icon">❌</span>
                    <p>Smart contract vulnerabilities</p>
                  </div>
                  <div className="liability-item">
                    <span className="liability-icon">❌</span>
                    <p>Third-party service failures</p>
                  </div>
                  <div className="liability-item">
                    <span className="liability-icon">❌</span>
                    <p>Unauthorized access to your wallet</p>
                  </div>
                  <div className="liability-item">
                    <span className="liability-icon">❌</span>
                    <p>Market price fluctuations</p>
                  </div>
                </div>
              </div>

              <div className="as-is-box">
                <h3>"AS IS" and "AS AVAILABLE"</h3>
                <p>
                  CryptOps is provided on an "as is" and "as available" basis without any warranties, express or 
                  implied. We do not warrant that the platform will be error-free, secure, or uninterrupted.
                </p>
              </div>

              <div className="contact-box">
                <h3>Questions or Concerns?</h3>
                <p>
                  If you have any questions about this disclaimer or our platform, please contact us at{' '}
                  <a href="mailto:legal@cryptops.io">legal@cryptops.io</a> or visit our{' '}
                  <a href="/support">Support Center</a>.
                </p>
                <p className="legal-note">
                  By using CryptOps, you acknowledge that you have read, understood, and agree to this disclaimer. 
                  We recommend reviewing our <a href="/terms-of-service">Terms of Service</a> and{' '}
                  <a href="/privacy-policy">Privacy Policy</a> as well.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Disclaimer;
