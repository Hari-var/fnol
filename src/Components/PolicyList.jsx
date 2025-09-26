import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import "../styles/policylist.css";
import PolicyCard from "./PolicyCard";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function PolicyList() {
  const [policies, setPolicy] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [policiesPerPage, setPoliciesPerPage] = useState(10);

  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://90175f0f47e6.ngrok-free.app/policies/policy_details_all", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail != null) {
          setError(data.detail);
          setPolicy([]);
        } else {
          setPolicy(data);
        }
      })
      .catch((err) => setError("Something went wrong " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPolicies = policies.filter(
    (policy) => {
      const matchesSearch = policy.policy_holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.policy_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || policy.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }
  );

const policiesToDisplay = filteredPolicies;


  const totalPolicies = policiesToDisplay.length;
  const startIndex = (currentPage - 1) * policiesPerPage;
  const endIndex = Math.min(startIndex + policiesPerPage, totalPolicies);
  const currentPolicies = policiesToDisplay.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="body">
        <div className="policy-loading">
          <p>Loading policies.....</p>
        </div>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="policy-list-container">

        {/* Top bar with search icon, dropdown, add button */}
        <div className="policy-topbar">
  {/* Search + Filter */}
  <div className="search-wrapper">
    <input
      type="text"
      className="search-input"
      placeholder="Search policies..."
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
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="expired">Expired</option>
        <option value="under-review">Under Review</option>
      </select>
    )}
  </div>
  
  <div className="right-controls">
    <div className="limit-container">
      <label>Show:</label>
      <select value={policiesPerPage} onChange={(e) => {setPoliciesPerPage(Number(e.target.value)); setCurrentPage(1);}} className="limit-select">
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
    {/* Add Policy button */}
    <button className="add-policy-btn" onClick={() => navigate("/policy/add")}>
      <FaPlus /> Create New Policy
    </button>
  </div>
</div>



        {/* Policy list */}
        <div className="policy-table-container">
  {error ? (
    <div className="no-policy-container">
      <p className="no-policy-message">{error}</p>
    </div>
  ) : policiesToDisplay.length > 0 ? (
    <>
      {/* Header */}
      <div className="policy-table-header">
        <span>Policy No.</span>
        <span>Contact Name</span>
        <span>From</span>
        <span>To</span>
        <span>Status</span>
        <span>Premium</span>
      </div>
      {/* Rows */}
      {policiesToDisplay.slice(startIndex, endIndex).map((policy) => (
        <div
          key={policy.policy_id}
          className="policy-table-row"
          onClick={() => navigate(`/policy/${policy.policy_id}`)}
        >
          <span title={policy.policy_number}>{policy.policy_number}</span>
          <span title={policy.policy_holder}>{policy.policy_holder}</span>
          <span>{policy.start_date || "-"}</span>
          <span>{policy.end_date || "-"}</span>
          <span>
            <span className={`status-badge ${policy.status?.toLowerCase() || 'active'}`}>
              {policy.status || 'Active'}
            </span>
          </span>
          <span>₹{policy.premium}</span>
        </div>
        
      ))}
    </>
  ) : (
    <div className="no-policy-container">
      <p className="no-policy-message">
        {searchTerm ? `No policy named "${searchTerm}" found.` : "No policies available yet."}
      </p>
    </div>
  )}
</div>




        {/* Pagination */}
        {totalPolicies > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FaChevronLeft />
            </button>
            <span className="pagination-info">
              {totalPolicies === 0 ? 0 : startIndex + 1} – {endIndex} of {totalPolicies}
            </span>
            <button
              className="pagination-btn"
              disabled={endIndex >= totalPolicies}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
