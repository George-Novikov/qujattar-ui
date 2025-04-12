import React from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import ElementProperties, { TableColumnProperties, TableRowProperties } from './ElementProperties';
import TemplateProperties from './TemplateProperties';
import './Properties.css';

const Properties: React.FC = () => {
  const { template, selectedElement, selectedTableElement } = useTemplate();
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
        {selectedTableElement ? (
          selectedTableElement.type === 'column' ? (
            <TableColumnProperties />
          ) : (
            <TableRowProperties />
          )
        ) : selectedElement ? (
          <ElementProperties element={selectedElement} />
        ) : (
          <TemplateProperties template={template} />
        )}
      </div>
    </div>
  );
};

export default Properties;