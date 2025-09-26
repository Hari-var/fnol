import React, { useState, useEffect } from "react";
import "./App.css";
import "./styles/styles.css";


import PolicyList from "./Components/PolicyList";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import PolicyDetailsNew from "./Components/PolicyDetailsNew";
import PolicyRequestForm from "./Components/PolicyRequestForm";
import { AuthProvider } from "./Components/AuthContext";

import PolicyCreate from "./Components/PolicyCreate";
import VehiclePolicyForm from "./Components/VehiclePolicyForm";
import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Claims from "./Components/Claims";
import ClaimDetails from "./Components/ClaimDetails";
import ClaimsForm from "./Components/ClaimsForm";
import Users from "./Components/Users";
import Assets from "./Components/Assets";
import VehicleDetails from "./Components/VehicleDetails";
import ComingSoon from "./Components/ComingSoon";
import ContactAdministrator from "./Components/ContactAdministrator";

// function ProtectedRoute({ children, isAuthenticated }) {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }

function App() {
  const [login, setLogin] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("Guest");
  const navigate = useNavigate();

  useEffect(() => {
    if (login) {
      fetch("https://81a531d55958.ngrok-free.app/auth/me", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            setLogin(false);
            localStorage.setItem("isLoggedIn", "false");
            navigate("/login");
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setUser(data);
            setUsername(data.username || "Guest");
          }
        })
        .catch(() => {
          setLogin(false);
          localStorage.setItem("isLoggedIn", "false");
          navigate("/login");
        });
    } else {
      setUsername("Guest");
    }
  }, [login, navigate]);



  const handleLogout = () => {
    setLogin(false);
    localStorage.setItem("isLoggedIn", "false");

    fetch("https://81a531d55958.ngrok-free.app/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch((err) => console.error("Logout failed:", err));

    navigate("/login");
  };

  return (
    <AuthProvider>
      <Layout login={login} user= {user} username={username} handleLogout={handleLogout}>
        <Routes>
          {!login && (
            <>
              <Route path="/login" element={<Login setLogin={setLogin} />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          <Route path="/" element={<ProtectedRoute login={login} user= {user}><div><Home/></div></ProtectedRoute>} />
          <Route path="/policy/add" element={<ProtectedRoute login={login} user= {user}><PolicyCreate /></ProtectedRoute>} />
          <Route path="/policy/create/auto" element={<ProtectedRoute login={login} user= {user}><VehiclePolicyForm user={user} /></ProtectedRoute>} />
          <Route path="/policies" element={<ProtectedRoute login={login} user= {user}><PolicyList /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute login={login} user= {user}><Profile /></ProtectedRoute>} />
          <Route path="/claims" element={<ProtectedRoute login={login} user= {user}><Claims /></ProtectedRoute>} />
          <Route path="/claims/create" element={<ProtectedRoute login={login} user= {user}><ClaimsForm user={user}/></ProtectedRoute>} />
          <Route path="/claims/:claimId" element={<ProtectedRoute login={login} user= {user}><ClaimDetails /></ProtectedRoute>} />
          <Route path="/policy/:policyId" element={<ProtectedRoute login={login} user= {user}><PolicyDetailsNew /></ProtectedRoute>} />
          <Route path="/policyrequestform" element={<ProtectedRoute login={login} user= {user}><PolicyRequestForm /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute login={login} user= {user}><Users /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute login={login} user= {user}><Assets /></ProtectedRoute>} />
          <Route path="/vehicle-details/:vehicleId" element={<ProtectedRoute login={login} user= {user}><VehicleDetails /></ProtectedRoute>} />
          <Route path="/coming-soon" element={<ProtectedRoute login={login} user= {user}><ComingSoon /></ProtectedRoute>} />
          <Route path="/contact-admin" element={<ContactAdministrator />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
