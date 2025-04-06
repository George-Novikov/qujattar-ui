export type Theme = 'LIGHT' | 'MEDIUM' | 'DARK';
export type ExportFormat = 'JSON' | 'ODT' | 'DOC';

export interface AppSettings {
  // UI settings
  theme: Theme;
  colorScheme: string;
  
  // Display settings
  showRulers: boolean;
  showGrid: boolean;
  showPalette: boolean;
  showTree: boolean;
  showProperties: boolean;
  zoom: number;
  
  // User preferences
  locale: string;
  defaultExportFormat: ExportFormat;
  autoSave: boolean;
  
  // User info (if logged in)
  userId?: number;
  username?: string;
  isAuthenticated: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'LIGHT',
  colorScheme: '#4C9AFF',
  
  showRulers: true,
  showGrid: true,
  showPalette: true,
  showTree: true,
  showProperties: true,
  zoom: 100,
  
  locale: 'en-US',
  defaultExportFormat: 'JSON',
  autoSave: true,
  
  isAuthenticated: false
};

export const COLOR_SCHEMES = [
  '#4C9AFF', // Blue
  '#6FCF97', // Green
  '#F2994A', // Orange
  '#BB87FC', // Purple
  '#F27979', // Red
  '#56CCF2', // Light Blue
  '#F2C94C', // Yellow
  '#9B51E0', // Violet
  '#EB5757', // Coral
  '#2D9CDB', // Sky Blue
  '#219653', // Emerald
  '#F2994A', // Amber
  '#828282', // Gray
  '#BDBDBD', // Silver
  '#E0E0E0', // Light Gray
  '#FFD166', // Gold
  '#06D6A0', // Mint
  '#EF476F', // Pink
  '#118AB2', // Teal
  '#073B4C'  // Navy
];