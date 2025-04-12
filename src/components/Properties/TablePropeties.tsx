import React, { useState, useEffect } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import ColorPicker from '../UI/ColorPicker';
import Dropdown from '../UI/Dropdown';
import Button from '../UI/Button';
import './Properties.css';

export const TableColumnProperties: React.FC = () => {
  const { 
    selectedElement, 
    selectedTableElement,
    updateTableColumnProps,
    deleteTableColumn
  } = useTemplate();
  
  // Add state for column title
  const [columnTitle, setColumnTitle] = useState('');
  
  if (!selectedElement || !selectedTableElement || selectedTableElement.type !== 'column') {
    return null;
  }
  
  // Make sure selectedElement is a template element and has the table data
  if (!('id' in selectedElement) || !selectedElement.values || !selectedElement.values[0]?.columns) {
    return null;
  }
  
  const tableData = selectedElement.values[0];
  
  // Find the column
  const column = tableData.columns.find(col => col.id === selectedTableElement.id);
  if (!column) {
    return null;
  }
  
  // Update column title state when column changes
  useEffect(() => {
    setColumnTitle(column.title || '');
  }, [column]);
  
  // Helper function to update properties
  const handleUpdateProps = (props: any) => {
    updateTableColumnProps(selectedElement.id, column.id, props);
  };
  
  return (
    <div className="element-properties">
      <div className="properties-section">
        <h3 className="properties-section-title">Column: {column.name}</h3>
        <Button 
          variant="secondary" 
          size="small"
          onClick={() => {
            const newName = prompt('Enter new column name', column.name);
            if (newName) {
              // Update column name (displayed in the table)
              handleUpdateProps({ name: newName });
            }
          }}
        >
          Rename
        </Button>
        {tableData.columns.length > 1 && (
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => {
              if (window.confirm(`Delete column "${column.name}"?`)) {
                deleteTableColumn(selectedElement.id, column.id);
              }
            }}
          >
            Delete
          </Button>
        )}
      </div>
      
      {/* Title Field (for tree view) */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Column Title</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Title (in tree view)</label>
            <input
              type="text"
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              onBlur={() => {
                // Update column title
                handleUpdateProps({ title: columnTitle });
              }}
              placeholder={column.name || `Column ${tableData.columns.indexOf(column) + 1}`}
            />
          </div>
        </div>
      </div>
      
      {/* Size */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Size</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Width</label>
            <input
              type="number"
              value={column.props.width || 100}
              onChange={(e) => handleUpdateProps({ width: parseFloat(e.target.value) })}
              min="20"
              max="500"
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
              label="Background"
              value={column.props.background || 'transparent'}
              onChange={(background) => handleUpdateProps({ background })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <ColorPicker
              label="Text Color"
              value={column.props.color || '#000000'}
              onChange={(color) => handleUpdateProps({ color })}
            />
          </div>
        </div>
      </div>
      
      {/* Text formatting */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Text Formatting</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Horizontal Alignment</label>
            <Dropdown
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
              value={column.props.horizontalAlignment || 'left'}
              onChange={(value) => handleUpdateProps({ horizontalAlignment: value })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Font Weight</label>
            <Dropdown
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' }
              ]}
              value={column.props.fontWeight || 'normal'}
              onChange={(value) => handleUpdateProps({ fontWeight: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TableRowProperties: React.FC = () => {
  const { 
    selectedElement, 
    selectedTableElement,
    updateTableRowProps,
    deleteTableRow
  } = useTemplate();
  
  // New state for row title
  const [rowTitle, setRowTitle] = useState('');
  
  if (!selectedElement || !selectedTableElement || selectedTableElement.type !== 'row') {
    return null;
  }
  
  // Make sure selectedElement is a template element and has the table data
  if (!('id' in selectedElement) || !selectedElement.values || !selectedElement.values[0]?.rows) {
    return null;
  }
  
  const tableData = selectedElement.values[0];
  
  // Find the row
  const row = tableData.rows.find(r => r.id === selectedTableElement.id);
  if (!row) {
    return null;
  }
  
  // Update row title state when row changes
  useEffect(() => {
    setRowTitle(row.title || '');
  }, [row]);
  
  // Helper function to update properties
  const handleUpdateProps = (props: any) => {
    updateTableRowProps(selectedElement.id, row.id, props);
  };
  
  return (
    <div className="element-properties">
      <div className="properties-section">
        <h3 className="properties-section-title">Table Row</h3>
        {tableData.rows.length > 1 && (
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => {
              if (window.confirm("Delete this row?")) {
                deleteTableRow(selectedElement.id, row.id);
              }
            }}
          >
            Delete
          </Button>
        )}
      </div>
      
      {/* Title field for row */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Row Title</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Title (in tree view)</label>
            <input
              type="text"
              value={rowTitle}
              onChange={(e) => setRowTitle(e.target.value)}
              onBlur={() => {
                // Update row title
                handleUpdateProps({ title: rowTitle });
              }}
              placeholder={`Row ${tableData.rows.indexOf(row) + 1}`}
            />
          </div>
        </div>
      </div>
      
      {/* Size */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Size</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Height (px)</label>
            <input
              type="number"
              value={row.props.height || 30}
              onChange={(e) => handleUpdateProps({ height: parseFloat(e.target.value) })}
              min="20"
              max="200"
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
              label="Background"
              value={row.props.background || 'transparent'}
              onChange={(background) => handleUpdateProps({ background })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};