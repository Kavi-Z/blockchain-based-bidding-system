import React, { useState, useEffect } from 'react';
import './cookie-policy.css';
import Navbar2 from '../navbar2/navbar2';
import Footer from '../footer/footer';

function CookiePolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: '🍪' },
    { id: 'what-are-cookies', title: 'What Are Cookies', icon: '❓' },
    { id: 'cookies-we-use', title: 'Cookies We Use', icon: '📋' },
    { id: 'manage-cookies', title: 'Manage Cookies', icon: '⚙️' }
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
    <div className="cookie-policy-page">
      <Navbar2 />
      
      <div className="cookie-container">
        <aside className="cookie-sidebar">
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

        <main className="cookie-content">
          <header className="cookie-header">
            <h1>Cookie Policy</h1>
            <p className="header-subtitle">Last Updated: February 5, 2026</p>
          </header>

          {/* Introduction */}
          <section id="introduction" className="cookie-section">
            <h2>
              <span className="section-icon">🍪</span>
              Introduction
            </h2>
            <div className="section-content">
              <p>
                This Cookie Policy explains how CryptOps uses cookies and similar tracking technologies when you 
                visit our platform. By using CryptOps, you consent to the use of cookies as described in this policy.
              </p>
              <div className="highlight-box">
                <h3>Quick Summary</h3>
                <ul>
                  <li>We use cookies to improve your experience on our platform</li>
                  <li>Essential cookies are required for basic functionality</li>
                  <li>You can control optional cookies through your browser settings</li>
                  <li>Some features may not work properly if you disable cookies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* What Are Cookies */}
          <section id="what-are-cookies" className="cookie-section">
            <h2>
              <span className="section-icon">❓</span>
              What Are Cookies
            </h2>
            <div className="section-content">
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They help 
                websites remember your preferences and provide a better user experience.
              </p>

              <div className="cookie-types-intro">
                <div className="cookie-type-card">
                  <div className="type-icon">⏱️</div>
                  <h3>Session Cookies</h3>
                  <p>Temporary cookies that expire when you close your browser</p>
                </div>

                <div className="cookie-type-card">
                  <div className="type-icon">💾</div>
                  <h3>Persistent Cookies</h3>
                  <p>Remain on your device until they expire or you delete them</p>
                </div>

                <div className="cookie-type-card">
                  <div className="type-icon">🌐</div>
                  <h3>Third-Party Cookies</h3>
                  <p>Set by external services integrated into our platform</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies We Use */}
          <section id="cookies-we-use" className="cookie-section">
            <h2>
              <span className="section-icon">📋</span>
              Cookies We Use
            </h2>
            <div className="section-content">
              <p>CryptOps uses the following types of cookies:</p>

              <div className="cookie-category">
                <div className="category-header essential">
                  <h3>🔒 Essential Cookies</h3>
                  <span className="required-badge">Required</span>
                </div>
                <p>
                  These cookies are necessary for the platform to function properly. They enable core features 
                  like security, wallet connection, and transaction processing.
                </p>
                <div className="cookie-examples">
                  <div className="cookie-item">
                    <strong>session_id</strong>
                    <span>Maintains your login session</span>
                  </div>
                  <div className="cookie-item">
                    <strong>wallet_connection</strong>
                    <span>Remembers your connected wallet</span>
                  </div>
                  <div className="cookie-item">
                    <strong>security_token</strong>
                    <span>Prevents unauthorized access</span>
                  </div>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <h3>⚙️ Functional Cookies</h3>
                  <span className="optional-badge">Optional</span>
                </div>
                <p>
                  These cookies remember your preferences and provide enhanced features for a better experience.
                </p>
                <div className="cookie-examples">
                  <div className="cookie-item">
                    <strong>language_preference</strong>
                    <span>Saves your language choice</span>
                  </div>
                  <div className="cookie-item">
                    <strong>theme_settings</strong>
                    <span>Remembers your display preferences</span>
                  </div>
                  <div className="cookie-item">
                    <strong>notification_prefs</strong>
                    <span>Stores notification settings</span>
                  </div>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <h3>📊 Analytics Cookies</h3>
                  <span className="optional-badge">Optional</span>
                </div>
                <p>
                  These cookies help us understand how users interact with our platform so we can improve it.
                </p>
                <div className="cookie-examples">
                  <div className="cookie-item">
                    <strong>_ga</strong>
                    <span>Google Analytics tracking</span>
                  </div>
                  <div className="cookie-item">
                    <strong>usage_stats</strong>
                    <span>Tracks feature usage</span>
                  </div>
                  <div className="cookie-item">
                    <strong>performance_metrics</strong>
                    <span>Monitors platform performance</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Manage Cookies */}
          <section id="manage-cookies" className="cookie-section">
            <h2>
              <span className="section-icon">⚙️</span>
              Manage Your Cookie Preferences
            </h2>
            <div className="section-content">
              <p>
                You have control over which cookies are placed on your device. Here's how you can manage them:
              </p>

              <div className="manage-options">
                <div className="manage-card">
                  <div className="manage-icon">🌐</div>
                  <h3>Browser Settings</h3>
                  <p>
                    Most browsers allow you to control cookies through their settings. You can block or delete 
                    cookies, but this may affect platform functionality.
                  </p>
                  <div className="browser-links">
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a>
                    <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</a>
                    <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a>
                    <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a>
                  </div>
                </div>

                <div className="manage-card">
                  <div className="manage-icon">🔕</div>
                  <h3>Opt-Out Tools</h3>
                  <p>
                    You can opt out of analytics cookies without affecting essential platform functionality.
                  </p>
                  <ul>
                    <li>Use browser "Do Not Track" settings</li>
                    <li>Install privacy browser extensions</li>
                    <li>Opt out of Google Analytics tracking</li>
                  </ul>
                </div>
              </div>

              <div className="info-box">
                <h3>⚠️ Important Note</h3>
                <p>
                  Disabling essential cookies will prevent core features from working properly. You may not be 
                  able to connect your wallet, place bids, or access your account. We recommend keeping essential 
                  cookies enabled for the best experience.
                </p>
              </div>

              <div className="contact-box">
                <h3>Questions About Cookies?</h3>
                <p>
                  If you have questions about our use of cookies, please contact us at{' '}
                  <a href="mailto:privacy@cryptops.io">privacy@cryptops.io</a> or visit our{' '}
                  <a href="/privacy-policy">Privacy Policy</a> for more information.
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

export default CookiePolicy;
