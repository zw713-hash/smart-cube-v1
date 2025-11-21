import React from 'react';
import { useStore, ViewState } from '../store';
import { Box, LayoutDashboard, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, setView } = useStore();

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
        currentView === view
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          : 'text-neutral-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 px-2 py-2 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        <NavItem view="home" icon={Home} label="Overview" />
        <NavItem view="model" icon={Box} label="3D View" />
        <NavItem view="dashboard" icon={LayoutDashboard} label="Control" />
      </div>
    </nav>
  );
};