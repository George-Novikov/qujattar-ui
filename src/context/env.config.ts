/**
 * Environment configuration
 * 
 * This file centralizes all environment variable access and provides
 * type-safe configuration with defaults.
 * 
 * Vite exposes environment variables on the import.meta.env object:
 * https://vitejs.dev/guide/env-and-mode.html
 * 
 * Variables must be prefixed with VITE_ to be exposed to the client.
 */

interface AppConfig {
    // API configuration
    apiUrl: string;
    apiTimeout: number;
    
    // Feature flags
    features: {
      enableFeatureA: boolean;
      enableFeatureB: boolean;
    };
    
    // Application settings
    app: {
      name: string;
      version: string;
      environment: 'development' | 'test' | 'production';
      debug: boolean;
    };
    
    // Authentication settings
    auth: {
      tokenStorageKey: string;
      refreshTokenStorageKey: string;
    };
  }
  
  /**
   * Parse a boolean environment variable
   */
  const parseBooleanEnv = (value: string | boolean | undefined, defaultValue: boolean): boolean => {
    if (typeof value === 'boolean') return value;
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
  };
  
  /**
   * Parse a numeric environment variable
   */
  const parseNumberEnv = (value: string | number | undefined, defaultValue: number): number => {
    if (typeof value === 'number') return value;
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  };
  
  /**
   * Build configuration from environment variables with sensible defaults
   */
  export const config: AppConfig = {
    apiUrl: import.meta.env.VITE_API_URL || '/api',
    apiTimeout: parseNumberEnv(import.meta.env.VITE_API_TIMEOUT, 30000),
    
    features: {
      enableFeatureA: parseBooleanEnv(import.meta.env.VITE_ENABLE_FEATURE_A, false),
      enableFeatureB: parseBooleanEnv(import.meta.env.VITE_ENABLE_FEATURE_B, false),
    },
    
    app: {
      name: import.meta.env.VITE_APP_NAME || 'React TypeScript App',
      version: import.meta.env.VITE_APP_VERSION || '0.1.0',
      environment: (import.meta.env.MODE as 'development' | 'test' | 'production') || 'development',
      debug: import.meta.env.DEV || false,
    },
    
    auth: {
      tokenStorageKey: 'auth_token',
      refreshTokenStorageKey: 'refresh_token',
    },
  };
  
  export default config;