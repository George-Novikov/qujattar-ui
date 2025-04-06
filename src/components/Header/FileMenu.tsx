import React, { useState } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import './Header.css';

interface FileMenuProps {
  onClose: () => void;
}

const FileMenu: React.FC<FileMenuProps> = ({ onClose }) => {
  const { 
    template, 
    exportToJson, 
    importFromJson, 
    saveTemplate, 
    loadTemplate 
  } = useTemplate();
  const { settings } = useAppSettings();
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMyFilesModalOpen, setIsMyFilesModalOpen] = useState(false);
  const [isAllTemplatesModalOpen, setIsAllTemplatesModalOpen] = useState(false);
  
  const handleNewTemplate = () => {
    // Logic to create new template would go here
    onClose();
  };
  
  const handleOpenTemplate = () => {
    // Open file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            importFromJson(json);
          } catch (error) {
            console.error('Failed to import template:', error);
            alert('Failed to import template. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    onClose();
  };
  
  const handleSaveTemplate = async () => {
    try {
      await saveTemplate();
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    }
    onClose();
  };
  
  const handleExport = (format: 'JSON' | 'ODT' | 'DOC') => {
    if (format === 'JSON') {
      const json = exportToJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.props.title}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert(`Export to ${format} not implemented yet`);
    }
    setIsExportModalOpen(false);
    onClose();
  };
  
  const handleImport = (format: 'JSON' | 'ODT' | 'DOC') => {
    // Open file picker with appropriate accept type
    const acceptMap = {
      'JSON': '.json',
      'ODT': '.odt',
      'DOC': '.doc'
    };
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptMap[format];
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (format === 'JSON') {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const json = event.target?.result as string;
              importFromJson(json);
            } catch (error) {
              console.error('Failed to import template:', error);
              alert('Failed to import template. Invalid file format.');
            }
          };
          reader.readAsText(file);
        } else {
          alert(`Import from ${format} not implemented yet`);
        }
      }
    };
    input.click();
    setIsImportModalOpen(false);
    onClose();
  };
  
  return (
    <>
      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-menu-item" onClick={handleNewTemplate}>
          <span>New</span>
          <span className="dropdown-menu-shortcut">Ctrl+N</span>
        </div>
        
        <div className="dropdown-menu-item" onClick={handleOpenTemplate}>
          <span>Open</span>
          <span className="dropdown-menu-shortcut">Ctrl+O</span>
        </div>
        
        <div className="dropdown-menu-item" onClick={handleSaveTemplate}>
          <span>Save</span>
          <span className="dropdown-menu-shortcut">Ctrl+S</span>
        </div>
        
        <div className="dropdown-menu-divider"></div>
        
        <div className="dropdown-menu-item" onClick={() => setIsExportModalOpen(true)}>
          <span>Export</span>
        </div>
        
        <div className="dropdown-menu-item" onClick={() => setIsImportModalOpen(true)}>
          <span>Import</span>
        </div>
        
        <div className="dropdown-menu-divider"></div>
        
        <div className="dropdown-menu-item" onClick={() => setIsMyFilesModalOpen(true)}>
          <span>My Files</span>
          <span className="dropdown-menu-disabled">{!settings.isAuthenticated && '(Login required)'}</span>
        </div>
        
        <div className="dropdown-menu-item" onClick={() => setIsAllTemplatesModalOpen(true)}>
          <span>All Templates</span>
        </div>
      </div>
      
      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Template"
        size="small"
        footer={
          <Button onClick={() => setIsExportModalOpen(false)}>Cancel</Button>
        }
      >
        <div className="export-options">
          <h4>Select Format</h4>
          <div className="export-option" onClick={() => handleExport('JSON')}>
            <div className="export-option-icon">📄</div>
            <div className="export-option-info">
              <div className="export-option-title">JSON</div>
              <div className="export-option-desc">Export as JSON file</div>
            </div>
          </div>
          
          <div className="export-option" onClick={() => handleExport('ODT')}>
            <div className="export-option-icon">📄</div>
            <div className="export-option-info">
              <div className="export-option-title">ODT</div>
              <div className="export-option-desc">Export as OpenDocument Text</div>
            </div>
          </div>
          
          <div className="export-option" onClick={() => handleExport('DOC')}>
            <div className="export-option-icon">📄</div>
            <div className="export-option-info">
              <div className="export-option-title">DOC</div>
              <div className="export-option-desc">Export as Microsoft Word Document</div>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Template"
        size="small"
        footer={
          <Button onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
        }
      >
        <div className="export-options">
          <h4>Select Format</h4>
          <div className="export-option" onClick={() => handleImport('JSON')}>
            <div className="export-option-icon">📄</div>
            <div className="export-option-info">
              <div className="export-option-title">JSON</div>
              <div className="export-option-desc">Import from JSON file</div>
            </div>
          </div>
          
          <div className="export-option" onClick={() => handleImport('ODT')}>
            <div className="export-option-icon">📄</div>
            <div className="export-option-info">
              <div className="export-option-title">ODT</div>
              <div className="export-option-desc">Import from OpenDocument Text</div>
            </div>
          </div>
          
          <div className="export-option" onClick={() => handleImport('DOC')}>
            <div className="export-option-icon">📄</div>
            <div className="export-option-info">
              <div className="export-option-title">DOC</div>
              <div className="export-option-desc">Import from Microsoft Word Document</div>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* My Files Modal */}
      <Modal
        isOpen={isMyFilesModalOpen}
        onClose={() => setIsMyFilesModalOpen(false)}
        title="My Files"
        size="medium"
      >
        {settings.isAuthenticated ? (
          <div className="template-grid">
            <p>Your saved templates will appear here.</p>
          </div>
        ) : (
          <div className="login-required">
            <p>Please login to access your files.</p>
            <Button onClick={() => {
              setIsMyFilesModalOpen(false);
              // Open user menu for login
            }}>
              Login
            </Button>
          </div>
        )}
      </Modal>
      
      {/* All Templates Modal */}
      <Modal
        isOpen={isAllTemplatesModalOpen}
        onClose={() => setIsAllTemplatesModalOpen(false)}
        title="All Templates"
        size="medium"
      >
        <div className="template-grid">
          <p>Public templates will appear here.</p>
        </div>
      </Modal>
    </>
  );
};

export default FileMenu;