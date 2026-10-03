import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import Footer from '../footer/footer';
import './explore.css';

const Explore = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthContext();

  return (
    <div className="explore-page">
      <main>
        <button className="back-home-button" onClick={() => navigate('/')}>
          Back to home
        </button>
        <section className="explore-hero">
          <div className="explore-hero-copy">
            <p className="explore-eyebrow">THE CRYPTOPS MARKETPLACE</p>
            <h1>Find the next thing worth bidding on.</h1>
            <p className="explore-intro">
              Discover auctions built for transparent, secure, and fair transactions. Browse freely, then sign in when you are ready to place a bid.
            </p>
            <div className="explore-actions">
              <button className="explore-primary" onClick={() => signIn()}>
                Sign In
              </button>
            </div>
          </div>
          <div className="explore-hero-note">
            <span className="note-mark">01</span>
            <p>Every bid is recorded on the blockchain for a clear and accountable auction.</p>
          </div>
        </section>

        <section className="how-it-works" aria-labelledby="how-heading">
          <div>
            <p className="explore-eyebrow">HOW IT WORKS</p>
            <h2 id="how-heading">From discovery to ownership.</h2>
          </div>
          <div className="steps">
            <div className="step"><span>01</span><h3>Connect</h3><p>Sign in and connect your wallet to get started.</p></div>
            <div className="step"><span>02</span><h3>Browse</h3><p>Explore items and find an auction that fits you.</p></div>
            <div className="step"><span>03</span><h3>Bid</h3><p>Place a transparent bid and follow the result on-chain.</p></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;