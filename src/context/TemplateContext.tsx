import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import {
  Template,
  TemplateElement,
  Row,
  Column,
  ElementType,
  createNewTemplate,
  generateElementId,
  ElementProps
} from '../models/Template';
import { useAppSettings } from './AppSettingsContext';
import { useTemplateHistory } from '../hooks/useTemplateHistory';

interface TemplateContextProps {
  template: Template;
  selectedElement: TemplateElement | Row | Column | null;
  setSelectedElement: (element: TemplateElement | Row | Column | null) => void;
  updateTemplateProps: (props: Partial<Template['props']>) => void;
  updateElementProps: (elementId: string, props: Partial<ElementProps>) => void;
  addElement: (type: ElementType, rowId: number, columnId: number) => void;
  removeElement: (elementId: string) => void;
  moveElement: (elementId: string, newRowId: number, newColumnId: number) => void;
  addRow: (columnId: number) => void;
  removeRow: (rowId: number, columnId: number) => void;
  addColumn: () => void;
  removeColumn: (columnId: number) => void;
  exportToJson: () => string;
  importFromJson: (json: string) => void;
  undoChange: () => void;
  redoChange: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveTemplate: () => Promise<void>;
  loadTemplate: (id: number) => Promise<void>;
  updateElementValues: (elementId: string, values: any[]) => void;
  selectedTableElement: {
    elementId: string | null;
    type: 'column' | 'row' | null;
    id: string | null;
  } | null;
  setSelectedTableElement: (data: { elementId: string; type: 'column' | 'row' | null; id: string | null }) => void;
  updateTableColumnProps: (elementId: string, columnId: string, props: Partial<ElementProps>) => void;
  updateTableRowProps: (elementId: string, rowId: string, props: Partial<ElementProps>) => void;
  deleteTableColumn: (elementId: string, columnId: string) => void;
  deleteTableRow: (elementId: string, rowId: string) => void;
  cutElement: () => void;
  copyElement: () => void;
  pasteElement: () => void;
  canPaste: boolean;
  duplicateElement: () => void;
  updateElementTitle: (elementId: string, title: string) => void;
  updateColumnTitle: (columnOrder: number, title: string) => void;
  updateRowTitle: (columnOrder: number, rowOrder: number, title: string) => void;
}

const TemplateContext = createContext<TemplateContextProps | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialTemplate = useRef(createNewTemplate()).current;
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [selectedElement, setSelectedElement] = useState<TemplateElement | Row | Column | null>(null);
  const { settings } = useAppSettings();

  // Clipboard state
  const [clipboardElement, setClipboardElement] = useState<TemplateElement | null>(null);
  const [clipboardRowId, setClipboardRowId] = useState<number | null>(null);
  const [clipboardColumnId, setClipboardColumnId] = useState<number | null>(null);

  // Initialize history with the initial template
  const {
    state: historyState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  } = useTemplateHistory<Template>(initialTemplate);

  // Flag to prevent adding history entries during undo/redo operations
  const isUndoRedoOperation = useRef(false);

  // Synchronize template state with history state
  useEffect(() => {
    // Only update if not in the middle of an undo/redo operation
    if (!isUndoRedoOperation.current) {
      setTemplate(historyState);
    }
  }, [historyState]);

  // Auto-save feature
  useEffect(() => {
    if (settings.autoSave && settings.isAuthenticated) {
      const timerId = setTimeout(() => {
        saveTemplate();
      }, 30000); // Save every 30 seconds

      return () => clearTimeout(timerId);
    }
  }, [template, settings.autoSave, settings.isAuthenticated]);

  // Helper for creating a deep copy
  const deepCopy = <T extends object>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  };

  // Helper for adding to history
  const addHistoryEntry = useCallback((updatedTemplate: Template) => {
    if (!isUndoRedoOperation.current) {
      addToHistory(updatedTemplate);
    }
  }, [addToHistory]);

  const updateTemplateProps = (props: Partial<Template['props']>) => {
    const updatedTemplate = {
      ...deepCopy(template),
      props: {
        ...template.props,
        ...props
      }
    };

    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);
  };

  // Update element title
  const updateElementTitle = useCallback((elementId: string, title: string) => {
    setTemplate(prevTemplate => {
      const newTemplate = deepCopy(prevTemplate);
      
      // Find the element and update its title
      let found = false;
      
      for (let c = 0; c < newTemplate.columns.length && !found; c++) {
        const column = newTemplate.columns[c];
        
        for (let r = 0; r < column.rows.length && !found; r++) {
          const row = column.rows[r];
          
          const elementIndex = row.elements.findIndex(el => el.id === elementId);
          if (elementIndex >= 0) {
            // Create a new element with the updated title
            row.elements[elementIndex] = { 
              ...row.elements[elementIndex],
              title: title || undefined // Don't store empty strings
            };
            
            found = true;
            break;
          }
        }
      }
      
      // Add to history if element was found and updated
      if (found) {
        addHistoryEntry(newTemplate);
      }
      
      return newTemplate;
    });
  }, [addHistoryEntry]);
  
  // Update column title
  const updateColumnTitle = useCallback((columnOrder: number, title: string) => {
    setTemplate(prevTemplate => {
      const newTemplate = deepCopy(prevTemplate);
      
      // Find the column by order
      const columnIndex = newTemplate.columns.findIndex(col => col.order === columnOrder);
      if (columnIndex >= 0) {
        // Update column title
        newTemplate.columns[columnIndex] = {
          ...newTemplate.columns[columnIndex],
          title: title || undefined // Don't store empty strings
        };
        
        // Add to history
        addHistoryEntry(newTemplate);
      }
      
      return newTemplate;
    });
  }, [addHistoryEntry]);
  
  // Update row title
  const updateRowTitle = useCallback((columnOrder: number, rowOrder: number, title: string) => {
    setTemplate(prevTemplate => {
      const newTemplate = deepCopy(prevTemplate);
      
      // Find the column by order
      const columnIndex = newTemplate.columns.findIndex(col => col.order === columnOrder);
      if (columnIndex >= 0) {
        const column = newTemplate.columns[columnIndex];
        
        // Find the row by order
        const rowIndex = column.rows.findIndex(row => row.order === rowOrder);
        if (rowIndex >= 0) {
          // Update row title
          newTemplate.columns[columnIndex].rows[rowIndex] = {
            ...column.rows[rowIndex],
            title: title || undefined // Don't store empty strings
          };
          
          // Add to history
          addHistoryEntry(newTemplate);
        }
      }
      
      return newTemplate;
    });
  }, [addHistoryEntry]);

  const updateElementProps = useCallback((elementId: string, props: Partial<ElementProps> & { title?: string }) => {
    setTemplate(prevTemplate => {
      const newTemplate = deepCopy(prevTemplate);
      let found = false;
      
      // Extract title from props if present
      const { title, ...otherProps } = props as any;
      
      for (let c = 0; c < newTemplate.columns.length && !found; c++) {
        const column = newTemplate.columns[c];
        
        for (let r = 0; r < column.rows.length && !found; r++) {
          const row = column.rows[r];
          
          const elementIndex = row.elements.findIndex(el => el.id === elementId);
          if (elementIndex >= 0) {
            // Create a new element with the updated props
            const updatedElement = { 
              ...row.elements[elementIndex],
              props: {
                ...row.elements[elementIndex].props,
                ...otherProps
              }
            };
            
            // Add title if provided
            if (title !== undefined) {
              updatedElement.title = title || undefined; // Don't store empty strings
            }
            
            // Update the element in the row
            row.elements[elementIndex] = updatedElement;
            
            found = true;
            break;
          }
        }
      }
      
      // Add to history if element was found and updated
      if (found) {
        addHistoryEntry(newTemplate);
      }
      
      return newTemplate;
    });
  }, [addHistoryEntry]);

  const addElement = (type: ElementType, rowId: number, columnId: number) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    const column = updatedTemplate.columns.find(c => c.order === columnId);
    if (!column) return;

    const row = column.rows.find(r => r.order === rowId);
    if (!row) return;

    const id = generateElementId(type, row.elements);

    // Default title will be provided in the element structure
    const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
    const elementNumber = row.elements.filter(el => el.type === type).length + 1;
    
    const newElement: TemplateElement = {
      id,
      order: row.elements.length,
      type,
      values: [],
      props: {
        height: 10,
        width: 20,
        x: 50,
        y: 50
      },
      title: `${typeCapitalized} ${elementNumber}`
    };

    row.elements.push(newElement);

    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);
    setSelectedElement(newElement);
  };

  const removeElement = (elementId: string) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const elementIndex = row.elements.findIndex(element => element.id === elementId);

        if (elementIndex !== -1) {
          row.elements.splice(elementIndex, 1);

          // Recalculate order for remaining elements
          row.elements.forEach((element, idx) => {
            element.order = idx;
          });

          setTemplate(updatedTemplate);
          addHistoryEntry(updatedTemplate);

          if (selectedElement && 'id' in selectedElement && selectedElement.id === elementId) {
            setSelectedElement(null);
          }

          return;
        }
      }
    }
  };

  const moveElement = (elementId: string, newRowId: number, newColumnId: number) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);
    let elementToMove: TemplateElement | null = null;

    // Find and remove the element from its current location
    outerLoop: for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const elementIndex = row.elements.findIndex(element => element.id === elementId);

        if (elementIndex !== -1) {
          elementToMove = deepCopy(row.elements[elementIndex]);
          row.elements.splice(elementIndex, 1);

          // Recalculate order for remaining elements
          row.elements.forEach((element, idx) => {
            element.order = idx;
          });

          break outerLoop;
        }
      }
    }

    if (!elementToMove) return;

    // Add the element to its new location
    const targetColumn = updatedTemplate.columns.find(c => c.order === newColumnId);
    if (!targetColumn) return;

    const targetRow = targetColumn.rows.find(r => r.order === newRowId);
    if (!targetRow) return;

    elementToMove.order = targetRow.elements.length;
    targetRow.elements.push(elementToMove);

    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);
  };

  const addRow = (columnId: number) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    const column = updatedTemplate.columns.find(c => c.order === columnId);
    if (!column) return;

    const rowNumber = column.rows.length + 1;
    const newRow: Row = {
      order: column.rows.length,
      props: {
        height: 10,
        width: column.props.width,
        x: column.props.x,
        y: column.rows.length === 0 ? column.props.y : column.rows[column.rows.length - 1].props.y + 10
      },
      elements: [],
      title: `Row ${rowNumber}`
    };

    column.rows.push(newRow);

    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);
    setSelectedElement(newRow);
  };

  const removeRow = (rowId: number, columnId: number) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    const column = updatedTemplate.columns.find(c => c.order === columnId);
    if (!column) return;

    const rowIndex = column.rows.findIndex(r => r.order === rowId);
    if (rowIndex === -1) return;

    column.rows.splice(rowIndex, 1);

    // Recalculate order for remaining rows
    column.rows.forEach((row, idx) => {
      row.order = idx;
    });

    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);

    if (selectedElement && 'order' in selectedElement && selectedElement.order === rowId) {
      setSelectedElement(null);
    }
  };

  const addColumn = () => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    const columnNumber = updatedTemplate.columns.length + 1;
    const newColumn: Column = {
      order: updatedTemplate.columns.length,
      props: {
        height: 100,
        width: 100 / (updatedTemplate.columns.length + 1),
        x: updatedTemplate.columns.length === 0 ? 50 :
          updatedTemplate.columns[updatedTemplate.columns.length - 1].props.x +
          updatedTemplate.columns[updatedTemplate.columns.length - 1].props.width / 2,
        y: 50
      },
      rows: [],
      title: `Column ${columnNumber}`
    };

    updatedTemplate.columns.push(newColumn);

    // Adjust width of existing columns
    updatedTemplate.columns.forEach(column => {
      column.props.width = 100 / updatedTemplate.columns.length;
    });

    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);
    setSelectedElement(newColumn);
  };

  const removeColumn = (columnId: number) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    const columnIndex = updatedTemplate.columns.findIndex(c => c.order === columnId);
    if (columnIndex === -1) return;

    updatedTemplate.columns.splice(columnIndex, 1);

    // Recalculate order for remaining columns and adjust width
    updatedTemplate.columns.forEach((column, idx) => {
      column.order = idx;
      column.props.width = 100 / updatedTemplate.columns.length;
    });

    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);

    if (selectedElement && 'rows' in selectedElement && selectedElement.order === columnId) {
      setSelectedElement(null);
    }
  };

  const exportToJson = (): string => {
    return JSON.stringify(template, null, 2);
  };

  const importFromJson = (json: string) => {
    try {
      const parsed = JSON.parse(json) as Template;
      setTemplate(parsed);

      // Clear history and start fresh with the imported template
      clearHistory();
      addHistoryEntry(parsed);
    } catch (e) {
      console.error('Failed to parse template JSON:', e);
      throw new Error('Invalid template format');
    }
  };

  const saveTemplate = async (): Promise<void> => {
    // Mock implementation, to be replaced with actual API call
    console.log('Saving template:', template);

    if (!settings.isAuthenticated) {
      console.warn('Cannot save template: user not authenticated');
      return;
    }

    try {
      // Mocked API call
      // await apiService.post('/api/v1/templates', template);
      console.log('Template saved successfully');
    } catch (error) {
      console.error('Failed to save template:', error);
      throw error;
    }
  };

  const loadTemplate = async (id: number): Promise<void> => {
    // Mock implementation, to be replaced with actual API call
    console.log('Loading template with ID:', id);

    try {
      // Mocked API call
      // const loadedTemplate = await apiService.get(`/api/v1/templates?id=${id}`);
      // setTemplate(loadedTemplate);
      // clearHistory();
      // addToHistory(loadedTemplate);

      // For now, just log that we would load the template
      console.log('Template loaded successfully');
    } catch (error) {
      console.error('Failed to load template:', error);
      throw error;
    }
  };

  // Fixed undo/redo functions
  const undoChange = () => {
    if (canUndo) {
      isUndoRedoOperation.current = true;
      const prevTemplate = undo();

      if (prevTemplate) {
        setTemplate(prevTemplate);
        // If the currently selected element doesn't exist in the previous state,
        // clear the selection
        if (selectedElement) {
          if ('id' in selectedElement) {
            // Check if element still exists
            let elementExists = false;
            outerLoop: for (const column of prevTemplate.columns) {
              for (const row of column.rows) {
                if (row.elements.some(el => el.id === selectedElement.id)) {
                  elementExists = true;
                  break outerLoop;
                }
              }
            }
            if (!elementExists) {
              setSelectedElement(null);
            }
          } else if ('order' in selectedElement && 'elements' in selectedElement) {
            // Check if row still exists
            let rowExists = false;
            for (const column of prevTemplate.columns) {
              if (column.rows.some(row => row.order === selectedElement.order)) {
                rowExists = true;
                break;
              }
            }
            if (!rowExists) {
              setSelectedElement(null);
            }
          } else if ('order' in selectedElement && 'rows' in selectedElement) {
            // Check if column still exists
            if (!prevTemplate.columns.some(col => col.order === selectedElement.order)) {
              setSelectedElement(null);
            }
          }
        }
      }

      isUndoRedoOperation.current = false;
    }
  };

  const redoChange = () => {
    if (canRedo) {
      isUndoRedoOperation.current = true;
      const nextTemplate = redo();

      if (nextTemplate) {
        setTemplate(nextTemplate);
      }

      isUndoRedoOperation.current = false;
    }
  };

  const updateElementValues = (elementId: string, values: any[]) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    // Find the element in the template
    for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const elementIndex = row.elements.findIndex(element => element.id === elementId);

        if (elementIndex !== -1) {
          // Update the element's values
          row.elements[elementIndex] = {
            ...row.elements[elementIndex],
            values: deepCopy(values)
          };

          setTemplate(updatedTemplate);
          addHistoryEntry(updatedTemplate);
          return;
        }
      }
    }
  };

  const [selectedTableElement, setSelectedTableElement] = useState<{
    elementId: string | null;
    type: 'column' | 'row' | null;
    id: string | null;
  } | null>(null);

  // Table column properties update
  const updateTableColumnProps = useCallback((elementId: string, columnId: string, props: Partial<ElementProps> & { name?: string }) => {
    setTemplate(prevTemplate => {
      const newTemplate = deepCopy(prevTemplate);
      let found = false;

      // Extract name from props if present
      const { name, ...otherProps } = props as any;
      
      for (let c = 0; c < newTemplate.columns.length && !found; c++) {
        const column = newTemplate.columns[c];
        
        for (let r = 0; r < column.rows.length && !found; r++) {
          const row = column.rows[r];
          
          const elementIndex = row.elements.findIndex(el => el.id === elementId);
          if (elementIndex >= 0 && row.elements[elementIndex].type === 'table') {
            const element = row.elements[elementIndex];
            
            if (Array.isArray(element.values) && element.values.length > 0) {
              const tableData = { ...element.values[0] };
              
              // Find the column in the table
              const columnIndex = tableData.columns.findIndex(col => col.id === columnId);
              if (columnIndex >= 0) {
                // Update column props
                const updatedColumn = {
                  ...tableData.columns[columnIndex],
                  props: {
                    ...tableData.columns[columnIndex].props,
                    ...otherProps
                  }
                };
                
                // Add name if provided
                if (name !== undefined) {
                  updatedColumn.name = name;
                }
                
                // Update the table data
                tableData.columns = [
                  ...tableData.columns.slice(0, columnIndex),
                  updatedColumn,
                  ...tableData.columns.slice(columnIndex + 1)
                ];
                
                // Update the element values
                element.values = [tableData];
                
                found = true;
                break;
              }
            }
          }
        }
      }
      
      // Add to history if found and updated
      if (found) {
        addHistoryEntry(newTemplate);
      }
      
      return newTemplate;
    });
  }, [addHistoryEntry]);

  // Table row properties update
  const updateTableRowProps = useCallback((elementId: string, rowId: string, props: Partial<ElementProps> & { title?: string }) => {
    setTemplate(prevTemplate => {
      const newTemplate = deepCopy(prevTemplate);
      let found = false;
      
      // Extract title from props if present
      const { title, ...otherProps } = props as any;
      
      for (let c = 0; c < newTemplate.columns.length && !found; c++) {
        const column = newTemplate.columns[c];
        
        for (let r = 0; r < column.rows.length && !found; r++) {
          const row = column.rows[r];
          
          const elementIndex = row.elements.findIndex(el => el.id === elementId);
          if (elementIndex >= 0 && row.elements[elementIndex].type === 'table') {
            const element = row.elements[elementIndex];
            
            if (Array.isArray(element.values) && element.values.length > 0) {
              const tableData = { ...element.values[0] };
              
              // Find the row in the table
              const tableRowIndex = tableData.rows.findIndex(tr => tr.id === rowId);
              if (tableRowIndex >= 0) {
                // Update row props
                const updatedRow = {
                  ...tableData.rows[tableRowIndex],
                  props: {
                    ...tableData.rows[tableRowIndex].props,
                    ...otherProps
                  }
                };
                
                // Add title if provided
                if (title !== undefined) {
                  updatedRow.title = title || undefined; // Don't store empty strings
                }
                
                // Update the table data
                tableData.rows = [
                  ...tableData.rows.slice(0, tableRowIndex),
                  updatedRow,
                  ...tableData.rows.slice(tableRowIndex + 1)
                ];
                
                // Update the element values
                element.values = [tableData];
                
                found = true;
                break;
              }
            }
          }
        }
      }
      
      // Add to history if found and updated
      if (found) {
        addHistoryEntry(newTemplate);
      }
      
      return newTemplate;
    });
  }, [addHistoryEntry]);

  // Delete table column
  const deleteTableColumn = (elementId: string, columnId: string) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    // Find the element
    for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const element = row.elements.find(el => el.id === elementId);

        if (element && element.type === 'table' && Array.isArray(element.values) && element.values[0]?.columns) {
          const tableData = element.values[0];

          // Make sure we don't delete the last column
          if (tableData.columns.length <= 1) {
            return;
          }

          // Filter out the column
          const filteredColumns = tableData.columns.filter(col => col.id !== columnId);

          // Remove column cells from rows
          const updatedRows = tableData.rows.map(tableRow => {
            const { [columnId]: removed, ...restCells } = tableRow.cells;
            return {
              ...tableRow,
              cells: restCells
            };
          });

          // Update the table data
          element.values[0] = {
            ...tableData,
            columns: filteredColumns,
            rows: updatedRows
          };

          setTemplate(updatedTemplate);
          addHistoryEntry(updatedTemplate);

          // Clear selection if the deleted column was selected
          if (selectedTableElement &&
            selectedTableElement.elementId === elementId &&
            selectedTableElement.type === 'column' &&
            selectedTableElement.id === columnId) {
            setSelectedTableElement(null);
          }

          return;
        }
      }
    }
  };

  // Delete table row
  const deleteTableRow = (elementId: string, rowId: string) => {
    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    // Find the element
    for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const element = row.elements.find(el => el.id === elementId);

        if (element && element.type === 'table' && Array.isArray(element.values) && element.values[0]?.rows) {
          const tableData = element.values[0];

          // Make sure we don't delete the last row
          if (tableData.rows.length <= 1) {
            return;
          }

          // Filter out the row
          const filteredRows = tableData.rows.filter(tableRow => tableRow.id !== rowId);

          // Update the table data
          element.values[0] = {
            ...tableData,
            rows: filteredRows
          };

          setTemplate(updatedTemplate);
          addHistoryEntry(updatedTemplate);

          // Clear selection if the deleted row was selected
          if (selectedTableElement &&
            selectedTableElement.elementId === elementId &&
            selectedTableElement.type === 'row' &&
            selectedTableElement.id === rowId) {
            setSelectedTableElement(null);
          }

          return;
        }
      }
    }
  };

  // Cut selected element to clipboard
  const cutElement = () => {
    if (!selectedElement || !('id' in selectedElement)) {
      return; // Only template elements can be cut (not rows or columns)
    }

    // Find the element's row and column
    let foundRowId = -1;
    let foundColumnId = -1;
    let foundElement: TemplateElement | null = null;

    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    // Find the element's location
    outerLoop: for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const elementIndex = row.elements.findIndex(element =>
          'id' in selectedElement && element.id === selectedElement.id);

        if (elementIndex !== -1) {
          foundElement = deepCopy(row.elements[elementIndex]);
          foundRowId = row.order;
          foundColumnId = column.order;

          // Remove the element
          row.elements.splice(elementIndex, 1);

          // Recalculate order for remaining elements
          row.elements.forEach((element, idx) => {
            element.order = idx;
          });

          break outerLoop;
        }
      }
    }

    if (foundElement) {
      // Save to clipboard
      setClipboardElement(foundElement);
      setClipboardRowId(foundRowId);
      setClipboardColumnId(foundColumnId);

      // Update the template
      setTemplate(updatedTemplate);
      addHistoryEntry(updatedTemplate);
      setSelectedElement(null);
    }
  };

  // Copy selected element to clipboard
  const copyElement = () => {
    if (!selectedElement || !('id' in selectedElement)) {
      return; // Only template elements can be copied (not rows or columns)
    }

    // Find the element's row and column
    let foundRowId = -1;
    let foundColumnId = -1;
    let foundElement: TemplateElement | null = null;

    // Find the element's location
    outerLoop: for (const column of template.columns) {
      for (const row of column.rows) {
        const element = row.elements.find(element =>
          'id' in selectedElement && element.id === selectedElement.id);

        if (element) {
          foundElement = deepCopy(element);
          foundRowId = row.order;
          foundColumnId = column.order;
          break outerLoop;
        }
      }
    }

    if (foundElement) {
      // Save to clipboard without removing from template
      setClipboardElement(foundElement);
      setClipboardRowId(foundRowId);
      setClipboardColumnId(foundColumnId);
    }
  };

  // Paste element from clipboard
  const pasteElement = () => {
    if (!clipboardElement) {
      return;
    }

    // Create a deep copy to avoid mutation
    const updatedTemplate = deepCopy(template);

    // Default to the first row and column if nothing is selected
    let targetRowId = 0;
    let targetColumnId = 0;

    // If an element is selected, paste into that element's row and column
    if (selectedElement) {
      if ('id' in selectedElement) {
        // Find selected element's row and column
        outerLoop: for (const column of updatedTemplate.columns) {
          for (const row of column.rows) {
            if (row.elements.some(el => el.id === selectedElement.id)) {
              targetRowId = row.order;
              targetColumnId = column.order;
              break outerLoop;
            }
          }
        }
      } else if ('elements' in selectedElement) {
        // Selected element is a row
        outerLoop: for (const column of updatedTemplate.columns) {
          if (column.rows.some(row => row.order === selectedElement.order)) {
            targetRowId = selectedElement.order;
            targetColumnId = column.order;
            break;
          }
        }
      } else if ('rows' in selectedElement) {
        // Selected element is a column
        targetColumnId = selectedElement.order;
        if (selectedElement.rows.length > 0) {
          targetRowId = selectedElement.rows[0].order;
        }
      }
    }

    // Find the target row
    let targetColumn = updatedTemplate.columns.find(c => c.order === targetColumnId);
    if (!targetColumn && updatedTemplate.columns.length > 0) {
      targetColumn = updatedTemplate.columns[0];
      targetColumnId = targetColumn.order;
    }

    if (!targetColumn) {
      return; // No valid column found
    }

    let targetRow = targetColumn.rows.find(r => r.order === targetRowId);
    if (!targetRow && targetColumn.rows.length > 0) {
      targetRow = targetColumn.rows[0];
      targetRowId = targetRow.order;
    }

    if (!targetRow) {
      return; // No valid row found
    }

    // Create a new element based on the clipboard element
    const newElement: TemplateElement = {
      ...deepCopy(clipboardElement),
      id: generateElementId(clipboardElement.type, targetRow.elements),
      order: targetRow.elements.length
    };

    // Add slight offset if pasting to the same location
    if (targetRowId === clipboardRowId && targetColumnId === clipboardColumnId) {
      newElement.props.x = (newElement.props.x || 0) + 5;
      newElement.props.y = (newElement.props.y || 0) + 5;
    }

    // Add the element to the target row
    targetRow.elements.push(newElement);

    // Update the template
    setTemplate(updatedTemplate);
    addHistoryEntry(updatedTemplate);
    setSelectedElement(newElement);
  };

  // Add this function to your TemplateProvider component
  const duplicateElement = () => {
    if (!selectedElement || !('id' in selectedElement)) {
      return; // Only template elements can be duplicated (not rows or columns)
    }

    // First copy the element
    copyElement();

    // Then paste it right away
    pasteElement();
  };

  return (
    <TemplateContext.Provider
      value={{
        template,
        selectedElement,
        setSelectedElement,
        updateTemplateProps,
        updateElementProps,
        addElement,
        removeElement,
        moveElement,
        addRow,
        removeRow,
        addColumn,
        removeColumn,
        exportToJson,
        importFromJson,
        undoChange,
        redoChange,
        canUndo,
        canRedo,
        saveTemplate,
        loadTemplate,
        updateElementValues,
        selectedTableElement,
        setSelectedTableElement,
        updateTableColumnProps,
        updateTableRowProps,
        deleteTableColumn,
        deleteTableRow,
        cutElement,
        copyElement,
        pasteElement,
        canPaste: clipboardElement !== null,
        duplicateElement,
        updateElementTitle,
        updateColumnTitle,
        updateRowTitle
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = (): TemplateContextProps => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};