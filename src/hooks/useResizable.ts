// src/hooks/useResizable.ts
import { useState, useRef, useEffect } from 'react';

export type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export const useResizable = (initialSize: Size, initialPosition: Position, onResize?: (size: Size, position: Position) => void) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Update state when props change
  useEffect(() => {
    if (!isResizing) {
      setSize(initialSize);
      setPosition(initialPosition);
    }
  }, [initialSize, initialPosition, isResizing]);

  const startResize = (direction: ResizeDirection, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = position.x;
    const startPosY = position.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      // Update based on resize direction
      switch (direction) {
        case 'right':
          newWidth = Math.max(10, startWidth + deltaX * 0.5);
          break;
        case 'left':
          newWidth = Math.max(10, startWidth - deltaX * 0.5);
          newX = startPosX + deltaX * 0.25;
          break;
        case 'bottom':
          newHeight = Math.max(10, startHeight + deltaY * 0.5);
          break;
        case 'top':
          newHeight = Math.max(10, startHeight - deltaY * 0.5);
          newY = startPosY + deltaY * 0.25;
          break;
        case 'topLeft':
          newWidth = Math.max(10, startWidth - deltaX * 0.5);
          newHeight = Math.max(10, startHeight - deltaY * 0.5);
          newX = startPosX + deltaX * 0.25;
          newY = startPosY + deltaY * 0.25;
          break;
        case 'topRight':
          newWidth = Math.max(10, startWidth + deltaX * 0.5);
          newHeight = Math.max(10, startHeight - deltaY * 0.5);
          newY = startPosY + deltaY * 0.25;
          break;
        case 'bottomLeft':
          newWidth = Math.max(10, startWidth - deltaX * 0.5);
          newHeight = Math.max(10, startHeight + deltaY * 0.5);
          newX = startPosX + deltaX * 0.25;
          break;
        case 'bottomRight':
          newWidth = Math.max(10, startWidth + deltaX * 0.5);
          newHeight = Math.max(10, startHeight + deltaY * 0.5);
          break;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
      
      if (onResize) {
        onResize({ width: newWidth, height: newHeight }, { x: newX, y: newY });
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    size,
    position,
    isResizing,
    elementRef,
    startResize
  };
};