import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaUpload, FaRobot } from "react-icons/fa";
import "../styles/vehiclepolicyform.css";

export default function ClaimsForm({user}) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [insuredAssets, setInsuredAssets] = useState([]);
  const [formData, setFormData] = useState({
    policy_id: "",
    subject_id: "",
    damage_description_user: "",
    damage_description_llm: "",
    severity_level: "",
    damage_percentage: "",
    date_of_incident: "",
    location_of_incident: "",
    fir_no: "",
    requested_amount: "",
    approvable_amount: "",
    approvable_reason: "",
    remarks: ""
  });
  const [damageImages, setDamageImages] = useState([]);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showDamagePopup, setShowDamagePopup] = useState(false);
  const [damageAnalysis, setDamageAnalysis] = useState("");

  useEffect(() => {
    setCurrentUser(user);
    if (user) {
      if (user.role === 'admin') {
        fetchUserNames();
      } else {
        fetchPolicies(user.user_id);
      }
    }
  }, [user]);

  const fetchUserNames = async () => {
    try {
      const response = await fetch('https://81a531d55958.ngrok-free.app/users/user_names', {
        credentials: 'include'
      });
      const data = await response.json();
      setUserNames(data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchPolicies = async (userId) => {
    try {
      const response = await fetch(`https://81a531d55958.ngrok-free.app/policies/policy_numbers/${userId || 0}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setPolicies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch policies');
    }
  };

  const fetchPolicyDetails = async (policyId) => {
    try {
      const response = await fetch(`https://81a531d55958.ngrok-free.app/policies/policy_details/${policyId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setSelectedPolicy(data);
    } catch (err) {
      setError('Failed to fetch policy details');
    }
  };

  const handleUserSelection = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    fetchPolicies(userId);
  };

  const fetchInsuredAssets = async (policyId) => {
    try {
      const response = await fetch(`https://81a531d55958.ngrok-free.app/insurables/get_id?policy_id=${policyId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Assets response:', data);
      setInsuredAssets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch insured assets');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'policy_id' && value) {
      setInsuredAssets([]); // Clear previous assets
      setFormData(prev => ({ ...prev, subject_id: '' })); // Clear selected asset
      fetchInsuredAssets(value);
      fetchPolicyDetails(value);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const handleMultipleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setDamageImages(prev => [...prev, ...files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setDamageImages(prev => [...prev, ...files]);
  };

  const allowDrag = (event) => event.preventDefault();

  const removeImage = (index) => {
    setDamageImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateFolderName = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `claim_${timestamp}_${random}`;
  };

  const handleLLMAnalysis = async () => {
    if (!formData.damage_description_user) {
      setError('Please provide damage description for analysis');
      return;
    }

    if (!formData.requested_amount) {
      setError('Please provide requested amount for analysis');
      return;
    }

    if (!selectedPolicy) {
      setError('Please select a policy first');
      return;
    }

    if (damageImages.length === 0) {
      setError('Please upload at least one damage image for analysis');
      return;
    }

    setAnalyzing(true);
    try {
      const formDataLLM = new FormData();
      
      damageImages.forEach((image) => {
        formDataLLM.append('images', image);
      });

      const response = await fetch(`https://81a531d55958.ngrok-free.app/llm/claim_validation?damage_description=${encodeURIComponent(formData.damage_description_user)}&requested_amount=${formData.requested_amount}&claimable_amount=${selectedPolicy.coverage_amount}`, {
        method: 'POST',
        credentials: 'include',
        body: formDataLLM
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        const details = data.details;
        setDamageAnalysis(details.damage_analysis);
        setFormData(prev => ({
          ...prev,
          damage_description_llm: details.damage_analysis || '',
          severity_level: details.severity_level || 'Low',
          damage_percentage: details.damage_percentage || '0',
          approvable_amount: details.approvable_amount || 0,
          approvable_reason: details.reason_for_approval || '',
          remarks: details.remarks || ''
        }));
        setShowDamagePopup(true);
      } else {
        setError('Analysis failed. Please try again.');
      }
      
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = async (files, folderName) => {
    if (files.length === 0) return null;

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('documents', file));

      const response = await fetch(`https://81a531d55958.ngrok-free.app/claims/upload_documents?folder_name=${folderName}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        return data.paths;
      }
      return null;
    } catch (err) {
      console.error('Document upload failed:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload damage images with unique folder name
      let damageImagePath = null;
      if (damageImages.length > 0) {
        const folderName = generateFolderName();
        const imageFormData = new FormData();
        damageImages.forEach((image) => {
          imageFormData.append('images', image);
        });
        
        const imageResponse = await fetch(`https://81a531d55958.ngrok-free.app/claims/upload_claim_images?folder_name=${folderName}`, {
          method: 'POST',
          body: imageFormData,
          credentials: 'include'
        });
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          damageImagePath = imageData.paths;
        }
      }

      // Upload documents
      let documentsPath = null;
      if (documents.length > 0) {
        const docFolderName = generateFolderName();
        documentsPath = await handleDocumentUpload(documents, docFolderName);
      }

      // Create claim
      const claimPayload = {
        policy_id: parseInt(formData.policy_id),
        subject_id: parseInt(formData.subject_id),
        damage_description_user: formData.damage_description_user,
        damage_description_llm: formData.damage_description_llm || "",
        severity_level: formData.severity_level || "Low",
        damage_percentage: parseFloat(formData.damage_percentage) || 0,
        damage_image_path: damageImagePath,
        date_of_incident: formData.date_of_incident,
        location_of_incident: formData.location_of_incident,
        documents_path: documentsPath,
        fir_no: formData.fir_no || null,
        requested_amount: parseFloat(formData.requested_amount),
        approvable_amount: formData.approvable_amount ? parseFloat(formData.approvable_amount) : null,
        approvable_reason: formData.approvable_reason || null,
        remarks: formData.remarks || null,
        claim_status: "in-review"
      };

      const response = await fetch('https://81a531d55958.ngrok-free.app/claims/claim_details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(claimPayload)
      });

      if (response.ok) {
        navigate('/claims');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create claim');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policy-form-container">
      <h2>File New Claim</h2>
      <form onSubmit={handleSubmit}>
        {/* User Selection for Admin */}
        {currentUser && currentUser.role === 'admin' && (
          <div className="form-section">
            <h3 className="section-title">Select User (Optional)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Select User</label>
                <select value={selectedUserId} onChange={handleUserSelection}>
                  <option value="">-- Select User (Optional) --</option>
                  {userNames.map(userData => (
                    <option key={userData.user_id} value={userData.user_id}>
                      {userData.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <h3 className="section-title">Claim Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Policy *</label>
              <select name="policy_id" value={formData.policy_id} onChange={handleChange} required>
                <option value="">-- Select Policy --</option>
                {policies.map(policy => (
                  <option key={policy.policy_id} value={policy.policy_id}>
                    {policy.policy_number}
                  </option>
                ))}
              </select>
            </div>
              
              <div className="form-group">
                <label>Insured Asset *</label>
                <select name="subject_id" value={formData.subject_id} onChange={handleChange} required>
                  <option value="">-- Select Insured Asset --</option>
                  {insuredAssets.map(assetId => (
                    <option key={assetId} value={assetId}>
                      Asset ID: {assetId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date of Incident *</label>
                <input 
                  type="date" 
                  name="date_of_incident" 
                  value={formData.date_of_incident} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Requested Amount *</label>
                <input 
                  type="number" 
                  name="requested_amount" 
                  value={formData.requested_amount} 
                  onChange={handleChange} 
                  placeholder="Enter amount"
                  required 
                />
              </div>

              <div className="form-group">
                <label>FIR Number</label>
                <input 
                  type="text" 
                  name="fir_no" 
                  value={formData.fir_no} 
                  onChange={handleChange} 
                  placeholder="Enter FIR number (if applicable)"
                />
              </div>

              <div className="form-group full-width">
                <label>Location of Incident *</label>
                <input 
                  type="text" 
                  name="location_of_incident" 
                  value={formData.location_of_incident} 
                  onChange={handleChange} 
                  placeholder="Enter incident location"
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Damage Description *</label>
                <textarea 
                  name="damage_description_user" 
                  value={formData.damage_description_user} 
                  onChange={handleChange} 
                  rows="4"
                  placeholder="Describe the damage in detail"
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Damage Assessment</h3>
            <div className="form-group">
              <label>Damage Images *</label>
              <button
                type="button"
                className="upload-btn"
                onClick={() => setShowImagePopup(true)}
              >
                📷 Upload Damage Images
              </button>
              {damageImages.length > 0 && (
                <p className="upload-status">{damageImages.length} image(s) uploaded</p>
              )}
            </div>
            
            <div className="analysis-section">
              <button
                type="button"
                className="analysis-btn"
                onClick={handleLLMAnalysis}
                disabled={analyzing || !formData.damage_description_user || !formData.requested_amount}
              >
                <FaRobot /> {analyzing ? "Analyzing..." : "AI Damage Analysis"}
              </button>
            </div>

            {formData.damage_description_llm && (
              <div className="llm-results">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Severity Level</label>
                    <input type="text" value={formData.severity_level} readOnly className="llm-field" />
                  </div>
                  <div className="form-group">
                    <label>Damage Percentage</label>
                    <input type="text" value={`${formData.damage_percentage}%`} readOnly className="llm-field" />
                  </div>
                  <div className="form-group">
                    <label>Approvable Amount</label>
                    <input type="text" value={`₹${formData.approvable_amount}`} readOnly className="llm-field" />
                  </div>
                  <div className="form-group full-width">
                    <label>AI Analysis</label>
                    <textarea value={formData.damage_description_llm} readOnly className="llm-field" rows="3" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3 className="section-title">Supporting Documents (Optional)</h3>
            <div className="upload-section">
              <input 
                type="file" 
                id="documents" 
                multiple 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="documents" className="upload-btn">
                <FaUpload /> Upload Documents
              </label>
              <p className="upload-hint">Supports: PDF, Images, Word documents</p>
              
              {documents.length > 0 && (
                <div className="documents-list">
                  {documents.map((doc, index) => (
                    <div key={index} className="document-item">
                      <span>{doc.name}</span>
                      <button type="button" onClick={() => removeDocument(index)}>
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/claims')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Filing Claim...' : 'File Claim'}
            </button>
          </div>
      </form>

      {/* ---- Damage Image Upload Popup ---- */}
      {showImagePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={() => setShowImagePopup(false)} className="close-btn-top">
              <FaTimes />
            </button>
            <div className="popup-form-content">
              <h3 className="section-title">Upload Damage Images</h3>
              <div 
                className="multi-upload-zone"
                onDrop={handleDrop}
                onDragOver={allowDrag}
                onClick={() => document.getElementById('multiple-upload').click()}
              >
                <div className="upload-instructions">
                  <p>📷 Drag & drop multiple images here or click to browse</p>
                  <p className="upload-hint">Supports: JPG, PNG, GIF (Multiple files allowed)</p>
                </div>
                <input
                  type="file"
                  id="multiple-upload"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleMultipleImageChange}
                />
              </div>
              
              {damageImages.length > 0 && (
                <div className="images-preview-grid">
                  {damageImages.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Damage ${index + 1}`}
                        className="preview-img"
                      />
                      <div className="image-info">
                        <p className="file-name">{image.name}</p>
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="popup-actions">
              <button 
                type="button" 
                onClick={() => setShowImagePopup(false)} 
                className="done-btn"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Damage Analysis Popup ---- */}
      {showDamagePopup && (
        <div className="popup-overlay">
          <div className="popup-content damage-popup">
            <button onClick={() => setShowDamagePopup(false)} className="close-btn-top">
              <FaTimes />
            </button>
            <div className="popup-form-content">
              <h3 className="section-title damage-title">🔍 AI Damage Analysis Report</h3>
              <div className="damage-content">
                <div className="damage-header">
                  <span className="damage-icon">⚠️</span>
                  <span className="damage-label">Analysis Results</span>
                </div>
                <div className="damage-text">
                  {damageAnalysis}
                </div>
              </div>
            </div>
            <div className="popup-actions">
              <button 
                type="button" 
                onClick={() => setShowDamagePopup(false)} 
                className="done-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}