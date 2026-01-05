export interface User {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  studyStreak: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  category: string;
  cardCount: number;
  dueCards: number;
  masteredCards: number;
  lastStudied?: Date;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  ownerName?: string;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags: string[];
  status: 'new' | 'learning' | 'review' | 'mastered';
  ease: number;
  interval: number;
  nextReview?: Date;
  lastReviewed?: Date;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  deckId: string;
  startedAt: Date;
  completedAt?: Date;
  cardsStudied: number;
  newCardsLearned: number;
  cardsReviewed: number;
  accuracy: number;
  ratings: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface DeckStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;
  averageEase: number;
  dueToday: number;
}
