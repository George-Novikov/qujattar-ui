import React from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import './Header.css';

interface ViewMenuProps {
  onClose: () => void;
}

const ViewMenu: React.FC<ViewMenuProps> = ({ onClose }) => {
  const { settings, toggleView, setZoom } = useAppSettings();
  
  const handleToggleRulers = () => {
    toggleView('rulers');
    onClose();
  };
  
  const handleToggleGrid = () => {
    toggleView('grid');
    onClose();
  };
  
  const handleTogglePalette = () => {
    toggleView('palette');
    onClose();
  };
  
  const handleToggleTree = () => {
    toggleView('tree');
    onClose();
  };
  
  const handleToggleProperties = () => {
    toggleView('properties');
    onClose();
  };
  
  const handleZoomIn = () => {
    setZoom(Math.min(settings.zoom + 10, 200));
    onClose();
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(settings.zoom - 10, 50));
    onClose();
  };
  
  const handleResetZoom = () => {
    setZoom(100);
    onClose();
  };
  
  return (
    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
      <div className="dropdown-menu-item" onClick={handleToggleRulers}>
        <span>Rulers</span>
        <span className="dropdown-menu-checkbox">
          {settings.showRulers ? '✓' : ''}
        </span>
      </div>
      
      <div className="dropdown-menu-item" onClick={handleToggleGrid}>
        <span>Grid</span>
        <span className="dropdown-menu-checkbox">
          {settings.showGrid ? '✓' : ''}
        </span>
      </div>
      
      <div className="dropdown-menu-divider"></div>
      
      <div className="dropdown-menu-item" onClick={handleZoomIn}>
        <span>Zoom In</span>
        <span className="dropdown-menu-shortcut">Ctrl++</span>
      </div>
      
      <div className="dropdown-menu-item" onClick={handleZoomOut}>
        <span>Zoom Out</span>
        <span className="dropdown-menu-shortcut">Ctrl+-</span>
      </div>
      
      <div className="dropdown-menu-item" onClick={handleResetZoom}>
        <span>Reset Zoom</span>
        <span className="dropdown-menu-shortcut">Ctrl+0</span>
      </div>
      
      <div className="dropdown-menu-divider"></div>
      
      <div className="dropdown-menu-item" onClick={handleTogglePalette}>
        <span>Palette</span>
        <span className="dropdown-menu-checkbox">
          {settings.showPalette ? '✓' : ''}
        </span>
      </div>
      
      <div className="dropdown-menu-item" onClick={handleToggleTree}>
        <span>Tree</span>
        <span className="dropdown-menu-checkbox">
          {settings.showTree ? '✓' : ''}
        </span>
      </div>
      
      <div className="dropdown-menu-item" onClick={handleToggleProperties}>
        <span>Properties</span>
        <span className="dropdown-menu-checkbox">
          {settings.showProperties ? '✓' : ''}
        </span>
      </div>
    </div>
  );
};

export default ViewMenu;