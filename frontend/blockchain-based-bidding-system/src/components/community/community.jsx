import React, { useState, useEffect } from 'react';
import './community.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

function Community() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Community Overview', icon: '👥' },
    { id: 'join', title: 'Join Our Community', icon: '🚀' },
    { id: 'guidelines', title: 'Community Guidelines', icon: '📋' },
    { id: 'events', title: 'Events & News', icon: '📅' },
    { id: 'contribute', title: 'Contribute', icon: '💡' }
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
    <div className="community-page">
      <Navbar2 />
      
      <div className="community-container">
        <aside className="community-sidebar">
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

        <main className="community-content">
          <header className="community-header">
            <h1>CryptOps Community</h1>
            <p className="header-subtitle">Join our growing community of blockchain enthusiasts, developers, and innovators</p>
          </header>

          {/* Community Overview */}
          <section id="overview" className="community-section">
            <h2>
              <span className="section-icon">👥</span>
              Community Overview
            </h2>
            <div className="overview-content">
              <p className="intro-text">
                Welcome to the CryptOps community! We're building the future of decentralized auctions together. 
                Our community is a vibrant ecosystem of developers, traders, collectors, and blockchain enthusiasts 
                who share a passion for transparent and secure digital trading.
              </p>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">5,000+</div>
                  <div className="stat-label">Community Members</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">1,200+</div>
                  <div className="stat-label">Active Traders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Contributors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support Available</div>
                </div>
              </div>

              <div className="community-values">
                <h3>Our Values</h3>
                <div className="values-grid">
                  <div className="value-item">
                    <span className="value-icon">🔒</span>
                    <h4>Transparency</h4>
                    <p>Open communication and honest dealings in every interaction</p>
                  </div>
                  <div className="value-item">
                    <span className="value-icon">🤝</span>
                    <h4>Collaboration</h4>
                    <p>Working together to build better solutions for everyone</p>
                  </div>
                  <div className="value-item">
                    <span className="value-icon">🎯</span>
                    <h4>Innovation</h4>
                    <p>Pushing boundaries and exploring new possibilities in blockchain</p>
                  </div>
                  <div className="value-item">
                    <span className="value-icon">🌟</span>
                    <h4>Inclusivity</h4>
                    <p>Welcoming everyone regardless of experience or background</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Join Our Community */}
          <section id="join" className="community-section">
            <h2>
              <span className="section-icon">🚀</span>
              Join Our Community
            </h2>
            <div className="join-content">
              <p className="section-intro">
                Connect with us on your favorite platforms. Get the latest updates, share ideas, 
                and collaborate with fellow community members.
              </p>

              <div className="platforms-grid">
                <div className="platform-card discord">
                  <div className="platform-icon">💬</div>
                  <h3>Discord</h3>
                  <p>Join our Discord server for real-time discussions, support, and community events</p>
                  <button className="platform-btn">Join Discord</button>
                  <div className="platform-stats">12,000+ members</div>
                </div>

                <div className="platform-card twitter">
                  <div className="platform-icon">🐦</div>
                  <h3>Twitter</h3>
                  <p>Follow us for the latest announcements, updates, and industry insights</p>
                  <button className="platform-btn">Follow @CryptOps</button>
                  <div className="platform-stats">8,500+ followers</div>
                </div>

                <div className="platform-card telegram">
                  <div className="platform-icon">✈️</div>
                  <h3>Telegram</h3>
                  <p>Join our Telegram group for quick updates and community discussions</p>
                  <button className="platform-btn">Join Telegram</button>
                  <div className="platform-stats">6,000+ members</div>
                </div>

                <div className="platform-card github">
                  <div className="platform-icon">💻</div>
                  <h3>GitHub</h3>
                  <p>Contribute to our open-source codebase and track development progress</p>
                  <button className="platform-btn">Visit GitHub</button>
                  <div className="platform-stats">200+ stars</div>
                </div>

                <div className="platform-card reddit">
                  <div className="platform-icon">🔴</div>
                  <h3>Reddit</h3>
                  <p>Discuss ideas, share experiences, and get help from the community</p>
                  <button className="platform-btn">Join Subreddit</button>
                  <div className="platform-stats">3,500+ members</div>
                </div>

                <div className="platform-card medium">
                  <div className="platform-icon">📝</div>
                  <h3>Medium</h3>
                  <p>Read in-depth articles, tutorials, and technical blog posts</p>
                  <button className="platform-btn">Follow on Medium</button>
                  <div className="platform-stats">2,000+ followers</div>
                </div>
              </div>
            </div>
          </section>

          {/* Community Guidelines */}
          <section id="guidelines" className="community-section">
            <h2>
              <span className="section-icon">📋</span>
              Community Guidelines
            </h2>
            <div className="guidelines-content">
              <p className="section-intro">
                To ensure a positive and productive environment for everyone, please follow these guidelines 
                when participating in our community.
              </p>

              <div className="guidelines-list">
                <div className="guideline-item">
                  <div className="guideline-number">1</div>
                  <div className="guideline-text">
                    <h3>Be Respectful</h3>
                    <p>Treat all community members with respect and kindness. No harassment, hate speech, or discriminatory behavior will be tolerated.</p>
                  </div>
                </div>

                <div className="guideline-item">
                  <div className="guideline-number">2</div>
                  <div className="guideline-text">
                    <h3>Stay On Topic</h3>
                    <p>Keep discussions relevant to CryptOps, blockchain technology, and related topics. Use appropriate channels for different types of conversations.</p>
                  </div>
                </div>

                <div className="guideline-item">
                  <div className="guideline-number">3</div>
                  <div className="guideline-text">
                    <h3>No Spam or Self-Promotion</h3>
                    <p>Avoid excessive self-promotion, spam, or sharing unrelated links. Focus on adding value to the community.</p>
                  </div>
                </div>

                <div className="guideline-item">
                  <div className="guideline-number">4</div>
                  <div className="guideline-text">
                    <h3>Share Knowledge</h3>
                    <p>Help others learn and grow. Share your expertise, answer questions, and contribute constructive feedback.</p>
                  </div>
                </div>

                <div className="guideline-item">
                  <div className="guideline-number">5</div>
                  <div className="guideline-text">
                    <h3>Report Issues</h3>
                    <p>If you encounter inappropriate behavior or technical issues, report them to moderators or support team immediately.</p>
                  </div>
                </div>

                <div className="guideline-item">
                  <div className="guideline-number">6</div>
                  <div className="guideline-text">
                    <h3>Protect Privacy</h3>
                    <p>Never share personal information, private keys, or sensitive data. Be cautious about phishing attempts and scams.</p>
                  </div>
                </div>
              </div>

              <div className="code-of-conduct">
                <h3>Code of Conduct</h3>
                <p>
                  By participating in the CryptOps community, you agree to uphold these guidelines and our 
                  <a href="#"> Code of Conduct</a>. Violations may result in warnings, temporary suspension, 
                  or permanent ban from community platforms.
                </p>
              </div>
            </div>
          </section>

          {/* Events & News */}
          <section id="events" className="community-section">
            <h2>
              <span className="section-icon">📅</span>
              Events & News
            </h2>
            <div className="events-content">
              <div className="events-grid">
                <div className="event-card upcoming">
                  <div className="event-badge">Upcoming</div>
                  <div className="event-date">Feb 15, 2026</div>
                  <h3>Community AMA Session</h3>
                  <p>Join our monthly Ask Me Anything session with the core team. Ask questions, share feedback, and learn about upcoming features.</p>
                  <div className="event-details">
                    <span>⏰ 6:00 PM UTC</span>
                    <span>📍 Discord</span>
                  </div>
                </div>

                <div className="event-card upcoming">
                  <div className="event-badge">Upcoming</div>
                  <div className="event-date">Feb 22, 2026</div>
                  <h3>Developer Workshop</h3>
                  <p>Learn how to build on CryptOps platform. We'll cover smart contract integration, API usage, and best practices.</p>
                  <div className="event-details">
                    <span>⏰ 3:00 PM UTC</span>
                    <span>📍 Online</span>
                  </div>
                </div>

                <div className="event-card past">
                  <div className="event-badge">Past</div>
                  <div className="event-date">Jan 20, 2026</div>
                  <h3>Platform Launch Event</h3>
                  <p>We celebrated the official launch of CryptOps with live demos, giveaways, and special announcements.</p>
                  <div className="event-details">
                    <span>📺 Watch Recording</span>
                  </div>
                </div>
              </div>

              <div className="news-section">
                <h3>Latest News</h3>
                <div className="news-list">
                  <div className="news-item">
                    <div className="news-date">Feb 1, 2026</div>
                    <h4>New Feature: NFT Collections</h4>
                    <p>Create and manage NFT collections with our new collection management feature.</p>
                  </div>
                  <div className="news-item">
                    <div className="news-date">Jan 28, 2026</div>
                    <h4>Security Audit Completed</h4>
                    <p>Our smart contracts have successfully passed a comprehensive security audit by CertiK.</p>
                  </div>
                  <div className="news-item">
                    <div className="news-date">Jan 15, 2026</div>
                    <h4>Mobile App Beta Launch</h4>
                    <p>Join our beta testing program for the CryptOps mobile app. Limited spots available!</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contribute */}
          <section id="contribute" className="community-section">
            <h2>
              <span className="section-icon">💡</span>
              Contribute
            </h2>
            <div className="contribute-content">
              <p className="section-intro">
                CryptOps is built by the community, for the community. There are many ways you can contribute 
                and help shape the future of decentralized auctions.
              </p>

              <div className="contribute-grid">
                <div className="contribute-card">
                  <span className="contribute-icon">💻</span>
                  <h3>Code Contributions</h3>
                  <p>Contribute to our open-source codebase on GitHub. Fix bugs, add features, or improve documentation.</p>
                  <ul>
                    <li>Frontend development (React)</li>
                    <li>Smart contract development (Solidity)</li>
                    <li>Backend API (Spring Boot)</li>
                    <li>Testing and QA</li>
                  </ul>
                  <button className="contribute-btn">View Open Issues</button>
                </div>

                <div className="contribute-card">
                  <span className="contribute-icon">🎨</span>
                  <h3>Design & UX</h3>
                  <p>Help improve the user experience and visual design of our platform.</p>
                  <ul>
                    <li>UI/UX design improvements</li>
                    <li>Logo and branding</li>
                    <li>Marketing materials</li>
                    <li>User research and feedback</li>
                  </ul>
                  <button className="contribute-btn">Share Your Designs</button>
                </div>

                <div className="contribute-card">
                  <span className="contribute-icon">📚</span>
                  <h3>Documentation</h3>
                  <p>Improve our documentation to help others learn and use CryptOps more effectively.</p>
                  <ul>
                    <li>Write tutorials and guides</li>
                    <li>Create video content</li>
                    <li>Translate documentation</li>
                    <li>Update API references</li>
                  </ul>
                  <button className="contribute-btn">Contribute Docs</button>
                </div>

                <div className="contribute-card">
                  <span className="contribute-icon">🐛</span>
                  <h3>Bug Reports</h3>
                  <p>Found a bug? Help us improve by reporting issues you encounter.</p>
                  <ul>
                    <li>Report bugs and errors</li>
                    <li>Suggest improvements</li>
                    <li>Test new features</li>
                    <li>Provide feedback</li>
                  </ul>
                  <button className="contribute-btn">Report an Issue</button>
                </div>

                <div className="contribute-card">
                  <span className="contribute-icon">🌍</span>
                  <h3>Community Support</h3>
                  <p>Help other community members by answering questions and sharing knowledge.</p>
                  <ul>
                    <li>Answer questions on Discord</li>
                    <li>Create tutorials</li>
                    <li>Moderate community channels</li>
                    <li>Welcome new members</li>
                  </ul>
                  <button className="contribute-btn">Join Support Team</button>
                </div>

                <div className="contribute-card">
                  <span className="contribute-icon">🎙️</span>
                  <h3>Content Creation</h3>
                  <p>Create content about CryptOps and share it with the broader community.</p>
                  <ul>
                    <li>Write blog posts</li>
                    <li>Create video tutorials</li>
                    <li>Host podcasts</li>
                    <li>Share on social media</li>
                  </ul>
                  <button className="contribute-btn">Get Started</button>
                </div>
              </div>

              <div className="contributor-rewards">
                <h3>Contributor Rewards</h3>
                <p>
                  We value and recognize our contributors. Active contributors receive special badges, 
                  early access to new features, exclusive NFTs, and opportunities to participate in governance decisions.
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

export default Community;
