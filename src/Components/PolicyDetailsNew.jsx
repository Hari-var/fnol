import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaCar, FaFileAlt, FaCalendarAlt, 
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt 
} from "react-icons/fa";
import "../styles/policydetailsnew.css";
import { path } from "../config";

export default function PolicyDetailsNew() {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${path}/policies/policy_details?policy_id=${policyId}`, {
      method: "GET",
      headers: {'ngrok-skip-browser-warning': '1'},
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch policy details");
        }
        return response.json();
      })
      .then((data) => setPolicy(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [policyId]);

  if (loading) {
    return (
      <div className="policy-loading">
        <div className="loading-spinner"></div>
        <p>Loading policy details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="policy-error">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="error-content">
          <h3>Error Loading Policy</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return <div className="policy-error"><p>No policy data found.</p></div>;
  }

  return (
    <div className="policy-details-new">
      <div className="policy-header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Policies
        </button>
        <h1>Policy Details</h1>
      </div>

      <div className="policy-content">
        {/* Policy Overview */}
        <div className="policy-card main-card">
          <div className="card-header">
            <div className="policy-number">
              <FaFileAlt className="icon" />
              <div>
                <h2>{policy.policy_number}</h2>
                <span className={`status ${policy.status.toLowerCase()}`}>{policy.status}</span>
              </div>
            </div>
            <div className="premium-amount">
              <span className="label">Premium</span>
              <span className="amount">₹{policy.premium}</span>
            </div>
          </div>
          <div className="policy-info-grid">
            <div className="info-item">
              <FaCalendarAlt className="icon" />
              <div>
                <span className="label">Policy Period</span>
                <span className="value">{policy.start_date} to {policy.end_date}</span>
              </div>
            </div>
            <div className="info-item">
              <span className="label">Coverage Amount</span>
              <span className="value">₹{policy.coverage_amount}</span>
            </div>
          </div>
        </div>

        {/* Policy Holder */}
        <div className="policy-card">
          <div className="card-title">
            <FaUser className="icon" />
            <h3>Policy Holder Details</h3>
          </div>
          <div className="holder-details">
            <div>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{policy.policy_holder}</span>
              </div>
              <div className="detail-row">
                <FaMapMarkerAlt className="icon" />
                <span className="label">Address:</span>
                <span className="value">{policy.user.address}</span>
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="icon" />
                <span>{policy.user.phone}</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="icon" />
                <span>{policy.user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insurable Details */}
        <div className="policy-card">
          <div className="card-title">
            <FaCar className="icon" />
            <h3>Insured Assets</h3>
          </div>
          <div className="assets-grid">
            {policy.insurable_details.length > 0 ? (
              policy.insurable_details.map((insurable) => (
                <div 
                  key={insurable.id} 
                  className={`asset-card ${insurable.type === 'vehicle' ? 'clickable' : ''}`}
                  onClick={() => {
                    if (insurable.type === 'vehicle') {
                      navigate(`/vehicle-details/${insurable.id}`);
                    }
                  }}
                >
                  <div className="asset-type">{insurable.type}</div>
                  <div className="asset-id">ID: {insurable.id}</div>
                </div>
              ))
            ) : (
              <p className="no-data">No insured assets found</p>
            )}
          </div>
        </div>

        {/* Claims */}
        <div className="policy-card">
          <div className="card-title">
            <FaFileAlt className="icon" />
            <h3>Filed Claims</h3>
          </div>
          <div className="claims-grid">
            {policy.filed_claims.length > 0 ? (
              policy.filed_claims.map((claim) => (
                <div 
                  key={claim.claim_id} 
                  className="claim-card"
                  onClick={() => navigate(`/claims/${claim.claim_id}`)}
                >
                  <div className="claim-header">
                    <span className="claim-number">{claim.claim_number}</span>
                    <span className={`claim-status ${claim.claim_status.toLowerCase()}`}>
                      {claim.claim_status}
                    </span>
                  </div>
                  <div className="claim-description">{claim.damage_description_user}</div>
                  <div className="claim-dates">
                    <span>Incident: {claim.date_of_incident}</span>
                    <span>Filed: {claim.claim_date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-claims">
                <p>No claims filed for this policy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
