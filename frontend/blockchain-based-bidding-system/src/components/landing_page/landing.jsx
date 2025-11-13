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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
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
            />
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
            />
          </div>

          <button type='submit' className='submit-btn'>
            Send Message
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;