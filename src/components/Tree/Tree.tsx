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
  const findTableData = (elementId: string) => {
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
  
  // Get element title or default label
  const getElementTitle = (element: any, defaultLabel: string) => {
    return element.title || defaultLabel;
  };
  
  // Get table column title or default
  const getColumnTitle = (column: any, index: number) => {
    // Use title for tree view if available
    if (column.title) return column.title;
    // If no title, use name as fallback (what's displayed in the table)
    if (column.name) return column.name;
    // If neither is available, use default format
    return `Column ${index + 1}`;
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
              label={getElementTitle(column, `Column ${column.order + 1}`)}
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
                  label={getElementTitle(row, `Row ${row.order + 1}`)}
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
                    const defaultLabel = `${element.type.charAt(0).toUpperCase() + element.type.slice(1)} ${element.id.split('-')[1]}`;
                    
                    return (
                      <TreeItem
                        key={element.id}
                        label={getElementTitle(element, defaultLabel)}
                        isSelected={selectedElement && 'id' in selectedElement && selectedElement.id === element.id && !selectedTableElement}
                        isExpanded={isTableElement && tableData && 
                          ((selectedElement && 'id' in selectedElement && selectedElement.id === element.id) || 
                           (selectedTableElement && selectedTableElement.elementId === element.id))}
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
                              {tableData.columns.map((col: any, index: number) => (
                                <TreeItem
                                  key={col.id}
                                  label={getColumnTitle(col, index)}
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
                              {tableData.rows.map((tableRow: any, index: number) => (
                                <TreeItem
                                  key={tableRow.id}
                                  label={tableRow.title || `Row ${index + 1}`}
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