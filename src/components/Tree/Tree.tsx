import React from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import TreeItem from './TreeItem';
import './Tree.css';

const Tree: React.FC = () => {
  const { template, selectedElement, setSelectedElement } = useTemplate();
  const { settings } = useAppSettings();
  
  if (!settings.showTree) {
    return null;
  }
  
  return (
    <div className="tree">
      <div className="tree-header">
        <span>Structure</span>
      </div>
      
      <div className="tree-content">
        {/* Root template node */}
        <TreeItem
          label={template.props.title}
          isTemplate
          isSelected={!selectedElement}
          isExpanded={true}
          onClick={() => setSelectedElement(null)}
        >
          {/* Column nodes */}
          {template.columns.map(column => (
            <TreeItem
              key={`column-${column.order}`}
              label={`Column ${column.order + 1}`}
              isSelected={selectedElement === column}
              isExpanded={true}
              onClick={() => setSelectedElement(column)}
            >
              {/* Row nodes */}
              {column.rows.map(row => (
                <TreeItem
                  key={`row-${column.order}-${row.order}`}
                  label={`Row ${row.order + 1}`}
                  isSelected={selectedElement === row}
                  isExpanded={true}
                  onClick={() => setSelectedElement(row)}
                >
                  {/* Element nodes */}
                  {row.elements.map(element => (
                    <TreeItem
                      key={element.id}
                      label={`${element.type.charAt(0).toUpperCase() + element.type.slice(1)} ${element.id.split('-')[1]}`}
                      isSelected={selectedElement && 'id' in selectedElement && selectedElement.id === element.id}
                      onClick={() => setSelectedElement(element)}
                    />
                  ))}
                </TreeItem>
              ))}
            </TreeItem>
          ))}
        </TreeItem>
      </div>
    </div>
  );
};

export default Tree;