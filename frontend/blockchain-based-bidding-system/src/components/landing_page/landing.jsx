import React, { useState } from 'react';
import './Landing.css';
import { motion } from 'framer-motion';
import Navbar2 from '../navbar2/navbar2';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.png';
import img4 from '../../assets/img4.png';
import img5 from '../../assets/img5.png';
import Footer from '../footer/footer';
import eth from '../../assets/eth.png';
import background from '../../assets/back.png';

const Landing = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTtvMVMOntNC_qwsnaR53Bk1M2opJiDLqd6R8EeC2laKQYwts-woLLxctNoEffC2Jn/exec';
  const MAX_NAME_LENGTH = 100;
  const MAX_MESSAGE_LENGTH = 1000;
  const MIN_MESSAGE_LENGTH = 10;
  const RATE_LIMIT_MS = 60000;

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const sanitizeInput = (input, maxLength) => input.replace(/[<>]/g, '').substring(0, maxLength);

  const validateForm = () => {
    const { name, email, message } = formData;
    if (!name.trim()) return { valid: false, message: 'Please enter your name.' };
    if (name.length > MAX_NAME_LENGTH) return { valid: false, message: `Name must be less than ${MAX_NAME_LENGTH} characters.` };
    if (!email.trim()) return { valid: false, message: 'Please enter your email.' };
    if (!isValidEmail(email)) return { valid: false, message: 'Please enter a valid email address.' };
    if (!message.trim()) return { valid: false, message: 'Please enter a message.' };
    if (message.length < MIN_MESSAGE_LENGTH) return { valid: false, message: `Message must be at least ${MIN_MESSAGE_LENGTH} characters.` };
    if (message.length > MAX_MESSAGE_LENGTH) return { valid: false, message: `Message must be less than ${MAX_MESSAGE_LENGTH} characters.` };
    if (/viagra|casino|lottery|winner|click here|buy now/i.test(name + message)) return { valid: false, message: 'Your message contains prohibited content.' };
    return { valid: true };
  };

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
    setFormData(prev => ({ ...prev, [name]: sanitizeInput(value, maxLength) }));
    if (submitStatus.message) setSubmitStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateForm();
    if (!validation.valid) return setSubmitStatus({ type: 'error', message: validation.message });

    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) return setSubmitStatus({ type: 'error', message: `Please wait ${rateLimit.waitTime} seconds before submitting again.` });

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim()
        })
      });
      setSubmitStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
      setLastSubmitTime(Date.now());
    } catch (error) {
      console.error(error);
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally { setIsSubmitting(false); }
  };

  const faqs = [
    { question: "What is CryptOps?", answer: "CryptOps is a decentralized auction platform built on blockchain technology, ensuring transparency, fairness, and security in every transaction." },
    { question: "How does CryptOps ensure fair and transparent auctions?", answer: "Every bid and transaction on CryptOps is recorded on the blockchain, preventing fraud, bid manipulation, or hidden changes." },
    { question: "What types of assets can I auction on CryptOps?", answer: "You can auction both digital assets like NFTs or tokens and real-world items, all within a secure blockchain-backed environment." },
    { question: "Do I need a crypto wallet to use CryptOps?", answer: "Yes, a crypto wallet is required for identity verification, placing bids, and securely handling transactions." },
    { question: "How do I participate in an auction?", answer: "Simply connect your crypto wallet, browse available auctions, and place your bids. Winners are determined automatically once the auction ends." }
  ];

  return (
    <div id="home" className="landing-container" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <Navbar2 />
<div className="hero">

  <div className="hero-left">

    <motion.p
      className="hero-small"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
 
    </motion.p>

    <motion.h1
      className="hero-title"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Decentralized Auction Platform<br />
     
    </motion.h1>

    <motion.p
      className="hero-sub"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Secure • Transparent • Trustless Auctions
    </motion.p>

    <motion.button
      className="hero-btn"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Explore Now
    </motion.button>

  </div>  

  <div className="hero-right">
    <motion.img
      src={eth}
      alt="Ethereum"
      className="hero-eth"
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 4 }}
    />
  </div>

  
 
</div>
      <motion.p className='sub-landing' initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
   
      </motion.p>

      <motion.p className='protocols' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        Gallery
      </motion.p>
  




      {/* Collage */}
<div className="collage">
  <div className="col col1">
    <motion.img 
      src={img3} 
      alt="img3"
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
    <p className='tags'>Tokens</p>
    <motion.img 
      src={img2} 
      alt="img2"
      whileHover={{ scale: 1.05, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
    <p className='tags'>Vehicles</p>
  </div>
  <div className="col col2">
    <motion.img 
      src={img1} 
      alt="img1"
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
    <p className='tags'>NFT</p>
  </div>
  <div className="col col3">
    <motion.img 
      src={img4} 
      alt="img4"
      whileHover={{ scale: 1.05, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
    <p className='tags'>Electronics</p>
    <motion.img 
      src={img5} 
      alt="img5"
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
    <p className='tags'>Mobile phones</p>
  </div>
</div>
 
      <motion.div id="faq" className='faq' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className='title-faq'>Frequently Asked Questions</p>
        {faqs.map((faq, index) => (
          <div className='faq-item' key={index}>
            <div className='question' onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className={`icon ${openIndex === index ? 'open' : ''}`}>+</span>
            </div>
            <motion.div className='answer' animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }} transition={{ duration: 0.4 }}>
              {faq.answer}
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Contact Form */}
      <motion.div id="contact" className='Contactus' initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className='contact-head'>Contact Us</p>
        <p className='contact-sub'>Have questions? We'd love to hear from you.</p>
        <form className='contact-form' onSubmit={handleSubmit}>
          {['name','email','message'].map((field, idx) => (
            <motion.div className='form-group' key={idx} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: idx * 0.2 }}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field === 'message' ? (
                <textarea id={field} name={field} value={formData[field]} onChange={handleInputChange} rows="6" placeholder={`Enter your ${field}...`} disabled={isSubmitting} maxLength={MAX_MESSAGE_LENGTH}></textarea>
              ) : (
                <input type={field === 'email' ? 'email' : 'text'} id={field} name={field} value={formData[field]} onChange={handleInputChange} placeholder={`Enter your ${field}`} disabled={isSubmitting} maxLength={MAX_NAME_LENGTH} />
              )}
              {field === 'name' || field === 'message' ? <span className='char-count'>{formData[field].length}/{field==='name'?MAX_NAME_LENGTH:MAX_MESSAGE_LENGTH}{field==='message'?` (min: ${MIN_MESSAGE_LENGTH})`:''}</span> : null}
            </motion.div>
          ))}

          {submitStatus.message && <div className={`submit-status ${submitStatus.type}`}>{submitStatus.message}</div>}

          <motion.button type='submit' className='submit-btn' whileHover={{ scale: 1.05 }} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Landing;