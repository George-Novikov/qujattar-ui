// Update your Tree.tsx component to handle table sub-elements

import React from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import TreeItem from './TreeItem';
import './Tree.css';

const Tree: React.FC = () => {
  const { 
    template, 
    selectedElement, 
    setSelectedElement,
    selectedTableElement,
    setSelectedTableElement
  } = useTemplate();
  const { settings } = useAppSettings();
  
  if (!settings.showTree) {
    return null;
  }
  
  // Find table data for rendering sub-elements
  const findTableData = (elementId) => {
    for (const column of template.columns) {
      for (const row of column.rows) {
        const element = row.elements.find(el => el.id === elementId);
        if (element && element.type === 'table' && Array.isArray(element.values) && element.values[0]?.columns) {
          return element.values[0];
        }
      }
    }
    return null;
  };
  
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
          onClick={() => {
            setSelectedElement(null);
            setSelectedTableElement(null);
          }}
        >
          {/* Column nodes */}
          {template.columns.map(column => (
            <TreeItem
              key={`column-${column.order}`}
              label={`Column ${column.order + 1}`}
              isSelected={selectedElement === column}
              isExpanded={true}
              onClick={() => {
                setSelectedElement(column);
                setSelectedTableElement(null);
              }}
            >
              {/* Row nodes */}
              {column.rows.map(row => (
                <TreeItem
                  key={`row-${column.order}-${row.order}`}
                  label={`Row ${row.order + 1}`}
                  isSelected={selectedElement === row}
                  isExpanded={true}
                  onClick={() => {
                    setSelectedElement(row);
                    setSelectedTableElement(null);
                  }}
                >
                  {/* Element nodes */}
                  {row.elements.map(element => {
                    const isTableElement = element.type === 'table';
                    const tableData = isTableElement ? findTableData(element.id) : null;
                    
                    return (
                      <TreeItem
                        key={element.id}
                        label={`${element.type.charAt(0).toUpperCase() + element.type.slice(1)} ${element.id.split('-')[1]}`}
                        isSelected={selectedElement && 'id' in selectedElement && selectedElement.id === element.id && !selectedTableElement}
                        isExpanded={isTableElement && tableData && 
                          (selectedElement?.id === element.id || selectedTableElement?.elementId === element.id)}
                        onClick={() => {
                          setSelectedElement(element);
                          setSelectedTableElement(null);
                        }}
                      >
                        {/* For table elements, add columns and rows as children */}
                        {isTableElement && tableData && (
                          <>
                            {/* Table columns */}
                            <TreeItem
                              label="Columns"
                              isExpanded={true}
                            >
                              {tableData.columns.map((col) => (
                                <TreeItem
                                  key={col.id}
                                  label={col.name}
                                  isSelected={selectedTableElement?.elementId === element.id && 
                                              selectedTableElement?.type === 'column' && 
                                              selectedTableElement?.id === col.id}
                                  onClick={() => {
                                    setSelectedElement(element);
                                    setSelectedTableElement({
                                      elementId: element.id,
                                      type: 'column',
                                      id: col.id
                                    });
                                  }}
                                />
                              ))}
                            </TreeItem>
                            
                            {/* Table rows */}
                            <TreeItem
                              label="Rows"
                              isExpanded={true}
                            >
                              {tableData.rows.map((tableRow, index) => (
                                <TreeItem
                                  key={tableRow.id}
                                  label={`Row ${index + 1}`}
                                  isSelected={selectedTableElement?.elementId === element.id && 
                                              selectedTableElement?.type === 'row' && 
                                              selectedTableElement?.id === tableRow.id}
                                  onClick={() => {
                                    setSelectedElement(element);
                                    setSelectedTableElement({
                                      elementId: element.id,
                                      type: 'row',
                                      id: tableRow.id
                                    });
                                  }}
                                />
                              ))}
                            </TreeItem>
                          </>
                        )}
                      </TreeItem>
                    );
                  })}
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