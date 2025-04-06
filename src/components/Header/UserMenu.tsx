import React, { useState } from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import './Header.css';

interface UserMenuProps {
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  const { settings, login, logout } = useAppSettings();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in a real app, this would make an API call
    login(123, username);
    setIsLoginModalOpen(false);
    onClose();
  };
  
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  return (
    <>
      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
        {settings.isAuthenticated ? (
          <>
            <div className="dropdown-menu-item" onClick={() => setIsProfileModalOpen(true)}>
              <span>Profile</span>
            </div>
            
            <div className="dropdown-menu-item" onClick={handleLogout}>
              <span>Log Out</span>
            </div>
          </>
        ) : (
          <div className="dropdown-menu-item" onClick={() => setIsLoginModalOpen(true)}>
            <span>Log In</span>
          </div>
        )}
      </div>
      
      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Log In"
        size="small"
      >
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-actions">
            <Button type="submit" variant="primary">Log In</Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsLoginModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="User Profile"
        size="small"
        footer={
          <Button onClick={() => setIsProfileModalOpen(false)}>Close</Button>
        }
      >
        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {settings.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          
          <div className="profile-info">
            <h3>{settings.username}</h3>
            <p>User ID: {settings.userId}</p>
            <p>Templates: 0</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserMenu;