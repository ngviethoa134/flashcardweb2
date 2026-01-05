import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Deck, Card } from '@/types/flashcard';
import { useAuth } from './AuthContext';
import * as deckService from '@/services/deck.service';
import * as cardService from '@/services/card.service';

interface DeckContextType {
  decks: Deck[];
  cards: Record<string, Card[]>;
  publicDecks: Deck[];
  isLoading: boolean;
  refreshDecks: () => Promise<void>;
  refreshCards: (deckId: string) => Promise<void>;
  addDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'cardCount' | 'dueCards' | 'masteredCards'>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  getDeck: (id: string) => Deck | undefined;
  addCard: (deckId: string, card: Omit<Card, 'id' | 'deckId' | 'createdAt' | 'updatedAt' | 'status' | 'ease' | 'interval' | 'reviewCount'>) => Promise<Card>;
  updateCard: (deckId: string, cardId: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (deckId: string, cardId: string) => Promise<void>;
  getCards: (deckId: string) => Card[];
  getDueCards: (deckId: string) => Card[];
  cloneDeck: (deckId: string) => Promise<Deck | null>;
  toggleDeckPublic: (deckId: string) => Promise<void>;
  getPublicDecks: () => Deck[];
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Record<string, Card[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load decks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshDecks();
      refreshPublicDecks();
    } else {
      setDecks([]);
      setCards({});
    }
  }, [isAuthenticated]);

  const refreshDecks = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const userDecks = await deckService.getUserDecks();
      setDecks(userDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const refreshPublicDecks = useCallback(async () => {
    try {
      const publicDecksData = await deckService.getPublicDecks();
      setPublicDecks(publicDecksData);
    } catch (error) {
      console.error('Error loading public decks:', error);
    }
  }, []);

  const refreshCards = useCallback(async (deckId: string) => {
    if (!isAuthenticated) return;
    try {
      const deckCards = await cardService.getDeckCards(deckId);
      setCards(prev => ({ ...prev, [deckId]: deckCards }));
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  }, [isAuthenticated]);

  const addDeck = useCallback(async (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'cardCount' | 'dueCards' | 'masteredCards'>) => {
    const newDeck = await deckService.createDeck({
      title: deckData.title,
      description: deckData.description,
      tags: deckData.tags,
      isPublic: deckData.isPublic,
      category: deckData.category,
    });
    setDecks(prev => [...prev, newDeck]);
    setCards(prev => ({ ...prev, [newDeck.id]: [] }));
    return newDeck;
  }, []);

  const updateDeck = useCallback(async (id: string, updates: Partial<Deck>) => {
    await deckService.updateDeck(id, {
      title: updates.title,
      description: updates.description,
      tags: updates.tags,
      isPublic: updates.isPublic,
      category: updates.category,
    });
    await refreshDecks();
  }, [refreshDecks]);

  const deleteDeck = useCallback(async (id: string) => {
    await deckService.deleteDeck(id);
    setDecks(prev => prev.filter(deck => deck.id !== id));
    setCards(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const getDeck = useCallback((id: string) => {
    return decks.find(deck => deck.id === id) || publicDecks.find(deck => deck.id === id);
  }, [decks, publicDecks]);

  const addCard = useCallback(async (deckId: string, cardData: Omit<Card, 'id' | 'deckId' | 'createdAt' | 'updatedAt' | 'status' | 'ease' | 'interval' | 'reviewCount'>) => {
    const newCard = await cardService.createCard(deckId, {
      front: cardData.front,
      back: cardData.back,
      tags: cardData.tags,
    });
    setCards(prev => ({
      ...prev,
      [deckId]: [...(prev[deckId] || []), newCard],
    }));
    await refreshDecks();
    return newCard;
  }, [refreshDecks]);

  const updateCard = useCallback(async (deckId: string, cardId: string, updates: Partial<Card>) => {
    await cardService.updateCard(cardId, {
      front: updates.front,
      back: updates.back,
      tags: updates.tags,
      status: updates.status,
      ease: updates.ease,
      interval: updates.interval,
      nextReview: updates.nextReview,
      lastReviewed: updates.lastReviewed,
      reviewCount: updates.reviewCount,
    });
    await refreshCards(deckId);
  }, [refreshCards]);

  const deleteCard = useCallback(async (deckId: string, cardId: string) => {
    await cardService.deleteCard(cardId);
    setCards(prev => ({
      ...prev,
      [deckId]: (prev[deckId] || []).filter(card => card.id !== cardId),
    }));
    await refreshDecks();
  }, [refreshDecks]);

  const getCards = useCallback((deckId: string) => {
    return cards[deckId] || [];
  }, [cards]);

  const getDueCards = useCallback((deckId: string) => {
    const deckCards = cards[deckId] || [];
    return deckCards.filter(card => 
      card.status === 'new' || 
      card.status === 'learning' || 
      card.status === 'review'
    );
  }, [cards]);

  const cloneDeck = useCallback(async (deckId: string) => {
    try {
      const clonedDeck = await deckService.cloneDeck(deckId);
      if (clonedDeck) {
        await refreshDecks();
        await refreshCards(clonedDeck.id);
      }
      return clonedDeck;
    } catch (error) {
      console.error('Error cloning deck:', error);
      return null;
    }
  }, [refreshDecks, refreshCards]);

  const toggleDeckPublic = useCallback(async (deckId: string) => {
    const deck = getDeck(deckId);
    if (!deck) return;
    await deckService.updateDeck(deckId, { isPublic: !deck.isPublic });
    await refreshDecks();
  }, [getDeck, refreshDecks]);

  const getPublicDecks = useCallback(() => {
    const userPublicDecks = decks.filter(d => d.isPublic);
    return [...publicDecks, ...userPublicDecks];
  }, [decks, publicDecks]);

  return (
    <DeckContext.Provider
      value={{
        decks,
        cards,
        publicDecks,
        isLoading,
        refreshDecks,
        refreshCards,
        addDeck,
        updateDeck,
        deleteDeck,
        getDeck,
        addCard,
        updateCard,
        deleteCard,
        getCards,
        getDueCards,
        cloneDeck,
        toggleDeckPublic,
        getPublicDecks,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
}

export function useDecks() {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDecks must be used within a DeckProvider');
  }
  return context;
}
