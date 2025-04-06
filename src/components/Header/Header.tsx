import React, { useState } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import FileMenu from './FileMenu';
import EditMenu from './EditMenu';
import ViewMenu from './ViewMenu';
import SettingsMenu from './SettingsMenu';
import HelpMenu from './HelpMenu';
import UserMenu from './UserMenu';
import './Header.css';

const Header: React.FC = () => {
  const { template, canUndo, canRedo, undoChange, redoChange } = useTemplate();
  const { settings } = useAppSettings();
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };
  
  const closeMenu = () => {
    setActiveMenu(null);
  };
  
  return (
    <div className="header">
      {/* Logo */}
      <div className="header-logo">
        <span className="logo-text">Template Editor</span>
      </div>
      
      {/* Left Menu Items */}
      <div className="header-left">
        <div 
          className={`header-menu-item ${activeMenu === 'file' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('file')}
        >
          <span>File</span>
          {activeMenu === 'file' && <FileMenu onClose={closeMenu} />}
        </div>
        
        <div 
          className={`header-menu-item ${activeMenu === 'edit' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('edit')}
        >
          <span>Edit</span>
          {activeMenu === 'edit' && <EditMenu onClose={closeMenu} />}
        </div>
        
        <div 
          className={`header-menu-item ${activeMenu === 'view' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('view')}
        >
          <span>View</span>
          {activeMenu === 'view' && <ViewMenu onClose={closeMenu} />}
        </div>
        
        <div 
          className={`header-menu-item ${activeMenu === 'settings' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('settings')}
        >
          <span>Settings</span>
          {activeMenu === 'settings' && <SettingsMenu onClose={closeMenu} />}
        </div>
        
        <div 
          className={`header-menu-item ${activeMenu === 'help' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('help')}
        >
          <span>Help</span>
          {activeMenu === 'help' && <HelpMenu onClose={closeMenu} />}
        </div>
      </div>
      
      {/* Right Menu Items */}
      <div className="header-right">
        {/* Quick access buttons */}
        <div className="header-quick-buttons">
          <button 
            className="quick-button" 
            onClick={undoChange} 
            disabled={!canUndo}
            title="Undo"
          >
            ↩
          </button>
          <button 
            className="quick-button" 
            onClick={redoChange} 
            disabled={!canRedo}
            title="Redo"
          >
            ↪
          </button>
          <button 
            className="quick-button" 
            onClick={() => {}} 
            title="Save"
          >
            💾
          </button>
        </div>
        
        {/* Template title display */}
        <div className="header-template-title">
          {template.props.title}
        </div>
        
        {/* User menu */}
        <div 
          className={`header-menu-item user-menu ${activeMenu === 'user' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('user')}
        >
          {settings.isAuthenticated ? (
            <span>{settings.username}</span>
          ) : (
            <span>Login</span>
          )}
          {activeMenu === 'user' && <UserMenu onClose={closeMenu} />}
        </div>
      </div>
    </div>
  );
};

export default Header;