import React, { useState, useEffect } from 'react';
import './privacy-policy.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: '📋' },
    { id: 'information', title: 'Information We Collect', icon: '📊' },
    { id: 'usage', title: 'How We Use Data', icon: '🔄' },
    { id: 'security', title: 'Security', icon: '🔒' },
    { id: 'rights', title: 'Your Rights', icon: '⚖️' },
    { id: 'cookies', title: 'Cookies', icon: '🍪' },
    { id: 'contact', title: 'Contact Us', icon: '📧' }
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
    <div className="privacy-policy-page">
      <Navbar2 />
      
      <div className="privacy-container">
        <aside className="privacy-sidebar">
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

        <main className="privacy-content">
          <header className="privacy-header">
            <h1>Privacy Policy</h1>
            <p className="header-subtitle">Last Updated: February 5, 2026</p>
          </header>

          {/* Introduction */}
          <section id="introduction" className="privacy-section">
            <h2>
              <span className="section-icon">📋</span>
              Introduction
            </h2>
            <div className="section-content">
              <p>
                Welcome to CryptOps. We are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                our decentralized auction platform.
              </p>
              <p>
                By using CryptOps, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our platform.
              </p>
              <div className="highlight-box">
                <h3>Key Points</h3>
                <ul>
                  <li>We prioritize your privacy and data security</li>
                  <li>We collect minimal personal information necessary for platform functionality</li>
                  <li>Your wallet private keys are never stored or accessed by us</li>
                  <li>You have full control over your data and can request deletion at any time</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
          <section id="information" className="privacy-section">
            <h2>
              <span className="section-icon">📊</span>
              Information We Collect
            </h2>
            <div className="section-content">
              <div className="info-category">
                <h3>1. Information You Provide</h3>
                <p>We collect information that you voluntarily provide when using our platform:</p>
                <ul>
                  <li><strong>Account Information:</strong> Email address, username, profile details</li>
                  <li><strong>Wallet Address:</strong> Your public Ethereum wallet address</li>
                  <li><strong>Transaction Data:</strong> Details of bids, auctions, and NFT transfers</li>
                  <li><strong>Communication Data:</strong> Messages sent through our support channels</li>
                  <li><strong>User Content:</strong> NFT descriptions, images, and auction details you upload</li>
                </ul>
              </div>

              <div className="info-category">
                <h3>2. Automatically Collected Information</h3>
                <p>We automatically collect certain information when you use our platform:</p>
                <ul>
                  <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                  <li><strong>IP Address:</strong> Your internet protocol address for security purposes</li>
                  <li><strong>Cookies:</strong> Small data files stored on your device (see Cookie Policy)</li>
                </ul>
              </div>

              <div className="info-category">
                <h3>3. Blockchain Data</h3>
                <p>Information recorded on the Ethereum blockchain:</p>
                <ul>
                  <li><strong>Public Transactions:</strong> All blockchain transactions are publicly visible</li>
                  <li><strong>Smart Contract Interactions:</strong> Your interactions with our smart contracts</li>
                  <li><strong>NFT Ownership:</strong> Records of NFT ownership and transfers</li>
                </ul>
                <div className="info-note">
                  <strong>Important:</strong> Blockchain data is permanent and cannot be deleted or modified after confirmation.
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section id="usage" className="privacy-section">
            <h2>
              <span className="section-icon">🔄</span>
              How We Use Your Information
            </h2>
            <div className="section-content">
              <p>We use the collected information for the following purposes:</p>
              
              <div className="usage-grid">
                <div className="usage-card">
                  <div className="usage-icon">🔧</div>
                  <h3>Platform Operation</h3>
                  <p>To provide, maintain, and improve our auction services and smart contract functionality</p>
                </div>

                <div className="usage-card">
                  <div className="usage-icon">👤</div>
                  <h3>Account Management</h3>
                  <p>To create and manage your account, verify your identity, and personalize your experience</p>
                </div>

                <div className="usage-card">
                  <div className="usage-icon">💬</div>
                  <h3>Communication</h3>
                  <p>To send you updates, notifications, security alerts, and respond to your inquiries</p>
                </div>

                <div className="usage-card">
                  <div className="usage-icon">🛡️</div>
                  <h3>Security & Fraud Prevention</h3>
                  <p>To detect, prevent, and address technical issues, fraud, and illegal activities</p>
                </div>

                <div className="usage-card">
                  <div className="usage-icon">📊</div>
                  <h3>Analytics</h3>
                  <p>To analyze usage patterns, improve user experience, and develop new features</p>
                </div>

                <div className="usage-card">
                  <div className="usage-icon">⚖️</div>
                  <h3>Legal Compliance</h3>
                  <p>To comply with legal obligations, enforce our terms, and protect user rights</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section id="security" className="privacy-section">
            <h2>
              <span className="section-icon">🔒</span>
              Data Storage and Security
            </h2>
            <div className="section-content">
              <p>
                We implement industry-standard security measures to protect your personal information from unauthorized 
                access, disclosure, alteration, or destruction.
              </p>

              <div className="security-measures">
                <h3>Our Security Measures</h3>
                <div className="measure-list">
                  <div className="measure-item">
                    <span className="measure-icon">🔐</span>
                    <div>
                      <h4>Encryption</h4>
                      <p>All data transmission is encrypted using SSL/TLS protocols</p>
                    </div>
                  </div>

                  <div className="measure-item">
                    <span className="measure-icon">🗄️</span>
                    <div>
                      <h4>Secure Storage</h4>
                      <p>Data stored on secure servers with restricted access</p>
                    </div>
                  </div>

                  <div className="measure-item">
                    <span className="measure-icon">🔑</span>
                    <div>
                      <h4>No Private Key Storage</h4>
                      <p>We never store or have access to your wallet private keys</p>
                    </div>
                  </div>

                  <div className="measure-item">
                    <span className="measure-icon">🔍</span>
                    <div>
                      <h4>Regular Audits</h4>
                      <p>Periodic security audits and vulnerability assessments</p>
                    </div>
                  </div>

                  <div className="measure-item">
                    <span className="measure-icon">👥</span>
                    <div>
                      <h4>Access Control</h4>
                      <p>Strict access controls and employee training on data protection</p>
                    </div>
                  </div>

                  <div className="measure-item">
                    <span className="measure-icon">💾</span>
                    <div>
                      <h4>Data Backup</h4>
                      <p>Regular backups to prevent data loss</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="warning-box">
                <strong>⚠️ Important Notice:</strong> While we implement strong security measures, no method 
                of transmission over the internet is 100% secure. Always use strong passwords and enable 
                two-factor authentication on your wallet.
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section id="rights" className="privacy-section">
            <h2>
              <span className="section-icon">⚖️</span>
              Your Privacy Rights
            </h2>
            <div className="section-content">
              <p>
                You have certain rights regarding your personal information. Depending on your location, 
                these may include:
              </p>

              <div className="rights-list">
                <div className="right-item">
                  <div className="right-number">1</div>
                  <div className="right-content">
                    <h3>Right to Access</h3>
                    <p>You can request a copy of the personal information we hold about you</p>
                  </div>
                </div>

                <div className="right-item">
                  <div className="right-number">2</div>
                  <div className="right-content">
                    <h3>Right to Correction</h3>
                    <p>You can request correction of inaccurate or incomplete information</p>
                  </div>
                </div>

                <div className="right-item">
                  <div className="right-number">3</div>
                  <div className="right-content">
                    <h3>Right to Deletion</h3>
                    <p>You can request deletion of your personal information (subject to legal obligations)</p>
                  </div>
                </div>

                <div className="right-item">
                  <div className="right-number">4</div>
                  <div className="right-content">
                    <h3>Right to Data Portability</h3>
                    <p>You can request a copy of your data in a structured, machine-readable format</p>
                  </div>
                </div>

                <div className="right-item">
                  <div className="right-number">5</div>
                  <div className="right-content">
                    <h3>Right to Object</h3>
                    <p>You can object to certain types of data processing</p>
                  </div>
                </div>

                <div className="right-item">
                  <div className="right-number">6</div>
                  <div className="right-content">
                    <h3>Right to Withdraw Consent</h3>
                    <p>You can withdraw consent for data processing at any time</p>
                  </div>
                </div>
              </div>

              <div className="exercise-rights">
                <h3>How to Exercise Your Rights</h3>
                <p>
                  To exercise any of these rights, please contact us at <a href="mailto:privacy@cryptops.io">privacy@cryptops.io</a>. 
                  We will respond to your request within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Policy */}
          <section id="cookies" className="privacy-section">
            <h2>
              <span className="section-icon">🍪</span>
              Cookie Policy
            </h2>
            <div className="section-content">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform. 
                Cookies are small data files stored on your device.
              </p>

              <div className="cookie-types">
                <div className="cookie-type">
                  <h3>Essential Cookies</h3>
                  <p>Required for basic platform functionality. Cannot be disabled.</p>
                  <ul>
                    <li>Session management</li>
                    <li>Security features</li>
                    <li>Load balancing</li>
                  </ul>
                </div>

                <div className="cookie-type">
                  <h3>Functional Cookies</h3>
                  <p>Remember your preferences and settings.</p>
                  <ul>
                    <li>Language preferences</li>
                    <li>Display settings</li>
                    <li>User preferences</li>
                  </ul>
                </div>

                <div className="cookie-type">
                  <h3>Analytics Cookies</h3>
                  <p>Help us understand how you use our platform.</p>
                  <ul>
                    <li>Usage statistics</li>
                    <li>Performance metrics</li>
                    <li>Error tracking</li>
                  </ul>
                </div>
              </div>

              <div className="cookie-control">
                <h3>Managing Cookies</h3>
                <p>
                  You can control and manage cookies through your browser settings. Note that disabling 
                  cookies may affect platform functionality.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="privacy-section">
            <h2>
              <span className="section-icon">📧</span>
              Contact Us
            </h2>
            <div className="section-content">
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, 
                please contact us:
              </p>

              <div className="contact-info-box">
                <div className="contact-method">
                  <h3>📧 Email</h3>
                  <p><a href="mailto:privacy@cryptops.io">privacy@cryptops.io</a></p>
                </div>

                <div className="contact-method">
                  <h3>💬 Support</h3>
                  <p>Visit our <a href="/support">Support Center</a></p>
                </div>

                <div className="contact-method">
                  <h3>📍 Address</h3>
                  <p>CryptOps Privacy Team<br />123 Blockchain Avenue<br />Crypto City, CC 12345</p>
                </div>
              </div>

              <div className="update-notice">
                <h3>Policy Updates</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
                  You are advised to review this Privacy Policy periodically for any changes.
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

export default PrivacyPolicy;
