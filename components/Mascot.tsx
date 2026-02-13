import React, { useState } from 'react';
import { Bot, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MascotProps {
  message: string;
  mood?: 'happy' | 'thinking' | 'neutral';
  onClick?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({ message, mood = 'happy', onClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 bg-white p-4 rounded-2xl shadow-xl border-2 border-yellow-400 max-w-xs relative pointer-events-auto"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 hover:bg-red-500"
            >
              <X size={12} />
            </button>
            <p className="text-gray-800 text-sm font-medium leading-relaxed">{message}</p>
            <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white border-b-2 border-r-2 border-yellow-400"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
            setIsOpen(true);
            onClick?.();
        }}
        className="bg-yellow-400 p-3 rounded-full shadow-lg border-4 border-white pointer-events-auto flex items-center justify-center"
      >
        <Bot size={40} className="text-white drop-shadow-md" />
      </motion.button>
    </div>
  );
};
