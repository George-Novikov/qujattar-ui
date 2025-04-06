import React, { useState, useEffect, useRef } from 'react';
import { TemplateElement } from '../../models/Template';
import { useResizable } from '../../hooks/useResizable';
import { useTemplate } from '../../context/TemplateContext';
import './Canvas.css';

interface CanvasElementProps {
  element: TemplateElement;
  rowId: number;
  columnId: number;
  isSelected: boolean;
  onClick: () => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  rowId,
  columnId,
  isSelected,
  onClick
}) => {
  const { updateElementProps, updateElementValues, setSelectedTableElement, updateTableRowProps } = useTemplate();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const tableEditRef = useRef<HTMLDivElement>(null);

  // Set up resizable behavior
  const { size, position, isResizing, elementRef, startResize } = useResizable(
    {
      width: element.props.width || 10,
      height: element.props.height || 10
    },
    {
      x: element.props.x || 50,
      y: element.props.y || 50
    },
    (newSize, newPosition) => {
      updateElementProps(element.id, {
        width: newSize.width,
        height: newSize.height,
        x: newPosition.x,
        y: newPosition.y
      });
    }
  );

  // Initialize table data when element changes
  useEffect(() => {
    if (element.type === 'table') {
      const data = Array.isArray(element.values) && element.values.length > 0
        ? element.values
        : [{ col1: '', col2: '' }];
      setTableData(data);
    }
  }, [element, element.values]);

  // Initialize edit value when editing starts
  useEffect(() => {
    if (isEditing) {
      initializeEditValue();
    }
  }, [element, isEditing]);

  const initializeEditValue = () => {
    switch (element.type) {
      case 'list':
        setEditValue(Array.isArray(element.values) ? element.values.join('\n') : '');
        break;
      case 'table':
        // Table uses its own state system
        break;
      case 'image':
      case 'url':
        setEditValue(element.props.src || (element.values[0] || ''));
        break;
      case 'text':
      case 'codeblock':
      default:
        setEditValue(element.values[0] || '');
        break;
    }
  };

  // Get element style
  const getElementStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${position.x}%`,
      top: `${position.y}%`,
      width: `${size.width}%`,
      height: `${size.height}%`,
      transform: 'translate(-50%, -50%)',
      backgroundColor: element.props.background || 'transparent',
      color: element.props.color || '#000000',
      opacity: element.props.opacity ? element.props.opacity / 100 : 1,
      zIndex: element.props.layer || 0,
      overflow: 'hidden'
    };

    if (element.props.borders) {
      style.border = `${element.props.borders.width}px solid ${element.props.borders.color}`;
    }

    if (element.props.innerMargin) {
      style.padding = `${element.props.innerMargin}%`;
    }

    if (element.props.outerMargin) {
      style.margin = `${element.props.outerMargin}%`;
    }

    if (element.props.cornerRadius) {
      style.borderRadius = `${element.props.cornerRadius}%`;
    }

    if (element.props.horizontalAlignment) {
      style.textAlign = element.props.horizontalAlignment;
    }

    if (element.props.verticalAlignment) {
      switch (element.props.verticalAlignment) {
        case 'top':
          style.alignItems = 'flex-start';
          break;
        case 'center':
          style.alignItems = 'center';
          break;
        case 'bottom':
          style.alignItems = 'flex-end';
          break;
      }
      style.display = 'flex';
    }

    if (element.props.font) {
      style.fontFamily = element.props.font;
    }

    if (element.props.fontSize) {
      style.fontSize = `${element.props.fontSize}px`;
    }

    if (element.props.shadow) {
      try {
        const parts = element.props.shadow.split(';');
        const size = parts[0] || '5';
        const color = parts[1] || '#000000';
        const intensity = parts[2] || '0.5';
        style.boxShadow = `0 0 ${size}px ${intensity}px ${color}`;
      } catch (e) {
        style.boxShadow = `0 0 5px 0.5px #000000`;
      }
    }

    if (element.props.glow) {
      try {
        const parts = element.props.glow.split(';');
        const size = parts[0] || '5';
        const color = parts[1] || '#FFFFFF';
        const intensity = parts[2] || '0.5';
        style.textShadow = `0 0 ${size}px ${color}`;
        style.filter = `brightness(${1 + parseFloat(intensity)})`;
      } catch (e) {
        style.textShadow = `0 0 5px #FFFFFF`;
      }
    }

    return style;
  };

  // Handle element drag
  const handleDragStart = (e: React.MouseEvent) => {
    if (isResizing || isEditing) return;

    // Prevent if clicking on a resize handle
    if ((e.target as HTMLElement).className.includes('resize-handle')) {
      return;
    }

    // Only allow dragging when clicking directly on the element or its container
    // but not on any inputs, buttons, table cells etc
    const target = e.target as HTMLElement;
    const isInputOrControl = 
      target instanceof HTMLInputElement || 
      target instanceof HTMLButtonElement ||
      target instanceof HTMLTableCellElement ||
      target instanceof HTMLTableRowElement ||
      target instanceof HTMLTableElement ||
      target.tagName.toLowerCase() === 'th' ||
      target.tagName.toLowerCase() === 'td' ||
      target.tagName.toLowerCase() === 'tr' ||
      target.tagName.toLowerCase() === 'thead' ||
      target.tagName.toLowerCase() === 'tbody' ||
      target.classList.contains('hierarchical-table') ||
      target.classList.contains('table-actions');
    
    if (element.type === 'table' && isInputOrControl) {
      return;
    }

    e.stopPropagation();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = element.props.x || 50;
    const startPosY = element.props.y || 50;

    const handleDragMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const canvas = document.querySelector('.canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const xPercent = (deltaX / rect.width) * 100;
        const yPercent = (deltaY / rect.height) * 100;

        updateElementProps(element.id, {
          x: startPosX + xPercent,
          y: startPosY + yPercent
        });
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Handle double click to edit
  const handleDoubleClick = (e: React.MouseEvent) => {
    // Prevent editing when clicking on table inputs
    if (element.type === 'table' &&
      (e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement ||
        (e.target as HTMLElement).tagName.toLowerCase() === 'td' ||
        (e.target as HTMLElement).tagName.toLowerCase() === 'th')) {
      return;
    }

    e.stopPropagation();
    setIsEditing(true);
    initializeEditValue();
  };

  // Handle saving edited values
  const handleEditSave = () => {
    try {
      switch (element.type) {
        case 'list':
          const listItems = editValue.split('\n').filter(item => item.trim() !== '');
          updateElementValues(element.id, listItems);
          break;
        case 'table':
          // Table has its own save mechanism
          break;
        case 'image':
        case 'url':
          updateElementProps(element.id, { src: editValue });
          updateElementValues(element.id, [editValue]);
          break;
        case 'text':
        case 'codeblock':
        default:
          updateElementValues(element.id, [editValue]);
          break;
      }
    } catch (e) {
      console.error("Error saving element:", e);
    }

    setIsEditing(false);
  };

  // Create default table data structure
  const createDefaultTableData = (element) => {
    // Create default table structure
    return {
      columns: [
        { id: 'col_0', name: 'Column 1', order: 0, props: { width: 100 } },
        { id: 'col_1', name: 'Column 2', order: 1, props: { width: 100 } }
      ],
      rows: [
        {
          id: 'row_0',
          order: 0,
          props: { height: 30 },
          cells: { 'col_0': '', 'col_1': '' }
        }
      ],
      settings: {
        borders: true,
        headerRow: true
      }
    };
  };

  // Adjust table size based on content
  const adjustTableSize = (tableData) => {
    // Calculate appropriate size based on column count and row count
    const columnCount = tableData.columns.length;
    const rowCount = tableData.rows.length;
    
    // Base size for the table
    const baseWidth = 20; // per column
    const baseHeight = 5; // per row
    
    // Calculate new dimensions (with some minimum values)
    const newWidth = Math.max(20, baseWidth * columnCount);
    const newHeight = Math.max(10, baseHeight * rowCount);
    
    // Update element properties
    updateElementProps(element.id, {
      width: newWidth,
      height: newHeight
    });
  };

  // Handle row resizing
  const handleRowResize = (row, e: React.MouseEvent) => {
    // Only handle row height resize when clicking on bottom edge
    const rect = e.currentTarget.getBoundingClientRect();
    const bottomEdge = rect.bottom;
    const clickY = e.clientY;
    
    if (Math.abs(clickY - bottomEdge) <= 5) {
      e.stopPropagation();
      e.preventDefault();
      
      const startY = e.clientY;
      const startHeight = row.props.height || 30;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const deltaY = moveEvent.clientY - startY;
        const newHeight = Math.max(20, startHeight + deltaY);
        
        // Update row height
        updateTableRowProps(element.id, row.id, { height: newHeight });
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  // Render content in edit mode
  const renderEditContent = () => {
    switch (element.type) {
      case 'text':
      case 'codeblock':
        return (
          <textarea
            className="element-editor"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            autoFocus
            style={{
              width: '100%',
              height: '100%',
              resize: 'none',
              background: element.type === 'codeblock' ? '#f5f5f5' : 'transparent',
              fontFamily: element.type === 'codeblock' ? 'monospace' : 'inherit'
            }}
          />
        );

      case 'list':
        return (
          <textarea
            className="element-editor"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            autoFocus
            placeholder="One item per line"
            style={{ width: '100%', height: '100%', resize: 'none' }}
          />
        );

      case 'image':
      case 'url':
        return (
          <input
            type="text"
            className="element-editor"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            autoFocus
            placeholder={element.type === 'image' ? "Image URL" : "URL"}
            style={{ width: '100%' }}
          />
        );

      default:
        return (
          <div className="element-content">Unknown element type</div>
        );
    }
  };

  // Render content in view mode
  const renderViewContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div className="element-content text-element">
            {element.values[0] || ''}
          </div>
        );

      case 'image':
        return (
          <div className="element-content image-element">
            {element.props.src ? (
              <img
                src={element.props.src}
                alt={`Image ${element.id}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div className="empty-placeholder">Double-click to add image URL</div>
            )}
          </div>
        );

      case 'shape':
        return (
          <div className="element-content shape-element">
            <svg
              viewBox="0 0 100 100"
              style={{ width: '100%', height: '100%' }}
              dangerouslySetInnerHTML={{ __html: element.values[0] || '' }}
            />
          </div>
        );

      case 'list':
        return (
          <div className="element-content list-element">
            {Array.isArray(element.values) && element.values.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {element.values.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <div className="empty-placeholder">Double-click to add list items</div>
            )}
          </div>
        );

      case 'table':
        return (
          <div className="element-content table-element">
            {(() => {
              // Convert the element values to our structured format if needed
              const tableData = Array.isArray(element.values) && element.values[0]?.columns
                ? element.values[0]
                : createDefaultTableData(element);

              // Calculate column widths
              const totalWidth = tableData.columns.reduce((sum, col) =>
                sum + (col.props.width || 100), 0);

              // Track which elements are selected
              const { selectedTableElement } = useTemplate();

              return (
                <div className="hierarchical-table" onClick={(e) => e.stopPropagation()}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <colgroup>
                      {tableData.columns.map(column => (
                        <col
                          key={column.id}
                          style={{ width: `${((column.props.width || 100) / totalWidth) * 100}%` }}
                        />
                      ))}
                    </colgroup>
                    <thead>
                      <tr>
                        {tableData.columns.map((column) => (
                          <th
                            key={column.id}
                            className={selectedTableElement?.elementId === element.id &&
                              selectedTableElement?.type === 'column' &&
                              selectedTableElement?.id === column.id
                              ? 'selected-column' : ''}
                            style={{
                              padding: '4px',
                              border: tableData.settings.borders ? '1px solid #ccc' : 'none',
                              backgroundColor: column.props.background || 'transparent',
                              color: column.props.color || 'inherit',
                              textAlign: column.props.horizontalAlignment || 'left',
                              fontWeight: column.props.fontWeight || 'bold',
                              position: 'relative'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTableElement({
                                elementId: element.id,
                                type: 'column',
                                id: column.id
                              });
                            }}
                          >
                            {column.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.rows.map((row) => (
                        <tr
                          key={row.id}
                          className={`resizable-row ${selectedTableElement?.elementId === element.id &&
                            selectedTableElement?.type === 'row' &&
                            selectedTableElement?.id === row.id
                            ? 'selected-row' : ''}`}
                          style={{
                            height: `${row.props.height || 30}px`,
                            backgroundColor: row.props.background || 'transparent',
                            position: 'relative'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTableElement({
                              elementId: element.id,
                              type: 'row',
                              id: row.id
                            });
                          }}
                          onMouseDown={(e) => handleRowResize(row, e)}
                        >
                          {tableData.columns.map((column) => (
                            <td
                              key={`${row.id}-${column.id}`}
                              style={{
                                border: tableData.settings.borders ? '1px solid #ccc' : 'none',
                                padding: '0'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                defaultValue={row.cells[column.id] || ''}
                                onBlur={(e) => {
                                  const newValue = e.target.value;

                                  // Update the cell value
                                  const updatedRows = tableData.rows.map(r => {
                                    if (r.id === row.id) {
                                      return {
                                        ...r,
                                        cells: { ...r.cells, [column.id]: newValue }
                                      };
                                    }
                                    return r;
                                  });

                                  // Update the element values
                                  updateElementValues(element.id, [{
                                    ...tableData,
                                    rows: updatedRows
                                  }]);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  (e.target as HTMLInputElement).select();
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  border: 'none',
                                  padding: '4px',
                                  background: 'transparent',
                                  textAlign: column.props.horizontalAlignment || 'left'
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="table-actions" style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        // Create a new column
                        const newColumnId = `col_${tableData.columns.length}`;
                        const newColumn = {
                          id: newColumnId,
                          name: `Column ${tableData.columns.length + 1}`,
                          order: tableData.columns.length,
                          props: { width: 100 }
                        };

                        // Add cells for this column to all rows
                        const updatedRows = tableData.rows.map(r => ({
                          ...r,
                          cells: { ...r.cells, [newColumnId]: '' }
                        }));

                        const updatedTableData = {
                          ...tableData,
                          columns: [...tableData.columns, newColumn],
                          rows: updatedRows
                        };

                        // Update the element values
                        updateElementValues(element.id, [updatedTableData]);
                        
                        // Adjust table size
                        adjustTableSize(updatedTableData);
                      }}
                    >
                      Add Column
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        // Create a new row
                        const newRowId = `row_${tableData.rows.length}`;

                        // Create cells for all columns
                        const cells = {};
                        tableData.columns.forEach(col => {
                          cells[col.id] = '';
                        });

                        const newRow = {
                          id: newRowId,
                          order: tableData.rows.length,
                          props: { height: 30 },
                          cells
                        };

                        const updatedTableData = {
                          ...tableData,
                          rows: [...tableData.rows, newRow]
                        };

                        // Update the element values
                        updateElementValues(element.id, [updatedTableData]);
                        
                        // Adjust table size
                        adjustTableSize(updatedTableData);
                      }}
                    >
                      Add Row
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );

      case 'pagebreak':
        return (
          <div className="element-content pagebreak-element">
            <hr style={{ border: 'none', borderTop: '1px dashed #888', width: '100%' }} />
            <div style={{ textAlign: 'center', color: '#888' }}>Page Break</div>
          </div>
        );

      case 'pagenumber':
        return (
          <div className="element-content pagenumber-element">
            <div style={{ textAlign: 'center' }}>
              {element.values[0] || '1'}
            </div>
          </div>
        );

      case 'pagetotal':
        return (
          <div className="element-content pagetotal-element">
            <div style={{ textAlign: 'center' }}>
              {element.values[0] || '1'}
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className="element-content datetime-element">
            {element.values[0] || new Date().toLocaleDateString()}
          </div>
        );

      case 'url':
        if (!element.props.src && (!element.values || !element.values[0])) {
          return <div className="empty-placeholder">Double-click to add URL</div>;
        }

        const url = element.props.src || element.values[0] || '#';
        const displayText = element.values[0] || element.props.src || url;

        return (
          <div className="element-content url-element">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: 'blue' }}
            >
              {displayText}
            </a>
          </div>
        );

      case 'codeblock':
        return (
          <div className="element-content codeblock-element">
            <pre style={{ margin: 0, padding: '8px', backgroundColor: '#f5f5f5', overflow: 'auto', height: '100%' }}>
              <code>{element.values[0] || ''}</code>
            </pre>
          </div>
        );

      default:
        return <div className="element-content">Unknown element type</div>;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`template-element element-${element.type} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={getElementStyle()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={handleDragStart}
      onDoubleClick={handleDoubleClick}
    >
      {element.type === 'table' ? renderViewContent() : (isEditing ? renderEditContent() : renderViewContent())}

      {isSelected && (
        <>
          <div className="resize-handle top" onMouseDown={(e) => { e.stopPropagation(); startResize('top', e); }}></div>
          <div className="resize-handle right" onMouseDown={(e) => { e.stopPropagation(); startResize('right', e); }}></div>
          <div className="resize-handle bottom" onMouseDown={(e) => { e.stopPropagation(); startResize('bottom', e); }}></div>
          <div className="resize-handle left" onMouseDown={(e) => { e.stopPropagation(); startResize('left', e); }}></div>
          <div className="resize-handle top-left" onMouseDown={(e) => { e.stopPropagation(); startResize('topLeft', e); }}></div>
          <div className="resize-handle top-right" onMouseDown={(e) => { e.stopPropagation(); startResize('topRight', e); }}></div>
          <div className="resize-handle bottom-left" onMouseDown={(e) => { e.stopPropagation(); startResize('bottomLeft', e); }}></div>
          <div className="resize-handle bottom-right" onMouseDown={(e) => { e.stopPropagation(); startResize('bottomRight', e); }}></div>
        </>
      )}
    </div>
  );
};

export default CanvasElement;