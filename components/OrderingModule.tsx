import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { RefreshCcw, ArrowRightLeft, HelpCircle, Check, MoveRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getFeedbackMessage, hasSeenTutorial, markTutorialSeen } from '../utils/gameUtils';
import { GameIntro } from './GameIntro';
import { TutorialOverlay, TutorialStep } from './TutorialOverlay';

interface OrderingModuleProps {
    setFeedback: (msg: string) => void;
}

export const OrderingModule: React.FC<OrderingModuleProps> = ({ setFeedback }) => {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [mode, setMode] = useState<'asc' | 'desc'>('asc');
    const [isComplete, setIsComplete] = useState(false);
    
    const [showIntro, setShowIntro] = useState(() => !hasSeenTutorial('ORDERING'));
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        generateGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateGame = () => {
        const newNums = new Set<number>();
        while(newNums.size < 5) {
            newNums.add(Math.floor(Math.random() * 99) + 1);
        }
        const arr = Array.from(newNums);
        setNumbers(arr); // Initially random
        const nextMode = Math.random() > 0.5 ? 'asc' : 'desc';
        setMode(nextMode);
        setIsComplete(false);
        setFeedback(`Drag the balloons to order them from ${nextMode === 'asc' ? 'Smallest to Largest' : 'Largest to Smallest'}!`);
    };

    const checkOrder = () => {
        if (showTutorial || isComplete) return;
        
        const sorted = [...numbers].sort((a, b) => mode === 'asc' ? a - b : b - a);
        const isCorrect = JSON.stringify(numbers) === JSON.stringify(sorted);
        
        if (isCorrect) {
            setIsComplete(true);
            confetti({
                spread: 120,
                particleCount: 80,
                origin: { y: 0.6 }
            });
            setFeedback(getFeedbackMessage(true));
            
            // Auto-advance after 2 seconds
            setTimeout(() => {
                generateGame();
            }, 2500);
        } else {
            // Give specific feedback based on mode
            if (mode === 'asc') {
                 setFeedback("Oops! Start with the SMALLEST number on the left.");
            } else {
                 setFeedback("Oops! Start with the LARGEST number on the left.");
            }
        }
    };

    const handleReorder = (newOrder: number[]) => {
        if (isComplete) return;
        setNumbers(newOrder);
    };

    const handleCloseIntro = () => {
        setShowIntro(false);
        if (!hasSeenTutorial('ORDERING')) {
            setShowTutorial(true);
        }
    };

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        markTutorialSeen('ORDERING');
    };

    const tutorialSteps: TutorialStep[] = [
        { targetId: 'order-mode', title: 'The Rules', content: 'Look here! Do we want smallest to largest, or largest to smallest?', position: 'bottom' },
        { targetId: 'balloon-container', title: 'The Balloons', content: 'Drag the balloons left or right to put them in order.', position: 'top' },
        { targetId: 'check-order-btn', title: 'Check Button', content: 'Click here when you think you are done!', position: 'top' },
    ];

    return (
        <>
            {showIntro && (
                <GameIntro 
                title="Balloon Ordering"
                description="The number balloons are floating away in the wrong order! We need to fix them."
                icon={<ArrowRightLeft size={40} />}
                instructions={[
                    "Read the sign at the top. It says 'Smallest to Largest' or 'Largest to Smallest'.",
                    "Click and drag the balloons left or right.",
                    "Look at the dots on the side to help you!",
                    "Click 'Check Order' to see if you won!"
                ]}
                onPlay={handleCloseIntro}
                />
            )}

            {showTutorial && <TutorialOverlay steps={tutorialSteps} onComplete={handleTutorialComplete} />}

            <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center select-none overflow-hidden">
                {/* Mode Indicator */}
                <div id="order-mode" className="flex flex-col md:flex-row items-center gap-4 mb-6 md:mb-8 bg-white px-6 py-4 rounded-3xl shadow-lg border-b-4 border-gray-100 max-w-full">
                    <div className="flex items-center gap-2 font-black text-gray-700 text-lg md:text-2xl whitespace-nowrap">
                        {mode === 'asc' ? (
                            <>
                                <span className="text-xs md:text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">1</span>
                                <MoveRight className="text-gray-300 w-4 h-4 md:w-6 md:h-6" />
                                <span className="text-lg md:text-2xl bg-blue-100 text-blue-600 px-2 py-1 rounded">100</span>
                                <span className="ml-2 text-sm md:text-base hidden sm:inline">Smallest <span className="text-gray-400 font-normal">➔</span> Largest</span>
                                <span className="ml-2 text-sm md:text-base sm:hidden">Small <span className="text-gray-400 font-normal">➔</span> Big</span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg md:text-2xl bg-orange-100 text-orange-600 px-2 py-1 rounded">100</span>
                                <MoveRight className="text-gray-300 w-4 h-4 md:w-6 md:h-6" />
                                <span className="text-xs md:text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded">1</span>
                                <span className="ml-2 text-sm md:text-base hidden sm:inline">Largest <span className="text-gray-400 font-normal">➔</span> Smallest</span>
                                <span className="ml-2 text-sm md:text-base sm:hidden">Big <span className="text-gray-400 font-normal">➔</span> Small</span>
                            </>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                         <button 
                            onClick={() => setShowTutorial(true)}
                            className="text-gray-300 hover:text-blue-500 transition p-1"
                            title="How to play"
                        >
                            <HelpCircle size={24} />
                        </button>
                        <button 
                            onClick={generateGame}
                            className="bg-gray-50 hover:bg-gray-200 p-2 rounded-full text-gray-400 transition"
                        >
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Game Area with Visual Guides */}
                <div className="w-full flex items-end justify-center gap-1 md:gap-4 mb-8 min-h-[160px] md:min-h-[200px]">
                    {/* Left Guide - Simplified for mobile */}
                    <div className="flex flex-col items-center gap-1 opacity-50 pb-8 hidden sm:flex">
                         <div className={`rounded-full bg-gray-300 ${mode === 'asc' ? 'w-3 h-3 md:w-4 md:h-4' : 'w-8 h-8 md:w-12 md:h-12'}`}></div>
                         <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">{mode === 'asc' ? 'Small' : 'Big'}</span>
                    </div>

                    <div id="balloon-container" className="flex-1 overflow-x-visible px-2">
                        <Reorder.Group 
                            axis="x" 
                            values={numbers} 
                            onReorder={handleReorder} 
                            className="flex gap-2 md:gap-4 justify-center w-full touch-none"
                        >
                            {numbers.map((num) => (
                                <Reorder.Item 
                                    key={num} 
                                    value={num} 
                                    className="cursor-grab active:cursor-grabbing touch-none relative"
                                    whileDrag={{ scale: 1.15, zIndex: 100 }}
                                >
                                    <div 
                                        className={`
                                            relative flex items-center justify-center
                                            w-14 h-20         /* Mobile size */
                                            min-[400px]:w-16 min-[400px]:h-24
                                            md:w-24 md:h-32   /* Desktop size */
                                            group
                                        `}
                                    >
                                        {/* Balloon String */}
                                        <div className="absolute bottom-0 left-1/2 w-0.5 h-full bg-gray-300 origin-top transform -translate-x-1/2 translate-y-[40%] -z-10"></div>
                                        
                                        {/* Balloon Body */}
                                        <div className={`
                                            w-full h-full rounded-t-full rounded-b-[40px] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.1)] shadow-md
                                            flex items-center justify-center 
                                            text-2xl md:text-3xl font-black text-white
                                            ${isComplete ? 'bg-green-400' : 'bg-orange-400'}
                                            border-b-4 ${isComplete ? 'border-green-600' : 'border-orange-600'}
                                            transition-colors duration-300
                                        `}>
                                            <span className="drop-shadow-sm select-none">{num}</span>
                                            {/* Reflection */}
                                            <div className="absolute top-1/4 left-[20%] w-[15%] h-[20%] bg-white opacity-30 rounded-full transform -rotate-12"></div>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>

                    {/* Right Guide - Simplified for mobile */}
                    <div className="flex flex-col items-center gap-1 opacity-50 pb-8 hidden sm:flex">
                         <div className={`rounded-full bg-gray-300 ${mode === 'asc' ? 'w-8 h-8 md:w-12 md:h-12' : 'w-3 h-3 md:w-4 md:h-4'}`}></div>
                         <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">{mode === 'asc' ? 'Big' : 'Small'}</span>
                    </div>
                </div>

                <motion.button
                    id="check-order-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={checkOrder}
                    disabled={isComplete}
                    className={`
                        px-8 py-3 rounded-full text-xl font-bold shadow-lg transition flex items-center gap-2
                        ${isComplete ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-400 border-b-4 border-green-600'}
                    `}
                >
                    <Check size={24} /> {isComplete ? 'Nice Job!' : 'Check Order'}
                </motion.button>

                <div className="mt-8 text-gray-400 font-medium italic text-sm text-center">
                    Drag numbers left or right to reorder them!
                </div>
            </div>
        </>
    );
};