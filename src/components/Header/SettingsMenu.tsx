import React, { useState } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Dropdown from '../UI/Dropdown';
import ColorPicker from '../UI/ColorPicker';
import { Theme, ExportFormat, COLOR_SCHEMES } from '../../models/AppSettings';
import './Header.css';

interface SettingsMenuProps {
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose }) => {
  const { template, updateTemplateProps } = useTemplate();
  const { settings, updateSettings, setTheme, setColorScheme } = useAppSettings();
  
  const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  
  return (
    <>
      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-menu-item" onClick={() => setIsProjectSettingsOpen(true)}>
          <span>Project Settings</span>
        </div>
        
        <div className="dropdown-menu-item" onClick={() => setIsGlobalSettingsOpen(true)}>
          <span>Global Settings</span>
        </div>
      </div>
      
      {/* Project Settings Modal */}
      <Modal
        isOpen={isProjectSettingsOpen}
        onClose={() => setIsProjectSettingsOpen(false)}
        title="Project Settings"
        size="small"
        footer={
          <Button onClick={() => setIsProjectSettingsOpen(false)}>Close</Button>
        }
      >
        <div className="settings-form">
          <div className="settings-form-group">
            <label>Title</label>
            <input
              type="text"
              value={template.props.title}
              onChange={(e) => updateTemplateProps({ title: e.target.value })}
            />
          </div>
          
          <div className="settings-form-group">
            <label>Orientation</label>
            <Dropdown
              options={[
                { value: 'VERTICAL', label: 'Portrait' },
                { value: 'LANDSCAPE', label: 'Landscape' }
              ]}
              value={template.props.orientation}
              onChange={(value) => updateTemplateProps({ orientation: value as 'VERTICAL' | 'LANDSCAPE' })}
            />
          </div>
          
          <div className="settings-form-group">
            <label>Paper Format</label>
            <Dropdown
              options={[
                { value: 'A1', label: 'A1' },
                { value: 'A2', label: 'A2' },
                { value: 'A3', label: 'A3' },
                { value: 'A4', label: 'A4' },
                { value: 'A5', label: 'A5' },
                { value: 'A6', label: 'A6' }
              ]}
              value={template.props.format}
              onChange={(value) => updateTemplateProps({ format: value as 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' })}
            />
          </div>
          
          <div className="settings-form-group">
            <label>Access</label>
            <Dropdown
              options={[
                { value: 'PRIVATE', label: 'Private' },
                { value: 'PUBLIC', label: 'Public' }
              ]}
              value={template.props.access}
              onChange={(value) => updateTemplateProps({ access: value as 'PRIVATE' | 'PUBLIC' })}
            />
          </div>
          
          <div className="settings-form-group">
            <label>Background Color</label>
            <ColorPicker
              value={template.props.background || '#FFFFFF'}
              onChange={(background) => updateTemplateProps({ background })}
            />
          </div>
          
          <div className="settings-form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={template.props.snapToGrid}
                onChange={(e) => updateTemplateProps({ snapToGrid: e.target.checked })}
              />
              Snap to Grid
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Global Settings Modal */}
      <Modal
        isOpen={isGlobalSettingsOpen}
        onClose={() => setIsGlobalSettingsOpen(false)}
        title="Global Settings"
        size="small"
        footer={
          <Button onClick={() => setIsGlobalSettingsOpen(false)}>Close</Button>
        }
      >
        <div className="settings-form">
          <div className="settings-form-group">
            <label>Theme</label>
            <Dropdown
              options={[
                { value: 'LIGHT', label: 'Light' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'DARK', label: 'Dark' }
              ]}
              value={settings.theme}
              onChange={(value) => setTheme(value as Theme)}
            />
          </div>
          
          <div className="settings-form-group">
            <label>Color Scheme</label>
            <ColorPicker
              value={settings.colorScheme}
              onChange={setColorScheme}
              presetColors={COLOR_SCHEMES}
            />
          </div>
          
          <div className="settings-form-group">
            <label>Locale</label>
            <Dropdown
              options={[
                { value: 'en-US', label: 'English (US)' },
                { value: 'en-GB', label: 'English (UK)' },
                { value: 'fr-FR', label: 'French' },
                { value: 'de-DE', label: 'German' },
                { value: 'es-ES', label: 'Spanish' },
                { value: 'it-IT', label: 'Italian' },
                { value: 'ja-JP', label: 'Japanese' },
                { value: 'zh-CN', label: 'Chinese (Simplified)' }
              ]}
              value={settings.locale}
              onChange={(value) => updateSettings({ locale: value })}
            />
          </div>
          
          <div className="settings-form-group">
            <label>Default Export Format</label>
            <Dropdown
              options={[
                { value: 'JSON', label: 'JSON' },
                { value: 'ODT', label: 'ODT' },
                { value: 'DOC', label: 'DOC' }
              ]}
              value={settings.defaultExportFormat}
              onChange={(value) => updateSettings({ defaultExportFormat: value as ExportFormat })}
            />
          </div>
          
          <div className="settings-form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSettings({ autoSave: e.target.checked })}
              />
              Auto Save
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SettingsMenu;