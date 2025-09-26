import React, { useState, useEffect } from "react";
import "../styles/vehiclepolicyform.css";
import axios from "axios";
import { FaTimes, FaRobot } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function VehiclePolicyForm({user}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    dateofbirth: "",
    phone: "",
    email: "",
    address: "",
    vehicle_no: "",
    vehicle_type: "",
    make: "",
    model: "",
    year_of_purchase: "",
    vin: "",
    premium: "",
    coverage_amount: "",
    policy_status: user?.role === 'user' ? 'under-review' : '',
    start_date: location.state?.startDate || "",
    end_date: location.state?.endDate || "",
  });

  const [images, setImages] = useState({
    front: null,
    left: null,
    right: null,
    back: null,
  });

  const [showImagePopup, setShowImagePopup] = useState(false);
  const [policyNumber, setPolicyNumber] = useState("");
  const [showContinue, setShowContinue] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewUserPopup, setShowNewUserPopup] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    middlename: "",
    dateofbirth: "",
    email: "",
    address:"",
  });
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [emailAvailability, setEmailAvailability] = useState(null);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateUsername = async (firstname, lastname) => {
    if (!firstname || !lastname) return '';
    const base = (firstname.toLowerCase() + lastname.toLowerCase()).replace(/[^a-z]/g, '');
    
    let username = '';
    let isAvailable = false;
    let attempts = 0;
    
    while (!isAvailable && attempts < 10) {
      const randomNum = Math.floor(Math.random() * 1000);
      username = base + randomNum;
      
      try {
        const response = await fetch(`https://90175f0f47e6.ngrok-free.app/users/check_username/${username}`);
        const data = await response.json();
        isAvailable = !data.exists;
        attempts++;
      } catch (error) {
        console.error('Error checking username:', error);
        break;
      }
    }
    
    return username;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [side]: file }));
    }
  };

  const handleDrop = (event, side) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [side]: file }));
    }
  };

  const allowDrag = (event) => event.preventDefault();

  useEffect(() => {
    // Auto-fill for regular users
    if (user && user.role === 'user') {
      fetchUserDetails(user.user_id);
    }
    // Load user names for admin/agent
    else if (user && (user.role === 'admin' || user.role === 'agent')) {
      fetchUserNames();
    }
  }, [user]);

  useEffect(() => {
    if (showNewUserPopup || showImagePopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNewUserPopup, showImagePopup]);

  const fetchUserNames = async () => {
    try {
      const response = await axios.get('https://90175f0f47e6.ngrok-free.app/users/user_names', {
        withCredentials: true
      });
      setUserNames(response.data);
    } catch (err) {
      console.error('Failed to fetch user names:', err);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`https://90175f0f47e6.ngrok-free.app/users/user_details/${userId}`, {
        withCredentials: true
      });
      const userData = response.data;
      setFormData(prev => ({
        ...prev,
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        middlename: userData.middlename || "",
        dateofbirth: userData.dateofbirth || "",
        phone: userData.phone || "",
        email: userData.email || "",
        address: userData.address || ""
      }));
    } catch (err) {
      console.error('Failed to fetch user details:', err);
    }
  };

  const handleUserSelection = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (userId) {
      setShowNewUserForm(false);
      fetchUserDetails(userId);
    } else {
      // Clear form when no user selected
      setFormData(prev => ({
        ...prev,
        firstname: "",
        lastname: "",
        middlename: "",
        dateofbirth: "",
        phone: "",
        email: "",
        address: ""
      }));
    }
  };

  const checkEmail = async (email) => {
    if (!email) {
      setEmailAvailability(null);
      return;
    }
    try {
      const res = await fetch(`https://90175f0f47e6.ngrok-free.app/users/check_email/${email}`);
      const data = await res.json();
      setEmailAvailability(data.exists ? "❌ Email already exists" : "✅ Email available");
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const handleNewUserChange = async (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate username when first or last name changes
    if (name === 'firstname' || name === 'lastname') {
      const updatedData = { ...newUserData, [name]: value };
      if (updatedData.firstname && updatedData.lastname) {
        setUsernameAvailability('Generating...');
        const autoUsername = await generateUsername(updatedData.firstname, updatedData.lastname);
        setNewUserData(prev => ({ ...prev, [name]: value, username: autoUsername }));
        setUsernameAvailability('✅ Username available');
      }
    }
    
    // Check email availability
    if (name === 'email') {
      checkEmail(value);
    }
    
    // Also update form data for display
    if (['firstname', 'lastname', 'middlename', 'dateofbirth', 'email'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const createNewUser = async () => {
    try {
      const autoPassword = generatePassword();
      const payload = {
        username: newUserData.username,
        firstname: newUserData.firstname,
        middlename: newUserData.middlename,
        lastname: newUserData.lastname,
        email: newUserData.email,
        dateofbirth: newUserData.dateofbirth,
        password: autoPassword,
        profile_pic: null,
        phone: null,
        address: null
      };
      
      const response = await fetch('https://90175f0f47e6.ngrok-free.app/users/input_user_details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Send acknowledgment email
        await axios.post('https://90175f0f47e6.ngrok-free.app/users/acknowledgement', {
          username: newUserData.username,
          password: autoPassword,
          email: newUserData.email
        });
        
        alert('New user created successfully! Login credentials sent to email.');
        setShowNewUserPopup(false);
        setShowNewUserForm(false);
        
        // Refresh user list and auto-select the new user
        await fetchUserNames();
        setSelectedUserId(data.user_id);
        setFormData(prev => ({
          ...prev,
          firstname: newUserData.firstname,
          lastname: newUserData.lastname,
          middlename: newUserData.middlename,
          dateofbirth: newUserData.dateofbirth,
          email: newUserData.email
        }));
        
        return data.user_id;
      } else {
        throw new Error(data.detail || 'Failed to create user');
      }
    } catch (err) {
      alert('Failed to create new user: ' + (err.message || err.response?.data?.detail));
      throw err;
    }
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserData.firstname || !newUserData.lastname || !newUserData.email || !newUserData.dateofbirth) {
      alert('Please fill all required fields');
      return;
    }
    if (emailAvailability?.includes('❌')) {
      alert('Please use a different email address');
      return;
    }
    await createNewUser();
  };

  const [damageReport, setDamageReport] = useState("No damages reported");
  const [showDamagePopup, setShowDamagePopup] = useState(false);
  const handleLLMAnalysis = async () => {
    if (!formData.make || !formData.model || !formData.year_of_purchase) {
      alert("Please fill vehicle make, model, and year for analysis");
      return;
    }
    
    if (!images.front || !images.back || !images.left || !images.right) {
      alert("Please upload all vehicle images for analysis");
      return;
    }
    
    setAnalyzing(true);
    try {
      const formData_llm = new FormData();
      formData_llm.append('front_img', images.front);
      formData_llm.append('back_img', images.back);
      formData_llm.append('left_img', images.left);
      formData_llm.append('right_img', images.right);


      const response = await fetch(`https://90175f0f47e6.ngrok-free.app/llm/extract_vehicle_details?make=${formData.make}&model=${formData.model}&type=${formData.vehicle_type}&year=${formData.year_of_purchase}`, {
        method: 'POST',
        credentials: 'include',
        body: formData_llm
      });
      
      const data = await response.json();
      
      if (data.valid) {
        // Extract damage report
        const damages = data.details?.damages || "No damages reported";
        setDamageReport(damages);
        
        // Calculate premium based on analysis
        const basePremium = 15000;
        const yearFactor = (2024 - parseInt(formData.year_of_purchase)) * 500;
        const premium = basePremium + yearFactor;
        const coverage = premium * 10;
        
        setFormData(prev => ({
          ...prev,
          premium: premium.toString(),
          coverage_amount: coverage.toString()
        }));
        
        setShowDamagePopup(true);
      } else {
        alert("Vehicle verification failed. Please check the images and details.");
      }
    } catch (err) {
      console.error('LLM Analysis error:', err);
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let targetUserId = user.user_id;
      
      // Use selected user ID
      if (selectedUserId && selectedUserId !== 'new') {
        targetUserId = selectedUserId;
      }

      const policy_payload = {
        user_id: targetUserId,
        start_date: formData.start_date,
        end_date: formData.end_date,
        premium: parseFloat(formData.premium),
        coverage_amount: parseFloat(formData.coverage_amount),
        status: formData.policy_status || 'under-review'
      }

      // 1. Create Policy first
      const policyRes = await fetch("https://90175f0f47e6.ngrok-free.app/policies/policy_details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(policy_payload),
      });

      const policyData =await policyRes.json();
      console.log(policyData);

      const policyId = policyData.policy_id;

      // 2. Upload all vehicle images in one call
      const imgForm = new FormData();
      imgForm.append("front_img", images.front);
      imgForm.append("back_img", images.back);
      imgForm.append("left_img", images.left);
      imgForm.append("right_img", images.right);

      const imgRes = await fetch(`https://90175f0f47e6.ngrok-free.app/vehicles/upload_vehicle_images?folder_name=${formData.vin}&typeofvehicle=${formData.vehicle_type}`, {
        method: "POST",
        credentials: "include",
        body: imgForm,
      });

      if (!imgRes.ok) {
        const errorData = await imgRes.text();
        throw new Error(`Upload failed: ${imgRes.status} ${errorData}`);
      }

      const result = await imgRes.json();
      console.log(result);

      const uploadedPaths = result.paths;

      const vehicle_payload = {
        policy_id: policyId,
        typeofvehicle: formData.vehicle_type,
        image_path: uploadedPaths, // store returned dict
        make: formData.make,
        model: formData.model,
        year_of_purchase: parseInt(formData.year_of_purchase),
        vin: formData.vin,
        vehicle_no: formData.vehicle_no,
        damage_report: damageReport || "No damages reported"
      }

      // 3. Create Vehicle
      const vehicleRes = await fetch("https://90175f0f47e6.ngrok-free.app/vehicles/vehicle_details", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(vehicle_payload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      setPolicyNumber(policyData.policy_number);
      setShowContinue(true);
      alert("Policy + Vehicle created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating policy/vehicle");
    }
  };

  return (
    <div className="policy-form-container">
      <h2>Vehicle Policy Details</h2>
      <form onSubmit={handleSubmit}>
        {/* User Selection for Admin/Agent */}
        {user && (user.role === 'admin' || user.role === 'agent') && (
          <div className="form-section">
            <h3 className="section-title">Select/Add Policy Holder</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Select User *</label>
                <select value={selectedUserId} onChange={handleUserSelection} required>
                  <option value="">-- Select User --</option>
                  {userNames.map(userData => (
                    <option key={userData.user_id} value={userData.user_id}>
                      {userData.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>&nbsp;</label>
                <button 
                  type="button" 
                  className="new-user-btn"
                  onClick={() => {
                    setShowNewUserPopup(true);
                    setSelectedUserId('');
                    setNewUserData({
                      username: "",
                      firstname: "",
                      lastname: "",
                      middlename: "",
                      dateofbirth: "",
                      email: ""
                    });
                    setUsernameAvailability(null);
                    setEmailAvailability(null);
                  }}
                >
                  + Add New User
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Personal Information Section - Auto-filled and read-only */}
        {(
          <div className="form-section">
            <h3 className="section-title">Personal Information (Auto-filled)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input name="firstname" value={formData.firstname} readOnly className="auto-filled-field" />
              </div>
              <div className="form-group">
                <label>Middle Name</label>
                <input name="middlename" value={formData.middlename} readOnly className="auto-filled-field" />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input name="lastname" value={formData.lastname} readOnly className="auto-filled-field" />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="dateofbirth" value={formData.dateofbirth} readOnly className="auto-filled-field" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value={formData.phone} readOnly className="auto-filled-field" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} readOnly className="auto-filled-field" />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <textarea name="address" value={formData.address} readOnly className="auto-filled-field" rows="3" />
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Information Section */}
        <div className="form-section">
          <h3 className="section-title">Vehicle Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Vehicle Number *</label>
              <input name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Type of Vehicle *</label>
              <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required>
                <option value="">-- Select Vehicle Type --</option>
                <option value="twowheeler">Two Wheeler</option>
                <option value="threewheeler">Three Wheeler</option>
                <option value="fourwheeler">Four Wheeler</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>VIN *</label>
              <input name="vin" value={formData.vin} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Make *</label>
              <input name="make" value={formData.make} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Model *</label>
              <input name="model" value={formData.model} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Year of Purchase *</label>
              <input type="number" name="year_of_purchase" value={formData.year_of_purchase} onChange={handleChange} required />
            </div>
            <div className="form-group">
            <label>Vehicle Images*</label>
            <button
              type="button"
              className="upload-btn"
              onClick={() => setShowImagePopup(true)}
            >
              📷 Upload Vehicle Images
            </button>
          </div>
          {damageReport !== "No damages reported" && (
            <div className="form-group full-width">
              <label>Damage Assessment</label>
              <div className="damage-report-display">
                <p>{damageReport}</p>
                <button 
                  type="button" 
                  className="view-damage-btn"
                  onClick={() => setShowDamagePopup(true)}
                >
                  View Details
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* LLM Analysis Button */}
        <div className="analysis-section">
          <button
            type="button"
            className="analysis-btn"
            onClick={handleLLMAnalysis}
            disabled={analyzing}
          >
            <FaRobot /> {analyzing ? "Analyzing..." : "AI Premium Analysis"}
          </button>
        </div>

        {/* Policy Information Section */}
        <div className="form-section">
          <h3 className="section-title">Policy Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required readOnly={user?.role === 'user'} className={user?.role === 'user' ? 'auto-filled-field' : ''} />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required readOnly={user?.role === 'user'} className={user?.role === 'user' ? 'auto-filled-field' : ''} />
            </div>
            <div className="form-group">
              <label>Premium Amount *</label>
              <input type="number" name="premium" value={formData.premium} onChange={handleChange} required readOnly={user?.role === 'user'} className={user?.role === 'user' ? 'auto-filled-field' : ''} />
            </div>
            <div className="form-group">
              <label>Coverage Amount *</label>
              <input type="number" name="coverage_amount" value={formData.coverage_amount} onChange={handleChange} required readOnly={user?.role === 'user'} className={user?.role === 'user' ? 'auto-filled-field' : ''} />
            </div>
            {user && (user.role === 'admin' || user.role === 'agent') && (
              <div className="form-group">
                <label>Policy Status *</label>
                <select name="policy_status" value={formData.policy_status} onChange={handleChange} required>
                  <option value="">-- Select Status --</option>
                  <option value="under-review">Under Review</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            )}
            {user?.role === 'user' && (
              <div className="form-group">
                <label>Policy Status</label>
                <input type="text" value="Under Review" readOnly className="auto-filled-field" />
              </div>
            )}
          </div>
        </div>

        {policyNumber && (
          <div className="form-section">
            <div className="form-group">
              <label>Policy Number</label>
              <input type="text" value={policyNumber} readOnly className="policy-number-field" />
            </div>
          </div>
        )}

        <div className="form-actions">
          {!showContinue ? (
            <button type="submit" className="submit-btn">Create Policy</button>
          ) : (
            <button 
              type="button" 
              className="continue-btn"
              onClick={() => navigate('/policies')}
            >
              Continue to Policies
            </button>
          )}
        </div>
      </form>

      {/* ---- Image Upload Popup ---- */}
      {showImagePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={() => setShowImagePopup(false)} className="close-btn-top">
              <FaTimes />
            </button>
            <div className="popup-form-content">
              <h3 className="section-title">Upload Vehicle Images</h3>
              <div className="image-upload-grid">
                {["front", "left", "right", "back"].map((side) => (
                  <div
                    key={side}
                    className="upload-box"
                    onDrop={(e) => handleDrop(e, side)}
                    onDragOver={allowDrag}
                  >
                    {images[side] ? (
                      <div className="preview-container">
                        <img
                          src={URL.createObjectURL(images[side])}
                          alt={`${side} view`}
                          className="preview-img"
                        />
                        <p className="file-name">{images[side].name}</p>
                      </div>
                    ) : (
                      <p className="upload-label">Drag & drop or browse {side} view</p>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id={`upload-${side}`}
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, side)}
                    />
                    <label htmlFor={`upload-${side}`} className="browse-btn">
                      Browse
                    </label>
                  </div>
                ))}
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
        </div>
      )}

      {/* ---- New User Popup ---- */}
      {showNewUserPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={() => setShowNewUserPopup(false)} className="close-btn-top">
              <FaTimes />
            </button>
            <div className="popup-form-content">
              <h3 className="section-title">Create New User</h3>
              <p className="auto-password-note">Username and password will be auto-generated and sent via email</p>
              <form id="new-user-form" onSubmit={handleNewUserSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input name="firstname" value={newUserData.firstname} onChange={handleNewUserChange} required />
                  </div>
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input name="middlename" value={newUserData.middlename} onChange={handleNewUserChange} />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input name="lastname" value={newUserData.lastname} onChange={handleNewUserChange} required />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input type="date" name="dateofbirth" value={newUserData.dateofbirth} onChange={handleNewUserChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={newUserData.email} onChange={handleNewUserChange} required />
                    {emailAvailability && (
                      <p className={`availability ${emailAvailability.includes('✅') ? 'success' : 'error1'}`}>
                        {emailAvailability}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Auto-Generated Username</label>
                    <input name="username" value={newUserData.username} readOnly className="auto-generated-field" />
                    {usernameAvailability && (
                      <p className={`availability ${usernameAvailability.includes('✅') ? 'success' : 'info'}`}>
                        {usernameAvailability}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="popup-actions">
              <button type="button" onClick={() => setShowNewUserPopup(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" form="new-user-form">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Damage Report Popup ---- */}
      {showDamagePopup && (
        <div className="popup-overlay">
          <div className="popup-content damage-popup">
            <button onClick={() => setShowDamagePopup(false)} className="close-btn-top">
              <FaTimes />
            </button>
            <div className="popup-form-content">
              <h3 className="section-title damage-title">🔍 AI Damage Assessment Report</h3>
              <div className="damage-content">
                <div className="damage-header">
                  <span className="damage-icon">⚠️</span>
                  <span className="damage-label">Analysis Results</span>
                </div>
                <div className="damage-text">
                  {damageReport}
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
