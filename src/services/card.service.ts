import { supabase } from '@/lib/supabase';
import { Card } from '@/types/flashcard';

export interface CreateCardData {
  front: string;
  back: string;
  tags: string[];
}

export interface UpdateCardData extends Partial<CreateCardData> {
  status?: 'new' | 'learning' | 'review' | 'mastered';
  ease?: number;
  interval?: number;
  nextReview?: Date;
  lastReviewed?: Date;
  reviewCount?: number;
}

/**
 * Get all cards for a deck
 */
export async function getDeckCards(deckId: string): Promise<Card[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify user owns the deck
  const { data: deck } = await supabase
    .from('decks')
    .select('owner_id')
    .eq('id', deckId)
    .single();

  if (!deck) throw new Error('Deck not found');
  if (deck.owner_id !== user.id) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((card) => ({
    id: card.id,
    deckId: card.deck_id,
    front: card.front,
    back: card.back,
    tags: card.tags || [],
    status: card.status,
    ease: card.ease,
    interval: card.interval,
    nextReview: card.next_review ? new Date(card.next_review) : undefined,
    lastReviewed: card.last_reviewed ? new Date(card.last_reviewed) : undefined,
    reviewCount: card.review_count || 0,
    createdAt: new Date(card.created_at),
    updatedAt: new Date(card.updated_at),
  })) as Card[];
}

/**
 * Get a single card by ID
 */
export async function getCard(id: string): Promise<Card | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      decks!inner(owner_id)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  // Verify ownership through deck
  if ((data.decks as any).owner_id !== user.id) {
    throw new Error('Unauthorized');
  }

  return {
    id: data.id,
    deckId: data.deck_id,
    front: data.front,
    back: data.back,
    tags: data.tags || [],
    status: data.status,
    ease: data.ease,
    interval: data.interval,
    nextReview: data.next_review ? new Date(data.next_review) : undefined,
    lastReviewed: data.last_reviewed ? new Date(data.last_reviewed) : undefined,
    reviewCount: data.review_count || 0,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  } as Card;
}

/**
 * Create a new card
 */
export async function createCard(deckId: string, cardData: CreateCardData): Promise<Card> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify user owns the deck
  const { data: deck } = await supabase
    .from('decks')
    .select('owner_id')
    .eq('id', deckId)
    .single();

  if (!deck) throw new Error('Deck not found');
  if (deck.owner_id !== user.id) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('cards')
    .insert({
      deck_id: deckId,
      front: cardData.front,
      back: cardData.back,
      tags: cardData.tags || [],
      status: 'new',
      ease: 2.5,
      interval: 0,
      review_count: 0,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    deckId: data.deck_id,
    front: data.front,
    back: data.back,
    tags: data.tags || [],
    status: data.status,
    ease: data.ease,
    interval: data.interval,
    nextReview: data.next_review ? new Date(data.next_review) : undefined,
    lastReviewed: data.last_reviewed ? new Date(data.last_reviewed) : undefined,
    reviewCount: data.review_count || 0,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  } as Card;
}

/**
 * Update a card
 */
export async function updateCard(id: string, updates: UpdateCardData): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify ownership through deck
  const card = await getCard(id);
  if (!card) throw new Error('Card not found');

  const updateData: any = {};
  if (updates.front !== undefined) updateData.front = updates.front;
  if (updates.back !== undefined) updateData.back = updates.back;
  if (updates.tags !== undefined) updateData.tags = updates.tags;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.ease !== undefined) updateData.ease = updates.ease;
  if (updates.interval !== undefined) updateData.interval = updates.interval;
  if (updates.nextReview !== undefined) {
    updateData.next_review = updates.nextReview ? updates.nextReview.toISOString() : null;
  }
  if (updates.lastReviewed !== undefined) {
    updateData.last_reviewed = updates.lastReviewed ? updates.lastReviewed.toISOString() : null;
  }
  if (updates.reviewCount !== undefined) updateData.review_count = updates.reviewCount;

  const { error } = await supabase
    .from('cards')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a card
 */
export async function deleteCard(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify ownership through deck
  const card = await getCard(id);
  if (!card) throw new Error('Card not found');

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get due cards for a deck (cards that need review)
 */
export async function getDueCards(deckId: string): Promise<Card[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify user owns the deck
  const { data: deck } = await supabase
    .from('decks')
    .select('owner_id')
    .eq('id', deckId)
    .single();

  if (!deck) throw new Error('Deck not found');
  if (deck.owner_id !== user.id) throw new Error('Unauthorized');

  const now = new Date().toISOString();

  // Get all cards for the deck
  const { data: allCards, error: fetchError } = await supabase
    .from('cards')
    .select('*')
    .eq('deck_id', deckId);

  if (fetchError) throw fetchError;

  // Filter due cards: new, learning, review, or next_review is null/past
  const dueCards = (allCards || []).filter((card) => {
    if (card.status === 'new' || card.status === 'learning' || card.status === 'review') {
      if (!card.next_review) return true;
      return new Date(card.next_review) <= new Date(now);
    }
    return false;
  });

  // Sort by next_review (nulls first, then by date)
  dueCards.sort((a, b) => {
    if (!a.next_review && !b.next_review) return 0;
    if (!a.next_review) return -1;
    if (!b.next_review) return 1;
    return new Date(a.next_review).getTime() - new Date(b.next_review).getTime();
  });

  return dueCards.map((card) => ({
    id: card.id,
    deckId: card.deck_id,
    front: card.front,
    back: card.back,
    tags: card.tags || [],
    status: card.status,
    ease: card.ease,
    interval: card.interval,
    nextReview: card.next_review ? new Date(card.next_review) : undefined,
    lastReviewed: card.last_reviewed ? new Date(card.last_reviewed) : undefined,
    reviewCount: card.review_count || 0,
    createdAt: new Date(card.created_at),
    updatedAt: new Date(card.updated_at),
  })) as Card[];
}

