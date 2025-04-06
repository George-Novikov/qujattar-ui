import React from 'react';
import { Template, PaperFormat, Orientation, AccessType } from '../../models/Template';
import { useTemplate } from '../../context/TemplateContext';
import ColorPicker from '../UI/ColorPicker';
import Dropdown from '../UI/Dropdown';
import './Properties.css';

interface TemplatePropertiesProps {
  template: Template;
}

const TemplateProperties: React.FC<TemplatePropertiesProps> = ({ template }) => {
  const { updateTemplateProps } = useTemplate();
  
  return (
    <div className="template-properties">
      <div className="properties-section">
        <h3 className="properties-section-title">Template Properties</h3>
      </div>
      
      {/* Basic Properties */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Basic Properties</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Title</label>
            <input
              type="text"
              value={template.props.title}
              onChange={(e) => updateTemplateProps({ title: e.target.value })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Orientation</label>
            <Dropdown
              options={[
                { value: 'VERTICAL', label: 'Portrait' },
                { value: 'LANDSCAPE', label: 'Landscape' }
              ]}
              value={template.props.orientation}
              onChange={(value) => updateTemplateProps({ orientation: value as Orientation })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
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
              onChange={(value) => updateTemplateProps({ format: value as PaperFormat })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Access</label>
            <Dropdown
              options={[
                { value: 'PRIVATE', label: 'Private' },
                { value: 'PUBLIC', label: 'Public' }
              ]}
              value={template.props.access}
              onChange={(value) => updateTemplateProps({ access: value as AccessType })}
            />
          </div>
        </div>
      </div>
      
      {/* Appearance */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Appearance</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <ColorPicker
              label="Background Color"
              value={template.props.background || '#FFFFFF'}
              onChange={(background) => updateTemplateProps({ background })}
            />
          </div>
        </div>
      </div>
      
      {/* Settings */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Settings</h4>
        
        <div className="properties-row">
          <div className="properties-field checkbox-field">
            <label>
              <input
                type="checkbox"
                checked={template.props.snapToGrid}
                onChange={(e) => updateTemplateProps({ snapToGrid: e.target.checked })}
              />
              Snap to Grid
            </label>
          </div>
        </div>
      </div>
      
      {/* Template Structure */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Structure</h4>
        
        <div className="properties-info">
          <p>Columns: {template.columns.length}</p>
          <p>Rows: {template.columns.reduce((acc, column) => acc + column.rows.length, 0)}</p>
          <p>Elements: {template.columns.reduce((acc, column) => 
            acc + column.rows.reduce((rowAcc, row) => rowAcc + row.elements.length, 0), 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateProperties;