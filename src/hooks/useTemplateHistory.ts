import { useState, useCallback } from 'react';

export interface HistoryState<T> {
  past: T[];
  future: T[];
  present: T;
}

export const useTemplateHistory = <T>(initialPresent: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  // Add current state to history
  const addToHistory = useCallback((newPresent: T) => {
    setState(prevState => ({
      past: [...prevState.past, prevState.present],
      present: newPresent,
      future: []
    }));
  }, []);

  // Go back to the previous state
  const undo = useCallback(() => {
    if (!canUndo) return null;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);

    setState({
      past: newPast,
      present: previous,
      future: [state.present, ...state.future]
    });

    return previous;
  }, [state, canUndo]);

  // Go forward to the next state
  const redo = useCallback(() => {
    if (!canRedo) return null;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    setState({
      past: [...state.past, state.present],
      present: next,
      future: newFuture
    });

    return next;
  }, [state, canRedo]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setState({
      past: [],
      present: state.present,
      future: []
    });
  }, [state.present]);

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