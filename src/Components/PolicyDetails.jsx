import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/policydetails.css";




export default function PolicyDetails() {
  const { policyId } = useParams(); // get policy id from URL
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://90175f0f47e6.ngrok-free.app/policies/policy_details?policy_id=${policyId}`, {
      method: "GET",
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
      <div className="policy-details-container">
        <div className="loading-message">
          <p>Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="policy-details-container">
        <button className="back-arrow" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return <p>No policy data found.</p>;
  }

  return (
    <div className="policy-details-container">
      <button className="back-arrow" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Policies
      </button>
  <div className="policy-form">
    <div className="policy-header">
      <img 
        src="/logos/ValueMomentum Corporate Logo 2024 - transparent.png" 
        alt="ValueMomentum Logo"
      />
      <h2>ValueMomentum</h2>
    </div>

    <div className="policy-body">
      <h3>Policy Holder Details</h3>
      <div className="policy-holder-details">
        {/* Left Column */}
        <div className="policy-holder-col">
          {/* <h4>Personal Details</h4> */}
          <ul>
            <li><strong>Policy Holder:</strong> <span>{policy.policy_holder}</span></li>
            <li><strong>Address:</strong> <span>{policy.user.address}</span></li>
            <li>
              <strong>Contact:</strong>
              <ul>
                <li><i style={{fontSize: "11px", color: "#4f748dff"}}>ph:</i> <span>{policy.user.phone}</span></li>
                <li><i style={{fontSize: "11px", color: "#4f748dff"}}>email:</i> <span>{policy.user.email}</span></li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Right Column */}
        <div className="policy-holder-col">
          {/* <h4>Policy Details</h4> */}
          <ul>
            <li><strong>Policy Number:</strong> <span>{policy.policy_number}</span></li>
            <li><strong>Premium:</strong> <span>{policy.premium}</span></li>
            <li><strong>Coverage Amount:</strong> <span>{policy.coverage_amount}</span></li>
            <li><strong>Period:</strong><span>From <i>{policy.start_date}</i> To <i>{policy.end_date}</i></span></li>
            <li><strong>Status:</strong> <span>{policy.status}</span></li>
          </ul>
        </div>
      </div>

      <div className="policy-section">
        <h3>{policy.insurable_details.type} Details</h3>
        <div className="vehicle-card" >
        <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Type</th>
              </tr>
          </thead>
          <tbody> 
            {policy.insurable_details.length > 0 ? (
              policy.insurable_details.map((insurable) => (
          <tr key={insurable.id}  onClick={() => navigate(`/${insurable.type}/${insurable.id}`)}>
              <td>{insurable.id}</td>
              <td>{insurable.type}</td> {/* assuming API gives description */}
          </tr>))
          
        ) : (
          <tr>
            <td colSpan="2">No insurable details filed for this policy.</td>
          </tr>
        )}
        </tbody>
          </table>
          </div>
      </div>

      <div className="policy-section">
        <h3>Filed Claims</h3>
        <div  className="claim-card">
            <table>
              <thead>
                <tr>
                    <th>Claim.No</th>
                    <th>Claim Description</th>
                    <th>Date of Incident</th>
                    <th>Raised Date</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                  {policy.filed_claims.length > 0 ? (
                    policy.filed_claims.map((claim) => (
                      <tr key={claim.claim_id} className="claim-card" onClick={() => navigate(`/claims/${claim.claim_id}`)}>
                        <td>{claim.claim_number}</td>
                        <td>{claim.damage_description_user}</td>
                        <td>{claim.date_of_incident}</td>
                        <td>{claim.claim_date}</td>
                        <td>{claim.claim_status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No claims filed for this policy.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
  </div>
</div>

  );
}
