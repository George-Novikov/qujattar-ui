import React, { useEffect } from 'react';
import { useTemplate } from '../context/TemplateContext';

const KeyboardShortcuts: React.FC = () => {
  const { undoChange, redoChange, canUndo, canRedo } = useTemplate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Ctrl+Z for undo
      if (event.ctrlKey && event.key === 'z' && !event.shiftKey && canUndo) {
        event.preventDefault();
        undoChange();
      }
      
      // Handle Ctrl+Y for redo
      if (event.ctrlKey && event.key === 'y' && canRedo) {
        event.preventDefault();
        redoChange();
      }
      
      // Alternative: Handle Ctrl+Shift+Z for redo (common in many applications)
      if (event.ctrlKey && event.shiftKey && event.key === 'z' && canRedo) {
        event.preventDefault();
        redoChange();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undoChange, redoChange, canUndo, canRedo]);

  // This component doesn't render anything
  return null;
};

export default KeyboardShortcuts;