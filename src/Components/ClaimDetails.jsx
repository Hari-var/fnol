import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileAlt, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign, FaExclamationTriangle, FaRobot, FaUser, FaImage, FaDownload, FaTimes, FaEdit, FaCheck, FaBan, FaSave } from "react-icons/fa";
import "../styles/claimdetails.css";

export default function ClaimDetails() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ type: '', url: '', title: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Fetch current user
    fetch(`https://90175f0f47e6.ngrok-free.app/auth/me`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(userData => setCurrentUser(userData))
      .catch(err => console.error('Failed to fetch user:', err));

    // Fetch claim details
    fetch(`https://90175f0f47e6.ngrok-free.app/claims/claim_details/${claimId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch claim details");
        }
        return response.json();
      })
      .then((data) => {
        console.log('Full claim data:', data);
        setClaim(data);
        setEditData({
          approvable_amount: data.approvable_amount || '',
          approvable_reason: data.approvable_reason || '',
          remarks: data.remarks || ''
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [claimId]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isEditMode || showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditMode, showPopup]);

  if (loading) {
    return (
      <div className="claim-loading">
        <div className="loading-spinner"></div>
        <p>Loading claim details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="claim-error">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="error-content">
          <h3>Error Loading Claim</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!claim) {
    return <div className="claim-error"><p>No claim data found.</p></div>;
  }

  const handleViewImage = (imagePath) => {
    setPopupContent({ type: 'image', url: `https://90175f0f47e6.ngrok-free.app/claims/files?path=${encodeURIComponent(imagePath)}`, title: 'Damage Image' });
    setShowPopup(true);
  };

  const handleViewDocument = (docPath) => {
    setPopupContent({ type: 'document', url: `https://90175f0f47e6.ngrok-free.app/claims/files?path=${encodeURIComponent(docPath)}`, title: 'Document' });
    setShowPopup(true);
  };

  const parseImagePaths = (imagePathString) => {
    console.log('Raw image path string:', imagePathString);
    try {
      if (!imagePathString) return [];
      
      // Handle HTML encoded strings
      let cleanString = imagePathString
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
      
      console.log('Cleaned string:', cleanString);
      
      // Parse the JSON
      const parsed = JSON.parse(cleanString.replace(/'/g, '"'));
      console.log('Parsed image paths:', parsed);
      
      const result = Array.isArray(parsed) ? parsed : Object.values(parsed);
      console.log('Final image paths:', result);
      return result;
    } catch (error) {
      console.error('Error parsing image paths:', error);
      return [];
    }
  };

  const parseDocumentPaths = (docPathString) => {
    console.log('Raw document path string:', docPathString);
    try {
      if (!docPathString) return [];
      
      // Handle HTML encoded strings
      let cleanString = docPathString
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
      
      console.log('Cleaned document string:', cleanString);
      
      const parsed = JSON.parse(cleanString.replace(/'/g, '"'));
      console.log('Parsed document paths:', parsed);
      
      const result = Array.isArray(parsed) ? parsed : Object.values(parsed);
      console.log('Final document paths:', result);
      return result;
    } catch (error) {
      console.error('Error parsing document paths:', error);
      return docPathString ? [docPathString] : [];
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent({ type: '', url: '', title: '' });
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`https://90175f0f47e6.ngrok-free.appclaims/claim_details/${claimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ claim_status: 'approved' })
      });
      if (response.ok) {
        setClaim(prev => ({ ...prev, claim_status: 'approved' }));
        alert('Claim approved successfully');
      }
    } catch (err) {
      setError('Failed to approve claim');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`https://90175f0f47e6.ngrok-free.appclaims/claim_details/${claimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ claim_status: 'rejected' })
      });
      if (response.ok) {
        setClaim(prev => ({ ...prev, claim_status: 'rejected' }));
        alert('Claim rejected successfully');
      }
    } catch (err) {
      setError('Failed to reject claim');
    }
  };

  const handleUpdate = async () => {
    try {
      const updatePayload = {
        approvable_amount: editData.approvable_amount ? parseFloat(editData.approvable_amount) : null,
        approvable_reason: editData.approvable_reason,
        remarks: editData.remarks
      };
      const response = await fetch(`https://90175f0f47e6.ngrok-free.appclaims/claim_details/${claimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatePayload)
      });
      if (response.ok) {
        setClaim(prev => ({ ...prev, ...updatePayload }));
        setIsEditMode(false);
        alert('Claim updated successfully');
      }
    } catch (err) {
      setError('Failed to update claim');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };



  return (
    <div className="claim-details-container">
      <div className="claim-header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Claims
        </button>
        <h1>Claim Details</h1>
        <div className="header-actions">
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'agent') && (
            <button className="edit-btn" onClick={() => setIsEditMode(true)}>
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="claim-content">
        {/* Claim Overview */}
        <div className="claim-card main-card">
          <div className="card-header">
            <div className="claim-number">
              <FaFileAlt className="icon" />
              <div>
                <h2>{claim.claim_number}</h2>
                <span className={`status ${claim.claim_status.toLowerCase()}`}>
                  {claim.claim_status}
                </span>
              </div>
            </div>
            <div className="amount-section">
              <div className="amount-item">
                <span className="label">Requested Amount</span>
                <span className="amount">₹{claim.requested_amount.toLocaleString()}</span>
              </div>
              <div className="amount-item">
                <span className="label">Approvable</span>
                <span className="amount approved">
                  ₹{claim.approvable_amount ? claim.approvable_amount.toLocaleString() : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div className="claim-card">
          <div className="card-title">
            <FaCalendarAlt className="icon" />
            <h3>Incident Information</h3>
          </div>
          <div className="incident-details">
            <div className="detail-row">
              <span className="label">Date of Incident:</span>
              <span className="value">{new Date(claim.date_of_incident).toLocaleDateString()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Claim Date:</span>
              <span className="value">{new Date(claim.claim_date).toLocaleDateString()}</span>
            </div>
            {claim.location_of_incident && (
              <div className="detail-row">
                <FaMapMarkerAlt className="icon" />
                <span className="label">Location:</span>
                <span className="value">{claim.location_of_incident}</span>
              </div>
            )}
            {claim.fir_no && (
              <div className="detail-row">
                <span className="label">FIR Number:</span>
                <span className="value">{claim.fir_no}</span>
              </div>
            )}
          </div>
        </div>

        {/* Damage Assessment */}
        <div className="claim-card">
          <div className="card-title">
            <FaExclamationTriangle className="icon" />
            <h3>Damage Assessment</h3>
          </div>
          <div className="damage-details">
            <div className="assessment-grid">
              <div className="assessment-card user-assessment">
                <div className="assessment-header">
                  <FaUser className="assessment-icon" />
                  <h4>User Description</h4>
                </div>
                <p className="description">{claim.damage_description_user}</p>
              </div>
              {claim.damage_description_llm && (
                <div className="assessment-card ai-assessment">
                  <div className="assessment-header">
                    <FaRobot className="assessment-icon" />
                    <h4>AI Assessment</h4>
                  </div>
                  <p className="description">{claim.damage_description_llm}</p>
                </div>
              )}
            </div>
            <div className="damage-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Severity Level</span>
                </div>
                <span className={`metric-value severity-${claim.severity_level?.toLowerCase()}`}>
                  {claim.severity_level}
                </span>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Damage Percentage</span>
                </div>
                <span className="metric-value">{claim.damage_percentage}%</span>
              </div>
            </div>
          </div>
        </div>



        {/* Admin Fields */}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'agent') && (
          <div className="claim-card admin-section">
            <div className="card-title">
              <FaEdit className="icon" />
              <h3>Administrative Details</h3>
            </div>
            <div className="admin-fields">
              <div className="field-group">
                <label>Approval Reason:</label>
                <p className="admin-text">{claim.approvable_reason || 'Not provided'}</p>
              </div>
              <div className="field-group">
                <label>Remarks:</label>
                <p className="admin-text">{claim.remarks || 'No remarks'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Damage Images */}
        {claim.damage_image_path && (
          <div className="claim-card">
            <div className="card-title">
              <FaImage className="icon" />
              <h3>Damage Images</h3>
            </div>
            <div className="images-grid">
              {parseImagePaths(claim.damage_image_path).map((imagePath, index) => (
                <div key={index} className="image-card">
                  <div className="image-preview">
                    <img 
                      src={`https://90175f0f47e6.ngrok-free.appclaims/files?path=${encodeURIComponent(imagePath)}`}
                      alt={`Damage ${index + 1}`}
                      className="damage-image-thumb"
                      onClick={() => handleViewImage(imagePath)}
                    />
                  </div>
                  <div className="image-info">
                    <h4>Image {index + 1}</h4>
                    <button onClick={() => handleViewImage(imagePath)} className="view-btn">
                      <FaImage /> View Full Size
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="claim-card">
          <div className="card-title">
            <FaFileAlt className="icon" />
            <h3>Supporting Documents</h3>

          </div>
          <div className="documents-grid">
            {parseDocumentPaths(claim.documents_path).length > 0 ? (
              parseDocumentPaths(claim.documents_path).map((docPath, index) => (
                <div key={index} className="document-card">
                  <div className="doc-icon-wrapper">
                    <FaDownload className="doc-icon" />
                  </div>
                  <div className="doc-content">
                    <h4 className="doc-title">Document {index + 1}</h4>
                    <p className="doc-description">Supporting documentation</p>
                    <button onClick={() => handleViewDocument(docPath)} className="doc-link">
                      <FaDownload /> View Document
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-documents">
                <p>No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Action Buttons */}
      {currentUser && (currentUser.role === 'admin' || currentUser.role === 'agent') && claim.claim_status === 'in-review' && (
        <div className="bottom-actions">
          <button className="approve-btn" onClick={handleApprove}>
            <FaCheck /> Approve Claim
          </button>
          <button className="reject-btn" onClick={handleReject}>
            <FaBan /> Reject Claim
          </button>
        </div>
      )}

      {/* Edit Popup */}
      {isEditMode && (
        <div className="popup-overlay" onClick={() => setIsEditMode(false)}>
          <div className="edit-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Edit Claim Details</h3>
              <button className="popup-close" onClick={() => setIsEditMode(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-body">
              <div className="admin-fields">
                <div className="field-group">
                  <label>Approvable Amount:</label>
                  <input
                    type="number"
                    name="approvable_amount"
                    value={editData.approvable_amount}
                    onChange={handleEditChange}
                    placeholder="Enter approvable amount"
                  />
                </div>
                <div className="field-group">
                  <label>Approval Reason:</label>
                  <textarea
                    name="approvable_reason"
                    value={editData.approvable_reason}
                    onChange={handleEditChange}
                    placeholder="Enter reason for approval/rejection"
                    rows="3"
                  />
                </div>
                <div className="field-group">
                  <label>Remarks:</label>
                  <textarea
                    name="remarks"
                    value={editData.remarks}
                    onChange={handleEditChange}
                    placeholder="Enter additional remarks"
                    rows="3"
                  />
                </div>
              </div>
              <div className="popup-actions">
                <button className="cancel-btn" onClick={() => setIsEditMode(false)}>
                  Cancel
                </button>
                <button className="update-btn" onClick={handleUpdate}>
                  <FaSave /> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup for viewing images and documents */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>{popupContent.title}</h3>
              <button className="popup-close" onClick={closePopup}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-body">
              {popupContent.type === 'image' ? (
                <img src={popupContent.url} alt="Damage" className="popup-image" />
              ) : (
                <iframe src={popupContent.url} className="popup-document" title="Document Viewer" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}