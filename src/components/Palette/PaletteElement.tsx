import React from 'react';
import { ElementType } from '../../models/Template';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import './Palette.css';

interface PaletteElementProps {
  type: ElementType;
  icon: string;
  label: string;
}

const PaletteElement: React.FC<PaletteElementProps> = ({ type, icon, label }) => {
  const { startNewElementDrag } = useDragAndDrop();
  
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('elementType', type);
    event.dataTransfer.effectAllowed = 'copy';
  };
  
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    startNewElementDrag(type, event);
  };
  
  return (
    <div 
      className="palette-element" 
      draggable
      onDragStart={handleDragStart}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="palette-element-icon"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <div className="palette-element-label">{label}</div>
    </div>
  );
};

export default PaletteElement;