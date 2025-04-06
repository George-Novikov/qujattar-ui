import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, DEFAULT_SETTINGS, Theme, ExportFormat } from '../models/AppSettings';

interface AppSettingsContextProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setTheme: (theme: Theme) => void;
  setColorScheme: (color: string) => void;
  toggleView: (view: 'rulers' | 'grid' | 'palette' | 'tree' | 'properties') => void;
  setZoom: (zoom: number) => void;
  login: (userId: number, username: string) => void;
  logout: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextProps | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const setTheme = (theme: Theme) => {
    updateSettings({ theme });
  };

  const setColorScheme = (colorScheme: string) => {
    updateSettings({ colorScheme });
  };

  const toggleView = (view: 'rulers' | 'grid' | 'palette' | 'tree' | 'properties') => {
    switch (view) {
      case 'rulers':
        updateSettings({ showRulers: !settings.showRulers });
        break;
      case 'grid':
        updateSettings({ showGrid: !settings.showGrid });
        break;
      case 'palette':
        updateSettings({ showPalette: !settings.showPalette });
        break;
      case 'tree':
        updateSettings({ showTree: !settings.showTree });
        break;
      case 'properties':
        updateSettings({ showProperties: !settings.showProperties });
        break;
    }
  };

  const setZoom = (zoom: number) => {
    updateSettings({ zoom });
  };

  const login = (userId: number, username: string) => {
    updateSettings({
      userId,
      username,
      isAuthenticated: true
    });
  };

  const logout = () => {
    updateSettings({
      userId: undefined,
      username: undefined,
      isAuthenticated: false
    });
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setTheme,
        setColorScheme,
        toggleView,
        setZoom,
        login,
        logout
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextProps => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};