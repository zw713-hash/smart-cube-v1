import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_MODE_SETTINGS, PRODUCT_COLORS } from './constants';

export type ViewState = 'home' | 'model' | 'dashboard';
export type CaseMaterial = 'matte' | 'metal' | 'transparent';
export type ModeType = 'study' | 'sleep' | 'party' | 'custom';
export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'failed';

export interface ModeSettings {
  noiseThreshold: number;
  lightThreshold: number;
  brightness: number;
  whiteNoiseVolume: number;
  ledColor: string;
}

interface CubeState {
  // Navigation
  currentView: ViewState;
  setView: (view: ViewState) => void;

  // 3D Viewer State
  isExploded: boolean;
  toggleExploded: () => void;
  isGhostMode: boolean;
  toggleGhostMode: () => void;
  highlightedPart: string | null;
  setHighlightedPart: (part: string | null) => void;

  // Connectivity
  connectionStatus: ConnectionStatus;
  connectBluetooth: () => Promise<void>;
  disconnectBluetooth: () => void;
  showConnectionPopup: boolean;
  closeConnectionPopup: () => void;

  // Global Hardware Config (Physically static attributes)
  caseColor: string;
  caseMaterial: CaseMaterial;
  setCaseConfig: (color: string, material: CaseMaterial) => void;

  // Software Mode Config (Dynamic attributes)
  currentMode: ModeType;
  customModeName: string;
  modes: Record<ModeType, ModeSettings>;
  
  setMode: (mode: ModeType) => void;
  setCustomModeName: (name: string) => void;
  updateModeSettings: (settings: Partial<ModeSettings>) => void;
  resetCurrentMode: () => void;
}

export const useStore = create<CubeState>()(
  persist(
    (set, get) => ({
      currentView: 'home',
      setView: (view) => set({ currentView: view }),

      isExploded: false,
      toggleExploded: () => set((state) => ({ isExploded: !state.isExploded })),

      isGhostMode: false,
      toggleGhostMode: () => set((state) => ({ isGhostMode: !state.isGhostMode })),

      highlightedPart: null,
      setHighlightedPart: (part) => set({ highlightedPart: part }),

      connectionStatus: 'idle',
      showConnectionPopup: false,
      
      connectBluetooth: async () => {
        set({ connectionStatus: 'connecting' });
        
        // Fix: Explicitly type Promise as void to allow resolve() without arguments
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            // Simulate a random failure chance (e.g., 10% chance to fail)
            const shouldFail = Math.random() < 0.1; 
            
            if (shouldFail) {
               set({ connectionStatus: 'failed', showConnectionPopup: true });
            } else {
               set({ connectionStatus: 'connected', showConnectionPopup: true });
            }
            resolve();
          }, 2000);
        });
      },
      disconnectBluetooth: () => set({ connectionStatus: 'idle', showConnectionPopup: false }),
      closeConnectionPopup: () => set({ showConnectionPopup: false }),

      // Hardware Defaults (Default to first product color)
      caseColor: PRODUCT_COLORS[0].hex,
      caseMaterial: 'matte',
      setCaseConfig: (color, material) => set({ caseColor: color, caseMaterial: material }),

      // Mode Defaults
      currentMode: 'study',
      customModeName: 'My Mode',
      modes: JSON.parse(JSON.stringify(DEFAULT_MODE_SETTINGS)),

      setMode: (mode) => set({ currentMode: mode }),
      
      setCustomModeName: (name) => set({ customModeName: name }),
      
      updateModeSettings: (newSettings) => set((state) => ({
        modes: {
          ...state.modes,
          [state.currentMode]: {
            ...state.modes[state.currentMode],
            ...newSettings
          }
        }
      })),

      resetCurrentMode: () => set((state) => ({
        modes: {
          ...state.modes,
          [state.currentMode]: { ...DEFAULT_MODE_SETTINGS[state.currentMode] }
        }
      })),
    }),
    {
      name: 'smart-focus-cube-storage-v2',
      partialize: (state) => ({ 
        caseColor: state.caseColor,
        caseMaterial: state.caseMaterial,
        modes: state.modes,
        customModeName: state.customModeName,
        currentMode: state.currentMode
      }),
    }
  )
);