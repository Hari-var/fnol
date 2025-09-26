import React from 'react';
import { FaClock, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/comingSoon.css';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <FaClock className="coming-soon-icon" />
        <h1>Coming Soon</h1>
        <p>This feature is currently under development and will be available soon.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Go Back
        </button>
      </div>
    </div>
  );
}