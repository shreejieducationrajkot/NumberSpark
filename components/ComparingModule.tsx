import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Sparkles, HelpCircle, Fish } from 'lucide-react';
import { getFeedbackMessage, hasSeenTutorial, markTutorialSeen } from '../utils/gameUtils';
import confetti from 'canvas-confetti';
import { Difficulty } from '../types';
import { GameIntro } from './GameIntro';
import { TutorialOverlay, TutorialStep } from './TutorialOverlay';

interface ComparingModuleProps {
    setFeedback: (msg: string) => void;
    difficulty: Difficulty;
}

const AnimatedAlligatorIcon = ({ direction, isEating }: { direction: 'left' | 'right' | 'equal', isEating: boolean }) => {
  const strokeColor = "#15803d"; // green-700
  const fillColor = "#4ade80"; // green-400
  const eyeWhite = "#ffffff";
  const eyePupil = "#000000";

  if (direction === 'equal') {
     return (
       <motion.svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-sm"
        animate={isEating ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : { y: [0, -3, 0] }}
        transition={{ duration: isEating ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
       >
         {/* Head Base - Rounder for friendly look */}
         <circle cx="50" cy="50" r="42" fill={fillColor} stroke={strokeColor} strokeWidth="3" />
         
         {/* Eyes - Big and centered */}
         <circle cx="35" cy="40" r="10" fill={eyeWhite} stroke={strokeColor} strokeWidth="2"/>
         <circle cx="35" cy="40" r="4" fill={eyePupil} />
         <circle cx="65" cy="40" r="10" fill={eyeWhite} stroke={strokeColor} strokeWidth="2"/>
         <circle cx="65" cy="40" r="4" fill={eyePupil} />

         {/* Nostrils */}
         <circle cx="42" cy="60" r="2" fill="#14532d" />
         <circle cx="58" cy="60" r="2" fill="#14532d" />

         {/* Mouth (= sign) - Clearly separated bars */}
         <rect x="30" y="70" width="40" height="6" rx="3" fill="#166534" />
         <rect x="30" y="82" width="40" height="6" rx="3" fill="#166534" />
       </motion.svg>
     )
  }

  const isLeft = direction === 'left'; 

  // Variants for jaw movement
  // Idle: Mouth stays clearly open to form the < or > shape.
  // Eating: Opens wider and snaps shut.
  const topJawVariants: Variants = {
    idle: { rotate: [-20, -23, -20], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }, 
    eating: { rotate: [-45, 0, -45], transition: { duration: 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } }
  };

  const bottomJawVariants: Variants = {
    idle: { rotate: [20, 23, 20], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
    eating: { rotate: [45, 0, 45], transition: { duration: 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } }
  };

  // Add a breathing animation to the whole head in idle
  const headVariants: Variants = {
      idle: { scale: 1, transition: { duration: 0.5 } },
      eating: { scale: 1.1, transition: { duration: 0.3, repeat: Infinity, repeatType: "mirror" } }
  }

  return (
    <div className={`w-full h-full ${!isLeft ? 'transform scale-x-[-1]' : ''}`}>
        <motion.svg 
            viewBox="0 0 100 100" 
            className="w-full h-full drop-shadow-sm overflow-visible"
            animate={isEating ? "eating" : "idle"}
            variants={headVariants}
        >
            {/* Body connection stub */}
             <path d="M 80 40 L 100 45 L 100 55 L 80 60 Z" fill={fillColor} stroke={strokeColor} strokeWidth="3" />

            {/* Top Jaw Group */}
            <motion.g 
                variants={topJawVariants}
                style={{ originX: "85px", originY: "50px" }}
            >
                {/* Upper Head Shape */}
                <path d="M 85 50 L 75 15 Q 40 15 10 35 L 5 48 L 85 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
                
                {/* Eye (Prominent) */}
                <circle cx="65" cy="30" r="9" fill={eyeWhite} stroke={strokeColor} strokeWidth="2" />
                <circle cx="67" cy="30" r="3.5" fill={eyePupil} />
                
                {/* Teeth (Upper) - Sharp and distinct */}
                <path d="M 15 48 L 20 56 L 25 48 M 30 48 L 35 56 L 40 48 M 45 48 L 50 56 L 55 48" fill="white" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" />
                
                {/* Nostril */}
                <circle cx="15" cy="35" r="2" fill="#14532d" />
            </motion.g>

            {/* Bottom Jaw Group */}
            <motion.g 
                variants={bottomJawVariants}
                style={{ originX: "85px", originY: "50px" }}
            >
                {/* Lower Jaw Shape */}
                <path d="M 85 50 L 75 85 Q 40 85 10 65 L 5 52 L 85 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
                
                {/* Teeth (Lower) */}
                <path d="M 15 52 L 20 44 L 25 52 M 30 52 L 35 44 L 40 52 M 45 52 L 50 44 L 55 52" fill="white" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" />
            </motion.g>
        </motion.svg>
    </div>
  );
}

const FishPond = ({ count, side }: { count: number, side: 'left' | 'right' }) => {
    const displayCount = Math.min(count, 20);
    return (
        <div className="relative w-full h-48 bg-sky-100 rounded-3xl border-4 border-sky-200 overflow-hidden shadow-inner">
             {/* Water Surface Animation */}
             <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-200 via-sky-300 to-sky-400 animate-pulse"></div>
             
             <div className="relative z-10 w-full h-full p-4 flex flex-wrap content-center justify-center gap-2">
                <AnimatePresence>
                {Array.from({length: displayCount}).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            x: [0, Math.random() * 6 - 3, 0],
                            y: [0, Math.random() * 4 - 2, 0]
                        }}
                        transition={{ 
                            delay: i * 0.03,
                            x: { repeat: Infinity, duration: 2 + Math.random(), ease: "easeInOut" },
                            y: { repeat: Infinity, duration: 3 + Math.random(), ease: "easeInOut" }
                        }}
                    >
                        <Fish 
                            size={Math.max(20, 40 - displayCount)} 
                            className={`text-orange-500 fill-orange-300 drop-shadow-sm ${side === 'right' ? 'transform scale-x-[-1]' : ''}`} 
                            strokeWidth={2.5}
                        />
                    </motion.div>
                ))}
                </AnimatePresence>
             </div>
             
             {count > 20 && (
                 <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded-full text-sky-600 font-bold text-xs shadow-sm backdrop-blur-sm">
                    + {count - 20} more
                 </div>
             )}
        </div>
    )
}

export const ComparingModule: React.FC<ComparingModuleProps> = ({ setFeedback, difficulty }) => {
    const [numA, setNumA] = useState(0);
    const [numB, setNumB] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(false);
    const [eatingDirection, setEatingDirection] = useState<'<' | '>' | '=' | null>(null);
    
    const [showIntro, setShowIntro] = useState(() => !hasSeenTutorial('COMPARING'));
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        setStreak(0);
        nextProblem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [difficulty]);

    const nextProblem = () => {
        let max = 10; // Default lower for fish visuals
        if (difficulty === Difficulty.MEDIUM) max = 25;
        if (difficulty === Difficulty.HARD) max = 50;

        setNumA(Math.floor(Math.random() * max) + 1);
        setNumB(Math.floor(Math.random() * max) + 1);
        setLoading(false);
        setEatingDirection(null);
        setFeedback("Which side has more fish? Help the alligator decide!");
    };

    const handleChoice = (operator: '<' | '>' | '=') => {
        if (loading || showTutorial) return;
        setLoading(true);

        let correct = false;
        if (operator === '>' && numA > numB) correct = true;
        if (operator === '<' && numA < numB) correct = true;
        if (operator === '=' && numA === numB) correct = true;

        if (correct) {
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
            setStreak(s => s + 1);
            setFeedback(getFeedbackMessage(true));
            setEatingDirection(operator);
            
            // Wait for animation before next problem
            setTimeout(() => {
                nextProblem();
            }, 2500);
        } else {
            setStreak(0);
            setFeedback(getFeedbackMessage(false));
            setLoading(false);
        }
    };

    const handleCloseIntro = () => {
        setShowIntro(false);
        if (!hasSeenTutorial('COMPARING')) {
            setShowTutorial(true);
        }
    };

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        markTutorialSeen('COMPARING');
    };

    const tutorialSteps: TutorialStep[] = [
        { targetId: 'pond-left', title: 'Left Pond', content: 'Count the fish in the left pond.', position: 'bottom' },
        { targetId: 'pond-right', title: 'Right Pond', content: 'Count the fish in the right pond.', position: 'bottom' },
        { targetId: 'alligator-controls', title: 'Hungry Alligator', content: 'Click the alligator that wants to eat the MOST fish!', position: 'top' }
    ];

    return (
        <>
            {showIntro && (
                <GameIntro 
                title="Hungry Alligator"
                description="The alligator is very hungry! He always wants to eat the side with MORE fish."
                icon={<Fish size={40} />}
                instructions={[
                    "Look at the two ponds of fish.",
                    "Which pond has more fish?",
                    "Click the alligator mouth that points to the bigger pond.",
                    "If they have the same amount, click the smiling alligator in the middle!"
                ]}
                onPlay={handleCloseIntro}
                />
            )}

            {showTutorial && <TutorialOverlay steps={tutorialSteps} onComplete={handleTutorialComplete} />}

            <div className="w-full max-w-5xl mx-auto p-4 flex flex-col items-center">
                {/* Header */}
                <div className="flex items-center justify-between w-full max-w-3xl mb-8 bg-white p-3 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                        <Sparkles size={18} /> Streak: {streak}
                    </div>
                    <div className="text-sm font-bold text-gray-400 px-4">
                        {difficulty} Level
                    </div>
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className="text-gray-300 hover:text-blue-500 transition p-2 hover:bg-gray-100 rounded-full"
                        title="How to play"
                    >
                        <HelpCircle size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center relative">
                    
                    {/* Left Pond */}
                    <div id="pond-left" className="flex flex-col items-center order-1 z-0">
                        <div className="text-6xl font-black text-sky-600 bg-white w-24 h-24 rounded-full shadow-lg flex items-center justify-center border-4 border-sky-100 mb-4 z-10 relative">
                            {numA}
                        </div>
                        <FishPond count={numA} side="left" />
                    </div>

                    {/* Controls (Alligator) */}
                    <div id="alligator-controls" className="flex flex-row md:flex-col items-center justify-center gap-4 order-3 md:order-2 my-6 md:my-0 z-20">
                        {/* Eats Left (>) */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate={eatingDirection === '>' ? { x: -180, scale: 1.5, zIndex: 50 } : (eatingDirection ? { opacity: 0 } : { x: 0, opacity: 1 })}
                            transition={eatingDirection === '>' ? { duration: 1.5, ease: "easeInOut" } : {}}
                            onClick={() => handleChoice('>')}
                            className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-b-8 border-green-600 hover:border-green-500 transition-colors group overflow-visible"
                            aria-label="Greater Than (Eats Left)"
                        >
                           <div className="w-20 h-20">
                             <AnimatedAlligatorIcon direction="left" isEating={eatingDirection === '>'} />
                           </div>
                        </motion.button>
                        
                        {/* Equal (=) */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate={eatingDirection === '=' ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : (eatingDirection ? { opacity: 0 } : { opacity: 1 })}
                            transition={eatingDirection === '=' ? { duration: 1 } : {}}
                            onClick={() => handleChoice('=')}
                            className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-b-8 border-green-600 hover:border-green-500 transition-colors group overflow-visible"
                            aria-label="Equal"
                        >
                            <div className="w-16 h-16">
                             <AnimatedAlligatorIcon direction="equal" isEating={eatingDirection === '='} />
                           </div>
                        </motion.button>

                        {/* Eats Right (<) */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate={eatingDirection === '<' ? { x: 180, scale: 1.5, zIndex: 50 } : (eatingDirection ? { opacity: 0 } : { x: 0, opacity: 1 })}
                            transition={eatingDirection === '<' ? { duration: 1.5, ease: "easeInOut" } : {}}
                            onClick={() => handleChoice('<')}
                            className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-b-8 border-green-600 hover:border-green-500 transition-colors group overflow-visible"
                            aria-label="Less Than (Eats Right)"
                        >
                            <div className="w-20 h-20">
                             <AnimatedAlligatorIcon direction="right" isEating={eatingDirection === '<'} />
                           </div>
                        </motion.button>
                    </div>

                    {/* Right Pond */}
                    <div id="pond-right" className="flex flex-col items-center order-2 md:order-3 z-0">
                         <div className="text-6xl font-black text-sky-600 bg-white w-24 h-24 rounded-full shadow-lg flex items-center justify-center border-4 border-sky-100 mb-4 z-10 relative">
                            {numB}
                        </div>
                        <FishPond count={numB} side="right" />
                    </div>
                </div>
                
                <div className="mt-12 max-w-md text-center text-gray-500 font-medium">
                    <p>Remember: The alligator is hungry for <strong>MORE</strong> fish!</p>
                </div>
            </div>
        </>
    );
};