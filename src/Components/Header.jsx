import React from 'react';
import '../styles/styles.css';
import '../styles/header.css';
import { Link } from 'react-router-dom';

export default function Header({ login, handleLogout }) {
  return (
    <div className="container">
      <div className="header-container">
        <Link to="/" className="home-link">
          <div className="image-wrapper">
            <img
              className="logo1"
              src="/logos/ValueMomentum Corporate Logo 2024 - transparent.png"
              alt="ValueMomentum Logo"
            />
            <img
              className="logo2"
              src="/logos/ValueMomentum White Corporate Logo 2024 - transparent.png"
              alt="ValueMomentum Logo"
            />
          </div>
        </Link>
        <h2 className="title">ValueMomentum Insurance</h2>
      </div>

      <div className="login-container">
        {login ? (
          <button className="login-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
}
