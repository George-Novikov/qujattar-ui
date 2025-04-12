import React, { useState, useEffect } from 'react';
import { TemplateElement, ElementProps, Row, Column } from '../../models/Template';
import { useTemplate } from '../../context/TemplateContext';
import ColorPicker from '../UI/ColorPicker';
import Dropdown from '../UI/Dropdown';
import Slider from '../UI/Slider';
import Button from '../UI/Button';
import './Properties.css';

// Import the TableColumnProperties and TableRowProperties components
import { TableColumnProperties, TableRowProperties } from './TablePropeties';

interface ElementPropertiesProps {
  element: TemplateElement | Row | Column;
}

const ElementProperties: React.FC<ElementPropertiesProps> = ({ element }) => {
  const { 
    updateElementProps, 
    updateElementValues,
    updateElementTitle,
    updateColumnTitle,
    updateRowTitle
  } = useTemplate();
  
  // State for controlled inputs
  const [inputValues, setInputValues] = useState({
    title: element.title || '',
    x: element.props.x || 0,
    y: element.props.y || 0,
    width: element.props.width || 0,
    height: element.props.height || 0,
    layer: element.props.layer || 0,
    innerMargin: element.props.innerMargin || 0,
    outerMargin: element.props.outerMargin || 0,
    cornerRadius: element.props.cornerRadius || 0,
    fontSize: element.props.fontSize || 16,
    src: element.props.src || '',
    format: element.props.format || 'yyyy-MM-dd',
    shadow: element.props.shadow || '',
    glow: element.props.glow || ''
  });
  
  // Check if element is a template element or structural element (row/column)
  const isTemplateElement = 'id' in element;
  const isColumn = 'rows' in element;
  const isRow = 'elements' in element && !isColumn && !isTemplateElement;
  const elementType = isTemplateElement ? element.type : (isColumn ? 'column' : 'row');
  
  // Update local state when element changes
  useEffect(() => {
    setInputValues({
      title: element.title || '',
      x: element.props.x || 0,
      y: element.props.y || 0,
      width: element.props.width || 0,
      height: element.props.height || 0,
      layer: element.props.layer || 0,
      innerMargin: element.props.innerMargin || 0,
      outerMargin: element.props.outerMargin || 0,
      cornerRadius: element.props.cornerRadius || 0,
      fontSize: element.props.fontSize || 16,
      src: element.props.src || '',
      format: element.props.format || 'yyyy-MM-dd',
      shadow: element.props.shadow || '',
      glow: element.props.glow || ''
    });
  }, [element]);
  
  // Helper function to update properties
  const handleUpdateProps = (props: Partial<ElementProps>) => {
    if (isTemplateElement && 'id' in element) {
      updateElementProps(element.id, props);
    }
    // For rows and columns, updates are handled separately through specialized functions
  };
  
  // Handle title update
  const handleUpdateTitle = (title: string) => {
    if (isTemplateElement && 'id' in element) {
      updateElementTitle(element.id, title);
    } else if (isColumn && 'order' in element) {
      updateColumnTitle(element.order, title);
    } else if (isRow && 'order' in element) {
      // Find the column this row belongs to
      for (const column of document.querySelectorAll('.template-column')) {
        const columnId = parseInt(column.getAttribute('data-column-id') || '0');
        if (column.contains(document.querySelector(`[data-row-id="${element.order}"]`))) {
          updateRowTitle(columnId, element.order, title);
          break;
        }
      }
    }
  };
  
  // Handle controlled input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, property: string) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setInputValues(prev => ({ ...prev, [property]: value }));
  };
  
  // Submit changes when input loses focus
  const handleInputBlur = (property: string) => {
    if (property === 'title') {
      handleUpdateTitle(inputValues.title);
    } else {
      handleUpdateProps({ [property]: inputValues[property] });
    }
  };
  
  // Handle controlled checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, property: string) => {
    handleUpdateProps({ [property]: e.target.checked });
  };
  
  // Get element label for display
  const getElementLabel = () => {
    if (isTemplateElement) {
      return `${element.type.charAt(0).toUpperCase() + element.type.slice(1)} ${element.id.split('-')[1]}`;
    } else if (isColumn) {
      return `Column ${(element as Column).order + 1}`;
    } else {
      return `Row ${(element as Row).order + 1}`;
    }
  };
  
  return (
    <div className="element-properties">
      <div className="properties-section">
        <h3 className="properties-section-title">{getElementLabel()}</h3>
      </div>
      
      {/* Title Field */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Element Title</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Title</label>
            <input
              type="text"
              value={inputValues.title}
              onChange={(e) => handleInputChange(e, 'title')}
              onBlur={() => handleInputBlur('title')}
              placeholder={getElementLabel()}
            />
          </div>
        </div>
      </div>
      
      {/* Position and Size */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Position & Size</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>X (%)</label>
            <input
              type="number"
              value={inputValues.x}
              onChange={(e) => handleInputChange(e, 'x')}
              onBlur={() => handleInputBlur('x')}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          
          <div className="properties-field">
            <label>Y (%)</label>
            <input
              type="number"
              value={inputValues.y}
              onChange={(e) => handleInputChange(e, 'y')}
              onBlur={() => handleInputBlur('y')}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Width (%)</label>
            <input
              type="number"
              value={inputValues.width}
              onChange={(e) => handleInputChange(e, 'width')}
              onBlur={() => handleInputBlur('width')}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          
          <div className="properties-field">
            <label>Height (%)</label>
            <input
              type="number"
              value={inputValues.height}
              onChange={(e) => handleInputChange(e, 'height')}
              onBlur={() => handleInputBlur('height')}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Layer</label>
            <input
              type="number"
              value={inputValues.layer}
              onChange={(e) => handleInputChange(e, 'layer')}
              onBlur={() => handleInputBlur('layer')}
              min="0"
              max="100"
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
              label="Color"
              value={element.props.color || '#000000'}
              onChange={(color) => handleUpdateProps({ color })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <ColorPicker
              label="Background"
              value={element.props.background || 'transparent'}
              onChange={(background) => handleUpdateProps({ background })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Opacity (%)</label>
            <Slider
              min={0}
              max={100}
              value={element.props.opacity || 100}
              onChange={(opacity) => handleUpdateProps({ opacity })}
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Inner margin (%)</label>
            <input
              type="number"
              value={inputValues.innerMargin}
              onChange={(e) => handleInputChange(e, 'innerMargin')}
              onBlur={() => handleInputBlur('innerMargin')}
              min="0"
              max="50"
              step="0.1"
            />
          </div>
          
          <div className="properties-field">
            <label>Outer margin (%)</label>
            <input
              type="number"
              value={inputValues.outerMargin}
              onChange={(e) => handleInputChange(e, 'outerMargin')}
              onBlur={() => handleInputBlur('outerMargin')}
              min="0"
              max="50"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Corner radius (%)</label>
            <input
              type="number"
              value={inputValues.cornerRadius}
              onChange={(e) => handleInputChange(e, 'cornerRadius')}
              onBlur={() => handleInputBlur('cornerRadius')}
              min="0"
              max="50"
              step="0.1"
            />
          </div>
        </div>
      </div>
      
      {/* Text formatting - only for text elements */}
      {isTemplateElement && ['text', 'list', 'table', 'url', 'codeblock'].includes(element.type) && (
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
                value={element.props.horizontalAlignment || 'left'}
                onChange={(value) => handleUpdateProps({ horizontalAlignment: value as 'left' | 'center' | 'right' })}
              />
            </div>
          </div>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>Vertical Alignment</label>
              <Dropdown
                options={[
                  { value: 'top', label: 'Top' },
                  { value: 'center', label: 'Center' },
                  { value: 'bottom', label: 'Bottom' }
                ]}
                value={element.props.verticalAlignment || 'top'}
                onChange={(value) => handleUpdateProps({ verticalAlignment: value as 'top' | 'center' | 'bottom' })}
              />
            </div>
          </div>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>Font</label>
              <Dropdown
                options={[
                  { value: 'Roboto', label: 'Roboto' },
                  { value: 'Arial', label: 'Arial' },
                  { value: 'Times New Roman', label: 'Times New Roman' },
                  { value: 'Courier New', label: 'Courier New' },
                  { value: 'Georgia', label: 'Georgia' }
                ]}
                value={element.props.font || 'Roboto'}
                onChange={(value) => handleUpdateProps({ font: value })}
              />
            </div>
          </div>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>Font Size</label>
              <input
                type="number"
                value={inputValues.fontSize}
                onChange={(e) => handleInputChange(e, 'fontSize')}
                onBlur={() => handleInputBlur('fontSize')}
                min="8"
                max="72"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Special properties based on element type */}
      {isTemplateElement && element.type === 'image' && (
        <div className="properties-section">
          <h4 className="properties-section-subtitle">Image Properties</h4>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>Source URL</label>
              <input
                type="text"
                value={inputValues.src}
                onChange={(e) => handleInputChange(e, 'src')}
                onBlur={() => handleInputBlur('src')}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
      )}
      
      {isTemplateElement && element.type === 'url' && (
        <div className="properties-section">
          <h4 className="properties-section-subtitle">URL Properties</h4>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>URL</label>
              <input
                type="text"
                value={inputValues.src}
                onChange={(e) => handleInputChange(e, 'src')}
                onBlur={() => handleInputBlur('src')}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
      )}
      
      {isTemplateElement && element.type === 'codeblock' && (
        <div className="properties-section">
          <h4 className="properties-section-subtitle">Code Block Properties</h4>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>Language</label>
              <Dropdown
                options={[
                  { value: 'JavaScript', label: 'JavaScript' },
                  { value: 'Python', label: 'Python' },
                  { value: 'Java', label: 'Java' },
                  { value: 'C#', label: 'C#' },
                  { value: 'HTML', label: 'HTML' },
                  { value: 'CSS', label: 'CSS' }
                ]}
                value={element.props.language || 'JavaScript'}
                onChange={(value) => handleUpdateProps({ language: value })}
              />
            </div>
          </div>
        </div>
      )}
      
      {isTemplateElement && element.type === 'datetime' && (
        <div className="properties-section">
          <h4 className="properties-section-subtitle">Date/Time Properties</h4>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>Format</label>
              <input
                type="text"
                value={inputValues.format}
                onChange={(e) => handleInputChange(e, 'format')}
                onBlur={() => handleInputBlur('format')}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          
          <div className="properties-row">
            <div className="properties-field">
              <label>Show Date</label>
              <input
                type="checkbox"
                checked={element.props.date !== false}
                onChange={(e) => handleCheckboxChange(e, 'date')}
              />
            </div>
            
            <div className="properties-field">
              <label>Show Time</label>
              <input
                type="checkbox"
                checked={element.props.time === true}
                onChange={(e) => handleCheckboxChange(e, 'time')}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Effects */}
      <div className="properties-section">
        <h4 className="properties-section-subtitle">Effects</h4>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Shadow</label>
            <input
              type="text"
              value={inputValues.shadow}
              onChange={(e) => handleInputChange(e, 'shadow')}
              onBlur={() => handleInputBlur('shadow')}
              onFocus={(e) => e.target.select()}
              placeholder="size;color;intensity"
            />
          </div>
        </div>
        
        <div className="properties-row">
          <div className="properties-field">
            <label>Glow</label>
            <input
              type="text"
              value={inputValues.glow}
              onChange={(e) => handleInputChange(e, 'glow')}
              onBlur={() => handleInputBlur('glow')}
              onFocus={(e) => e.target.select()}
              placeholder="size;color;intensity"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Export all components
export { TableColumnProperties, TableRowProperties };
export default ElementProperties;