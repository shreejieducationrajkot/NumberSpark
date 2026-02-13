import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Plus, Minus, Sparkles, Calculator, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getFeedbackMessage, hasSeenTutorial, markTutorialSeen } from '../utils/gameUtils';
import { Difficulty } from '../types';
import { GameIntro } from './GameIntro';
import { TutorialOverlay, TutorialStep } from './TutorialOverlay';

interface AdditionSubtractionModuleProps {
    setFeedback: (msg: string) => void;
    difficulty: Difficulty;
}

export const AdditionSubtractionModule: React.FC<AdditionSubtractionModuleProps> = ({ setFeedback, difficulty }) => {
    const [numA, setNumA] = useState(0);
    const [numB, setNumB] = useState(0);
    const [operator, setOperator] = useState<'+' | '-'>('+');
    const [options, setOptions] = useState<number[]>([]);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(false);
    const [solvedNumber, setSolvedNumber] = useState<number | null>(null);
    
    // Ref for the drop target (the ? box)
    const dropZoneRef = useRef<HTMLDivElement>(null);
    
    const [showIntro, setShowIntro] = useState(() => !hasSeenTutorial('ADDITION_SUBTRACTION'));
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        setStreak(0);
        nextProblem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [difficulty]);

    const nextProblem = () => {
        let max = 20;
        if (difficulty === Difficulty.MEDIUM) max = 50;
        if (difficulty === Difficulty.HARD) max = 100;

        const isAddition = Math.random() > 0.5;
        const newOp = isAddition ? '+' : '-';
        setOperator(newOp);

        let a = 0;
        let b = 0;
        let calculatedAnswer = 0;

        if (isAddition) {
            // Ensure sum <= max
            calculatedAnswer = Math.floor(Math.random() * (max - 2)) + 2; // min 2
            a = Math.floor(Math.random() * (calculatedAnswer - 1)) + 1;
            b = calculatedAnswer - a;
        } else {
            // Ensure result >= 0
            a = Math.floor(Math.random() * (max - 1)) + 1;
            b = Math.floor(Math.random() * a); // b < a or b <= a
            calculatedAnswer = a - b;
        }

        setNumA(a);
        setNumB(b);
        setSolvedNumber(null);

        // Generate options
        const opts = new Set<number>();
        opts.add(calculatedAnswer);
        
        while (opts.size < 3) {
            const offset = Math.floor(Math.random() * 5) + 1;
            const sign = Math.random() > 0.5 ? 1 : -1;
            const candidate = calculatedAnswer + (offset * sign);
            
            if (candidate >= 0 && candidate <= max * 1.5 && candidate !== calculatedAnswer) {
                opts.add(candidate);
            }
        }

        // Shuffle options
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
        setLoading(false);
        setFeedback("Drag the answer to the box!");
    };

    const handleAnswer = (val: number) => {
        if (loading || showTutorial) return;
        
        const correctAnswer = operator === '+' ? numA + numB : numA - numB;

        if (val === correctAnswer) {
            setLoading(true);
            setSolvedNumber(val); // Show the number in the box
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
            setStreak(s => s + 1);
            setFeedback(getFeedbackMessage(true));
            setTimeout(nextProblem, 1500);
        } else {
            setStreak(0);
            setFeedback(getFeedbackMessage(false));
            setLoading(false);
        }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, val: number) => {
        if (!dropZoneRef.current || loading || showTutorial) return;

        const dropZone = dropZoneRef.current.getBoundingClientRect();
        const point = info.point;

        // Check if dropped inside the target box
        const isOverTarget = 
            point.x >= dropZone.left && 
            point.x <= dropZone.right && 
            point.y >= dropZone.top && 
            point.y <= dropZone.bottom;

        if (isOverTarget) {
            handleAnswer(val);
        }
    };

    const renderDots = (count: number, colorClass: string) => {
        // Only show visual aids for easy numbers to avoid clutter
        if (difficulty !== Difficulty.EASY || count > 15) return null;
        
        return (
            <div className="flex flex-wrap justify-center gap-1 mt-2 max-w-[80px] md:max-w-[100px]">
                {Array.from({length: count}).map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${colorClass}`} 
                    />
                ))}
            </div>
        );
    };

    const handleCloseIntro = () => {
        setShowIntro(false);
        if (!hasSeenTutorial('ADDITION_SUBTRACTION')) {
            setShowTutorial(true);
        }
    };

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        markTutorialSeen('ADDITION_SUBTRACTION');
    };

    const tutorialSteps: TutorialStep[] = [
        { targetId: 'math-problem', title: 'The Problem', content: 'Use your math skills to solve this!', position: 'bottom' },
        { targetId: 'math-options', title: 'Drag & Drop', content: 'Drag the correct number to the box with the question mark.', position: 'top' }
    ];

    return (
        <>
            {showIntro && (
                <GameIntro 
                title="Math Wizard"
                description="Use your magical math powers to solve addition and subtraction problems!"
                icon={<Calculator size={40} />}
                instructions={[
                    "Look at the math problem (like 2 + 2).",
                    "Look at the choices at the bottom.",
                    "Drag the correct number into the question mark box.",
                    "In 'Easy' mode, you can count the dots to help you!"
                ]}
                onPlay={handleCloseIntro}
                />
            )}

            {showTutorial && <TutorialOverlay steps={tutorialSteps} onComplete={handleTutorialComplete} />}

            <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold shadow-sm">
                        <Sparkles size={18} /> Streak: {streak}
                    </div>
                    <div className="text-xs font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded bg-white">
                        {difficulty}
                    </div>
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className="text-gray-300 hover:text-blue-500 transition"
                        title="How to play"
                    >
                        <HelpCircle size={20} />
                    </button>
                </div>

                <div className="bg-white p-4 md:p-8 rounded-3xl shadow-xl border-4 border-blue-50 w-full max-w-2xl flex flex-col items-center">
                    
                    {/* Equation Display */}
                    {/* Grouped flex-wrap to keep A+B together and =? together */}
                    <div id="math-problem" className="flex flex-wrap items-center justify-center gap-x-2 md:gap-x-4 gap-y-6 mb-8 md:mb-12 w-full">
                        
                        {/* First Group: Operand A, Operator, Operand B */}
                        <div className="flex items-center gap-1 md:gap-4">
                            {/* Num A */}
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 md:w-32 md:h-32 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl md:text-6xl font-black shadow-inner">
                                    {numA}
                                </div>
                                {renderDots(numA, 'bg-blue-400')}
                            </div>

                            {/* Operator */}
                            <div className="text-gray-400">
                                {operator === '+' ? <Plus size={24} strokeWidth={4} className="md:w-12 md:h-12" /> : <Minus size={24} strokeWidth={4} className="md:w-12 md:h-12" />}
                            </div>

                            {/* Num B */}
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 md:w-32 md:h-32 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl md:text-6xl font-black shadow-inner">
                                    {numB}
                                </div>
                                {renderDots(numB, 'bg-purple-400')}
                            </div>
                        </div>

                        {/* Second Group: Equals and Answer Box */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="text-gray-400">
                                <span className="text-3xl md:text-6xl font-black">=</span>
                            </div>

                            <div 
                                ref={dropZoneRef}
                                className={`
                                    w-16 h-16 md:w-32 md:h-32 rounded-2xl border-4 border-dashed 
                                    flex items-center justify-center text-3xl md:text-6xl transition-colors duration-300
                                    ${solvedNumber !== null ? 'bg-green-100 border-green-400 text-green-600' : 'bg-gray-100 border-gray-300 text-gray-400'}
                                `}
                            >
                                {solvedNumber !== null ? solvedNumber : '?'}
                            </div>
                        </div>

                    </div>

                    {/* Options */}
                    <div id="math-options" className="grid grid-cols-3 gap-3 md:gap-4 w-full h-20 md:h-32">
                        <AnimatePresence mode='popLayout'>
                        {options.map((opt, idx) => {
                            // If this option is the solved number, we hide it from the list so it looks like it moved to the box
                            if (solvedNumber === opt) return null;

                            return (
                                <motion.div
                                    key={`${opt}-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    whileHover={{ scale: 1.05, cursor: 'grab' }}
                                    whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                                    drag
                                    dragSnapToOrigin={true}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, opt)}
                                    whileDrag={{ scale: 1.2, zIndex: 50 }}
                                    className="bg-white border-2 border-b-4 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 text-2xl md:text-4xl font-bold py-2 md:py-6 rounded-xl shadow-sm hover:shadow-md flex items-center justify-center touch-none select-none active:scale-110"
                                    onClick={() => handleAnswer(opt)} // Keep click for accessibility
                                >
                                    {opt}
                                </motion.div>
                            )
                        })}
                        </AnimatePresence>
                    </div>
                     <div className="mt-8 text-gray-400 font-medium italic text-sm text-center">
                        Drag the number to the question mark!
                    </div>
                </div>
            </div>
        </>
    );
};