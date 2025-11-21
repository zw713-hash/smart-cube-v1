import { Zap, Cpu, Battery, Speaker, Layers, Settings } from 'lucide-react';
import { ModeType, ModeSettings } from './store';

// ========================================================================
// 🟢 PART 1: DEFAULT MODE SETTINGS
// Change the numbers below to adjust the default behavior of the Cube.
// ========================================================================

export const DEFAULT_MODE_SETTINGS: Record<ModeType, ModeSettings> = {
  study: {
    noiseThreshold: 60,       // dB level that triggers noise cancellation
    lightThreshold: 400,      // Ambient light target (Lux)
    brightness: 80,           // LED Brightness (%)
    whiteNoiseVolume: 20,     // Volume (%)
    ledColor: '#00eaff',      // Cyan
  },
  sleep: {
    noiseThreshold: 30,
    lightThreshold: 100,
    brightness: 20,
    whiteNoiseVolume: 60,
    ledColor: '#ff4d00',      // Warm Orange/Red
  },
  party: {
    noiseThreshold: 90,
    lightThreshold: 800,
    brightness: 100,
    whiteNoiseVolume: 0,
    ledColor: '#d900ff',      // Purple/Pink
  },
  custom: {
    noiseThreshold: 50,
    lightThreshold: 300,
    brightness: 50,
    whiteNoiseVolume: 0,
    ledColor: '#00ff00',      // Green default
  }
};

// ========================================================================
// 🔵 PART 2: COMPONENT LIST (BOM)
// ========================================================================

export const COMPONENT_MANIFEST = [
  { 
    id: 'shell_top', 
    name: 'Top Shell', 
    description: 'Outer housing, top section. PC/ABS Blend.', 
    mesh: 'ShellTopMesh', 
    colorEditable: true, 
    icon: Layers 
  },
  { 
    id: 'led_strip', 
    name: 'LED Strip', 
    description: 'WS2812B LEDs for lighting effects.', 
    mesh: 'LEDStripMesh', 
    colorEditable: true, 
    icon: Zap 
  },
  { 
    id: 'pcb_main', 
    name: 'Main PCB', 
    description: 'ESP32 Core + Power Management.', 
    mesh: 'PCBMesh', 
    colorEditable: false, 
    icon: Cpu 
  },
  { 
    id: 'battery_pack', 
    name: 'Battery Pack', 
    description: '1200mAh LiPo Cell.', 
    mesh: 'BatteryMesh', 
    colorEditable: false, 
    icon: Battery 
  },
  { 
    id: 'speaker_unit', 
    name: 'Speaker Unit', 
    description: '3W 4Ω Full Range Driver.', 
    mesh: 'SpeakerMesh', 
    colorEditable: false, 
    icon: Speaker 
  },
  { 
    id: 'shell_bottom', 
    name: 'Bottom Shell', 
    description: 'Base housing with non-slip pad.', 
    mesh: 'ShellBottomMesh', 
    colorEditable: true, 
    icon: Layers 
  },
  {
    id: 'sensors',
    name: 'Sensors Array',
    description: 'Mic Array (x2) + Ambient Light.',
    mesh: 'SensorMesh',
    colorEditable: false,
    icon: Settings
  }
];

// ========================================================================
// 🟣 PART 3: PRODUCT COLORS
// Official color options for the Smart Focus Cube
// ========================================================================

export const PRODUCT_COLORS = [
  { name: 'Arctic White', hex: '#FFFFFF' },
  { name: 'Midnight Black', hex: '#111111' },
  { name: 'Electric Blue', hex: '#0066CC' },
  { name: 'Ruby Red', hex: '#CC0033' },
  { name: 'Forest Green', hex: '#106636' },
];