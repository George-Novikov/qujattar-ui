import React from 'react';
import { useTemplate } from '../../context/TemplateContext';
import './Header.css';

interface EditMenuProps {
  onClose: () => void;
}

const EditMenu: React.FC<EditMenuProps> = ({ onClose }) => {
  const { 
    undoChange, 
    redoChange, 
    canUndo, 
    canRedo, 
    selectedElement, 
    removeElement,
    cutElement,
    copyElement,
    pasteElement,
    duplicateElement,
    canPaste
  } = useTemplate();
  
  const handleUndo = () => {
    undoChange();
    onClose();
  };
  
  const handleRedo = () => {
    redoChange();
    onClose();
  };
  
  const handleCut = () => {
    if (selectedElement && 'id' in selectedElement) {
      cutElement();
    }
    onClose();
  };
  
  const handleCopy = () => {
    if (selectedElement && 'id' in selectedElement) {
      copyElement();
    }
    onClose();
  };
  
  const handlePaste = () => {
    if (canPaste) {
      pasteElement();
    }
    onClose();
  };
  
  const handleDuplicate = () => {
    if (selectedElement && 'id' in selectedElement) {
      duplicateElement();
    }
    onClose();
  };
  
  const handleDelete = () => {
    if (selectedElement && 'id' in selectedElement) {
      removeElement(selectedElement.id);
    }
    onClose();
  };
  
  return (
    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
      <div 
        className={`dropdown-menu-item ${!canUndo ? 'dropdown-menu-item-disabled' : ''}`} 
        onClick={canUndo ? handleUndo : undefined}
      >
        <span>Undo</span>
        <span className="dropdown-menu-shortcut">Ctrl+Z</span>
      </div>
      
      <div 
        className={`dropdown-menu-item ${!canRedo ? 'dropdown-menu-item-disabled' : ''}`} 
        onClick={canRedo ? handleRedo : undefined}
      >
        <span>Redo</span>
        <span className="dropdown-menu-shortcut">Ctrl+Y</span>
      </div>
      
      <div className="dropdown-menu-divider"></div>
      
      <div 
        className={`dropdown-menu-item ${!selectedElement || !('id' in selectedElement) ? 'dropdown-menu-item-disabled' : ''}`} 
        onClick={selectedElement && 'id' in selectedElement ? handleCut : undefined}
      >
        <span>Cut</span>
        <span className="dropdown-menu-shortcut">Ctrl+X</span>
      </div>
      
      <div 
        className={`dropdown-menu-item ${!selectedElement || !('id' in selectedElement) ? 'dropdown-menu-item-disabled' : ''}`} 
        onClick={selectedElement && 'id' in selectedElement ? handleCopy : undefined}
      >
        <span>Copy</span>
        <span className="dropdown-menu-shortcut">Ctrl+C</span>
      </div>
      
      <div 
        className={`dropdown-menu-item ${!canPaste ? 'dropdown-menu-item-disabled' : ''}`} 
        onClick={canPaste ? handlePaste : undefined}
      >
        <span>Paste</span>
        <span className="dropdown-menu-shortcut">Ctrl+V</span>
      </div>
      
      <div 
        className={`dropdown-menu-item ${!selectedElement || !('id' in selectedElement) ? 'dropdown-menu-item-disabled' : ''}`} 
        onClick={selectedElement && 'id' in selectedElement ? handleDuplicate : undefined}
      >
        <span>Duplicate</span>
        <span className="dropdown-menu-shortcut">Ctrl+D</span>
      </div>
      
      <div className="dropdown-menu-divider"></div>
      
      <div 
        className={`dropdown-menu-item ${!selectedElement || !('id' in selectedElement) ? 'dropdown-menu-item-disabled' : ''}`} 
        onClick={selectedElement && 'id' in selectedElement ? handleDelete : undefined}
      >
        <span>Delete</span>
        <span className="dropdown-menu-shortcut">Delete</span>
      </div>
    </div>
  );
};

export default EditMenu;