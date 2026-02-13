import React, { useState, useEffect } from 'react';
import { GameMode, Difficulty } from './types';
import { CountingModule } from './components/CountingModule';
import { PlaceValueModule } from './components/PlaceValueModule';
import { OrderingModule } from './components/OrderingModule';
import { ComparingModule } from './components/ComparingModule';
import { AdditionSubtractionModule } from './components/AdditionSubtractionModule';
import { Mascot } from './components/Mascot';
import { getMascotMessage } from './utils/gameUtils';
import { LayoutGrid, Binary, ArrowRightLeft, Scale, Signal, Calculator } from 'lucide-react';

const App = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>(GameMode.MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [mascotMessage, setMascotMessage] = useState("Hi! I'm Sparky. Pick a game to start!");

  // Update mascot message when mode changes
  useEffect(() => {
    setMascotMessage(getMascotMessage(currentMode === GameMode.MENU ? 'MENU' : currentMode));
  }, [currentMode]);

  const handleMascotClick = () => {
    // Simple static interaction
    setMascotMessage(getMascotMessage(currentMode === GameMode.MENU ? 'MENU' : currentMode));
  };

  const renderContent = () => {
    switch (currentMode) {
      case GameMode.COUNTING:
        return <CountingModule difficulty={difficulty} onSuccess={() => setMascotMessage("You mastered counting!")} setFeedback={setMascotMessage} />;
      case GameMode.PLACE_VALUE:
        return <PlaceValueModule setFeedback={setMascotMessage} />;
      case GameMode.ORDERING:
        return <OrderingModule setFeedback={setMascotMessage} />;
      case GameMode.COMPARING:
        return <ComparingModule difficulty={difficulty} setFeedback={setMascotMessage} />;
      case GameMode.ADDITION_SUBTRACTION:
        return <AdditionSubtractionModule difficulty={difficulty} setFeedback={setMascotMessage} />;
      case GameMode.MENU:
      default:
        return (
          <div className="flex flex-col items-center max-w-4xl mx-auto p-6">
            
            <div className="bg-white p-2 rounded-full shadow-md mb-8 flex gap-2">
              <span className="px-4 py-2 flex items-center gap-2 text-gray-500 font-bold uppercase text-sm tracking-wider">
                <Signal size={16} /> Difficulty:
              </span>
              {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map((key) => {
                const level = Difficulty[key];
                const isActive = difficulty === level;
                let activeColor = 'bg-blue-500';
                if (level === Difficulty.EASY) activeColor = 'bg-green-500';
                if (level === Difficulty.MEDIUM) activeColor = 'bg-yellow-500';
                if (level === Difficulty.HARD) activeColor = 'bg-red-500';

                return (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`
                      px-6 py-2 rounded-full font-bold transition-all duration-200
                      ${isActive ? `${activeColor} text-white shadow-lg transform scale-105` : 'hover:bg-gray-100 text-gray-400'}
                    `}
                  >
                    {level}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <MenuCard 
                title="Counting & Grid" 
                icon={<LayoutGrid size={40} />} 
                color="bg-blue-500" 
                onClick={() => setCurrentMode(GameMode.COUNTING)} 
              />
              <MenuCard 
                title="Place Value" 
                icon={<Binary size={40} />} 
                color="bg-purple-500" 
                onClick={() => setCurrentMode(GameMode.PLACE_VALUE)} 
              />
              <MenuCard 
                title="Ordering" 
                icon={<ArrowRightLeft size={40} />} 
                color="bg-orange-500" 
                onClick={() => setCurrentMode(GameMode.ORDERING)} 
              />
              <MenuCard 
                title="Comparing" 
                icon={<Scale size={40} />} 
                color="bg-emerald-500" 
                onClick={() => setCurrentMode(GameMode.COMPARING)} 
              />
               <MenuCard 
                title="Add & Subtract" 
                icon={<Calculator size={40} />} 
                color="bg-rose-500" 
                onClick={() => setCurrentMode(GameMode.ADDITION_SUBTRACTION)} 
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-gray-800 font-sans selection:bg-yellow-200">
      <header className="bg-white shadow-sm border-b border-blue-100 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div 
            className="text-3xl font-black text-blue-500 tracking-tight cursor-pointer flex items-center gap-2"
            onClick={() => setCurrentMode(GameMode.MENU)}
          >
            <span className="bg-yellow-400 text-white rounded-lg px-2 transform -rotate-6 shadow-sm">123</span> NumberSpark
          </div>
          {currentMode !== GameMode.MENU && (
            <button 
              onClick={() => setCurrentMode(GameMode.MENU)}
              className="text-sm font-bold text-gray-400 hover:text-blue-500 transition uppercase tracking-wider"
            >
              Exit Game
            </button>
          )}
        </div>
      </header>

      <main className="py-8 min-h-[calc(100vh-80px)]">
        {renderContent()}
      </main>

      <Mascot message={mascotMessage} onClick={handleMascotClick} />
    </div>
  );
};

const MenuCard: React.FC<{title: string, icon: React.ReactNode, color: string, onClick: () => void}> = ({ title, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left overflow-hidden border-2 border-transparent hover:border-blue-200"
  >
    <div className={`absolute top-0 right-0 p-16 ${color} opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`}></div>
    
    <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:rotate-12 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-gray-400 font-medium">Tap to play!</p>
  </button>
);

export default App;
