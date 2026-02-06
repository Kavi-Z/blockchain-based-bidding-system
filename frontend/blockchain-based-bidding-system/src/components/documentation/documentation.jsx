import React, { useState } from 'react';
import './documentation.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'wallet-setup', title: 'Wallet Setup' },
    { id: 'seller-guide', title: 'Seller Guide' },
    { id: 'bidder-guide', title: 'Bidder Guide' },
    { id: 'smart-contracts', title: 'Smart Contracts' },
    { id: 'security', title: 'Security' }
  ];

  return (
    <div className="documentation-page">
      <Navbar2 />
      
      <div className="documentation-container">
        <div className="documentation-header">
          <h1 className="documentation-title">CryptOps Documentation</h1>
          <p className="documentation-subtitle">
            Complete guide to understanding and using the blockchain-based bidding system
          </p>
        </div>

        <div className="documentation-layout">
          {/* Sidebar Navigation */}
          <aside className="documentation-sidebar">
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
          <main className="documentation-content">
            
            {/* Introduction */}
            <section id="introduction" className="doc-section">
              <h2 className="section-title">Introduction</h2>
              <div className="section-content">
                <p>
                  Welcome to CryptOps, a revolutionary blockchain-based bidding system that brings transparency, 
                  security, and fairness to online auctions. Built on Ethereum blockchain technology, CryptOps 
                  eliminates intermediaries and ensures every transaction is verifiable and tamper-proof.
                </p>
                
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h3>Secure</h3>
                    <p>End-to-end encryption and blockchain security</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🌐</div>
                    <h3>Decentralized</h3>
                    <p>No central authority, completely peer-to-peer</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">✅</div>
                    <h3>Transparent</h3>
                    <p>All transactions recorded on the blockchain</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Fast</h3>
                    <p>Real-time bidding with instant verification</p>
                  </div>
                </div>

                <h3 className="subsection-title">Key Features</h3>
                <ul className="feature-list">
                  <li><strong>Smart Contract Integration:</strong> Automated, trustless auction execution</li>
                  <li><strong>NFT Support:</strong> Auction digital assets and collectibles</li>
                  <li><strong>Real-time Updates:</strong> Live bid tracking and notifications</li>
                  <li><strong>Secure Payments:</strong> Cryptocurrency-based transactions</li>
                  <li><strong>Anti-Sniping Protection:</strong> Automatic auction time extensions</li>
                  <li><strong>Bid Verification:</strong> Cryptographic proof of every bid</li>
                </ul>
              </div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="doc-section">
              <h2 className="section-title">Getting Started</h2>
              <div className="section-content">
                <p>
                  Follow these steps to begin your journey with CryptOps:
                </p>

                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Install MetaMask</h3>
                      <p>Download and install the MetaMask browser extension from <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">metamask.io</a></p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Create Your Wallet</h3>
                      <p>Set up a new wallet or import an existing one. Make sure to securely store your seed phrase.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Get Test ETH</h3>
                      <p>For testing, obtain test ETH from a faucet. For mainnet, purchase ETH from an exchange.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Connect to CryptOps</h3>
                      <p>Visit the platform and click "Connect Wallet" to link your MetaMask wallet.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3>Choose Your Role</h3>
                      <p>Register as a Seller to create auctions or as a Bidder to participate in them.</p>
                    </div>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">ℹ️</div>
                  <div>
                    <h4>Network Configuration</h4>
                    <p>CryptOps operates on the Ethereum network. Ensure your MetaMask is connected to the correct network (Mainnet or Testnet).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Wallet Setup */}
            <section id="wallet-setup" className="doc-section">
              <h2 className="section-title">Wallet Setup</h2>
              <div className="section-content">
                <p>
                  Your cryptocurrency wallet is essential for interacting with CryptOps. Here's how to set it up properly:
                </p>

                <h3 className="subsection-title">MetaMask Installation</h3>
                <ol className="numbered-list">
                  <li>Visit <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">metamask.io</a> and click "Download"</li>
                  <li>Install the browser extension for Chrome, Firefox, Edge, or Brave</li>
                  <li>Click on the MetaMask icon in your browser toolbar</li>
                  <li>Select "Create a Wallet" or "Import Wallet"</li>
                  <li>Create a strong password</li>
                  <li>Write down your 12-word seed phrase and store it securely offline</li>
                  <li>Confirm your seed phrase to complete setup</li>
                </ol>

                <div className="warning-box">
                  <div className="warning-icon">⚠️</div>
                  <div>
                    <h4>Security Warning</h4>
                    <p>Never share your seed phrase or private key with anyone. Store it in a secure location offline. CryptOps will never ask for your seed phrase.</p>
                  </div>
                </div>

                <h3 className="subsection-title">Adding Funds</h3>
                <p>To participate in auctions, you need ETH in your wallet:</p>
                <ul className="feature-list">
                  <li><strong>Purchase ETH:</strong> Buy from exchanges like Coinbase, Binance, or Kraken</li>
                  <li><strong>Transfer:</strong> Send ETH to your MetaMask wallet address</li>
                  <li><strong>Test Networks:</strong> Use faucets for test ETH (Goerli, Sepolia)</li>
                </ul>

                <h3 className="subsection-title">Connecting to CryptOps</h3>
                <ol className="numbered-list">
                  <li>Navigate to the CryptOps platform</li>
                  <li>Click "Connect Wallet" button</li>
                  <li>Select MetaMask from the wallet options</li>
                  <li>Approve the connection request in MetaMask</li>
                  <li>Your wallet address will appear in the navigation bar</li>
                </ol>
              </div>
            </section>

            {/* Seller Guide */}
            <section id="seller-guide" className="doc-section">
              <h2 className="section-title">Seller Guide</h2>
              <div className="section-content">
                <p>
                  As a seller on CryptOps, you can create secure auctions for digital assets, NFTs, or tokenized items.
                </p>

                <h3 className="subsection-title">Creating an Auction</h3>
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Register as Seller</h3>
                      <p>Complete the seller registration with your details and wallet connection.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Upload Item Details</h3>
                      <p>Provide item name, description, and upload high-quality images (JPEG, PNG, GIF, WEBP - Max 10MB).</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Configure Auction Parameters</h3>
                      <p>Set bidding time, minimum bid increment, extension time, and optional maximum bid.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Deploy Smart Contract</h3>
                      <p>Confirm the transaction in MetaMask to deploy the auction smart contract.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3>Start Auction</h3>
                      <p>Once deployed, your auction goes live and bidders can start placing bids.</p>
                    </div>
                  </div>
                </div>

                <h3 className="subsection-title">Auction Configuration Parameters</h3>
                <div className="table-container">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Description</th>
                        <th>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Bidding Time</td>
                        <td>Duration of the auction in seconds</td>
                        <td>300 (5 minutes)</td>
                      </tr>
                      <tr>
                        <td>Min Increment</td>
                        <td>Minimum amount each bid must increase</td>
                        <td>0.001 ETH</td>
                      </tr>
                      <tr>
                        <td>Extension Time</td>
                        <td>Time added when bid placed near end</td>
                        <td>60 seconds</td>
                      </tr>
                      <tr>
                        <td>Max Bid (Optional)</td>
                        <td>Upper limit for bids</td>
                        <td>10 ETH</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="info-box">
                  <div className="info-icon">💡</div>
                  <div>
                    <h4>Pro Tip</h4>
                    <p>Set a reasonable minimum bid increment to encourage active bidding while preventing spam bids. Extension time helps prevent last-second sniping.</p>
                  </div>
                </div>

                <h3 className="subsection-title">Managing Your Auctions</h3>
                <ul className="feature-list">
                  <li><strong>Dashboard:</strong> View all your active and past auctions</li>
                  <li><strong>Real-time Monitoring:</strong> Track current highest bid and bidder</li>
                  <li><strong>Auction Status:</strong> See time remaining and total bids</li>
                  <li><strong>End Auction:</strong> Option to end auction and finalize the sale</li>
                  <li><strong>Withdraw Funds:</strong> Claim proceeds after successful auction</li>
                </ul>
              </div>
            </section>

            {/* Bidder Guide */}
            <section id="bidder-guide" className="doc-section">
              <h2 className="section-title">Bidder Guide</h2>
              <div className="section-content">
                <p>
                  As a bidder, you can participate in auctions, place bids, and win unique items on the blockchain.
                </p>

                <h3 className="subsection-title">Participating in Auctions</h3>
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Register as Bidder</h3>
                      <p>Create your bidder account and connect your wallet.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Browse Auctions</h3>
                      <p>Explore available auctions and view item details, current bids, and time remaining.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Place Your Bid</h3>
                      <p>Enter your bid amount (must exceed current highest bid + minimum increment).</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Confirm Transaction</h3>
                      <p>Approve the transaction in MetaMask. Your bid is recorded on the blockchain.</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3>Win & Claim</h3>
                      <p>If you're the highest bidder when auction ends, claim your item!</p>
                    </div>
                  </div>
                </div>

                <h3 className="subsection-title">Bidding Rules</h3>
                <ul className="feature-list">
                  <li>Each new bid must be at least the minimum increment higher than the current highest bid</li>
                  <li>Bids placed near the auction end time trigger automatic time extensions</li>
                  <li>All bids are final and cannot be canceled once submitted</li>
                  <li>Only the highest bidder wins the auction</li>
                  <li>Previous bidders receive automatic refunds when outbid</li>
                  <li>Gas fees apply to all transactions</li>
                </ul>

                <div className="warning-box">
                  <div className="warning-icon">⚠️</div>
                  <div>
                    <h4>Important</h4>
                    <p>Ensure you have sufficient ETH in your wallet to cover both the bid amount and gas fees. Failed transactions due to insufficient funds will not be refunded for gas costs.</p>
                  </div>
                </div>

                <h3 className="subsection-title">Bidder Dashboard</h3>
                <ul className="feature-list">
                  <li><strong>My Bids:</strong> Track all your active and past bids</li>
                  <li><strong>Winning Status:</strong> See which auctions you're currently winning</li>
                  <li><strong>Bid History:</strong> Complete record of your bidding activity</li>
                  <li><strong>Notifications:</strong> Get alerts when outbid or auction ends</li>
                  <li><strong>Won Items:</strong> View your auction wins and claim items</li>
                </ul>
              </div>
            </section>

            {/* Smart Contracts */}
            <section id="smart-contracts" className="doc-section">
              <h2 className="section-title">Smart Contracts</h2>
              <div className="section-content">
                <p>
                  CryptOps uses Ethereum smart contracts to ensure transparent, automated, and trustless auction execution.
                </p>

                <h3 className="subsection-title">SecureAuction Contract</h3>
                <p>
                  The core smart contract handles all auction logic, including bid placement, auction timing, 
                  and winner determination. Key functions include:
                </p>

                <div className="code-block">
                  <h4>Main Contract Functions</h4>
                  <pre><code>{`// Start a new auction
startAuction(
  uint biddingTime,
  uint minimumIncrement,
  uint extensionTime,
  uint maxBid
)

// Place a bid
placeBid() payable

// End the auction
endAuction()

// Withdraw funds (for sellers)
withdrawFunds()

// Get refund (for outbid bidders)
getRefund()`}</code></pre>
                </div>

                <h3 className="subsection-title">Security Features</h3>
                <ul className="feature-list">
                  <li><strong>Reentrancy Protection:</strong> Guards against reentrancy attacks</li>
                  <li><strong>Access Control:</strong> Only authorized users can perform specific actions</li>
                  <li><strong>Overflow Protection:</strong> SafeMath operations prevent arithmetic errors</li>
                  <li><strong>Bid Validation:</strong> Automatic verification of bid amounts</li>
                  <li><strong>Time Locks:</strong> Prevents premature auction termination</li>
                  <li><strong>Automatic Refunds:</strong> Instant refunds for outbid users</li>
                </ul>

                <h3 className="subsection-title">Contract Events</h3>
                <p>The smart contract emits events for important actions:</p>
                <div className="table-container">
                  <table className="doc-table">
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Description</th>
                        <th>When Triggered</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>AuctionStarted</td>
                        <td>New auction begins</td>
                        <td>Seller deploys auction</td>
                      </tr>
                      <tr>
                        <td>BidPlaced</td>
                        <td>New bid received</td>
                        <td>Bidder places valid bid</td>
                      </tr>
                      <tr>
                        <td>AuctionExtended</td>
                        <td>Time extension triggered</td>
                        <td>Late bid activates extension</td>
                      </tr>
                      <tr>
                        <td>AuctionEnded</td>
                        <td>Auction concludes</td>
                        <td>Time expires or manual end</td>
                      </tr>
                      <tr>
                        <td>RefundIssued</td>
                        <td>Outbid refund processed</td>
                        <td>New highest bid placed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="info-box">
                  <div className="info-icon">📊</div>
                  <div>
                    <h4>Contract Verification</h4>
                    <p>All CryptOps smart contracts are verified on Etherscan, allowing anyone to audit the code and verify transaction integrity.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section id="security" className="doc-section">
              <h2 className="section-title">Security</h2>
              <div className="section-content">
                <p>
                  Security is our top priority. CryptOps implements multiple layers of protection to ensure 
                  safe transactions and protect user assets.
                </p>

                <h3 className="subsection-title">Platform Security</h3>
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3>Smart Contract Audits</h3>
                    <p>Regular security audits by third-party experts</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🔐</div>
                    <h3>Encryption</h3>
                    <p>End-to-end encryption for all communications</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h3>Transparency</h3>
                    <p>Open-source contracts, publicly verifiable</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Automated Protection</h3>
                    <p>Built-in safeguards against common attacks</p>
                  </div>
                </div>

                <h3 className="subsection-title">Best Practices</h3>
                <ul className="feature-list">
                  <li><strong>Secure Your Wallet:</strong> Use hardware wallets for large amounts</li>
                  <li><strong>Verify Transactions:</strong> Always check transaction details before confirming</li>
                  <li><strong>Keep Seed Phrase Safe:</strong> Store offline in multiple secure locations</li>
                  <li><strong>Enable 2FA:</strong> Add extra security layer to your accounts</li>
                  <li><strong>Check Contract Addresses:</strong> Verify official contract addresses</li>
                  <li><strong>Regular Updates:</strong> Keep MetaMask and browsers updated</li>
                  <li><strong>Beware of Phishing:</strong> Only use official CryptOps URLs</li>
                </ul>

                <div className="warning-box">
                  <div className="warning-icon">🚨</div>
                  <div>
                    <h4>Common Scams to Avoid</h4>
                    <ul>
                      <li>Fake websites claiming to be CryptOps</li>
                      <li>Messages asking for your private key or seed phrase</li>
                      <li>Too-good-to-be-true auction deals</li>
                      <li>Unsolicited wallet connection requests</li>
                      <li>Fake customer support accounts on social media</li>
                    </ul>
                  </div>
                </div>

                <h3 className="subsection-title">Reporting Security Issues</h3>
                <p>
                  If you discover a security vulnerability or suspicious activity, please report it immediately 
                  to our security team at <a href="mailto:security@cryptops.com">security@cryptops.com</a>
                </p>
              </div>
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Documentation;
