import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/policycreate.css";

export default function PolicyCreate() {
  const [policyType, setPolicyType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!policyType || !startDate || !endDate) {
      return alert("Please fill all required fields!");
    }
    // Pass dates to the type-specific page
    navigate(`/policy/create/${policyType.toLowerCase()}`, {
      state: { startDate, endDate }
    });
  };

  return (
    <div className="policy-create-container">
      <h2>Create New Policy</h2>
      <div className="policy-type-select">
        <label htmlFor="policyType">Select Policy Type:</label>
        <select
          id="policyType"
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
        >
          <option value="">--Select--</option>
          <option value="Auto">Auto / Vehicle</option>
          <option value="Health">Health</option>
          <option value="Property">Property</option>
        </select>
        
      </div>
      <div className="form-row">
        <label>Start Date *</label>
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required 
        />
      </div>
      <div className="form-row">
        <label>End Date *</label>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required 
        />
      </div>
      <button className="next-btn" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}
