import React, { useState, useEffect, useRef } from 'react';
import { TemplateElement } from '../../models/Template';
import './Canvas.css';

interface TableColumn {
  id: string;
  name: string;
  width: number;
  properties: {
    backgroundColor?: string;
    textColor?: string;
    align?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
  };
}

interface TableRow {
  id: string;
  cells: { [columnId: string]: string };
  height?: number;
}

interface TableData {
  columns: TableColumn[];
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
  const [tableData, setTableData] = useState<TableData>(() => {
    // Initialize from existing element values or create default
    if (Array.isArray(element.values) && element.values.length > 0) {
      try {
        // If element.values already has our structure
        if (element.values[0]?.columns) {
          return element.values[0] as TableData;
        }
        
        // Convert from flat structure to our enhanced structure
        const columns: TableColumn[] = [];
        const existingData = element.values[0] || {};
        
        // Create columns from first row keys
        Object.keys(existingData).forEach((key, index) => {
          columns.push({
            id: `col_${index}`,
            name: key,
            width: DEFAULT_COLUMN_WIDTH,
            properties: {
              align: 'left',
              fontWeight: index === 0 ? 'bold' : 'normal'
            }
          });
        });
        
        // Create rows from values
        const rows: TableRow[] = element.values.map((rowData, index) => ({
          id: `row_${index}`,
          cells: Object.entries(rowData).reduce((acc, [key, value], colIndex) => {
            acc[`col_${colIndex}`] = value as string;
            return acc;
          }, {} as { [key: string]: string }),
          height: 30
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
    return {
      columns: [
        { 
          id: 'col_0', 
          name: 'Column 1', 
          width: DEFAULT_COLUMN_WIDTH,
          properties: { align: 'left', fontWeight: 'bold' } 
        },
        { 
          id: 'col_1', 
          name: 'Column 2', 
          width: DEFAULT_COLUMN_WIDTH,
          properties: { align: 'left', fontWeight: 'normal' } 
        }
      ],
      rows: [
        {
          id: 'row_0',
          cells: {
            'col_0': '',
            'col_1': ''
          },
          height: 30
        }
      ],
      settings: {
        borders: true,
        headerRow: true
      }
    };
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
      const newColumnId = `col_${prev.columns.length}`;
      
      // Create new column
      const newColumn: TableColumn = {
        id: newColumnId,
        name: `Column ${prev.columns.length + 1}`,
        width: DEFAULT_COLUMN_WIDTH,
        properties: {
          align: 'left',
          fontWeight: 'normal'
        }
      };
      
      // Add cell to each row for this column
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
      const newRowId = `row_${prev.rows.length}`;
      
      // Create empty cells for all columns
      const cells: { [key: string]: string } = {};
      prev.columns.forEach(col => {
        cells[col.id] = '';
      });
      
      const newRow: TableRow = {
        id: newRowId,
        cells,
        height: 30
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
    setInitialWidth(column.width);
    
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
            width: newWidth
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
  const updateColumnProperties = (columnId: string, properties: Partial<TableColumn['properties']>) => {
    setTableData(prev => {
      const updatedColumns = prev.columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            properties: {
              ...col.properties,
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
  const totalWidth = tableData.columns.reduce((sum, col) => sum + col.width, 0);
  
  return (
    <div className="advanced-table" onClick={(e) => e.stopPropagation()}>
      <div className="table-container">
        <table ref={tableRef} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <colgroup>
            {tableData.columns.map(column => (
              <col key={column.id} style={{ width: `${(column.width / totalWidth) * 100}%` }} />
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
                    backgroundColor: column.properties.backgroundColor || 'transparent',
                    color: column.properties.textColor || 'inherit'
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
                          textAlign: column.properties.align || 'left', 
                          fontWeight: column.properties.fontWeight || 'bold',
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
                            value={column.properties.align || 'left'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              align: e.target.value as 'left' | 'center' | 'right' 
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
                            value={column.properties.fontWeight || 'normal'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              fontWeight: e.target.value as 'normal' | 'bold' 
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
                            value={column.properties.backgroundColor || '#ffffff'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              backgroundColor: e.target.value 
                            })}
                          />
                        </div>
                        
                        <div className="settings-item">
                          <label>Text Color:</label>
                          <input 
                            type="color" 
                            value={column.properties.textColor || '#000000'} 
                            onChange={(e) => updateColumnProperties(column.id, { 
                              textColor: e.target.value 
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
              <tr key={row.id} style={{ height: `${row.height}px` }}>
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
                        textAlign: column.properties.align || 'left'
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