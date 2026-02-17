import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layouts/layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UserList';
import Colleges from './pages/Colleges';  
import AddCollege from './pages/AddCollege';
import Profile from './pages/Profile';
import AddCollegeCourse from './pages/AddCollegeCourse';
import AddCollegeTab from './pages/AddCollegeTab';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Leads from './pages/Leads';
import EditCollege from './pages/EditCollege';
import EditCollegeCourse from './pages/EditCollegeCourse'
import EditCollegeTab from './pages/EditCollegeTab';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setAuthChecked(true); // ✅ auth status loaded
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!authChecked) return null; // or loader
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          }
        />

        {/* Protected Area */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="college" element={<Colleges />} />
          <Route path="college/add" element={<AddCollege />} />
          <Route path="college/add-course/:collegeId" element={<AddCollegeCourse />} />
          <Route path="college/add-college-tab/:collegeId" element={<AddCollegeTab />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leads" element={<Leads />} />
          <Route path="college-course-edit/:collegeId" element={<EditCollegeCourse />} />
          <Route path="college-tab-edit/:collegeId" element={<EditCollegeTab />} />
          <Route path="college-info-edit/:id" element={<EditCollege />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
