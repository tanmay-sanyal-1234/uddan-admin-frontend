import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {logo} from "@/assets/images/index";

function Layout({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      onLogout();
      navigate('/login');
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} width={200} alt="Admin Logo" className="admin-logo" />
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li>
              <Link to="/" className={isActive('/')}>
                <span className="icon">
                  <i className="fa fa-home"></i>
                </span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/college" className={isActive('/college')}>
                <span className="icon">
                  <i className="fa fa-university"></i>
                </span>
                College
              </Link>
            </li>
            <li>
              <Link to="/leads" className={isActive('/leads')}>
              <span className="icon">
                <i className="fa fa-users"></i>
                </span>
                 Leads
              </Link>
            </li>
            {/* <li>
              <Link to="/profile" className={isActive('/profile')}>
                <span className="icon">👤</span>
                Profile
              </Link>
            </li> */}
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="logout-link">
                <span className="icon">
                  <i className="fa fa-sign-out"></i>
                </span>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
