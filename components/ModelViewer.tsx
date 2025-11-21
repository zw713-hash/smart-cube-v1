import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, ContactShadows } from '@react-three/drei';
import { Scene } from './Scene';
import { Sidebar } from './Sidebar';
import { ConnectionPopup } from './ConnectionPopup';
import { useStore } from '../store';

export const ModelViewer: React.FC = () => {
  const isExploded = useStore((state) => state.isExploded);
  const toggleExploded = useStore((state) => state.toggleExploded);
  const isGhostMode = useStore((state) => state.isGhostMode);
  const toggleGhostMode = useStore((state) => state.toggleGhostMode);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* LEFT: 3D Canvas Area */}
      <div className="relative flex-1 h-[60vh] md:h-full bg-gradient-to-b from-neutral-900 to-neutral-950 overflow-hidden order-1">
        <Canvas shadows camera={{ position: [4, 2, 5], fov: 45 }}>
          <fog attach="fog" args={['#0a0a0a', 5, 20]} />
          <Environment preset="city" />
          
          {/* Zoom speed 0.4 for precise control */}
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} zoomSpeed={0.4} />
          
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            <Scene />
          </Stage>
          
          <ContactShadows opacity={0.4} scale={10} blur={2} far={4} />
        </Canvas>

        {/* Quick Controls Overlay (Floating in Canvas) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-10 w-max">
           <button 
             onClick={toggleExploded}
             className={`px-6 py-2 rounded-full backdrop-blur-md border transition-all text-sm font-medium ${
               isExploded 
                 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                 : 'bg-black/40 border-white/20 text-white hover:bg-white/10'
             }`}
           >
             {isExploded ? 'Collapse View' : 'Explode View'}
           </button>
           
           <button 
             onClick={toggleGhostMode}
             className={`px-6 py-2 rounded-full backdrop-blur-md border transition-all text-sm font-medium ${
               isGhostMode
                 ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                 : 'bg-black/40 border-white/20 text-white hover:bg-white/10'
             }`}
           >
             Ghost Mode
           </button>
        </div>
        
        {/* Connection Popup Overlay */}
        <ConnectionPopup />
      </div>

      {/* RIGHT: Sidebar Control Panel */}
      <div className="w-full md:w-96 h-[50vh] md:h-full flex-shrink-0 order-2 z-20 shadow-2xl">
        <Sidebar />
      </div>
    </div>
  );
};