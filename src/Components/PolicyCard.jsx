import React from "react";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

export default function PolicyCard({ policy }) {
  const navigate = useNavigate();
  return (
    <div key={policy.policy_id} className="policy-card" onClick={() => navigate(`/policy/${policy.policy_id}`)}>
      <div className="policy-details">
      <div>
        <p>{policy.policy_holder}</p>
      </div>
      
        <div className="label-container">
          <p>{policy.policy_number}</p>
        </div>
        <div className="label-container">
          <p>{policy.premium}</p>
        </div>
        <div className="label-container">
          <p>{policy.start_date}</p>
        </div>
        <div className="label-container">
          <p>{policy.end_date}</p>
        </div>
        <div className="label-container">
          <p>{policy.status}</p>
        </div>
      </div>
    </div>
  );
}
