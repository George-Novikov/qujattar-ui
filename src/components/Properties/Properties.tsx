import React from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import ElementProperties from './ElementProperties';
import TemplateProperties from './TemplateProperties';
import './Properties.css';

const Properties: React.FC = () => {
  const { template, selectedElement } = useTemplate();
  const { settings } = useAppSettings();
  
  if (!settings.showProperties) {
    return null;
  }
  
  return (
    <div className="properties">
      <div className="properties-header">
        <span>Properties</span>
      </div>
      
      <div className="properties-content">
        {selectedElement ? (
          <ElementProperties element={selectedElement} />
        ) : (
          <TemplateProperties template={template} />
        )}
      </div>
    </div>
  );
};

export default Properties;