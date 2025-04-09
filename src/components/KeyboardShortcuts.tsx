import React, { useEffect } from 'react';
import { useTemplate } from '../context/TemplateContext';

/**
 * Component to handle all keyboard shortcuts in the application.
 * This component doesn't render anything visible,
 * but handles global keyboard shortcuts.
 */
const KeyboardShortcuts: React.FC = () => {
  const { 
    undoChange, 
    redoChange, 
    canUndo, 
    canRedo,
    cutElement,
    copyElement,
    pasteElement,
    canPaste,
    selectedElement,
    removeElement,
    duplicateElement
  } = useTemplate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle shortcuts when user is typing in an input
      if (
        event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      // Handle Ctrl+Z for undo
      if (event.ctrlKey && event.key.toLowerCase() === 'z' && !event.shiftKey && canUndo) {
        event.preventDefault();
        undoChange();
        return;
      }
      
      // Handle Ctrl+Y for redo
      if (event.ctrlKey && event.key.toLowerCase() === 'y' && canRedo) {
        event.preventDefault();
        redoChange();
        return;
      }
      
      // Alternative: Handle Ctrl+Shift+Z for redo
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z' && canRedo) {
        event.preventDefault();
        redoChange();
        return;
      }

      // Handle Ctrl+X for cut
      if (event.ctrlKey && event.key.toLowerCase() === 'x' && selectedElement && 'id' in selectedElement) {
        event.preventDefault();
        cutElement();
        return;
      }

      // Handle Ctrl+C for copy
      if (event.ctrlKey && event.key.toLowerCase() === 'c' && selectedElement && 'id' in selectedElement) {
        event.preventDefault();
        copyElement();
        return;
      }

      // Handle Ctrl+V for paste
      if (event.ctrlKey && event.key.toLowerCase() === 'v' && canPaste) {
        event.preventDefault();
        pasteElement();
        return;
      }
      
      // Handle Ctrl+D for duplicate
      if (event.ctrlKey && event.key.toLowerCase() === 'd' && selectedElement && 'id' in selectedElement) {
        event.preventDefault();
        duplicateElement();
        return;
      }

      // Handle Delete key
      if (event.key === 'Delete' && selectedElement && 'id' in selectedElement) {
        event.preventDefault();
        removeElement(selectedElement.id);
        return;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    undoChange, 
    redoChange, 
    canUndo, 
    canRedo, 
    cutElement, 
    copyElement, 
    pasteElement, 
    canPaste, 
    selectedElement, 
    removeElement,
    duplicateElement
  ]);

  // This component doesn't render anything
  return null;
};

export default KeyboardShortcuts;