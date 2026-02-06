import React, { useState, useEffect } from 'react';
import './support.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

function Support() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Support Overview', icon: '🛟' },
    { id: 'contact', title: 'Contact Us', icon: '📧' },
    { id: 'faq', title: 'FAQ', icon: '❓' },
    { id: 'resources', title: 'Resources', icon: '📚' }
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
    <div className="support-page">
      <Navbar2 />
      
      <div className="support-container">
        <aside className="support-sidebar">
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

        <main className="support-content">
          <header className="support-header">
            <h1>Support Center</h1>
            <p className="header-subtitle">We're here to help you with any questions or issues</p>
          </header>

          {/* Support Overview */}
          <section id="overview" className="support-section">
            <h2>
              <span className="section-icon">🛟</span>
              Support Overview
            </h2>
            <div className="overview-content">
              <p className="intro-text">
                Our support team is dedicated to ensuring you have the best experience with CryptOps. 
                Whether you need technical assistance, have questions about our platform, or want to report an issue, 
                we're here to help 24/7.
              </p>

              <div className="support-channels">
                <div className="channel-card">
                  <div className="channel-icon">💬</div>
                  <h3>Live Chat</h3>
                  <p>Get instant help from our support team</p>
                  <span className="availability">Available 24/7</span>
                </div>

                <div className="channel-card">
                  <div className="channel-icon">📧</div>
                  <h3>Email Support</h3>
                  <p>Send us detailed queries via email</p>
                  <span className="availability">Response within 24 hours</span>
                </div>

                <div className="channel-card">
                  <div className="channel-icon">📞</div>
                  <h3>Phone Support</h3>
                  <p>Speak directly with our support staff</p>
                  <span className="availability">Mon-Fri, 9 AM - 6 PM UTC</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Us */}
          <section id="contact" className="support-section">
            <h2>
              <span className="section-icon">📧</span>
              Contact Us
            </h2>
            <div className="contact-content">
              <div className="contact-info">
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-details">
                    <h3>Email</h3>
                    <p>support@cryptops.io</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">💬</div>
                  <div className="info-details">
                    <h3>Discord</h3>
                    <p>Join our Discord server for community support</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">🐦</div>
                  <div className="info-details">
                    <h3>Twitter</h3>
                    <p>@CryptOps - DM us for quick responses</p>
                  </div>
                </div>
              </div>

              <div className="contact-form">
                <h3>Send us a message</h3>
                <form>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Your name" />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="your.email@example.com" />
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <select>
                      <option>Select a topic</option>
                      <option>Technical Issue</option>
                      <option>Account Problem</option>
                      <option>Transaction Help</option>
                      <option>Feature Request</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea rows="5" placeholder="Describe your issue or question..."></textarea>
                  </div>

                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="support-section">
            <h2>
              <span className="section-icon">❓</span>
              Frequently Asked Questions
            </h2>
            <div className="faq-content">
              <div className="faq-item">
                <h3>How do I connect my wallet?</h3>
                <p>Click the "Connect Wallet" button in the navigation bar and select MetaMask. Follow the prompts to authorize the connection.</p>
              </div>

              <div className="faq-item">
                <h3>What cryptocurrencies are supported?</h3>
                <p>Currently, we support Ethereum (ETH) and ERC-20 tokens. Support for additional blockchains is coming soon.</p>
              </div>

              <div className="faq-item">
                <h3>How do transaction fees work?</h3>
                <p>CryptOps charges a 2.5% platform fee on successful auctions. Additionally, you'll pay standard Ethereum gas fees for blockchain transactions.</p>
              </div>

              <div className="faq-item">
                <h3>Can I cancel a bid?</h3>
                <p>Once placed, bids are immutable and cannot be canceled. This ensures auction integrity and prevents bid manipulation.</p>
              </div>

              <div className="faq-item">
                <h3>What happens if I win an auction?</h3>
                <p>When you win, the smart contract automatically transfers the NFT to your wallet and deducts the bid amount. You'll receive a confirmation notification.</p>
              </div>

              <div className="faq-item">
                <h3>Is my data secure?</h3>
                <p>Yes. We use industry-standard encryption and don't store private keys. All sensitive operations happen directly through your wallet.</p>
              </div>

              <div className="faq-item">
                <h3>How do I report a bug?</h3>
                <p>Please email us at support@cryptops.io with details about the issue, including screenshots if possible. You can also report bugs on our GitHub repository.</p>
              </div>

              <div className="faq-item">
                <h3>Can I create multiple auctions?</h3>
                <p>Yes! Sellers can create and manage multiple auctions simultaneously from the seller dashboard.</p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section id="resources" className="support-section">
            <h2>
              <span className="section-icon">📚</span>
              Resources
            </h2>
            <div className="resources-content">
              <div className="resource-grid">
                <div className="resource-card">
                  <span className="resource-icon">📖</span>
                  <h3>Documentation</h3>
                  <p>Comprehensive guides and tutorials</p>
                  <a href="/documentation" className="resource-link">View Docs →</a>
                </div>

                <div className="resource-card">
                  <span className="resource-icon">📄</span>
                  <h3>Whitepaper</h3>
                  <p>Technical overview and architecture</p>
                  <a href="/whitepaper" className="resource-link">Read Whitepaper →</a>
                </div>

                <div className="resource-card">
                  <span className="resource-icon">🎥</span>
                  <h3>Video Tutorials</h3>
                  <p>Step-by-step video guides</p>
                  <a href="#" className="resource-link">Watch Videos →</a>
                </div>

                <div className="resource-card">
                  <span className="resource-icon">💻</span>
                  <h3>API Documentation</h3>
                  <p>Developer API reference</p>
                  <a href="#" className="resource-link">View API Docs →</a>
                </div>

                <div className="resource-card">
                  <span className="resource-icon">🔧</span>
                  <h3>Troubleshooting</h3>
                  <p>Common issues and solutions</p>
                  <a href="#" className="resource-link">Get Help →</a>
                </div>

                <div className="resource-card">
                  <span className="resource-icon">👥</span>
                  <h3>Community</h3>
                  <p>Join our community forums</p>
                  <a href="/community" className="resource-link">Visit Community →</a>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Support;
