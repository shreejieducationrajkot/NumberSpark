export enum GameMode {
  MENU = 'MENU',
  COUNTING = 'COUNTING',
  PLACE_VALUE = 'PLACE_VALUE',
  ORDERING = 'ORDERING',
  COMPARING = 'COMPARING',
  ADDITION_SUBTRACTION = 'ADDITION_SUBTRACTION',
}

export enum Difficulty {
  EASY = 'EASY', // 1-20
  MEDIUM = 'MEDIUM', // 1-50
  HARD = 'HARD', // 1-100
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export type GemResponse = {
  text: string;
  hint?: string;
};
