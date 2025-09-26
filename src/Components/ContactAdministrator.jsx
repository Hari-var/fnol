import React from 'react';
import { FaExclamationTriangle, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../styles/contactAdministrator.css';

export default function ContactAdministrator() {
  return (
    <div className="contact-admin-container">
      <div className="contact-admin-content">
        <FaExclamationTriangle className="warning-icon" />
        <h1>Account Inactive</h1>
        <p>Your account is currently inactive. Please contact the administrator to reactivate your account.</p>
        
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope />
            <span>admin@insurance.com</span>
          </div>
          <div className="contact-item">
            <FaPhone />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
}