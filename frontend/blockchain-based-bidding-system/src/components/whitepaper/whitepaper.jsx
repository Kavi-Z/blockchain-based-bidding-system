import React, { useState } from 'react';
import './whitepaper.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

const Whitepaper = () => {
  const [activeSection, setActiveSection] = useState('abstract');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const sections = [
    { id: 'abstract', title: 'Abstract' },
    { id: 'problem-solution', title: 'Problem & Solution' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'tokenomics', title: 'Tokenomics' },
    { id: 'roadmap', title: 'Roadmap' }
  ];

  return (
    <div className="whitepaper-page">
      <Navbar2 />
      
      <div className="whitepaper-container">
        <div className="whitepaper-header">
          <h1 className="whitepaper-title">CryptOps Whitepaper</h1>
          <p className="whitepaper-subtitle">
            A Decentralized Blockchain-Based Auction Platform for Secure and Transparent Bidding
          </p>
          <div className="whitepaper-meta">
            <span>Version 1.0</span>
            <span>•</span>
            <span>February 2026</span>
            <span>•</span>
            <span>CryptOps Foundation</span>
          </div>
        </div>

        <div className="whitepaper-layout">
          {/* Sidebar Navigation */}
          <aside className="whitepaper-sidebar">
            <h3 className="sidebar-title">Contents</h3>
            <nav className="sidebar-nav">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="whitepaper-content">
            
            {/* Abstract */}
            <section id="abstract" className="wp-section">
              <h2 className="section-title">Abstract</h2>
              <div className="section-content">
                <p>
                  CryptOps is a blockchain-based auction platform that eliminates trust issues in traditional 
                  online auctions. Using Ethereum smart contracts, we create a transparent, secure marketplace 
                  where buyers and sellers engage in fair bidding without intermediaries.
                </p>
                <div className="highlight-box">
                  <h4>Key Features</h4>
                  <ul>
                    <li>100% transparent, on-chain auction records</li>
                    <li>Automated smart contract execution</li>
                    <li>Zero platform fees</li>
                    <li>Anti-sniping protection</li>
                    <li>Instant automatic refunds</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Problem & Solution */}
            <section id="problem-solution" className="wp-section">
              <h2 className="section-title">Problem & Solution</h2>
              <div className="section-content">
                <h3 className="subsection-title">Challenges in Traditional Auctions</h3>

                <div className="problem-card">
                  <div className="problem-number">1</div>
                  <div className="problem-content">
                    <h3>Lack of Transparency</h3>
                    <p>
                      Users cannot verify bid authenticity or auction integrity. Centralized platforms control 
                      all data, making independent audits impossible.
                    </p>
                  </div>
                </div>

                <div className="problem-card">
                  <div className="problem-number">2</div>
                  <div className="problem-content">
                    <h3>High Transaction Costs</h3>
                    <p>
                      Traditional platforms charge 10-15% in combined fees, significantly reducing seller 
                      profits and increasing buyer costs.
                    </p>
                  </div>
                </div>

                <div className="problem-card">
                  <div className="problem-number">3</div>
                  <div className="problem-content">
                    <h3>Centralized Control</h3>
                    <p>
                      Single entities control platforms, creating failure points, censorship risks, and 
                      arbitrary rule changes.
                    </p>
                  </div>
                </div>

                <h3 className="subsection-title">Our Solution</h3>

                <div className="solution-grid">
                  <div className="solution-card">
                    <div className="solution-icon">🔗</div>
                    <h4>Blockchain Transparency</h4>
                    <p>Every bid recorded on Ethereum, creating an immutable, publicly auditable record.</p>
                  </div>

                  <div className="solution-card">
                    <div className="solution-icon">⚡</div>
                    <h4>Smart Contracts</h4>
                    <p>Automated execution when conditions are met, eliminating trusted intermediaries.</p>
                  </div>

                  <div className="solution-card">
                    <div className="solution-icon">🛡️</div>
                    <h4>Anti-Sniping</h4>
                    <p>Automatic time extensions prevent last-second sniping tactics.</p>
                  </div>

                  <div className="solution-card">
                    <div className="solution-icon">💸</div>
                    <h4>Instant Refunds</h4>
                    <p>Automatic, immediate refunds when outbid. No delays or manual processing.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="wp-section">
              <h2 className="section-title">System Architecture</h2>
              <div className="section-content">
                <p>
                  CryptOps employs a multi-layer architecture combining blockchain with modern web technologies.
                </p>

                <div className="architecture-layer">
                  <h4>Blockchain Layer</h4>
                  <p><strong>Ethereum Network</strong></p>
                  <ul>
                    <li>Mainnet for production, Testnet for development</li>
                    <li>EVM compatibility for broad ecosystem support</li>
                  </ul>
                </div>

                <div className="architecture-layer">
                  <h4>Smart Contract Layer</h4>
                  <p><strong>SecureAuction Contract</strong></p>
                  <ul>
                    <li>Solidity 0.8.x with enhanced security</li>
                    <li>Reentrancy guards and access controls</li>
                    <li>Event emissions for real-time tracking</li>
                  </ul>
                </div>

                <div className="architecture-layer">
                  <h4>Application Layer</h4>
                  <p><strong>Frontend & Backend</strong></p>
                  <ul>
                    <li>React + Web3.js for blockchain interaction</li>
                    <li>Spring Boot API for off-chain data</li>
                    <li>MetaMask wallet integration</li>
                  </ul>
                </div>

                <h3 className="subsection-title">Technology Stack</h3>
                <div className="tech-table">
                  <div className="tech-row">
                    <div className="tech-category">Blockchain</div>
                    <div className="tech-items">Ethereum, Solidity, Web3.js</div>
                  </div>
                  <div className="tech-row">
                    <div className="tech-category">Backend</div>
                    <div className="tech-items">Spring Boot, Java 17, PostgreSQL</div>
                  </div>
                  <div className="tech-row">
                    <div className="tech-category">Frontend</div>
                    <div className="tech-items">React, Vite, MetaMask</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tokenomics */}
            <section id="tokenomics" className="wp-section">
              <h2 className="section-title">Tokenomics</h2>
              <div className="section-content">
                <div className="fee-card">
                  <h4>Fee Structure</h4>
                  <p>CryptOps charges minimal fees compared to traditional platforms:</p>
                  <ul>
                    <li><strong>Auction Creation:</strong> Gas fees only (no platform fee)</li>
                    <li><strong>Bidding:</strong> Gas fees only (no platform fee)</li>
                    <li><strong>Settlement:</strong> Gas fees only (no platform fee)</li>
                  </ul>
                </div>

                <h3 className="subsection-title">Comparison</h3>
                <div className="comparison-table">
                  <div className="comparison-header">
                    <div>Feature</div>
                    <div>Traditional</div>
                    <div>CryptOps</div>
                  </div>
                  <div className="comparison-row">
                    <div>Platform Fees</div>
                    <div>10-15%</div>
                    <div>0%</div>
                  </div>
                  <div className="comparison-row">
                    <div>Settlement</div>
                    <div>3-7 days</div>
                    <div>Instant</div>
                  </div>
                  <div className="comparison-row">
                    <div>Transparency</div>
                    <div>Limited</div>
                    <div>Complete</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Roadmap */}
            <section id="roadmap" className="wp-section">
              <h2 className="section-title">Roadmap</h2>
              <div className="section-content">
                <div className="roadmap-item">
                  <div className="roadmap-quarter">Q1 2026</div>
                  <div className="roadmap-content">
                    <h4>Foundation</h4>
                    <ul>
                      <li>✅ Smart contract development</li>
                      <li>✅ Frontend & Backend development</li>
                      <li>✅ Testnet deployment</li>
                    </ul>
                  </div>
                </div>

                <div className="roadmap-item">
                  <div className="roadmap-quarter">Q2 2026</div>
                  <div className="roadmap-content">
                    <h4>Launch</h4>
                    <ul>
                      <li>Security audit</li>
                      <li>Mainnet deployment</li>
                      <li>Public beta launch</li>
                    </ul>
                  </div>
                </div>

                <div className="roadmap-item">
                  <div className="roadmap-quarter">Q3-Q4</div>
                  <div className="roadmap-content">
                    <h4>Expansion</h4>
                    <ul>
                      <li>Layer 2 scaling (Polygon, Arbitrum)</li>
                      <li>Mobile applications</li>
                      <li>Governance token</li>
                      <li>Cross-chain bridges</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Whitepaper;
