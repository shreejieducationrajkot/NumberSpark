import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check, Trophy, LayoutGrid, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getFeedbackMessage, hasSeenTutorial, markTutorialSeen } from '../utils/gameUtils';
import { Difficulty } from '../types';
import { GameIntro } from './GameIntro';
import { TutorialOverlay, TutorialStep } from './TutorialOverlay';

interface CountingModuleProps {
  onSuccess: () => void;
  setFeedback: (msg: string) => void;
  difficulty: Difficulty;
}

export const CountingModule: React.FC<CountingModuleProps> = ({ onSuccess, setFeedback, difficulty }) => {
  const [gridSize, setGridSize] = useState(20);
  const [missingNumbers, setMissingNumbers] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<{[key: number]: string}>({});
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  // Tutorial State
  const [showIntro, setShowIntro] = useState(() => !hasSeenTutorial('COUNTING'));
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    let size = 20;
    if (difficulty === Difficulty.MEDIUM) size = 50;
    if (difficulty === Difficulty.HARD) size = 100;
    
    setGridSize(size);
    setLevel(1);
    setScore(0);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, gridSize]);

  const startNewGame = () => {
    const baseMissing = level * 2;
    const extraMissing = difficulty === Difficulty.EASY ? 0 : (difficulty === Difficulty.MEDIUM ? 2 : 4);
    const totalMissing = Math.min(baseMissing + extraMissing, gridSize / 2); 

    const newMissing = new Set<number>();
    while(newMissing.size < totalMissing) {
      newMissing.add(Math.floor(Math.random() * gridSize) + 1);
    }
    setMissingNumbers(Array.from(newMissing));
    setUserInputs({});
    setHasChecked(false);
    setIsLevelComplete(false);
    setFeedback(`Can you fill in the ${totalMissing} missing numbers?`);
  };

  const handleInputChange = (num: number, val: string) => {
    if (isLevelComplete || showTutorial) return;
    if (val && !/^\d*$/.test(val)) return;
    
    setUserInputs(prev => ({...prev, [num]: val}));
    setHasChecked(false); 
  };

  const checkAnswers = () => {
    if (isLevelComplete || showTutorial) return;

    setHasChecked(true);
    let correctCount = 0;
    let allCorrect = true;

    missingNumbers.forEach(num => {
      const inputVal = parseInt(userInputs[num] || '0', 10);
      if (inputVal === num) {
        correctCount++;
      } else {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setIsLevelComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const msg = getFeedbackMessage(true);
      setFeedback(msg);
      setScore(s => s + 10);
      setTimeout(() => {
          setLevel(l => l + 1);
      }, 2000);
    } else {
      const msg = getFeedbackMessage(false);
      setFeedback(msg);
    }
  };

  const handleCloseIntro = () => {
    setShowIntro(false);
    // Start interactive tutorial if it's the first time
    if (!hasSeenTutorial('COUNTING')) {
      setShowTutorial(true);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    markTutorialSeen('COUNTING');
  };

  const tutorialSteps: TutorialStep[] = [
    {
      targetId: 'counting-grid',
      title: 'The Number Grid',
      content: 'Here is a grid of numbers. Look closely!',
      position: 'top'
    },
    {
      targetId: `input-${missingNumbers[0] || 'missing'}`,
      title: 'Missing Numbers',
      content: 'Some numbers are gone! Find the empty box and type the correct number.',
      position: 'top'
    },
    {
      targetId: 'check-btn',
      title: 'Check Your Work',
      content: 'When you are done, click this button to see if you are right!',
      position: 'top'
    }
  ];

  return (
    <>
      {showIntro && (
        <GameIntro 
          title="Counting Grid"
          description="Some numbers have gone missing from the grid! Can you help us find them?"
          icon={<LayoutGrid size={40} />}
          instructions={[
            "Look for the empty boxes in the grid.",
            "Figure out which number comes next in the counting pattern.",
            "Click the box and type the missing number.",
            "Click 'Check My Answers' when you are done!"
          ]}
          onPlay={handleCloseIntro}
        />
      )}

      {showTutorial && (
        <TutorialOverlay steps={tutorialSteps} onComplete={handleTutorialComplete} />
      )}

      <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
        <div className="flex justify-between w-full mb-6 items-center bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Level {level}
                <span className="text-sm font-normal text-gray-400 ml-2 border border-gray-200 rounded px-2 bg-gray-50">{difficulty}</span>
            </h2>
            <button 
                onClick={() => setShowTutorial(true)}
                className="text-blue-300 hover:text-blue-500 transition"
                title="How to play"
            >
                <HelpCircle size={24} />
            </button>
          </div>
          <div className="text-xl font-bold text-green-600">Score: {score}</div>
          <button 
              onClick={startNewGame}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
          >
              <RefreshCw size={20} />
          </button>
        </div>

        <div 
          id="counting-grid"
          className={`
          grid gap-2 mb-8 bg-blue-50 p-6 rounded-3xl shadow-inner border-4 border-blue-100
          ${gridSize <= 20 ? 'grid-cols-5 max-w-lg' : 'grid-cols-10'}
        `}>
          {Array.from({ length: gridSize }, (_, i) => i + 1).map((num, i) => {
            const isMissing = missingNumbers.includes(num);
            const inputVal = parseInt(userInputs[num] || '0', 10);
            const isCorrect = isMissing && inputVal === num;
            const isWrong = hasChecked && isMissing && !isCorrect;
            
            return (
              <motion.div
                key={num}
                id={isMissing ? `input-${num}` : undefined}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.005 }}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-lg font-bold relative
                  ${!isMissing ? 'bg-white text-blue-500 shadow-sm' : ''}
                  ${isMissing && isCorrect ? 'bg-green-400 text-white shadow-md transform scale-105 z-10' : ''}
                  ${isMissing && !isCorrect && !isWrong ? 'bg-yellow-100' : ''}
                  ${isWrong ? 'bg-red-100 border-2 border-red-400 shake' : ''}
                `}
              >
                {!isMissing ? (
                  num
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`w-full h-full bg-transparent text-center focus:outline-none rounded-lg p-0
                      ${isCorrect ? 'text-white font-black' : 'text-blue-800'}
                      ${isWrong ? 'text-red-600' : ''}
                    `}
                    value={userInputs[num] || ''}
                    onChange={(e) => handleInputChange(num, e.target.value)}
                    disabled={isCorrect || isLevelComplete}
                    autoComplete="off"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.button
          id="check-btn"
          whileHover={{ scale: isLevelComplete ? 1 : 1.05 }}
          whileTap={{ scale: isLevelComplete ? 1 : 0.95 }}
          onClick={checkAnswers}
          disabled={isLevelComplete}
          className={`px-8 py-3 text-white text-xl font-bold rounded-full shadow-lg border-b-4 transition flex items-center gap-2
            ${isLevelComplete ? 'bg-gray-400 border-gray-500 cursor-not-allowed' : 'bg-green-500 border-green-600 hover:bg-green-400'}
          `}
        >
          <Check size={24} /> Check My Answers
        </motion.button>
      </div>
    </>
  );
};