import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Bluetooth } from 'lucide-react';
import { useStore } from '../store';

export const ConnectionPopup: React.FC = () => {
  const { connectionStatus, showConnectionPopup, closeConnectionPopup } = useStore();

  useEffect(() => {
    if (showConnectionPopup) {
      const timer = setTimeout(() => {
        closeConnectionPopup();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConnectionPopup, closeConnectionPopup]);

  return (
    <AnimatePresence>
      {showConnectionPopup && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="absolute bottom-10 left-0 right-0 mx-auto w-80 bg-neutral-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center z-50"
        >
          <div className="relative mb-4">
             {connectionStatus === 'connected' ? (
               <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                 <CheckCircle size={32} />
               </div>
             ) : (
               <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                 <XCircle size={32} />
               </div>
             )}
             <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-full">
               <Bluetooth size={12} />
             </div>
          </div>

          <h3 className="text-lg font-bold mb-1">
            {connectionStatus === 'connected' ? 'Smart Cube Connected' : 'Connection Failed'}
          </h3>
          <p className="text-sm text-neutral-400">
            {connectionStatus === 'connected' 
              ? 'Your settings have been synced.' 
              : 'Please ensure your device is in range.'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};