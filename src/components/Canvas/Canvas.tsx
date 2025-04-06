import React, { useRef, useEffect, useState } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { ElementType, PaperFormat } from '../../models/Template';
import ElementsRenderer from './ElementsRenderer';
import './Canvas.css';

const Canvas: React.FC = () => {
  const { template, addElement } = useTemplate();
  const { settings } = useAppSettings();
  const { dragState, canvasRef, endDrag } = useDragAndDrop();
  const [paperSize, setPaperSize] = useState({ width: 595, height: 842 }); // Default A4 size in pixels (72dpi)
  
  // Calculate paper size based on format and orientation
  useEffect(() => {
    let width = 0;
    let height = 0;
    
    // Paper sizes in pixels (72dpi)
    switch (template.props.format) {
      case 'A1':
        width = 1684;
        height = 2384;
        break;
      case 'A2':
        width = 1191;
        height = 1684;
        break;
      case 'A3':
        width = 842;
        height = 1191;
        break;
      case 'A4':
        width = 595;
        height = 842;
        break;
      case 'A5':
        width = 420;
        height = 595;
        break;
      case 'A6':
        width = 298;
        height = 420;
        break;
      default:
        width = 595;
        height = 842;
    }
    
    // Swap dimensions for landscape orientation
    if (template.props.orientation === 'LANDSCAPE') {
      setPaperSize({ width: height, height: width });
    } else {
      setPaperSize({ width, height });
    }
  }, [template.props.format, template.props.orientation]);
  
  // Handle element drop on canvas
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const elementType = event.dataTransfer.getData('elementType') as ElementType;
    if (!elementType) return;
    
    // Get drop position relative to canvas
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = ((event.clientX - canvasRect.left) / canvasRect.width) * 100;
    const y = ((event.clientY - canvasRect.top) / canvasRect.height) * 100;
    
    // Find the row and column closest to the drop position
    // For simplicity, always add to the first column and row for now
    // In a real implementation, you would determine the actual row and column based on position
    addElement(elementType, 0, 0);
  };
  
  // Handle drag over to allow dropping
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  // Handle mouse up to finish dragging elements from palette
  const handleMouseUp = () => {
    if (dragState.isDragging && dragState.elementType) {
      const dropResult = endDrag();
      
      if (dropResult.dropped) {
        // For simplicity, always add to the first column and row for now
        addElement(dragState.elementType, 0, 0);
      }
    }
  };
  
  return (
    <div className="canvas-container">
      <div
        ref={canvasRef}
        className={`canvas ${settings.showGrid ? 'canvas-grid' : ''}`}
        style={{
          width: `${paperSize.width}px`,
          height: `${paperSize.height}px`,
          backgroundColor: template.props.background || '#FFFFFF'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseUp={handleMouseUp}
      >
        {settings.showRulers && (
          <>
            <div className="canvas-ruler-horizontal"></div>
            <div className="canvas-ruler-vertical"></div>
          </>
        )}
        
        <ElementsRenderer />
      </div>
    </div>
  );
};

export default Canvas;