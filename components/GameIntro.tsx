import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Sparkles } from 'lucide-react';

interface GameIntroProps {
  title: string;
  description: string;
  instructions: string[];
  onPlay: () => void;
  icon: React.ReactNode;
}

export const GameIntro: React.FC<GameIntroProps> = ({ title, description, instructions, onPlay, icon }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-900/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-white"
      >
        <div className="bg-yellow-400 p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rotate-12 scale-150 transform origin-top-left"></div>
          <div className="relative z-10 bg-white text-yellow-500 p-4 rounded-full shadow-lg mb-3">
            {icon}
          </div>
          <h2 className="relative z-10 text-3xl font-black text-white drop-shadow-md tracking-wide">{title}</h2>
        </div>

        <div className="p-8">
          <p className="text-gray-600 text-lg font-medium text-center mb-6 leading-relaxed">
            {description}
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-8 border-2 border-blue-100">
            <h3 className="text-blue-500 font-bold uppercase text-xs tracking-wider mb-3 flex items-center gap-2">
              <Info size={16} /> How to Play
            </h3>
            <ul className="space-y-3">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700 font-medium">
                  <span className="bg-blue-200 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlay}
            className="w-full bg-green-500 hover:bg-green-400 text-white text-xl font-bold py-4 rounded-2xl shadow-lg border-b-4 border-green-600 flex items-center justify-center gap-3 transition-colors"
          >
            <Play fill="currentColor" /> Let's Play!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};