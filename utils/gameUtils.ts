export const getFeedbackMessage = (success: boolean): string => {
  if (success) {
    const positive = [
      "Great job!", 
      "You did it!", 
      "Super work!", 
      "Correct!", 
      "Awesome!",
      "That's right!"
    ];
    return positive[Math.floor(Math.random() * positive.length)];
  } else {
    const negative = [
      "Try again!", 
      "Not quite.", 
      "Give it another shot.", 
      "Oops, almost!",
      "Keep trying!"
    ];
    return negative[Math.floor(Math.random() * negative.length)];
  }
};

export const getMascotMessage = (mode: string): string => {
  switch (mode) {
      case 'COUNTING': return "Fill in all the missing numbers in the grid!";
      case 'PLACE_VALUE': return "Drag the blocks to build the target number.";
      case 'ORDERING': return "Drag the balloons to put them in the right order.";
      case 'COMPARING': return "Choose the sign that points to the bigger number.";
      case 'ADDITION_SUBTRACTION': return "Solve the math problem by picking the right answer!";
      default: return "Pick a game to start learning math!";
  }
};

export const hasSeenTutorial = (gameKey: string): boolean => {
  try {
    return localStorage.getItem(`tutorial_seen_${gameKey}`) === 'true';
  } catch (e) {
    console.warn('LocalStorage access denied', e);
    return false;
  }
};

export const markTutorialSeen = (gameKey: string): void => {
  try {
    localStorage.setItem(`tutorial_seen_${gameKey}`, 'true');
  } catch (e) {
    console.warn('LocalStorage access denied', e);
  }
};