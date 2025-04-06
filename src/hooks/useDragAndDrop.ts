import { useState, useRef, useEffect } from 'react';
import { ElementType } from '../models/Template';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  elementType?: ElementType;
  elementId?: string;
  startPosition: Position;
  currentPosition: Position;
}

interface DropResult {
  dropped: boolean;
  x: number;
  y: number;
  rowId?: number;
  columnId?: number;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 }
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Start dragging a new element from the palette
  const startNewElementDrag = (elementType: ElementType, event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    
    setDragState({
      isDragging: true,
      elementType,
      startPosition: { x: clientX, y: clientY },
      currentPosition: { x: clientX, y: clientY }
    });
  };

  // Start dragging an existing element
  const startElementDrag = (elementId: string, event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    
    setDragState({
      isDragging: true,
      elementId,
      startPosition: { x: clientX, y: clientY },
      currentPosition: { x: clientX, y: clientY }
    });
  };
  
  // Update the position while dragging
  const updateDragPosition = (event: MouseEvent) => {
    if (!dragState.isDragging) return;
    
    const { clientX, clientY } = event;
    
    setDragState(prev => ({
      ...prev,
      currentPosition: { x: clientX, y: clientY }
    }));
  };
  
  // End the dragging operation
  const endDrag = (): DropResult => {
    const result: DropResult = {
      dropped: false,
      x: dragState.currentPosition.x,
      y: dragState.currentPosition.y
    };
    
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // Check if the drop position is inside the canvas
      if (
        dragState.currentPosition.x >= canvasRect.left &&
        dragState.currentPosition.x <= canvasRect.right &&
        dragState.currentPosition.y >= canvasRect.top &&
        dragState.currentPosition.y <= canvasRect.bottom
      ) {
        result.dropped = true;
        
        // Calculate position relative to canvas
        result.x = ((dragState.currentPosition.x - canvasRect.left) / canvasRect.width) * 100;
        result.y = ((dragState.currentPosition.y - canvasRect.top) / canvasRect.height) * 100;
        
        // Find the row and column at the drop position (this is a placeholder, actual implementation would depend on how rows and columns are rendered)
        // Simplified example:
        result.rowId = 0; // Default to first row
        result.columnId = 0; // Default to first column
      }
    }
    
    // Reset drag state
    setDragState({
      isDragging: false,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 }
    });
    
    return result;
  };
  
  // Set up event listeners for drag operations
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dragState.isDragging) {
        updateDragPosition(event);
      }
    };
    
    const handleMouseUp = () => {
      if (dragState.isDragging) {
        endDrag();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging]);
  
  return {
    dragState,
    canvasRef,
    startNewElementDrag,
    startElementDrag,
    endDrag
  };
};