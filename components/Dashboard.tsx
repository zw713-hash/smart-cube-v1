import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { RotateCcw, Sliders, Volume2, Sun, Activity, PenLine, Plus } from 'lucide-react';

// Helper to generate fake real-time data
const useSimulatedData = () => {
  const [data, setData] = useState<{ time: string; noise: number; light: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
      
      setData(prev => {
        const newPoint = {
          time: timeStr,
          noise: 40 + Math.random() * 30 + (Math.sin(now.getTime() / 2000) * 10),
          light: 300 + Math.random() * 100
        };
        const newData = [...prev, newPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
};

export const Dashboard: React.FC = () => {
  const { 
    modes, 
    currentMode, 
    setMode, 
    updateModeSettings, 
    resetCurrentMode, 
    customModeName, 
    setCustomModeName 
  } = useStore();
  
  const chartData = useSimulatedData();
  
  // Get config for the CURRENT active mode
  const config = modes?.[currentMode];
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(customModeName);

  const handleRename = () => {
    setCustomModeName(tempName);
    setIsRenaming(false);
  };

  if (!config) {
      return (
          <div className="w-full h-full flex items-center justify-center">
              <p className="text-neutral-500">Loading control settings...</p>
          </div>
      );
  }

  return (
    <div className="w-full h-full overflow-y-auto pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
             <h2 className="text-3xl font-bold flex items-center gap-3">
               <Sliders className="text-cyan-400" />
               Control Center
             </h2>
             <p className="text-neutral-400 mt-1">Configure thresholds and visualize sensor data.</p>
          </div>
          <button 
            onClick={resetCurrentMode}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30"
            title={`Reset ${currentMode === 'custom' ? customModeName : currentMode} settings only`}
          >
            <RotateCcw size={14} /> Reset {currentMode === 'custom' ? customModeName : currentMode}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Controls */}
          <div className="space-y-6">
            <ControlCard title="Operating Mode">
               <div className="grid grid-cols-2 gap-2 mb-3">
                 {['study', 'sleep', 'party'].map((m) => (
                   <button
                     key={m}
                     onClick={() => setMode(m as any)}
                     className={`py-2 rounded-md text-sm font-medium capitalize transition-all ${
                       currentMode === m 
                        ? 'bg-cyan-600 text-white shadow-lg' 
                        : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5'
                     }`}
                   >
                     {m}
                   </button>
                 ))}
                 <button
                    onClick={() => setMode('custom')}
                    className={`py-2 rounded-md text-sm font-medium capitalize transition-all flex items-center justify-center gap-1 ${
                      currentMode === 'custom' 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-dashed border-white/20'
                    }`}
                 >
                   {currentMode === 'custom' ? (
                       <span className="truncate max-w-[100px]">{customModeName}</span>
                   ) : (
                       <>
                         <Plus size={14} /> Custom
                       </>
                   )}
                 </button>
               </div>

               {/* Custom Mode Renaming UI */}
               {currentMode === 'custom' && (
                   <div className="mt-3 pt-3 border-t border-white/10">
                       {!isRenaming ? (
                           <div className="flex justify-between items-center group">
                               <span className="text-xs text-purple-300">Custom Profile: <span className="text-white font-bold">{customModeName}</span></span>
                               <button onClick={() => { setTempName(customModeName); setIsRenaming(true); }} className="text-neutral-500 hover:text-white"><PenLine size={14}/></button>
                           </div>
                       ) : (
                           <div className="flex gap-2">
                               <input 
                                  type="text" 
                                  value={tempName} 
                                  onChange={(e) => setTempName(e.target.value)}
                                  className="bg-black/50 border border-purple-500/50 text-xs p-1.5 rounded text-white w-full focus:outline-none"
                                  autoFocus
                                  maxLength={12}
                               />
                               <button onClick={handleRename} className="text-xs bg-purple-600 px-2 rounded hover:bg-purple-500">Save</button>
                           </div>
                       )}
                   </div>
               )}
            </ControlCard>

            <ControlCard title="Noise Cancellation">
               <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-neutral-400">Activation Threshold</span>
                   <span className="font-mono text-cyan-400">{config.noiseThreshold} dB</span>
                 </div>
                 <input 
                   type="range" min="30" max="90" value={config.noiseThreshold}
                   onChange={(e) => updateModeSettings({ noiseThreshold: Number(e.target.value) })}
                   className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
                 
                 <div className="flex justify-between text-sm pt-2">
                   <span className="flex items-center gap-2 text-neutral-400"><Volume2 size={14}/> White Noise Vol</span>
                   <span className="font-mono text-cyan-400">{config.whiteNoiseVolume}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" value={config.whiteNoiseVolume}
                   onChange={(e) => updateModeSettings({ whiteNoiseVolume: Number(e.target.value) })}
                   className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
               </div>
            </ControlCard>

            <ControlCard title="Lighting & Display">
               <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="flex items-center gap-2 text-neutral-400"><Sun size={14}/> LED Brightness</span>
                   <span className="font-mono text-cyan-400">{config.brightness}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" value={config.brightness}
                   onChange={(e) => updateModeSettings({ brightness: Number(e.target.value) })}
                   className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
               </div>
            </ControlCard>
          </div>

          {/* Right Column: Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Activity size={18} className="text-green-400" />
                Real-time Noise Levels (dB)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorNoise" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#666" domain={[20, 100]} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="noise" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorNoise)" 
                      isAnimationActive={false}
                    />
                    {/* Threshold Line */}
                    <path stroke="red" strokeDasharray="5 5" d={`M 60 ${256 - (config.noiseThreshold - 20) * (256/80)} L 1000 ${256 - (config.noiseThreshold - 20) * (256/80)}`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Sun size={18} className="text-yellow-400" />
                Ambient Light (Lux)
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} hide />
                    <YAxis stroke="#666" domain={[0, 600]} fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                      itemStyle={{ color: '#fbbf24' }}
                    />
                    <Line 
                      type="basis" 
                      dataKey="light" 
                      stroke="#fbbf24" 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ControlCard = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
    <h3 className="text-lg font-bold mb-4 text-neutral-200">{title}</h3>
    {children}
  </div>
);