import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import "../styles/policylist.css";
import { useNavigate } from "react-router-dom";

export default function PolicyList() {
  const [policies, setPolicy] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const policiesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/policies/policy_details", {
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
    (policy) =>
      policy.policy_holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policy_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const policiesToDisplay =
    filteredPolicies.length === 0 && searchTerm.trim() !== ""
      ? policies
      : filteredPolicies;

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

  if (error) {
    return (
      <div className="body">
        <div className="policy-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="policy-list-container">
        <input
          type="text"
          className="search-input"
          placeholder="search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="policy-table-wrapper">
          <table className="policy-table">
            <thead>
              <tr>
                <th>Policy Holder</th>
                <th>Policy Number</th>
                <th>Premium</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPolicies.map((policy) => (
                <tr
                  key={policy.policy_id}
                  className="policy-row"
                  onClick={() => navigate(`/policy/${policy.policy_id}`)}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <td>{policy.policy_holder}</td>
                  <td>{policy.policy_number}</td>
                  <td>{policy.premium}</td>
                  <td>{policy.start_date}</td>
                  <td>{policy.end_date}</td>
                  <td>{policy.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPolicies.length === 0 && searchTerm.trim() !== "" && (
            <p className="no-policy-message">
              No policy named "{searchTerm}" found. Showing all policies.
            </p>
          )}
          {totalPolicies > 0 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                &lt;&lt;
              </button>
              <span>
                {endIndex} out of {totalPolicies}
              </span>
              <button
                disabled={endIndex >= totalPolicies}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                &gt;&gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
