import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/assets.css';
import { path } from "../config";

export default function Assets() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${path}/insurables/assets`, {
        headers: {'ngrok-skip-browser-warning': '1'},
        withCredentials: true
      });
      if (response.data.detail != null) {
        setError(response.data.detail);
        setAssets([]);
      } else {
        setAssets(response.data);
      }
    } catch (err) {
      setError('Failed to fetch assets');
      setAssets([]);
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.policy_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.id?.toString().includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) return <div className="loading">Loading assets...</div>;

  return (
    <div className="assets-container">
      <div className="assets-header">
        <h2>Insured Assets</h2>
        <div className="controls-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="limit-container">
            <label>Show:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="limit-select">
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="no-data-container">
          <div className="no-data-icon">🏠</div>
          <h3>No Assets Found</h3>
          <p>{error}</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="no-data-container">
          <div className="no-data-icon">🏠</div>
          <h3>No Assets Found</h3>
          <p>There are currently no insured assets to display.</p>
        </div>
      ) : (
        <div className="assets-table-container">
          <table className="assets-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Type</th>
                <th>Policy Number</th>
              </tr>
            </thead>
            <tbody>
              {currentAssets.map((asset) => (
                <tr 
                  key={asset.id} 
                  className={asset.type === 'vehicle' ? 'clickable-row' : ''}
                  onClick={() => {
                    if (asset.type === 'vehicle') {
                      navigate(`/vehicle-details/${asset.id}`);
                    }
                  }}
                >
                  <td className="id-cell">{asset.id}</td>
                  <td className="type-cell" title={asset.type}>{asset.type}</td>
                  <td className="policy-cell" title={asset.policy_number}>{asset.policy_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAssets.length)} of {filteredAssets.length} assets
          </div>
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}