import React, { ReactNode } from 'react';
import KeyboardShortcuts from './KeyboardShortcuts';

interface AppShortcutsWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that adds keyboard shortcuts functionality.
 * Can be added to any parent component to enable shortcuts.
 */
const AppShortcutsWrapper: React.FC<AppShortcutsWrapperProps> = ({ children }) => {
  return (
    <>
      <KeyboardShortcuts />
      {children}
    </>
  );
};

export default AppShortcutsWrapper;