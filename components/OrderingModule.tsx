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

            <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
                {/* Mode Indicator */}
                <div id="order-mode" className="flex items-center gap-4 mb-8 bg-white px-8 py-4 rounded-full shadow-lg border-b-4 border-gray-100">
                    <div className="flex items-center gap-2 font-black text-gray-700 text-xl md:text-2xl">
                        {mode === 'asc' ? (
                            <>
                                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">1</span>
                                <MoveRight className="text-gray-300" />
                                <span className="text-2xl bg-blue-100 text-blue-600 px-2 py-1 rounded">100</span>
                                <span className="ml-2">Smallest <span className="text-gray-400 font-normal">➔</span> Largest</span>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl bg-orange-100 text-orange-600 px-2 py-1 rounded">100</span>
                                <MoveRight className="text-gray-300" />
                                <span className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded">1</span>
                                <span className="ml-2">Largest <span className="text-gray-400 font-normal">➔</span> Smallest</span>
                            </>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className="ml-2 text-gray-300 hover:text-blue-500 transition"
                        title="How to play"
                    >
                        <HelpCircle size={24} />
                    </button>
                    <button 
                        onClick={generateGame}
                        className="ml-2 bg-gray-50 hover:bg-gray-200 p-2 rounded-full text-gray-400 transition"
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>

                {/* Game Area with Visual Guides */}
                <div className="w-full flex items-center justify-center gap-4 md:gap-8 mb-8">
                    {/* Left Guide */}
                    <div className="flex flex-col items-center gap-2 opacity-50">
                         <div className={`rounded-full bg-gray-300 ${mode === 'asc' ? 'w-4 h-4' : 'w-12 h-12'}`}></div>
                         <span className="text-xs font-bold text-gray-400 uppercase">{mode === 'asc' ? 'Small' : 'Big'}</span>
                    </div>

                    <div id="balloon-container" className="flex-1 flex justify-center">
                        <Reorder.Group 
                            axis="x" 
                            values={numbers} 
                            onReorder={handleReorder} 
                            className="flex gap-2 md:gap-4 flex-wrap justify-center w-full min-h-[200px]"
                        >
                            {numbers.map((num) => (
                                <Reorder.Item key={num} value={num} className="cursor-grab active:cursor-grabbing touch-none">
                                    <motion.div 
                                        layout
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileDrag={{ scale: 1.1, zIndex: 50 }}
                                        className={`
                                            relative w-20 h-28 md:w-24 md:h-32 flex items-center justify-center
                                            group
                                        `}
                                    >
                                        {/* Balloon String */}
                                        <div className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-gray-300 origin-top transform -translate-x-1/2 translate-y-full"></div>
                                        
                                        {/* Balloon Body */}
                                        <div className={`
                                            w-full h-full rounded-t-full rounded-b-[40px] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.1)] shadow-md
                                            flex items-center justify-center text-2xl md:text-3xl font-black text-white
                                            ${isComplete ? 'bg-green-400' : 'bg-orange-400'}
                                            border-b-4 ${isComplete ? 'border-green-600' : 'border-orange-600'}
                                            transition-colors duration-300
                                        `}>
                                            <span className="drop-shadow-sm">{num}</span>
                                            {/* Reflection */}
                                            <div className="absolute top-4 left-4 w-3 h-6 bg-white opacity-30 rounded-full transform -rotate-12"></div>
                                        </div>
                                    </motion.div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>

                    {/* Right Guide */}
                    <div className="flex flex-col items-center gap-2 opacity-50">
                         <div className={`rounded-full bg-gray-300 ${mode === 'asc' ? 'w-12 h-12' : 'w-4 h-4'}`}></div>
                         <span className="text-xs font-bold text-gray-400 uppercase">{mode === 'asc' ? 'Big' : 'Small'}</span>
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

                <div className="mt-8 text-gray-400 font-medium italic text-sm">
                    Drag numbers left or right to reorder them!
                </div>
            </div>
        </>
    );
};