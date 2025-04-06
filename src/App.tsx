import React, { useEffect } from 'react';
import { TemplateProvider } from './context/TemplateContext';
import { AppSettingsProvider, useAppSettings } from './context/AppSettingsContext';
import Header from './components/Header/Header';
import Canvas from './components/Canvas/Canvas';
import Tree from './components/Tree/Tree';
import Palette from './components/Palette/Palette';
import Properties from './components/Properties/Properties';
import './App.css';

const AppContent: React.FC = () => {
  const { settings } = useAppSettings();
  
  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
    
    // Set color scheme CSS variable
    document.documentElement.style.setProperty('--color-scheme', settings.colorScheme);
    document.documentElement.style.setProperty(
      '--color-scheme-hover', 
      settings.colorScheme + 'CC' // Add transparency for hover state
    );
    document.documentElement.style.setProperty(
      '--color-scheme-active', 
      settings.colorScheme + '99' // Add more transparency for active state
    );
    document.documentElement.style.setProperty(
      '--color-scheme-transparent', 
      settings.colorScheme + '22' // Add high transparency for backgrounds
    );
  }, [settings.theme, settings.colorScheme]);
  
  return (
    <div className="app">
      <Header />
      <div className="main-container">
        {settings.showTree && <Tree />}
        <Canvas />
        {settings.showProperties && <Properties />}
      </div>
      <Palette />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppSettingsProvider>
      <TemplateProvider>
        <AppContent />
      </TemplateProvider>
    </AppSettingsProvider>
  );
};

export default App;