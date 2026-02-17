import React, { useState } from 'react';

function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@example.com',
    phone: '+1 234 567 8900',
    bio: 'Admin user with full access to the system.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Updated:', profileData);
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password Changed');
    alert('Password changed successfully!');
    setProfileData({
      ...profileData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div>
      <div className="header">
        <h1>My Profile</h1>
      </div>

      <div className="content-card">
        <h2>Profile Information</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </div>
        </form>
      </div>

      <div className="content-card">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={profileData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
