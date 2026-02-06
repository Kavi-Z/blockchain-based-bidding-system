import React, { useState } from 'react';
import './Landing.css';
import Navbar2 from  '../navbar2/navbar2';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.png';
import img4 from '../../assets/img4.png';
import img5 from '../../assets/img5.png';
import Footer from '../footer/footer';

const Landing = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Replace this with your actual Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTtvMVMOntNC_qwsnaR53Bk1M2opJiDLqd6R8EeC2laKQYwts-woLLxctNoEffC2Jn/exec';

  // Validation constants
  const MAX_NAME_LENGTH = 100;
  const MAX_MESSAGE_LENGTH = 1000;
  const MIN_MESSAGE_LENGTH = 10;
  const RATE_LIMIT_MS = 60000; // 1 minute between submissions

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Sanitize input to prevent XSS attacks (don't trim during typing)
  const sanitizeInput = (input, maxLength) => {
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .substring(0, maxLength);
  };

  // Validate form data
  const validateForm = () => {
    const { name, email, message } = formData;

    // Name validation
    if (!name || name.trim().length === 0) {
      return { valid: false, message: 'Please enter your name.' };
    }
    if (name.length > MAX_NAME_LENGTH) {
      return { valid: false, message: `Name must be less than ${MAX_NAME_LENGTH} characters.` };
    }

    // Email validation
    if (!email || email.trim().length === 0) {
      return { valid: false, message: 'Please enter your email address.' };
    }
    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }

    // Message validation
    if (!message || message.trim().length === 0) {
      return { valid: false, message: 'Please enter a message.' };
    }
    if (message.length < MIN_MESSAGE_LENGTH) {
      return { valid: false, message: `Message must be at least ${MIN_MESSAGE_LENGTH} characters.` };
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, message: `Message must be less than ${MAX_MESSAGE_LENGTH} characters.` };
    }

    // Check for spam patterns
    const spamPatterns = /viagra|casino|lottery|winner|click here|buy now/i;
    if (spamPatterns.test(name) || spamPatterns.test(message)) {
      return { valid: false, message: 'Your message contains prohibited content.' };
    }

    return { valid: true };
  };

  // Rate limiting check
  const checkRateLimit = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    if (timeSinceLastSubmit < RATE_LIMIT_MS && lastSubmitTime > 0) {
      const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastSubmit) / 1000);
      return { allowed: false, waitTime };
    }
    return { allowed: true };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const maxLength = name === 'message' ? MAX_MESSAGE_LENGTH : MAX_NAME_LENGTH;
    const sanitizedValue = sanitizeInput(value, maxLength);
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    // Clear any previous status messages when user starts typing
    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateForm();
    if (!validation.valid) {
      setSubmitStatus({
        type: 'error',
        message: validation.message
      });
      return;
    }

    // Check rate limiting
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setSubmitStatus({
        type: 'error',
        message: `Please wait ${rateLimit.waitTime} seconds before submitting again.`
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requires no-cors mode
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim()
        })
      });

      // Note: With no-cors mode, we can't read the response
      // Assume success if no error is thrown
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', message: '' });
      setLastSubmitTime(Date.now());

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "What is CryptOps?",
      answer: "CryptOps is a decentralized auction platform built on blockchain technology, ensuring transparency, fairness, and security in every transaction."
    },
    {
      question: "How does CryptOps ensure fair and transparent auctions?",
      answer: "Every bid and transaction on CryptOps is recorded on the blockchain, preventing fraud, bid manipulation, or hidden changes."
    },
    {
      question: "What types of assets can I auction on CryptOps?",
      answer: "You can auction both digital assets like NFTs or tokens and real-world items, all within a secure blockchain-backed environment."
    },
    {
      question: "Do I need a crypto wallet to use CryptOps?",
      answer: "Yes, a crypto wallet is required for identity verification, placing bids, and securely handling transactions."
    },
    {
      question: "How do I participate in an auction?",
      answer: "Simply connect your crypto wallet, browse available auctions, and place your bids. Winners are determined automatically once the auction ends."
    }
  ];

  return (
    <div id="home" className="landing-container">
      <Navbar2 />
      <p className='Head-landing'>Blockchain Infrastructure</p>
      <p className='sub-landing'>for Secure Online Auctions</p>
      <p className='protocols'>Our Protocols</p>
      <p className='protocol-landing'>A Decentralized Auction Platform Where Sellers List and Bidders Compete — Powered by Blockchain.</p>

  <div id="about" className='about'>
        <p className='About-head'>About Us</p>
        <p className='about-content'>CryptOps is a decentralized auction platform built on blockchain technology to ensure transparency, security, and fairness in every transaction. We remove intermediaries, prevent bid manipulation, and make auctions accessible to everyone — globally and trustlessly.</p>
      </div>

      <div className='vismis'>
        <p className='vision-head'>Our Vision</p>
        <p className='vision-content'>To redefine how online auctions work by providing a transparent, decentralized, and user-driven ecosystem for buyers and sellers.</p>
        <p className='mission-head'>Our Mission</p>
        <p className='mission-content'>To empower sellers and bidders through blockchain technology, ensuring every bid and sale is verifiable, secure, and tamper-proof.</p>
      </div>

      <div className='introduction'>
        <p className='intro-head'>Web 3.0 Auction Engine for All Types of Assets</p>
        <p className='intro-sub'>Seamlessly auction NFTs, digital tokens, and real-world assets on one platform.</p>
      </div>
      
      <div className="collage">
        <div className="col col1">
          <img src={img3} alt="img3" />
          <p className='tags'>Tokens</p>
          <img src={img2} alt="img2" />
          <p className='tags'>Vehicles</p>
        </div>
        <div className="col col2">
          <img src={img1} alt="img1" />
          <p className='tags'>NFT</p>
        </div>
        <div className="col col3">
          <img src={img4} alt="img4" />
          <p className='tags'>Electronics</p>
          <img src={img5} alt="img5" />
          <p className='tags'>Mobile phones</p>
        </div>
      </div>

  <div id="faq" className='faq'>
        <p className='title-faq'>Frequently Asked Questions</p>

        {faqs.map((faq, index) => (
          <div className='faq-item' key={index}>
            <div className='question' onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className={`icon ${openIndex === index ? 'open' : ''}`}>
                +
              </span>
            </div>
            <div className={`answer ${openIndex === index ? 'open' : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

  <div id="contact" className='Contactus'>
        <p className='contact-head'>Contact Us</p>
        <p className='contact-sub'>Have questions? We'd love to hear from you.</p>
        
        <form className='contact-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Enter your name'
              required
              disabled={isSubmitting}
              maxLength={MAX_NAME_LENGTH}
            />
            <span className='char-count'>{formData.name.length}/{MAX_NAME_LENGTH}</span>
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Enter your email'
              required
              disabled={isSubmitting}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='message'>Message</label>
            <textarea
              id='message'
              name='message'
              value={formData.message}
              onChange={handleInputChange}
              placeholder='Write your message here...'
              rows='6'
              required
              disabled={isSubmitting}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <span className='char-count'>{formData.message.length}/{MAX_MESSAGE_LENGTH} characters (min: {MIN_MESSAGE_LENGTH})</span>
          </div>

          {submitStatus.message && (
            <div className={`submit-status ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <button 
            type='submit' 
            className='submit-btn'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;