import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaFileAlt, FaPlus, FaSignOutAlt, FaBars, FaClipboardList, FaUsers, FaCar, FaChartBar, FaCog, FaBell } from "react-icons/fa";
import "../styles/sidebar.css";

export default function Sidebar({ user, expanded, setExpanded }) {
  const location = useLocation();

  return (
    <div className={`sidebar${expanded ? " expanded" : ""}`}>
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? "Minimize sidebar" : "Expand sidebar"}
        >
          <FaBars />
        </button>
        {expanded && <h2 className="sidebar-title">VM Portal</h2>}
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`sidebar-link${location.pathname === "/" ? " active" : ""}`}
        >
          <FaHome className="sidebar-icon" />
          {expanded && <span className="sidebar-label">Home</span>}
        </Link>

        <Link
          to="/policies"
          className={`sidebar-link${
            location.pathname.startsWith("/policies") ? " active" : ""
          }`}
        >
          <FaFileAlt className="sidebar-icon" />
          {expanded && <span className="sidebar-label">Policies</span>}
        </Link>

        <Link
          to="/policy/add"
          className={`sidebar-link${
            location.pathname === "/policy/add" ? " active" : ""
          }`}
        >
          <FaPlus className="sidebar-icon" />
          {expanded && <span className="sidebar-label">Add Policy</span>}
        </Link>

        <Link
          to="/claims"
          className={`sidebar-link${
            location.pathname.startsWith("/claims") ? " active" : ""
          }`}
        >
          <FaClipboardList className="sidebar-icon" />
          {expanded && <span className="sidebar-label">Claims</span>}
        </Link>

        <Link
          to="/assets"
          className={`sidebar-link${
            location.pathname.startsWith("/assets") ? " active" : ""
          }`}
        >
          <FaCar className="sidebar-icon" />
          {expanded && <span className="sidebar-label">Insured Assets</span>}
        </Link>


        {user && (user.role === 'admin' || user.role === 'agent') && (
          <>
            
            <Link
              to="/users"
              className={`sidebar-link${
                location.pathname.startsWith("/users") ? " active" : ""
              }`}
            >
              <FaUsers className="sidebar-icon" />
              {expanded && <span className="sidebar-label">Users</span>}
            </Link>
          </>
        )}

        {/* <Link
          to="/coming-soon"
          className={`sidebar-link${
            location.pathname === "/coming-soon" ? " active" : ""
          }`}
        >
          <FaChartBar className="sidebar-icon" />
          {expanded && <span className="sidebar-label">Reports</span>}
        </Link>

        <Link
          to="/coming-soon"
          className={`sidebar-link${
            location.pathname === "/coming-soon" ? " active" : ""
          }`}
        >
          <FaBell className="sidebar-icon" />
          {expanded && <span className="sidebar-label">Notifications</span>}
        </Link>

        {user && user.role === 'admin' && (
          <Link
            to="/coming-soon"
            className={`sidebar-link${
              location.pathname === "/coming-soon" ? " active" : ""
            }`}
          >
            <FaCog className="sidebar-icon" />
            {expanded && <span className="sidebar-label">Settings</span>}
          </Link>
        )} */}

        
      </nav>
    </div>
  );
}
