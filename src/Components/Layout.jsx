import React, { useState } from "react";
import Header from "./Header";
import {useLocation} from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout({ children, login, user, username, handleLogout }) {
  const location = useLocation();
  
  const [expanded, setExpanded] = useState(false);

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";


  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="main-layout">
      <div className={`sidebar-backdrop ${expanded ? "show" : ""}`} onClick={() => setExpanded(false)}></div>
      <aside className={`sidebar ${expanded ? "expanded" : ""}`}>
        <Sidebar user={user} expanded={expanded} setExpanded={setExpanded} />
      </aside>
      
      <div className={`content-area ${expanded ? "expanded" : ""}`}>
        <Header
          login={login}
          user={user}
          username={username}
          handleLogout={handleLogout}
          onMenuToggle={() => setExpanded((prev) => !prev)}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;