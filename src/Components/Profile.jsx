import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaTimes, FaCamera, FaTrash } from 'react-icons/fa';
import '../styles/profile.css';
import { path } from "../config";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetch(`${path}/auth/me`, {
        method: 'GET',
        credentials: 'include',
    }).then((res) => res.json())
    .then((data) => {
        if (data.user_id) {
            fetch(`${path}/users/user_details/${data.user_id}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                console.log('User details response status:', response);
                return response.json();
            })
            .then((data) => setUser(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        } else {
            setError('User not authenticated');
            setLoading(false);
        }
    }).catch((err) => {
        setError(err.message);
        setLoading(false);
    });
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      const response = await fetch(`${path}/users/update_details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profile_pic: "" }),
      });
      
      if (response.ok) {
        setUser({ ...user, profile_pic: "" });
        setPreviewUrl(null);
        setProfilePicFile(null);
      } else {
        throw new Error('Failed to remove profile picture');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      let updatedData = {};
      
      // Only include changed fields
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== user[key]) {
          updatedData[key] = editForm[key];
        }
      });
      
      // Upload new profile picture if selected
      if (profilePicFile) {
        const picFormData = new FormData();
        picFormData.append('file', profilePicFile);
        
        const picResponse = await fetch(`${path}/users/upload_pic`, {
          method: 'POST',
          body: picFormData,
        });
        
        if (picResponse.ok) {
          const picData = await picResponse.json();
          updatedData.profile_pic = picData.file_name;
        }
      }
      
      // Only update if there are changes
      if (Object.keys(updatedData).length > 0) {
        const response = await fetch(`${path}/users/update_details`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedData),
        });
        
        if (response.ok) {
          // Refresh user data
          const updatedUser = { ...user, ...updatedData };
          setUser(updatedUser);
        } else {
          throw new Error('Failed to update profile');
        }
      }
      
      setIsEditing(false);
      setProfilePicFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };
    

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return <div className="profile-error"><p>No user data found.</p></div>;
  }

  const profilePicUrl = user.profile_pic 
    ? `${path}/users/get_profile_pic/${user.user_id}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstname + ' ' + user.lastname)}&background=random&size=200`;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button className="edit-btn" onClick={() => {
          setIsEditing(true);
          setEditForm({
            username: user.username,
            firstname: user.firstname,
            middlename: user.middlename || '',
            lastname: user.lastname,
            dateofbirth: user.dateofbirth,
            phone: user.phone || '',
            email: user.email,
            address: user.address
          });
        }}>
          <FaEdit /> Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <img
              src={profilePicUrl}
              alt="Profile"
              className="profile-avatar-large"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstname + ' ' + user.lastname)}&background=random&size=200`;
              }}
            />
            <h2>{user.firstname} {user.middlename ? user.middlename + ' ' : ''}{user.lastname}</h2>
            <span className="user-type">{user.usertype}</span>
          </div>
          <div className="profile-details">
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <div>
                    <span className="detail-label">Username</span>
                    <span className="detail-value">{user.username}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <div>
                    <span className="detail-label">Date of Birth</span>
                    <span className="detail-value">{new Date(user.dateofbirth).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                </div>

                {user.phone && (
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <div>
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{user.phone}</span>
                    </div>
                  </div>
                )}

                <div className="detail-item address-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <div>
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{user.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setIsEditing(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <div className="profile-pic-edit">
                <div className="current-pic">
                  <img
                    src={previewUrl || profilePicUrl}
                    alt="Profile"
                    className="edit-avatar"
                  />
                  <div className="pic-actions">
                    <button type="button" className="change-pic-btn" onClick={() => document.getElementById('profilePicEdit').click()}>
                      <FaCamera />
                    </button>
                    {(user.profile_pic || previewUrl) && (
                      <button type="button" className="remove-pic-btn" onClick={handleRemoveProfilePic}>
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profilePicEdit"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editForm.firstname}
                    onChange={(e) => setEditForm({...editForm, firstname: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    value={editForm.middlename}
                    onChange={(e) => setEditForm({...editForm, middlename: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastname}
                    onChange={(e) => setEditForm({...editForm, lastname: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={editForm.dateofbirth}
                    onChange={(e) => setEditForm({...editForm, dateofbirth: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setIsEditing(false)} disabled={updating}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={updating}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}