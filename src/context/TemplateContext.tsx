import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}

const TemplateContext = createContext<TemplateContextProps | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [template, setTemplate] = useState<Template>(createNewTemplate());
  const [selectedElement, setSelectedElement] = useState<TemplateElement | Row | Column | null>(null);
  const { settings } = useAppSettings();
  const { 
    addToHistory, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useTemplateHistory<Template>(template);

  // Auto-save feature
  useEffect(() => {
    if (settings.autoSave && settings.isAuthenticated) {
      const timerId = setTimeout(() => {
        saveTemplate();
      }, 30000); // Save every 30 seconds

      return () => clearTimeout(timerId);
    }
  }, [template, settings.autoSave, settings.isAuthenticated]);

  const updateTemplateProps = (props: Partial<Template['props']>) => {
    const updatedTemplate = {
      ...template,
      props: {
        ...template.props,
        ...props
      }
    };
    
    setTemplate(updatedTemplate);
    addToHistory(updatedTemplate);
  };

  const updateElementProps = (elementId: string, props: Partial<ElementProps>) => {
    const updatedTemplate = { ...template };
    
    // Find the element in the template
    for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const elementIndex = row.elements.findIndex(element => element.id === elementId);
        
        if (elementIndex !== -1) {
          row.elements[elementIndex] = {
            ...row.elements[elementIndex],
            props: {
              ...row.elements[elementIndex].props,
              ...props
            }
          };
          
          setTemplate(updatedTemplate);
          addToHistory(updatedTemplate);
          return;
        }
      }
    }
  };

  const addElement = (type: ElementType, rowId: number, columnId: number) => {
    const updatedTemplate = { ...template };
    
    const column = updatedTemplate.columns.find(c => c.order === columnId);
    if (!column) return;
    
    const row = column.rows.find(r => r.order === rowId);
    if (!row) return;
    
    const id = generateElementId(type, row.elements);
    
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
      }
    };
    
    row.elements.push(newElement);
    
    setTemplate(updatedTemplate);
    addToHistory(updatedTemplate);
    setSelectedElement(newElement);
  };

  const removeElement = (elementId: string) => {
    const updatedTemplate = { ...template };
    
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
          addToHistory(updatedTemplate);
          
          if (selectedElement && 'id' in selectedElement && selectedElement.id === elementId) {
            setSelectedElement(null);
          }
          
          return;
        }
      }
    }
  };

  const moveElement = (elementId: string, newRowId: number, newColumnId: number) => {
    const updatedTemplate = { ...template };
    let elementToMove: TemplateElement | null = null;
    
    // Find and remove the element from its current location
    outerLoop: for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const elementIndex = row.elements.findIndex(element => element.id === elementId);
        
        if (elementIndex !== -1) {
          elementToMove = row.elements[elementIndex];
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
    addToHistory(updatedTemplate);
  };

  const addRow = (columnId: number) => {
    const updatedTemplate = { ...template };
    
    const column = updatedTemplate.columns.find(c => c.order === columnId);
    if (!column) return;
    
    const newRow: Row = {
      order: column.rows.length,
      props: {
        height: 10,
        width: column.props.width,
        x: column.props.x,
        y: column.rows.length === 0 ? column.props.y : column.rows[column.rows.length - 1].props.y + 10
      },
      elements: []
    };
    
    column.rows.push(newRow);
    
    setTemplate(updatedTemplate);
    addToHistory(updatedTemplate);
    setSelectedElement(newRow);
  };

  const removeRow = (rowId: number, columnId: number) => {
    const updatedTemplate = { ...template };
    
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
    addToHistory(updatedTemplate);
    
    if (selectedElement && 'order' in selectedElement && selectedElement.order === rowId) {
      setSelectedElement(null);
    }
  };

  const addColumn = () => {
    const updatedTemplate = { ...template };
    
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
      rows: []
    };
    
    updatedTemplate.columns.push(newColumn);
    
    // Adjust width of existing columns
    updatedTemplate.columns.forEach(column => {
      column.props.width = 100 / updatedTemplate.columns.length;
    });
    
    setTemplate(updatedTemplate);
    addToHistory(updatedTemplate);
    setSelectedElement(newColumn);
  };

  const removeColumn = (columnId: number) => {
    const updatedTemplate = { ...template };
    
    const columnIndex = updatedTemplate.columns.findIndex(c => c.order === columnId);
    if (columnIndex === -1) return;
    
    updatedTemplate.columns.splice(columnIndex, 1);
    
    // Recalculate order for remaining columns and adjust width
    updatedTemplate.columns.forEach((column, idx) => {
      column.order = idx;
      column.props.width = 100 / updatedTemplate.columns.length;
    });
    
    setTemplate(updatedTemplate);
    addToHistory(updatedTemplate);
    
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
      addToHistory(parsed);
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
      // addToHistory(loadedTemplate);
      
      // For now, just log that we would load the template
      console.log('Template loaded successfully');
    } catch (error) {
      console.error('Failed to load template:', error);
      throw error;
    }
  };

  const undoChange = () => {
    const prevTemplate = undo();
    if (prevTemplate) {
      setTemplate(prevTemplate);
    }
  };

  const redoChange = () => {
    const nextTemplate = redo();
    if (nextTemplate) {
      setTemplate(nextTemplate);
    }
  };

  const updateElementValues = (elementId: string, values: any[]) => {
    const updatedTemplate = { ...template };
    
    // Find the element in the template
    for (const column of updatedTemplate.columns) {
      for (const row of column.rows) {
        const elementIndex = row.elements.findIndex(element => element.id === elementId);
        
        if (elementIndex !== -1) {
          // Update the element's values
          row.elements[elementIndex] = {
            ...row.elements[elementIndex],
            values: values
          };
          
          setTemplate(updatedTemplate);
          addToHistory(updatedTemplate);
          return;
        }
      }
    }
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
        updateElementValues
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