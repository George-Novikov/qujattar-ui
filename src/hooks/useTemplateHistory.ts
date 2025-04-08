import { useState, useCallback, useRef } from 'react';

export interface HistoryState<T> {
  past: T[];
  future: T[];
  present: T;
}

/**
 * Custom hook for managing history state with undo/redo functionality
 * 
 * @param initialPresent The initial state
 * @returns History management functions and state
 */
export const useTemplateHistory = <T>(initialPresent: T) => {
  // Use state to track history
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: deepClone(initialPresent),
    future: []
  });

  // Keep a reference to the current state for comparison
  const stateRef = useRef(state);
  stateRef.current = state;

  // Determine if undo/redo are available
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  /**
   * Creates a deep clone of an object to ensure we have separate instances
   */
  function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Checks if two objects are deeply equal by comparing their JSON strings
   */
  function areEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Adds current state to history
   */
  const addToHistory = useCallback((newPresent: T) => {
    // Skip if the new state is identical to current state
    if (areEqual(newPresent, stateRef.current.present)) {
      return;
    }

    // Create a deep clone to ensure we don't keep references
    const clonedNew = deepClone(newPresent);
    
    setState(prevState => ({
      past: [...prevState.past, deepClone(prevState.present)],
      present: clonedNew,
      future: []
    }));
  }, []);

  /**
   * Go back to the previous state
   */
  const undo = useCallback(() => {
    if (!canUndo) return null;

    // Get the most recent past state
    const previous = stateRef.current.past[stateRef.current.past.length - 1];
    const clonedPrevious = deepClone(previous);
    
    // Create a deep clone of the current present to store in future
    const clonedPresent = deepClone(stateRef.current.present);
    
    // Remove the last item from past
    const newPast = stateRef.current.past.slice(0, stateRef.current.past.length - 1);

    setState({
      past: newPast,
      present: clonedPrevious,
      future: [clonedPresent, ...stateRef.current.future]
    });

    return clonedPrevious;
  }, [canUndo]);

  /**
   * Go forward to the next state
   */
  const redo = useCallback(() => {
    if (!canRedo) return null;

    // Get the first future state
    const next = stateRef.current.future[0];
    const clonedNext = deepClone(next);
    
    // Create a deep clone of the current present to store in past
    const clonedPresent = deepClone(stateRef.current.present);
    
    // Remove the first item from future
    const newFuture = stateRef.current.future.slice(1);

    setState({
      past: [...stateRef.current.past, clonedPresent],
      present: clonedNext,
      future: newFuture
    });

    return clonedNext;
  }, [canRedo]);

  /**
   * Clear all history but keep the current state
   */
  const clearHistory = useCallback(() => {
    setState({
      past: [],
      present: deepClone(stateRef.current.present),
      future: []
    });
  }, []);

  return {
    state: state.present,
    addToHistory,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo
  };
};