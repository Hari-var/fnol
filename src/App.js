import React, { useState, useEffect } from "react";
import "./App.css";
import "./styles/styles.css";

import Header from "./Components/Header";
import PolicyList from "./Components/PolicyList";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import PolicyDetails from "./Components/PolicyDetails";
import PolicyRequestForm from "./Components/PolicyRequestForm";


// function ProtectedRoute({ children, isAuthenticated }) {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }
function Layout({ children, login, handleLogout }) {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      {!hideHeader && <Header login={login} handleLogout={handleLogout} />}
      {children}
    </div>
  );
}

function App() {
  const [login, setLogin] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (login) {
      fetch("http://localhost:8000/policies/policy_details", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            setLogin(false);
            localStorage.removeItem("isLoggedIn");
          }
        })
        .catch(() => {
          setLogin(false);
          localStorage.removeItem("isLoggedIn");
        });
    }
  }, [login]);

  const handleLogout = () => {
    setLogin(false);
    localStorage.removeItem("isLoggedIn");

    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch((err) => console.error("Logout failed:", err));

    navigate("/login");
  };

  return (
    <Layout login={login} handleLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/policies" element={<PolicyList />} />
        <Route path="/login" element={<Login setLogin={setLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/policy/:policyId" element={<PolicyDetails />} />
        <Route path="/policyrequestform" element={<PolicyRequestForm />} />
      </Routes>
    </Layout>
  );
}

export default App;
