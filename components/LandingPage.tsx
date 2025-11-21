import React from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, Zap, Bluetooth, Layers, Moon, Cpu } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const setView = useStore((state) => state.setView);

  return (
    <div className="w-full h-full overflow-y-auto scroll-smooth pb-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <h2 className="text-cyan-400 tracking-[0.2em] text-sm font-bold uppercase mb-4">Introducing</h2>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            Smart Focus Cube
            <span className="text-2xl align-top ml-2 opacity-50 font-light">v1</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reclaim your focus in a noisy world. An intelligent desktop companion designed to analyze your environment and optimize your productivity flow.
          </p>
          
          <button 
            onClick={() => setView('model')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
          >
            Explore Interactive 3D
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Abstract Visual Representation */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
      </section>

      {/* Problem & Solution */}
      <section className="py-24 px-6 bg-neutral-900/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Designed for the Dorm. <br/>Perfected for Deep Work.</h3>
            <p className="text-neutral-400 text-lg mb-6 leading-relaxed">
              Dormitory noise, flickering lights, and constant interruptions kill productivity. The Smart Focus Cube isn't just a lamp or a sensor—it's a guardian of your headspace.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time decibel monitoring",
                "Automatic white noise masking",
                "Pomodoro visual timer integration",
                "Sleep cycle lighting capabilities"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-80 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div className="text-center p-8">
                <span className="text-6xl font-bold block mb-2">42%</span>
                <span className="text-sm uppercase tracking-widest text-neutral-400">Improvement in Focus Time</span>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h3 className="text-center text-3xl font-bold mb-16">Engineering Highlights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Mic} 
            title="Dual Mic Array" 
            desc="Spatial audio analysis allows the cube to distinguish between background hum and sharp interruptions." 
          />
          <FeatureCard 
            icon={Zap} 
            title="OLED Dashboard" 
            desc="High-contrast 0.96 inch display showing real-time stats without blue-light eye strain." 
          />
          <FeatureCard 
            icon={Layers} 
            title="Modular Design" 
            desc="Designed with repairability in mind. Three distinct layers for sensing, processing, and power." 
          />
          <FeatureCard 
            icon={Bluetooth} 
            title="Bluetooth 5.0" 
            desc="Seamlessly connects to your phone for custom alert profiles and data logging." 
          />
          <FeatureCard 
            icon={Cpu} 
            title="ESP32 Core" 
            desc="Powered by the robust dual-core ESP32 microcontroller for edge-computing capabilities." 
          />
          <FeatureCard 
            icon={Moon} 
            title="Circadian Rhythm" 
            desc="RGB LEDs automatically shift temperature to match your biological clock." 
          />
        </div>
      </section>
      
      <footer className="py-12 text-center text-neutral-600 text-sm border-t border-white/5">
        <p>© 2024 Smart Focus Cube Project. Open Source Hardware.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h4 className="text-xl font-bold mb-3">{title}</h4>
    <p className="text-neutral-400 leading-relaxed text-sm">{desc}</p>
  </div>
);