import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    profile_pic:"",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [emailAvailability, setEmailAvailability] = useState(null);
  const [phoneAvailability, setPhoneAvailability] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let profilePicPath = null;
      
      // Upload profile picture first if provided
      if (profilePicFile) {
        const picFormData = new FormData();
        picFormData.append('file', profilePicFile);
        
        const picResponse = await fetch("https://81a531d55958.ngrok-free.app/users/upload_pic", {
          method: "POST",
          body: picFormData,
        });
        
        if (picResponse.ok) {
          const picData = await picResponse.json();
          profilePicPath = picData.file_name;
          console.log('Uploaded profile picture path:', profilePicPath);
        }
      }

      // Create user with profile pic path
      const payload = {
        username: formData.username,
        firstname: formData.firstName,
        middlename: formData.middleName,
        lastname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateofbirth: formData.dob,
        address: formData.address,
        password: formData.password,
        profile_pic: profilePicPath,
        status: 'active'
      };

      const response = await fetch("https://81a531d55958.ngrok-free.app/users/input_user_details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("⚠️ " + (data.detail || "Failed to create user"));
      } else {
        setError(null);
        setSuccess(data.message);
        navigate("/login");
      }
      
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check username availability
   const checkUsername = async (username) => {
    if (!username) {
      setUsernameAvailability(null);
      return;
    }
    try {
      const res = await fetch(`https://81a531d55958.ngrok-free.app/users/check_username/${username}`);
      const data = await res.json();
      setUsernameAvailability(data.exists ? "❌ Username already taken" : "✅ Username available");
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  // ✅ Check email availability
  const checkEmail = async (email) => {
    if (!email) {
      setEmailAvailability(null);
      return;
    }
    try {
      const res = await fetch(`https://81a531d55958.ngrok-free.app/users/check_email/${email}`);
      const data = await res.json();
      setEmailAvailability(data.exists ? "❌ Email already exists" : "✅ Email available");
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  // ✅ Check phone availability
  const checkPhone = async (phone) => {
    if (!phone) {
      setPhoneAvailability(null);
      return;
    }
    try {
      const res = await fetch(`https://81a531d55958.ngrok-free.app/users/check_phone/${phone}`);
      const data = await res.json();
      setPhoneAvailability(data.exists ? "❌ Phone already exists" : "✅ Phone available");
    } catch (error) {
      console.error("Error checking phone:", error);
    }
  };

  // ✅ Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return null;
    if (password.length < 6) return "❌ Too short";
    if (!/[A-Z]/.test(password)) return "❌ Must include uppercase letter";
    if (!/[0-9]/.test(password)) return "❌ Must include number";
    if (!/[!@#$%^&*]/.test(password)) return "❌ Must include special character";
    return "✅ Strong password";
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") checkUsername(value);
    if (name === "email") checkEmail(value);
    if (name === "phone") checkPhone(value);
    if (name === "password") setPasswordStrength(checkPasswordStrength(value));
    if (name === "confirmPassword") {
      setPasswordMatch(value === formData.password ? "✅ Passwords match" : "❌ Passwords do not match");
    }
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setProfilePicFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };


  // ✅ Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    setPasswordStrength(checkPasswordStrength(value));

    if (formData.confirmPassword) {
      setPasswordMatch(value === formData.confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match");
    }
  };

  return (
    <div className="signup-form-container">
      
      <div className="signup-card">
        <div className="signup-meta">
        <img
            src="logos/ValueMomentum Corporate Logo 2024 - transparent.png"
            alt="ValueMomentum Logo"
          />
        <h2 className="form-title">Signup</h2>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required placeholder="Enter username" />
            {usernameAvailability && (
    <p className={`availability ${usernameAvailability.includes("❌") ? "error1" : "success"}`}>
      {usernameAvailability}
    </p>
    )}
          </div>

          {/* Name fields */}
          <div className="name-block">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Enter first name" />
            </div>
            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Enter middle name" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Enter last name" />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email" />
            {emailAvailability && (
    <p className={`availability ${emailAvailability.includes("❌") ? "error1" : "success"}`}>
      {emailAvailability}
    </p>
  )}

          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter phone number" />
             {phoneAvailability && (
            <p className={`availability ${phoneAvailability.includes("❌") ? "error1" : "success"}`}>
              {phoneAvailability}
            </p>
          )}
          </div>

          {/* DOB */}
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required className="date-picker" />
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" className="address-box" placeholder="Enter address" />
          </div>

          {/* Profile Picture */}
          <div className="form-group">
            <label htmlFor="profilePic">Profile Picture (Optional)</label>
            <div 
              className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('profilePic').click()}
            >
              {previewUrl ? (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                  <p className="file-name">{profilePicFile.name}</p>
                </div>
              ) : (
                <div className="drop-text">
                  <p>📷 Drag & drop your photo here or click to browse</p>
                  <p className="drop-hint">Supports: JPG, PNG, GIF</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="profilePic" 
              name="profilePic" 
              accept="image/*" 
              onChange={handleProfilePicChange}
              className="file-input-hidden"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handlePasswordChange} required placeholder="Enter password" />
            {passwordStrength && (
              <p className={`availability ${passwordStrength.includes("❌") ? "error1" : "success"}`}>{passwordStrength}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
            {passwordMatch && (
              <p className={`availability ${passwordMatch.includes("❌") ? "error1" : "success"}`}>{passwordMatch}</p>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
            {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignUp;
