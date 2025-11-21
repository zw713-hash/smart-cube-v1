import React from 'react';
import { useStore } from './store';
import { LandingPage } from './components/LandingPage';
import { ModelViewer } from './components/ModelViewer';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  const currentView = useStore((state) => state.currentView);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <LandingPage />;
      case 'model':
        return <ModelViewer />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-neutral-950 text-white selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;