import React from "react";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

export default function PolicyCard({ policy }) {
  const navigate = useNavigate();
  return (
    <div key={policy.policy_id} className="policy-card" onClick={() => navigate(`/policy/${policy.policy_id}`)}>
      <div>
        <h2>{policy.policy_holder}</h2>
      </div>
      <div className="policy-details">
        <div className="label-container">
          <label>Policy Number:</label>
          <p>{policy.policy_number}</p>
        </div>
        <div className="label-container">
          <label>Premium:</label>
          <p>{policy.premium}</p>
        </div>
        <div className="label-container">
          <label>Start Date:</label>
          <p>{policy.start_date}</p>
        </div>
        <div className="label-container">
          <label>End Date:</label>
          <p>{policy.end_date}</p>
        </div>
      </div>
    </div>
  );
}
