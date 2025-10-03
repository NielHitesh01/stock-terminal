/**
 * Layout Storage Service
 * 
 * Manages saving and loading panel layouts to/from browser localStorage
 */

import { PanelState } from '../components/Terminal';

export interface SavedLayout {
  name: string;
  panels: PanelState[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'stock-terminal-layouts';
const DEFAULT_LAYOUT_KEY = 'stock-terminal-default-layout';

/**
 * Get all saved layouts
 */
export const listLayouts = (): SavedLayout[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error listing layouts:', error);
    return [];
  }
};

/**
 * Save a new layout or update existing
 */
export const saveLayout = (name: string, panels: PanelState[]): boolean => {
  try {
    const layouts = listLayouts();
    const existingIndex = layouts.findIndex(l => l.name === name);
    
    const layout: SavedLayout = {
      name,
      panels: panels.map(p => ({
        ...p,
        loading: false, // Don't save loading state
        error: null      // Don't save errors
      })),
      createdAt: existingIndex >= 0 ? layouts[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      layouts[existingIndex] = layout;
    } else {
      layouts.push(layout);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
    return true;
  } catch (error) {
    console.error('Error saving layout:', error);
    return false;
  }
};

/**
 * Load a layout by name
 */
export const loadLayout = (name: string): PanelState[] | null => {
  try {
    const layouts = listLayouts();
    const layout = layouts.find(l => l.name === name);
    return layout ? layout.panels : null;
  } catch (error) {
    console.error('Error loading layout:', error);
    return null;
  }
};

/**
 * Delete a layout by name
 */
export const deleteLayout = (name: string): boolean => {
  try {
    const layouts = listLayouts();
    const filtered = layouts.filter(l => l.name !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting layout:', error);
    return false;
  }
};

/**
 * Save current layout as default (auto-loads on startup)
 */
export const saveAsDefault = (panels: PanelState[]): boolean => {
  try {
    localStorage.setItem(DEFAULT_LAYOUT_KEY, JSON.stringify(panels));
    return true;
  } catch (error) {
    console.error('Error saving default layout:', error);
    return false;
  }
};

/**
 * Load default layout
 */
export const loadDefault = (): PanelState[] | null => {
  try {
    const data = localStorage.getItem(DEFAULT_LAYOUT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading default layout:', error);
    return null;
  }
};

/**
 * Clear default layout
 */
export const clearDefault = (): boolean => {
  try {
    localStorage.removeItem(DEFAULT_LAYOUT_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing default layout:', error);
    return false;
  }
};

/**
 * Export layouts as JSON file
 */
export const exportLayouts = (): void => {
  try {
    const layouts = listLayouts();
    const json = JSON.stringify(layouts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-terminal-layouts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting layouts:', error);
  }
};

/**
 * Import layouts from JSON file
 */
export const importLayouts = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (!Array.isArray(imported)) {
            console.error('Invalid layout file format');
            resolve(false);
            return;
          }
          
          const existing = listLayouts();
          const merged = [...existing];
          
          imported.forEach((layout: SavedLayout) => {
            const existingIndex = merged.findIndex(l => l.name === layout.name);
            if (existingIndex >= 0) {
              // Update existing with suffix
              layout.name = `${layout.name} (imported)`;
            }
            merged.push(layout);
          });
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          resolve(true);
        } catch (error) {
          console.error('Error parsing layout file:', error);
          resolve(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing layouts:', error);
      resolve(false);
    }
  });
};
