import React, { useState } from 'react';
import { FaUser, FaSun, FaCog, FaSignOutAlt } from "react-icons/fa";
import './style.css'

const Profile = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-section">
      <FaUser className="icon" onClick={() => setOpen(!open)} />
      {open && (
        <div className="dropdown">
          <p>👤 My Profile</p>
          <p><FaCog /> Settings</p>
          <p><FaSun /> Change Theme</p>
          <p><FaSignOutAlt /> Logout</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
