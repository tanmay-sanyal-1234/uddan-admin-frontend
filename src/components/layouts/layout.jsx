import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {logo} from "@/assets/images/index";

function Layout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

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
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
            <li>
              <Link to="/blogs" className={isActive('/blogs')}>
              <span className="icon">
                <i className="fa fa-newspaper-o"></i>
                </span>
                 Blogs
              </Link>
              
            </li>
            <li>
              <Link to="/contact-us-list" className={isActive('/contact-us-list')}>
              <span className="icon">
                <i className="fa fa-envelope"></i>
                </span>
                 Contact Us
              </Link>
            </li>
            <li>
              <Link to="/newsletter-list" className={isActive('/newsletter-list')}>
              <span className="icon">
                <i className="fa fa-newspaper-o"></i>
                </span>
                 News Letter
              </Link>
            </li>
            <li>
              <Link to="/faqs" className={isActive('/faqs')}>
              <span className="icon">
                <i className="fa fa-question-circle"></i>
                </span>
                 FAQ
              </Link>
            </li>
            <li>
              <Link to="/testimonials" className={isActive('/testimonials')}>
              <span className="icon">
                <i className="fa fa-newspaper-o"></i>
                </span>
                 Testimonials
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
        <div className="mobile-header">
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}>
            <i className="fa fa-bars"></i>
          </button>
          <span className="mobile-logo-text">Admin Panel</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
