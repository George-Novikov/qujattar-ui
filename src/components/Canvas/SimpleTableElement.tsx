import React, { useState, useEffect } from 'react';
import { TemplateElement } from '../../models/Template';
import './Canvas.css';

// Simplified version just for rendering - detailed logic moved to Template context
interface SimpleTableElementProps {
  element: TemplateElement;
  updateElementValues: (elementId: string, values: any[]) => void;
  selectedSubElement: { type: 'column' | 'row' | null; id: string | null };
  onSelectSubElement: (type: 'column' | 'row' | null, id: string | null) => void;
}

const SimpleTableElement: React.FC<SimpleTableElementProps> = ({ 
  element, 
  updateElementValues,
  selectedSubElement,
  onSelectSubElement
}) => {
  // We expect the element values to contain our structured data
  const [tableData, setTableData] = useState(() => {
    // Initialize from element values or create default structure
    if (Array.isArray(element.values) && element.values[0]?.columns) {
      return element.values[0];
    }
    
    // Default table structure
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
  });

  // Update element values when table data changes
  useEffect(() => {
    updateElementValues(element.id, [tableData]);
  }, [tableData, element.id, updateElementValues]);

  // Update cell value
  const updateCell = (rowId: string, columnId: string, value: string) => {
    setTableData(prev => {
      const updatedRows = prev.rows.map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: { ...row.cells, [columnId]: value }
          };
        }
        return row;
      });
      
      return { ...prev, rows: updatedRows };
    });
  };

  // Add new row
  const addRow = () => {
    setTableData(prev => {
      const newRowId = `row_${prev.rows.length}`;
      
      // Create cells for all columns
      const cells = {};
      prev.columns.forEach(col => {
        cells[col.id] = '';
      });
      
      const newRow = {
        id: newRowId,
        order: prev.rows.length,
        props: { height: 30 },
        cells
      };
      
      return {
        ...prev,
        rows: [...prev.rows, newRow]
      };
    });
  };

  // Add new column
const addColumn = () => {
  setTableData(prev => {
    const columnIndex = prev.columns.length;
    const newColumnId = `col_${columnIndex}`;
    const columnName = `Column ${columnIndex + 1}`;
    
    // Create new column with a title that matches its name initially
    const newColumn: TableColumn = {
      id: newColumnId,
      name: columnName,
      title: columnName, // Set default title to match name
      order: columnIndex,
      props: {
        width: DEFAULT_COLUMN_WIDTH,
        align: 'left',
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

  // Calculate column widths as percentages
  const totalWidth = tableData.columns.reduce((sum, col) => 
    sum + (col.props.width || 100), 0);
    
  // Get percentage width for a column
  const getColumnWidth = (column) => {
    return `${((column.props.width || 100) / totalWidth) * 100}%`;
  };

  return (
    <div className="simple-table" onClick={(e) => e.stopPropagation()}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <colgroup>
          {tableData.columns.map(column => (
            <col key={column.id} style={{ width: getColumnWidth(column) }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {tableData.columns.map((column) => (
              <th 
                key={column.id}
                className={selectedSubElement.type === 'column' && selectedSubElement.id === column.id 
                  ? 'selected-column' : ''}
                style={{ 
                  padding: '4px',
                  border: tableData.settings.borders ? '1px solid #ccc' : 'none',
                  backgroundColor: column.props.background || 'transparent',
                  color: column.props.color || 'inherit',
                  textAlign: column.props.horizontalAlignment || 'left',
                  fontWeight: column.props.fontWeight || 'bold'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement('column', column.id);
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
              className={selectedSubElement.type === 'row' && selectedSubElement.id === row.id 
                ? 'selected-row' : ''}
              style={{ 
                height: `${row.props.height || 30}px`,
                backgroundColor: row.props.background || 'transparent'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement('row', row.id);
              }}
            >
              {tableData.columns.map((column) => (
                <td 
                  key={`${row.id}-${column.id}`}
                  style={{ 
                    border: tableData.settings.borders ? '1px solid #ccc' : 'none',
                    padding: '4px'
                  }}
                  onClick={(e) => {
                    // Stop event to prevent row selection
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="text"
                    value={row.cells[column.id] || ''}
                    onChange={(e) => updateCell(row.id, column.id, e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ 
                      width: '100%',
                      border: 'none',
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
      <div className="table-actions">
        <button onClick={(e) => {
          e.stopPropagation();
          addColumn();
        }}>
          Add Column
        </button>
        <button onClick={(e) => {
          e.stopPropagation();
          addRow();
        }}>
          Add Row
        </button>
      </div>
    </div>
  );
};

export default SimpleTableElement;