import React, { useState, useEffect } from 'react';
import '../styles/header.css';
import { Link } from 'react-router-dom';
import { path } from "../config";

export default function Header({ login, user, username, handleLogout }) {
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (login && username && user && user.user_id) {
      fetch(`${path}/users/user_details/${user.user_id}`, {
        method: 'GET',
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          console.log('Profile pic filename:', data.profile_pic);
          setUserData(data);
          if (data.profile_pic) {
            setProfilePic(`${path}/users/get_profile_pic/${data.user_id}`);
          } else {
            setProfilePic(null);
          }
        })
        .catch(() => setProfilePic(null));
    }
  }, [login, username, user]);

  return (
    <div className="container">
      <div className="header-container">
        <Link to="/" className="home-link">
          <div className="image-wrapper">
            <img
              className="logo1"
              src="/logos/ValueMomentum Corporate Logo 2024 - transparent.png"
              alt="ValueMomentum Logo"
            />
            <img
              className="logo2"
              src="/logos/ValueMomentum White Corporate Logo 2024 - transparent.png"
              alt="ValueMomentum Logo"
            />
          </div>
        </Link>
        <h2 className="title">ValueMomentum Insurance</h2>
      </div>
    
      <div className="login-container">
        {!login ? (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        ) : (
          <div 
            className="profile-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <img
                src={
                  profilePic ||
                  (userData
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${userData.firstname} ${userData.lastname}`
                      )}&background=random`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}&background=random`)
                }
                alt="Profile"
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(`${userData.firstname} ${userData.lastname}` || "User")}&background=random`;
                }}
              />
            {showDropdown && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
