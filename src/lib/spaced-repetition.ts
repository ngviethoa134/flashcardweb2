/**
 * Spaced Repetition Algorithm (SM-2 Algorithm)
 * Based on SuperMemo 2 algorithm for optimal learning intervals
 */

import { Card } from '@/types/flashcard';

export type Rating = 'again' | 'hard' | 'good' | 'easy';

interface SM2Result {
  ease: number;
  interval: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  nextReview: Date;
}

const INITIAL_EASE = 2.5;
const MIN_EASE = 1.3;
const EASE_DECREASE = 0.15;
const EASE_INCREASE = 0.15;

/**
 * Calculate new card parameters based on rating using SM-2 algorithm
 */
export function calculateNextReview(card: Card, rating: Rating): SM2Result {
  const now = new Date();
  let ease = card.ease || INITIAL_EASE;
  let interval = card.interval || 0;
  let status = card.status;
  let reviewCount = card.reviewCount || 0;

  // Update ease factor based on rating
  switch (rating) {
    case 'again':
      ease = Math.max(MIN_EASE, ease - (2 * EASE_DECREASE));
      interval = 1; // Review again tomorrow (minimum)
      status = 'learning';
      break;
    case 'hard':
      ease = Math.max(MIN_EASE, ease - EASE_DECREASE);
      if (interval === 0) {
        interval = 1;
      } else {
        interval = Math.max(1, Math.round(interval * 1.2));
      }
      status = status === 'new' ? 'learning' : status === 'learning' ? 'learning' : 'review';
      break;
    case 'good':
      ease = ease; // No change to ease for 'good'
      if (interval === 0) {
        interval = 1;
      } else {
        interval = Math.round(interval * ease);
      }
      status = status === 'new' ? 'learning' : status === 'learning' ? 'review' : 'review';
      break;
    case 'easy':
      ease = Math.min(2.5, ease + (2 * EASE_INCREASE));
      if (interval === 0) {
        interval = 4;
      } else {
        interval = Math.round(interval * ease * 1.3);
      }
      status = reviewCount >= 3 ? 'mastered' : status === 'new' ? 'learning' : 'review';
      break;
  }

  // Calculate next review date
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  // Determine final status
  if (status === 'review' && interval >= 30 && reviewCount >= 5) {
    status = 'mastered';
  }

  return {
    ease: Math.round(ease * 100) / 100, // Round to 2 decimal places
    interval,
    status,
    nextReview,
  };
}

/**
 * Check if a card is due for review
 */
export function isCardDue(card: Card): boolean {
  if (card.status === 'new') return true;
  if (!card.nextReview) return true;
  
  const now = new Date();
  const nextReviewDate = new Date(card.nextReview);
  return now >= nextReviewDate;
}

/**
 * Get due cards from a list
 */
export function getDueCards(cards: Card[]): Card[] {
  return cards.filter(isCardDue);
}




