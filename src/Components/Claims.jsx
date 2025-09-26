import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye, FaPlus, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/claims.css";

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [claimsPerPage, setClaimsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://90175f0f47e6.ngrok-free.app/claims/claim_details", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setError(data.detail);
          setClaims([]);
        } else {
          setClaims(Array.isArray(data) ? data : [data]);
        }
      })
      .catch((err) => setError("Something went wrong: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClaims = claims.filter(
    (claim) => {
      const matchesSearch = claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.claim_status.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || claim.claim_status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }
  );

  const totalClaims = filteredClaims.length;
  const startIndex = (currentPage - 1) * claimsPerPage;
  const endIndex = Math.min(startIndex + claimsPerPage, totalClaims);
  const currentClaims = filteredClaims.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="claims-loading">
        <div className="loading-spinner"></div>
        <p>Loading claims...</p>
      </div>
    );
  }

  return (
    <div className="claims-container">
      <div className="claims-topbar">
        <div className="search-filter-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={handleSearch}
          />
          
          <button className="icon-btn" onClick={() => setShowFilter(!showFilter)}>
            <FaFilter />
          </button>
          {showFilter && (
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-review">In-Review</option>
            </select>
          )}
        </div>
        
        <div className="right-controls">
          <div className="limit-container">
            <label>Show:</label>
            <select value={claimsPerPage} onChange={(e) => {setClaimsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="limit-select">
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button className="add-claim-btn" onClick={() => navigate("/claims/create")}>
            <FaPlus /> File New Claim
          </button>
        </div>
      </div>

      <div className="claims-table-container">
        {error ? (
          <div className="no-claims-container">
            <p className="no-claims-message">{error}</p>
          </div>
        ) : currentClaims.length > 0 ? (
          <>
            <div className="claims-table-header">
              <span>Claim Number</span>
              <span>Policy ID</span>
              <span>Incident Date</span>
              <span>Claim Date</span>
              <span>Status</span>
              <span>Requested Amount</span>
            </div>
            {currentClaims.map((claim) => (
              <div
                key={claim.claim_id}
                className="claims-table-row"
                onClick={() => navigate(`/claims/${claim.claim_id}`)}
              >
                <span title={claim.claim_number}>{claim.claim_number}</span>
                <span>{claim.policy_id}</span>
                <span>{new Date(claim.date_of_incident).toLocaleDateString()}</span>
                <span>{new Date(claim.claim_date).toLocaleDateString()}</span>
                <span>
                  <span className={`status-badge ${claim.claim_status.toLowerCase()}`}>
                    {claim.claim_status}
                  </span>
                </span>
                <span>₹{claim.requested_amount.toLocaleString()}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="no-claims-container">
            <p className="no-claims-message">
              {searchTerm || statusFilter ? "No claims match your filters" : "No claims available yet."}
            </p>
            {!searchTerm && !statusFilter && (
              <button className="add-first-claim-btn" onClick={() => navigate("/claims/create")}>
                <FaPlus /> File Your First Claim
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalClaims > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <FaChevronLeft />
          </button>
          <span className="pagination-info">
            {totalClaims === 0 ? 0 : startIndex + 1} – {endIndex} of {totalClaims}
          </span>
          <button
            className="pagination-btn"
            disabled={endIndex >= totalClaims}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}