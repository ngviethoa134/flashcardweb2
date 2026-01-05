import { supabase } from '@/lib/supabase';
import { Deck } from '@/types/flashcard';

export interface CreateDeckData {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  category: string;
}

export interface UpdateDeckData extends Partial<CreateDeckData> {}

/**
 * Get all decks for the current user
 */
export async function getUserDecks(): Promise<Deck[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('decks')
    .select(`
      *,
      profiles!decks_owner_id_fkey(display_name)
    `)
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Get card counts and stats for each deck
  const decksWithStats = await Promise.all(
    (data || []).map(async (deck) => {
      const stats = await getDeckStats(deck.id);
      return {
        id: deck.id,
        title: deck.title,
        description: deck.description,
        tags: deck.tags || [],
        isPublic: deck.is_public,
        category: deck.category,
        cardCount: stats.totalCards,
        dueCards: stats.dueCards,
        masteredCards: stats.masteredCards,
        lastStudied: deck.last_studied ? new Date(deck.last_studied) : undefined,
        createdAt: new Date(deck.created_at),
        updatedAt: new Date(deck.updated_at),
        ownerId: deck.owner_id,
        ownerName: (deck.profiles as any)?.display_name,
      } as Deck;
    })
  );

  return decksWithStats;
}

/**
 * Get a single deck by ID
 */
export async function getDeck(id: string): Promise<Deck | null> {
  const { data, error } = await supabase
    .from('decks')
    .select(`
      *,
      profiles!decks_owner_id_fkey(display_name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  const stats = await getDeckStats(id);

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    tags: data.tags || [],
    isPublic: data.is_public,
    category: data.category,
    cardCount: stats.totalCards,
    dueCards: stats.dueCards,
    masteredCards: stats.masteredCards,
    lastStudied: data.last_studied ? new Date(data.last_studied) : undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    ownerId: data.owner_id,
    ownerName: (data.profiles as any)?.display_name,
  } as Deck;
}

/**
 * Create a new deck
 */
export async function createDeck(deckData: CreateDeckData): Promise<Deck> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('decks')
    .insert({
      title: deckData.title,
      description: deckData.description,
      tags: deckData.tags,
      is_public: deckData.isPublic,
      category: deckData.category,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    tags: data.tags || [],
    isPublic: data.is_public,
    category: data.category,
    cardCount: 0,
    dueCards: 0,
    masteredCards: 0,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    ownerId: data.owner_id,
  } as Deck;
}

/**
 * Update a deck
 */
export async function updateDeck(id: string, updates: UpdateDeckData): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.tags !== undefined) updateData.tags = updates.tags;
  if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
  if (updates.category !== undefined) updateData.category = updates.category;

  const { error } = await supabase
    .from('decks')
    .update(updateData)
    .eq('id', id)
    .eq('owner_id', user.id); // Ensure user owns the deck

  if (error) throw error;
}

/**
 * Delete a deck
 */
export async function deleteDeck(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('decks')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id); // Ensure user owns the deck

  if (error) throw error;
}

/**
 * Get public decks (for explore page)
 */
export async function getPublicDecks(): Promise<Deck[]> {
  const { data, error } = await supabase
    .from('decks')
    .select(`
      *,
      profiles!decks_owner_id_fkey(display_name)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;

  return (data || []).map((deck) => ({
    id: deck.id,
    title: deck.title,
    description: deck.description,
    tags: deck.tags || [],
    isPublic: deck.is_public,
    category: deck.category,
    cardCount: 0, // Will be calculated if needed
    dueCards: 0,
    masteredCards: 0,
    createdAt: new Date(deck.created_at),
    updatedAt: new Date(deck.updated_at),
    ownerId: deck.owner_id,
    ownerName: (deck.profiles as any)?.display_name,
  })) as Deck[];
}

/**
 * Clone a public deck
 */
export async function cloneDeck(deckId: string): Promise<Deck> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get the source deck
  const sourceDeck = await getDeck(deckId);
  if (!sourceDeck) throw new Error('Deck not found');
  if (!sourceDeck.isPublic && sourceDeck.ownerId !== user.id) {
    throw new Error('Cannot clone private deck');
  }

  // Create new deck
  const newDeck = await createDeck({
    title: `${sourceDeck.title} (Copy)`,
    description: sourceDeck.description,
    tags: sourceDeck.tags,
    isPublic: false,
    category: sourceDeck.category,
  });

  // Clone cards
  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('deck_id', deckId);

  if (cards && cards.length > 0) {
    const newCards = cards.map((card) => ({
      deck_id: newDeck.id,
      front: card.front,
      back: card.back,
      tags: card.tags || [],
      status: 'new',
      ease: 2.5,
      interval: 0,
      review_count: 0,
    }));

    await supabase.from('cards').insert(newCards);
  }

  return newDeck;
}

/**
 * Get deck statistics
 */
async function getDeckStats(deckId: string) {
  const { data: cards } = await supabase
    .from('cards')
    .select('status, next_review')
    .eq('deck_id', deckId);

  if (!cards) {
    return { totalCards: 0, dueCards: 0, masteredCards: 0 };
  }

  const now = new Date();
  const dueCards = cards.filter(
    (card) =>
      card.status === 'new' ||
      (card.next_review && new Date(card.next_review) <= now)
  ).length;

  const masteredCards = cards.filter((card) => card.status === 'mastered').length;

  return {
    totalCards: cards.length,
    dueCards,
    masteredCards,
  };
}


