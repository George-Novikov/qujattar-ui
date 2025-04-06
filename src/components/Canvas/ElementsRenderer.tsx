import React from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { Template, Column, Row, TemplateElement } from '../../models/Template';
import CanvasElement from './CanvasElement';
import './Canvas.css';

const ElementsRenderer: React.FC = () => {
  const { template, selectedElement, setSelectedElement } = useTemplate();
  
  // Render a single template element
  const renderElement = (element: TemplateElement, rowId: number, columnId: number) => {
    const isSelected = selectedElement && 'id' in selectedElement && selectedElement.id === element.id;
    
    return (
      <CanvasElement
        key={element.id}
        element={element}
        rowId={rowId}
        columnId={columnId}
        isSelected={isSelected}
        onClick={() => setSelectedElement(element)}
      />
    );
  };
  
  // Render a row and its elements
  const renderRow = (row: Row, columnId: number) => {
    const isSelected = selectedElement && 'elements' in selectedElement && selectedElement.order === row.order;
    
    return (
      <div
        key={`row-${columnId}-${row.order}`}
        className={`template-row ${isSelected ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          left: `${row.props.x}%`,
          top: `${row.props.y}%`,
          width: `${row.props.width}%`,
          height: `${row.props.height}%`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: row.props.background || 'transparent',
          border: isSelected ? '1px dashed var(--color-scheme)' : 'none'
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(row);
        }}
      >
        {row.elements.map(element => renderElement(element, row.order, columnId))}
      </div>
    );
  };
  
  // Render a column and its rows
  const renderColumn = (column: Column) => {
    const isSelected = selectedElement && 'rows' in selectedElement && selectedElement.order === column.order;
    
    return (
      <div
        key={`column-${column.order}`}
        className={`template-column ${isSelected ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          left: `${column.props.x}%`,
          top: `${column.props.y}%`,
          width: `${column.props.width}%`,
          height: `${column.props.height}%`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: column.props.background || 'transparent',
          border: isSelected ? '1px dashed var(--color-scheme)' : 'none'
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(column);
        }}
      >
        {column.rows.map(row => renderRow(row, column.order))}
      </div>
    );
  };
  
  // Clear selection when clicking on empty canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only clear if clicking directly on the canvas, not on an element
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };
  
  return (
    <div className="elements-container" onClick={handleCanvasClick}>
      {template.columns.map(column => renderColumn(column))}
    </div>
  );
};

export default ElementsRenderer;