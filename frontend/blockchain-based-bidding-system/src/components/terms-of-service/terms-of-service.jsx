import React, { useState, useEffect } from 'react';
import './terms-of-service.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

function TermsOfService() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: '📋' },
    { id: 'account', title: 'Account Terms', icon: '👤' },
    { id: 'usage', title: 'Platform Usage', icon: '💻' },
    { id: 'transactions', title: 'Transactions', icon: '💰' },
    { id: 'prohibited', title: 'Prohibited Activities', icon: '🚫' },
    { id: 'termination', title: 'Termination', icon: '⚠️' }
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
    <div className="terms-page">
      <Navbar2 />
      
      <div className="terms-container">
        <aside className="terms-sidebar">
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

        <main className="terms-content">
          <header className="terms-header">
            <h1>Terms of Service</h1>
            <p className="header-subtitle">Last Updated: February 5, 2026</p>
          </header>

          {/* Introduction */}
          <section id="introduction" className="terms-section">
            <h2>
              <span className="section-icon">📋</span>
              Introduction
            </h2>
            <div className="section-content">
              <p>
                Welcome to CryptOps. These Terms of Service ("Terms") govern your access to and use of our 
                decentralized auction platform. By accessing or using CryptOps, you agree to be bound by these Terms.
              </p>
              <p>
                Please read these Terms carefully before using our platform. If you do not agree with any part 
                of these Terms, you must not use CryptOps.
              </p>
              <div className="highlight-box">
                <h3>Key Terms</h3>
                <ul>
                  <li>You must be at least 18 years old to use this platform</li>
                  <li>You are responsible for maintaining the security of your wallet</li>
                  <li>All transactions are final and recorded on the blockchain</li>
                  <li>We reserve the right to suspend accounts that violate these Terms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Account Terms */}
          <section id="account" className="terms-section">
            <h2>
              <span className="section-icon">👤</span>
              Account Terms
            </h2>
            <div className="section-content">
              <div className="term-item">
                <h3>1. Account Creation</h3>
                <p>
                  You must connect a valid Ethereum wallet (such as MetaMask) to use CryptOps. You are responsible 
                  for maintaining the confidentiality of your wallet credentials and private keys.
                </p>
              </div>

              <div className="term-item">
                <h3>2. Age Requirement</h3>
                <p>
                  You must be at least 18 years old (or the legal age of majority in your jurisdiction) to use 
                  this platform. By using CryptOps, you represent that you meet this requirement.
                </p>
              </div>

              <div className="term-item">
                <h3>3. Account Security</h3>
                <p>
                  You are solely responsible for your account security. Never share your private keys with anyone. 
                  CryptOps will never ask for your private keys or seed phrases.
                </p>
              </div>

              <div className="term-item">
                <h3>4. Accurate Information</h3>
                <p>
                  You agree to provide accurate and complete information when using our platform. You must update 
                  your information promptly if it changes.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Usage */}
          <section id="usage" className="terms-section">
            <h2>
              <span className="section-icon">💻</span>
              Platform Usage
            </h2>
            <div className="section-content">
              <p>By using CryptOps, you agree to the following terms:</p>

              <div className="usage-grid">
                <div className="usage-box">
                  <div className="usage-icon">✓</div>
                  <h3>Permitted Use</h3>
                  <ul>
                    <li>Creating and managing auctions</li>
                    <li>Bidding on legitimate auctions</li>
                    <li>Transferring NFTs you own</li>
                    <li>Using platform features responsibly</li>
                  </ul>
                </div>

                <div className="usage-box">
                  <div className="usage-icon">✗</div>
                  <h3>Prohibited Use</h3>
                  <ul>
                    <li>Violating laws or regulations</li>
                    <li>Infringing intellectual property</li>
                    <li>Manipulating auctions or prices</li>
                    <li>Creating fake or misleading listings</li>
                  </ul>
                </div>
              </div>

              <div className="info-note">
                <strong>Important:</strong> CryptOps is provided "as is" without warranties. You use the platform 
                at your own risk and are responsible for complying with all applicable laws.
              </div>
            </div>
          </section>

          {/* Transactions and Fees */}
          <section id="transactions" className="terms-section">
            <h2>
              <span className="section-icon">💰</span>
              Transactions and Fees
            </h2>
            <div className="section-content">
              <div className="term-item">
                <h3>1. Transaction Finality</h3>
                <p>
                  All transactions on CryptOps are executed through smart contracts on the Ethereum blockchain. 
                  Once confirmed, transactions are irreversible and cannot be canceled or refunded.
                </p>
              </div>

              <div className="term-item">
                <h3>2. Platform Fees</h3>
                <p>
                  CryptOps charges a 2.5% fee on successful auction sales. This fee is automatically deducted 
                  from the final sale price by the smart contract.
                </p>
              </div>

              <div className="term-item">
                <h3>3. Gas Fees</h3>
                <p>
                  You are responsible for paying Ethereum network gas fees for all transactions. Gas fees vary 
                  based on network congestion and are paid directly to Ethereum miners, not to CryptOps.
                </p>
              </div>

              <div className="term-item">
                <h3>4. Payment Processing</h3>
                <p>
                  All payments are processed automatically through smart contracts. CryptOps does not hold, 
                  custody, or control your funds at any time.
                </p>
              </div>

              <div className="fee-table">
                <h3>Fee Structure</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Fee Type</th>
                      <th>Amount</th>
                      <th>Paid To</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Platform Fee</td>
                      <td>2.5%</td>
                      <td>CryptOps</td>
                    </tr>
                    <tr>
                      <td>Gas Fee</td>
                      <td>Variable</td>
                      <td>Ethereum Network</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section id="prohibited" className="terms-section">
            <h2>
              <span className="section-icon">🚫</span>
              Prohibited Activities
            </h2>
            <div className="section-content">
              <p>The following activities are strictly prohibited on CryptOps:</p>

              <div className="prohibited-grid">
                <div className="prohibited-item">
                  <span className="prohibited-icon">⛔</span>
                  <h3>Fraud and Scams</h3>
                  <p>Creating fake listings, wash trading, or engaging in fraudulent activities</p>
                </div>

                <div className="prohibited-item">
                  <span className="prohibited-icon">⛔</span>
                  <h3>Market Manipulation</h3>
                  <p>Artificially inflating prices, shill bidding, or coordinating to manipulate auctions</p>
                </div>

                <div className="prohibited-item">
                  <span className="prohibited-icon">⛔</span>
                  <h3>Intellectual Property Theft</h3>
                  <p>Listing NFTs that infringe copyrights, trademarks, or other intellectual property rights</p>
                </div>

                <div className="prohibited-item">
                  <span className="prohibited-icon">⛔</span>
                  <h3>Money Laundering</h3>
                  <p>Using the platform for money laundering or financing illegal activities</p>
                </div>

                <div className="prohibited-item">
                  <span className="prohibited-icon">⛔</span>
                  <h3>System Abuse</h3>
                  <p>Attempting to hack, exploit vulnerabilities, or disrupt platform operations</p>
                </div>

                <div className="prohibited-item">
                  <span className="prohibited-icon">⛔</span>
                  <h3>Illegal Content</h3>
                  <p>Listing illegal, harmful, or offensive content</p>
                </div>
              </div>

              <div className="warning-box">
                <strong>⚠️ Violation Consequences:</strong> Accounts engaging in prohibited activities will be 
                immediately suspended or terminated. We may also report illegal activities to law enforcement.
              </div>
            </div>
          </section>

          {/* Termination */}
          <section id="termination" className="terms-section">
            <h2>
              <span className="section-icon">⚠️</span>
              Termination
            </h2>
            <div className="section-content">
              <div className="term-item">
                <h3>1. Termination by You</h3>
                <p>
                  You may stop using CryptOps at any time by disconnecting your wallet. However, transactions 
                  already recorded on the blockchain cannot be reversed.
                </p>
              </div>

              <div className="term-item">
                <h3>2. Termination by Us</h3>
                <p>
                  We reserve the right to suspend or terminate your access to CryptOps at any time, with or 
                  without notice, for any reason, including violation of these Terms.
                </p>
              </div>

              <div className="term-item">
                <h3>3. Effect of Termination</h3>
                <p>
                  Upon termination, your right to use the platform ceases immediately. However, your obligations 
                  under these Terms will survive termination, including ownership rights, warranty disclaimers, 
                  and limitations of liability.
                </p>
              </div>

              <div className="highlight-box">
                <h3>Contact Us</h3>
                <p>
                  If you have questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:legal@cryptops.io">legal@cryptops.io</a> or visit our{' '}
                  <a href="/support">Support Center</a>.
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

export default TermsOfService;
