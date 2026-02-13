import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';

export interface TutorialStep {
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateRect = () => {
    const element = document.getElementById(steps[currentStep].targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    }
  };

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    
    // Retry to ensure element is rendered/animated in
    const timer1 = setTimeout(updateRect, 100);
    const timer2 = setTimeout(updateRect, 500);

    return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect);
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto font-sans">
       {/* Spotlight Backdrop */}
       <div className="absolute inset-0 overflow-hidden">
          {targetRect && (
            <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: 1,
                    top: targetRect.top - 10,
                    left: targetRect.left - 10,
                    width: targetRect.width + 20,
                    height: targetRect.height + 20,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] border-2 border-yellow-400/50"
            />
          )}
          {!targetRect && <div className="absolute inset-0 bg-black/70" />}
       </div>

       {/* Tooltip */}
       <AnimatePresence mode='wait'>
         {targetRect && (
             <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute flex flex-col items-center"
                style={{
                    top: step.position === 'top' ? Math.max(20, targetRect.top - 180) : targetRect.bottom + 30,
                    left: Math.max(20, Math.min(window.innerWidth - 320, targetRect.left + (targetRect.width / 2) - 150)),
                    width: 300
                }}
             >
                <div className="bg-white p-5 rounded-3xl shadow-2xl border-b-8 border-blue-500 relative">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-xl text-blue-600">{step.title}</h3>
                        <span className="text-xs font-bold text-gray-300 bg-gray-100 px-2 py-1 rounded-full">
                            {currentStep + 1} / {steps.length}
                        </span>
                    </div>
                    <p className="text-gray-600 font-medium text-base mb-4 leading-relaxed">{step.content}</p>
                    <div className="flex justify-end">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-lg hover:bg-green-400 transition shadow-md border-b-4 border-green-600"
                        >
                            {currentStep === steps.length - 1 ? "Start Playing!" : "Next"}
                        </motion.button>
                    </div>
                    
                    {/* Triangle pointer */}
                    <div className={`absolute w-6 h-6 bg-white transform rotate-45 
                        ${step.position === 'top' ? 'bottom-[-10px] border-b-8 border-r-8 border-blue-500' : 'top-[-10px] border-t-8 border-l-8 border-white'} 
                        left-1/2 -translate-x-1/2 rounded-sm`} 
                    />
                </div>
             </motion.div>
         )}
       </AnimatePresence>

       {/* Hand Cursor Animation */}
        {targetRect && (
            <motion.div
                initial={{ x: 20, y: 20, opacity: 0 }}
                animate={{ 
                    x: [0, 10, 0],
                    y: [0, 10, 0],
                    opacity: 1
                }}
                transition={{ 
                    x: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                    opacity: { duration: 0.5 }
                }}
                className="absolute pointer-events-none drop-shadow-2xl z-[110]"
                style={{
                    top: targetRect.bottom - 10,
                    left: targetRect.right - 40,
                }}
            >
                <Hand size={64} className="fill-yellow-400 text-yellow-600 transform -rotate-12 stroke-[3]" />
            </motion.div>
        )}
    </div>
  );
};