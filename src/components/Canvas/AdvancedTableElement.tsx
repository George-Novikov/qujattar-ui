import React, { useState, useEffect, useRef } from 'react';
import { TemplateElement, TableColumn, TableRow, ElementProps } from '../../models/Template';
import './Canvas.css';

// Define custom interface that extends ElementProps with the additional properties needed
interface TableColumnProps extends ElementProps {
  fontWeight?: string;  // Add fontWeight property that's missing from ElementProps
}

// Update TableColumn interface to use the extended props type
interface TableColumnWithExtendedProps extends Omit<TableColumn, 'props'> {
  props: TableColumnProps;
}

// Define TableElementData interface
interface TableElementData {
  columns: TableColumnWithExtendedProps[];
  rows: TableRow[];
  settings: {
    borders: boolean;
    headerRow: boolean;
  };
}

// Props for our advanced table renderer
interface AdvancedTableElementProps {
  element: TemplateElement;
  updateElementValues: (elementId: string, values: any[]) => void;
}

const DEFAULT_COLUMN_WIDTH = 100;
const MIN_COLUMN_WIDTH = 50;

/**
 * Advanced Table Element Component
 * Handles column resizing, column/row deletion, and column properties
 */
const AdvancedTableElement: React.FC<AdvancedTableElementProps> = ({ 
  element, 
  updateElementValues 
}) => {
  // Convert element values to structured table data
  const [tableData, setTableData] = useState<TableElementData>(() => {
    // Initialize from existing element values or create default
    if (Array.isArray(element.values) && element.values.length > 0) {
      try {
        // If element.values already has our structure
        if (element.values[0]?.columns) {
          return element.values[0] as TableElementData;
        }
        
        // Convert from flat structure to our enhanced structure
        const columns: TableColumnWithExtendedProps[] = [];
        const existingData = element.values[0] || {};
        
        // Create columns from first row keys
        Object.keys(existingData).forEach((key, index) => {
          columns.push({
            id: `col_${index}`,
            name: key,
            title: key, // Add a default title matching the name
            order: index,
            props: {
              // Fix align property by using horizontalAlignment instead
              horizontalAlignment: 'left',
              fontWeight: index === 0 ? 'bold' : 'normal',
              width: DEFAULT_COLUMN_WIDTH
            }
          });
        });
        
        // Create rows from values
        const rows: TableRow[] = element.values.map((rowData, index) => ({
          id: `row_${index}`,
          order: index,
          title: `Row ${index + 1}`, // Add a default title
          props: { height: 30 },
          cells: Object.entries(rowData).reduce((acc, [key, value], colIndex) => {
            acc[`col_${colIndex}`] = value as string;
            return acc;
          }, {} as { [key: string]: string })
        }));
        
        return {
          columns,
          rows,
          settings: {
            borders: true,
            headerRow: true
          }
        };
      } catch (e) {
        console.error("Error parsing table data:", e);
      }
    }
    
    // Default structure with 2 columns and 1 row
    return createDefaultTableData();
  });
  
  // Track which column is being resized
  const [resizingColumnId, setResizingColumnId] = useState<string | null>(null);
  // Track initial position when resizing
  const [resizeStartX, setResizeStartX] = useState(0);
  // Track initial width when resizing
  const [initialWidth, setInitialWidth] = useState(0);
  // Editing column settings
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  
  // Refs
  const tableRef = useRef<HTMLTableElement>(null);
  
  // Create default table data structure
  const createDefaultTableData = (): TableElementData => {
    // Create default table structure
    return {
      columns: [
        { 
          id: 'col_0', 
          name: 'Column 1', 
          title: 'Column 1', // Add title matching name 
          order: 0, 
          props: { 
            width: DEFAULT_COLUMN_WIDTH,
            horizontalAlignment: 'left',
            fontWeight: 'bold'
          } 
        },
        { 
          id: 'col_1', 
          name: 'Column 2',
          title: 'Column 2', // Add title matching name
          order: 1, 
          props: { 
            width: DEFAULT_COLUMN_WIDTH,
            horizontalAlignment: 'left',
            fontWeight: 'normal'
          } 
        }
      ],
      rows: [
        {
          id: 'row_0',
          order: 0,
          title: 'Row 1', // Add default title
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
  
  // Save table data whenever it changes
  useEffect(() => {
    // Prevent excessive updates during column resizing
    if (resizingColumnId) return;
    
    const timer = setTimeout(() => {
      updateElementValues(element.id, [tableData]);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [tableData, element.id, updateElementValues, resizingColumnId]);
  
  // Add a new column
  const addColumn = () => {
    setTableData(prev => {
      const columnIndex = prev.columns.length;
      const newColumnId = `col_${columnIndex}`;
      const columnName = `Column ${columnIndex + 1}`;
      
      // Create new column with a title that matches its name initially
      const newColumn: TableColumnWithExtendedProps = {
        id: newColumnId,
        name: columnName,
        title: columnName, // Set default title to match name
        order: columnIndex,
        props: {
          width: DEFAULT_COLUMN_WIDTH,
          horizontalAlignment: 'left',
          fontWeight: 'normal'
        }
      };
      
      // Add cell for this column to each row
      const updatedRows = prev.rows.map(row => ({
        ...row,
        cells: {
          ...row.cells,
          [newColumnId]: ''
        }
      }));
      
      return {
        ...prev,
        columns: [...prev.columns, newColumn],
        rows: updatedRows
      };
    });
  };
  
  // Add a new row
  const addRow = () => {
    setTableData(prev => {
      const rowIndex = prev.rows.length;
      const newRowId = `row_${rowIndex}`;
      const rowTitle = `Row ${rowIndex + 1}`;
      
      // Create cells for all columns
      const cells: { [key: string]: string } = {};
      prev.columns.forEach(col => {
        cells[col.id] = '';
      });
      
      const newRow: TableRow = {
        id: newRowId,
        order: rowIndex,
        title: rowTitle, // Set a default title
        props: { height: 30 },
        cells
      };
      
      return {
        ...prev,
        rows: [...prev.rows, newRow]
      };
    });
  };
  
  // Delete a column
  const deleteColumn = (columnId: string) => {
    setTableData(prev => {
      // Filter out the column
      const updatedColumns = prev.columns.filter(col => col.id !== columnId);
      
      // Remove the column's cell from each row
      const updatedRows = prev.rows.map(row => {
        const { [columnId]: removed, ...restCells } = row.cells;
        return {
          ...row,
          cells: restCells
        };
      });
      
      return {
        ...prev,
        columns: updatedColumns,
        rows: updatedRows
      };
    });
  };
  
  // Delete a row
  const deleteRow = (rowId: string) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.filter(row => row.id !== rowId)
    }));
  };
  
  // Update cell content
  const updateCell = (rowId: string, columnId: string, value: string) => {
    setTableData(prev => {
      const updatedRows = prev.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: {
              ...row.cells,
              [columnId]: value
            }
          };
        }
        return row;
      });
      
      return {
        ...prev,
        rows: updatedRows
      };
    });
  };
  
  // Update column name
  const updateColumnName = (columnId: string, name: string) => {
    setTableData(prev => {
      const updatedColumns = prev.columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            name
          };
        }
        return col;
      });
      
      return {
        ...prev,
        columns: updatedColumns
      };
    });
  };
  
  // Start column resize
  const startColumnResize = (
    columnId: string, 
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Find column
    const column = tableData.columns.find(col => col.id === columnId);
    if (!column) return;
    
    setResizingColumnId(columnId);
    setResizeStartX(e.clientX);
    // Fix: Use column.props.width
    setInitialWidth(column.props.width || DEFAULT_COLUMN_WIDTH);
    
    // Add event listeners to window
    window.addEventListener('mousemove', handleColumnResize);
    window.addEventListener('mouseup', stopColumnResize);
  };
  
  // Handle column resizing
  const handleColumnResize = (e: MouseEvent) => {
    if (!resizingColumnId) return;
    
    const deltaX = e.clientX - resizeStartX;
    const newWidth = Math.max(MIN_COLUMN_WIDTH, initialWidth + deltaX);
    
    setTableData(prev => {
      const updatedColumns = prev.columns.map(col => {
        if (col.id === resizingColumnId) {
          return {
            ...col,
            props: {
              ...col.props,
              width: newWidth
            }
          };
        }
        return col;
      });
      
      return {
        ...prev,
        columns: updatedColumns
      };
    });
  };
  
  // Stop column resize
  const stopColumnResize = () => {
    setResizingColumnId(null);
    window.removeEventListener('mousemove', handleColumnResize);
    window.removeEventListener('mouseup', stopColumnResize);
  };
  
  // Update column properties
  const updateColumnProperties = (columnId: string, properties: Partial<TableColumnProps>) => {
    setTableData(prev => {
      const updatedColumns = prev.columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            props: {
              ...col.props,
              ...properties
            }
          };
        }
        return col;
      });
      
      return {
        ...prev,
        columns: updatedColumns
      };
    });
  };
  
  // Handle clicks for editing cells
  const handleCellClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.stopPropagation();
    
    const input = e.currentTarget.querySelector('input');
    if (input) {
      input.focus();
      input.select();
    }
  };
  
  // Toggle column settings
  const toggleColumnSettings = (columnId: string) => {
    setEditingColumnId(editingColumnId === columnId ? null : columnId);
  };
  
  // Calculate total width
  const totalWidth = tableData.columns.reduce((sum, col) => sum + (col.props.width || DEFAULT_COLUMN_WIDTH), 0);
  
  return (
    <div className="advanced-table" onClick={(e) => e.stopPropagation()}>
      <div className="table-container">
        <table ref={tableRef} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <colgroup>
            {tableData.columns.map(column => (
              <col key={column.id} style={{ 
                width: `${((column.props.width || DEFAULT_COLUMN_WIDTH) / totalWidth) * 100}%` 
              }} />
            ))}
            <col style={{ width: '30px' }} /> {/* Actions column */}
          </colgroup>
          <thead>
            <tr>
              {tableData.columns.map((column, index) => (
                <th 
                  key={column.id} 
                  style={{ 
                    position: 'relative',
                    padding: '0', 
                    border: tableData.settings.borders ? '1px solid #ccc' : 'none',
                    backgroundColor: column.props.background || 'transparent',
                    color: column.props.color || 'inherit'
                  }}
                >
                  <div className="column-header-container">
                    {/* Column header with context menu */}
                    <div className="column-header">
                      <input
                        type="text"
                        defaultValue={column.name}
                        onBlur={(e) => updateColumnName(column.id, e.target.value)}
                        onClick={(e) => {
                          e.stopPropagation();
                          (e.target as HTMLInputElement).select();
                        }}
                        style={{ 
                          width: '100%', 
                          textAlign: column.props.horizontalAlignment || 'left', 
                          fontWeight: column.props.fontWeight || 'normal',
                          border: 'none',
                          padding: '4px',
                          background: 'transparent'
                        }}
                      />
                      
                      <div className="column-actions">
                        <button
                          className="column-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleColumnSettings(column.id);
                          }}
                          title="Column Settings"
                        >
                          ⚙️
                        </button>
                        
                        <button
                          className="column-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (tableData.columns.length > 1 && 
                                window.confirm('Delete this column?')) {
                              deleteColumn(column.id);
                            }
                          }}
                          title="Delete Column"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {/* Column settings dropdown */}
                    {editingColumnId === column.id && (
                      <div className="column-settings-dropdown">
                        <div className="settings-item">
                          <label>Alignment:</label>
                          <select 
                            value={column.props.horizontalAlignment || 'left'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              horizontalAlignment: e.target.value as 'left' | 'center' | 'right' 
                            })}
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                        
                        <div className="settings-item">
                          <label>Font Weight:</label>
                          <select 
                            value={column.props.fontWeight || 'normal'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              fontWeight: e.target.value
                            })}
                          >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                          </select>
                        </div>
                        
                        <div className="settings-item">
                          <label>Background:</label>
                          <input 
                            type="color" 
                            value={column.props.background || '#ffffff'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              background: e.target.value 
                            })}
                          />
                        </div>
                        
                        <div className="settings-item">
                          <label>Text Color:</label>
                          <input 
                            type="color" 
                            value={column.props.color || '#000000'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              color: e.target.value 
                            })}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Column resize handle */}
                    <div 
                      className="column-resize-handle"
                      onMouseDown={(e) => startColumnResize(column.id, e)}
                    />
                  </div>
                </th>
              ))}
              <th style={{ width: '40px', padding: '0' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addColumn();
                  }}
                  style={{ width: '100%', padding: '2px' }}
                  title="Add Column"
                >+</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={row.id} style={{ height: `${row.props.height || 30}px` }}>
                {tableData.columns.map(column => (
                  <td 
                    key={`${row.id}-${column.id}`} 
                    style={{ 
                      border: tableData.settings.borders ? '1px solid #ccc' : 'none',
                      padding: '0' 
                    }}
                    onClick={handleCellClick}
                  >
                    <input
                      type="text"
                      defaultValue={row.cells[column.id] || ''}
                      onBlur={(e) => updateCell(row.id, column.id, e.target.value)}
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
                <td style={{ padding: '0' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tableData.rows.length > 1 && 
                          window.confirm('Delete this row?')) {
                        deleteRow(row.id);
                      }
                    }}
                    style={{ width: '100%', padding: '2px' }}
                    title="Delete Row"
                  >🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '5px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addRow();
            }}
            style={{ width: '100%', padding: '4px' }}
          >
            + Add Row
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTableElement;