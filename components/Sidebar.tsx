import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { ChevronRight, Bluetooth, CheckCircle2, Loader2, Palette, Zap, XCircle, Lock } from 'lucide-react';
import { COMPONENT_MANIFEST, PRODUCT_COLORS } from '../constants';

// --- Color Utility Functions ---
function hexToHsl(hex: string): { h: number, s: number, l: number } {
  if (!hex) return { h: 0, s: 0, l: 0 };
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// --- Reusable Color Control Component ---
const ColorControl = ({ 
  label, 
  color, 
  onChange, 
  icon: Icon,
  presets
}: { 
  label: string, 
  color: string, 
  onChange: (c: string) => void,
  icon?: any,
  presets?: { name: string, hex: string }[]
}) => {
  const [hue, setHue] = useState(0);
  const isDragging = useRef(false);
  
  const showCustomControls = !presets;

  // Sync local hue when external color changes (if not dragging)
  useEffect(() => {
    if (!isDragging.current && color) {
      setHue(hexToHsl(color).h);
    }
  }, [color]);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isDragging.current = true;
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    
    const currentHSL = color ? hexToHsl(color) : { h: 0, s: 100, l: 50 };
    // Maintain current Saturation/Lightness but update Hue
    const newHex = hslToHex(newHue, Math.max(currentHSL.s, 50), Math.max(currentHSL.l, 50)); 
    onChange(newHex);
  };

  const handleHueRelease = () => {
    isDragging.current = false;
  };

  if (!color) return null;

  return (
    <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
          {Icon && <Icon size={14} className="text-cyan-500" />}
          {label}
        </label>
        <span className="text-[10px] font-mono text-neutral-500 bg-black/40 px-1.5 py-0.5 rounded">{color.toUpperCase()}</span>
      </div>
      
      {/* Product Presets Grid */}
      {presets && (
        <div className="grid grid-cols-5 gap-2 mb-4">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => onChange(p.hex)}
              className={`w-full aspect-square rounded-full border-2 transition-all relative group ${
                color.toLowerCase() === p.hex.toLowerCase() ? 'border-cyan-500 scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: p.hex }}
              title={p.name}
            >
               {color.toLowerCase() === p.hex.toLowerCase() && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                 </div>
               )}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex gap-4 items-center">
        {/* Large Preview Box */}
        <div 
          className="w-16 h-16 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-white/10 shrink-0 transition-colors duration-200" 
          style={{ backgroundColor: color }}
        />
        
        {showCustomControls ? (
          <div className="flex-grow flex flex-col justify-between py-0.5 h-16">
             {/* Main Color Picker Button */}
             <div className="relative w-full">
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => onChange(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                />
                <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs py-1.5 px-3 rounded border border-white/10 transition-colors text-left flex justify-between items-center">
                  <span>Pick Specific Color</span>
                  <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                </button>
             </div>

             {/* Hue Slider */}
             <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-neutral-500 uppercase font-semibold">
                  <span>Hue</span>
                  <span>{hue}°</span>
                </div>
                <div className="relative h-3 rounded-full w-full overflow-hidden ring-1 ring-white/10">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]" />
                  <input 
                    type="range" min="0" max="360" 
                    value={hue} 
                    onChange={handleHueChange}
                    onMouseUp={handleHueRelease}
                    onTouchEnd={handleHueRelease}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize" 
                  />
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-center px-2 h-16 border border-dashed border-white/10 rounded-lg bg-white/5">
             <div className="flex items-center gap-2 text-neutral-400 mb-1">
               <Lock size={12} />
               <span className="text-xs font-medium">Official Color</span>
             </div>
             <span className="text-[10px] text-neutral-600 leading-tight">
               Custom hues disabled for this part.
             </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const highlightedPart = useStore((state) => state.highlightedPart);
  const setHighlightedPart = useStore((state) => state.setHighlightedPart);
  
  // Global Hardware Config
  const caseColor = useStore((state) => state.caseColor);
  const caseMaterial = useStore((state) => state.caseMaterial);
  const setCaseConfig = useStore((state) => state.setCaseConfig);

  // Active Mode Config (for LEDs)
  const currentMode = useStore((state) => state.currentMode);
  const modes = useStore((state) => state.modes);
  const updateModeSettings = useStore((state) => state.updateModeSettings);
  
  const activeSettings = modes?.[currentMode];

  // Connectivity State
  const connectionStatus = useStore((state) => state.connectionStatus);
  const connectBluetooth = useStore((state) => state.connectBluetooth);
  const disconnectBluetooth = useStore((state) => state.disconnectBluetooth);

  const handleConnect = async () => {
    await connectBluetooth();
  };

  if (!activeSettings) {
      return <div className="w-full h-full bg-neutral-900 border-l border-white/10 p-6 flex items-center justify-center text-neutral-500">Loading settings...</div>;
  }

  return (
    // Sidebar Container: Full height on desktop, scrollable
    <div className="w-full h-full overflow-y-auto bg-neutral-900 border-l border-white/10 flex flex-col">
      
      {/* Connectivity Section (Added padding-top to clear navbar on small desktops) */}
      <div className="p-6 pt-24 md:pt-6 border-b border-white/10 bg-neutral-800/30">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bluetooth size={14} /> Device Connectivity
        </h3>
        
        {connectionStatus === 'connected' ? (
           <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">Smart Cube Connected</span>
            </div>
            <button 
              onClick={disconnectBluetooth}
              className="text-xs text-neutral-400 hover:text-white underline"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            disabled={connectionStatus === 'connecting'}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg ${
               connectionStatus === 'failed' 
               ? 'bg-red-600/20 border border-red-500 text-red-200 hover:bg-red-600/30'
               : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
            }`}
          >
            {connectionStatus === 'connecting' ? (
              <><Loader2 className="animate-spin" size={18} /> Connecting...</>
            ) : connectionStatus === 'failed' ? (
              <><XCircle size={18} /> Connection Failed (Retry)</>
            ) : (
              <><Bluetooth size={18} /> Connect via Bluetooth</>
            )}
          </button>
        )}
      </div>

      {/* Customization Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
             <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Visualization</h3>
             <span className="text-[10px] bg-neutral-800 px-2 py-1 rounded text-neutral-400">Live Preview</span>
        </div>
        
        {/* A. Case Color Control */}
        <ColorControl 
          label="Case Color" 
          color={caseColor} 
          onChange={(c) => setCaseConfig(c, caseMaterial)}
          icon={Palette}
          presets={PRODUCT_COLORS} // Official Product Colors
        />

        {/* Case Material Toggles */}
        <div className="mb-8 grid grid-cols-3 gap-2">
           {['matte', 'metal', 'transparent'].map((mat) => (
             <button 
               key={mat}
               onClick={() => setCaseConfig(caseColor, mat as any)}
               className={`text-[10px] uppercase font-bold py-2 rounded border transition-all ${
                 caseMaterial === mat 
                   ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                   : 'bg-neutral-800 border-transparent text-neutral-500 hover:bg-neutral-700'
               }`}
             >
               {mat}
             </button>
           ))}
        </div>

        {/* B. LED Accent Color Control */}
        <div className="border-t border-white/5 pt-6">
           <ColorControl 
             label="LED Accent Color" 
             color={activeSettings.ledColor} 
             onChange={(c) => updateModeSettings({ ledColor: c })}
             icon={Zap}
           />
           <p className="text-[10px] text-neutral-500 text-center mt-2">
             * Updates apply to {currentMode} mode
           </p>
        </div>
      </div>

      {/* Part Details Section */}
      <div className="flex-grow p-6 bg-neutral-950/30 pb-24">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Hardware Manifest</h3>
        
        <div className="space-y-2">
          {COMPONENT_MANIFEST.map((part) => (
            <div 
              key={part.id}
              onMouseEnter={() => setHighlightedPart(part.id)}
              onMouseLeave={() => setHighlightedPart(null)}
              className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center gap-3 group ${
                highlightedPart === part.id 
                  ? 'bg-cyan-900/20 border-cyan-500/40' 
                  : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
            >
                <div className={`p-2 rounded-lg transition-colors ${highlightedPart === part.id ? 'bg-cyan-500 text-black' : 'bg-neutral-800 text-neutral-400 group-hover:text-white'}`}>
                  <part.icon size={16} />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm truncate text-neutral-200">{part.name}</h4>
                  {highlightedPart === part.id && (
                    <p className="text-xs text-cyan-400/80 mt-0.5 truncate animate-pulse">{part.description}</p>
                  )}
                </div>
                <ChevronRight size={14} className={`text-neutral-600 transition-transform ${highlightedPart === part.id ? 'translate-x-1 text-cyan-400' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};