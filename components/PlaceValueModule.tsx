import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Box, GripHorizontal, Binary, SkipForward, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getFeedbackMessage, hasSeenTutorial, markTutorialSeen } from '../utils/gameUtils';
import { GameIntro } from './GameIntro';
import { TutorialOverlay, TutorialStep } from './TutorialOverlay';

interface PlaceValueModuleProps {
    setFeedback: (msg: string) => void;
}

export const PlaceValueModule: React.FC<PlaceValueModuleProps> = ({ setFeedback }) => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [tensCount, setTensCount] = useState(0);
  const [onesCount, setOnesCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [showIntro, setShowIntro] = useState(() => !hasSeenTutorial('PLACE_VALUE'));
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    generateProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateProblem = () => {
    const num = Math.floor(Math.random() * 89) + 10; // 10 to 99
    setTargetNumber(num);
    setTensCount(0);
    setOnesCount(0);
    setIsCorrect(false);
    setFeedback(`Build the number ${num} using blocks!`);
  };

  const checkAnswer = () => {
    if (showTutorial) return;
    const currentVal = (tensCount * 10) + onesCount;
    if (currentVal === targetNumber) {
        setIsCorrect(true);
        confetti({ origin: { x: 0.5, y: 0.7 } });
        setFeedback(getFeedbackMessage(true));
        
        // Auto-advance after 2 seconds
        setTimeout(() => {
            generateProblem();
        }, 2000);
    } else {
        setFeedback(getFeedbackMessage(false));
    }
  };

  const handleCloseIntro = () => {
    setShowIntro(false);
    if (!hasSeenTutorial('PLACE_VALUE')) {
        setShowTutorial(true);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    markTutorialSeen('PLACE_VALUE');
  };

  const tutorialSteps: TutorialStep[] = [
    { targetId: 'pv-target', title: 'Target Number', content: 'This is the number we need to build.', position: 'bottom' },
    { targetId: 'pv-add-ten', title: 'Add Tens', content: 'Click this Blue button to add a 10-block.', position: 'top' },
    { targetId: 'pv-add-one', title: 'Add Ones', content: 'Click this Green button to add a 1-block.', position: 'top' },
    { targetId: 'pv-check', title: 'Check Button', content: 'When your blocks match the target, click here!', position: 'top' },
  ];

  return (
    <>
      {showIntro && (
        <GameIntro 
          title="Place Value Builder"
          description="Let's act like construction workers and build numbers using blocks!"
          icon={<Binary size={40} />}
          instructions={[
            "Look at the 'Target' number at the top.",
            "Use Blue blocks for Tens (10).",
            "Use Green blocks for Ones (1).",
            "Click 'Add Ten' or 'Add One' until you match the target number!"
          ]}
          onPlay={handleCloseIntro}
        />
      )}

      {showTutorial && <TutorialOverlay steps={tutorialSteps} onComplete={handleTutorialComplete} />}

      <div className="w-full max-w-5xl mx-auto p-4 flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Workspace */}
          <div className="flex-1 bg-white rounded-3xl shadow-xl p-4 md:p-6 w-full flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div className="flex items-center gap-4">
                    <h2 id="pv-target" className="text-2xl md:text-3xl font-bold text-gray-700 p-2 rounded-xl">Target: <span className="text-purple-600 text-4xl md:text-5xl ml-2">{targetNumber}</span></h2>
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className="text-purple-300 hover:text-purple-500 transition"
                        title="How to play"
                    >
                        <HelpCircle size={24} />
                    </button>
                  </div>
                  <button 
                      onClick={generateProblem}
                      className="text-gray-400 hover:text-purple-500 flex items-center gap-1 text-sm font-bold transition"
                  >
                      Skip <SkipForward size={16} />
                  </button>
              </div>

              <div className="flex gap-2 md:gap-4 flex-grow min-h-[300px]">
                  {/* Tens Column */}
                  <div className="flex-1 bg-blue-50 rounded-2xl border-2 border-blue-200 p-2 md:p-4 flex flex-col items-center gap-2 relative">
                      <div className="text-blue-500 font-bold uppercase tracking-wider mb-2 text-sm md:text-base">Tens</div>
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 text-2xl md:text-4xl font-black text-blue-200 select-none">{tensCount}</div>
                      
                      <div className="flex flex-wrap justify-center gap-1 md:gap-2 content-start w-full h-full overflow-y-auto max-h-[500px]">
                          <AnimatePresence>
                          {Array.from({length: tensCount}).map((_, i) => (
                              <motion.div
                                  key={`ten-${i}`}
                                  initial={{ scale: 0, y: 50 }}
                                  animate={{ scale: 1, y: 0 }}
                                  exit={{ scale: 0 }}
                                  onClick={() => !isCorrect && setTensCount(c => c - 1)}
                                  className="w-6 md:w-8 h-32 md:h-40 bg-blue-500 rounded-md shadow-md cursor-pointer border-b-4 border-blue-700 hover:bg-blue-400 flex flex-col justify-between py-1"
                              >
                                  {Array.from({length: 10}).map((__, k) => (
                                      <div key={k} className="w-full h-[10%] border-t border-blue-400/50"></div>
                                  ))}
                              </motion.div>
                          ))}
                          </AnimatePresence>
                      </div>
                  </div>

                  {/* Ones Column */}
                  <div className="flex-1 bg-green-50 rounded-2xl border-2 border-green-200 p-2 md:p-4 flex flex-col items-center gap-2 relative">
                      <div className="text-green-500 font-bold uppercase tracking-wider mb-2 text-sm md:text-base">Ones</div>
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 text-2xl md:text-4xl font-black text-green-200 select-none">{onesCount}</div>

                      <div className="flex flex-wrap justify-center gap-1 md:gap-2 content-start w-full h-full overflow-y-auto max-h-[500px]">
                          <AnimatePresence>
                          {Array.from({length: onesCount}).map((_, i) => (
                              <motion.div
                                  key={`one-${i}`}
                                  initial={{ scale: 0, y: 50 }}
                                  animate={{ scale: 1, y: 0 }}
                                  exit={{ scale: 0 }}
                                  onClick={() => !isCorrect && setOnesCount(c => c - 1)}
                                  className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-md shadow-md cursor-pointer border-b-4 border-green-700 hover:bg-green-400"
                              />
                          ))}
                          </AnimatePresence>
                      </div>
                  </div>
              </div>

              <div className="mt-6 flex justify-center">
                  <button 
                      id="pv-check"
                      onClick={checkAnswer}
                      disabled={isCorrect}
                      className={`
                          px-8 py-3 rounded-full text-xl font-bold shadow-lg transition
                          ${isCorrect ? 'bg-green-500 text-white scale-110' : 'bg-purple-600 text-white hover:bg-purple-500 border-b-4 border-purple-800'}
                      `}
                  >
                      {isCorrect ? 'Correct! Next...' : 'Check Blocks'}
                  </button>
              </div>
          </div>

          {/* Tools Panel */}
          <div className="w-full lg:w-48 bg-white rounded-3xl shadow-xl p-4 flex flex-row lg:flex-col gap-4 justify-center items-center">
              <div className="text-center font-bold text-gray-400 mb-2 hidden lg:block">Tools</div>
              
              <button 
                  id="pv-add-ten"
                  onClick={() => !isCorrect && !showTutorial && setTensCount(c => c < 9 ? c + 1 : c)}
                  disabled={isCorrect}
                  className="flex-1 lg:flex-none w-full h-24 lg:h-48 bg-blue-100 rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center gap-2 hover:bg-blue-200 transition group disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
              >
                  <div className="w-4 h-12 lg:w-6 lg:h-28 bg-blue-500 rounded shadow-sm border-b-2 border-blue-700 group-hover:scale-110 transition"></div>
                  <span className="font-bold text-blue-700 text-xs lg:text-sm">Add Ten</span>
              </button>

              <button 
                  id="pv-add-one"
                  onClick={() => !isCorrect && !showTutorial && setOnesCount(c => c < 19 ? c + 1 : c)}
                  disabled={isCorrect}
                  className="flex-1 lg:flex-none w-full h-24 lg:h-32 bg-green-100 rounded-xl border-2 border-green-300 flex flex-col items-center justify-center gap-2 hover:bg-green-200 transition group disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
              >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded shadow-sm border-b-2 border-green-700 group-hover:scale-110 transition"></div>
                  <span className="font-bold text-green-700 text-xs lg:text-sm">Add One</span>
              </button>
          </div>
      </div>
    </>
  );
};