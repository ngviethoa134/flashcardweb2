import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  X,
  Trophy,
  Home,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { StudyCard } from '@/components/cards/StudyCard';
import { useDecks } from '@/contexts/DeckContext';
import { useToast } from '@/hooks/use-toast';
import { Card, Rating } from '@/types/flashcard';
import { calculateNextReview } from '@/lib/spaced-repetition';
import * as cardService from '@/services/card.service';

export default function StudyMode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDeck, getDueCards, refreshCards, refreshDecks } = useDecks();
  const { toast } = useToast();
  
  const [studyCards, setStudyCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const deck = getDeck(id || '');

  // Load due cards when deck is viewed
  useEffect(() => {
    const loadDueCards = async () => {
      if (id && deck) {
        setIsLoading(true);
        try {
          const dueCards = await cardService.getDueCards(id);
          setStudyCards(dueCards);
          if (dueCards.length === 0) {
            setIsComplete(true);
          }
        } catch (error) {
          console.error('Error loading due cards:', error);
          toast({
            title: 'Error',
            description: 'Failed to load cards. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadDueCards();
  }, [id, deck, toast]);

  const currentCard = studyCards[currentIndex];
  const progress = studyCards.length > 0 ? ((currentIndex + 1) / studyCards.length) * 100 : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleRate = useCallback(async (rating: Rating) => {
    const currentCard = studyCards[currentIndex];
    if (!currentCard) return;

    try {
      // Calculate new card parameters using spaced repetition
      const result = calculateNextReview(currentCard, rating);
      
      // Update card in database
      await cardService.updateCard(currentCard.id, {
        status: result.status,
        ease: result.ease,
        interval: result.interval,
        nextReview: result.nextReview,
        lastReviewed: new Date(),
        reviewCount: currentCard.reviewCount + 1,
      });

      // Remove card from study list or move to next
      const remainingCards = studyCards.filter((_, idx) => idx !== currentIndex);
      setStudyCards(remainingCards);

      if (remainingCards.length === 0) {
        setIsComplete(true);
        // Refresh deck stats
        await refreshDecks();
      } else {
        // Stay at same index (which now points to next card) or reset if at end
        if (currentIndex >= remainingCards.length) {
          setCurrentIndex(remainingCards.length - 1);
        }
        setIsFlipped(false);
      }
    } catch (error) {
      console.error('Error updating card:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress. Please try again.',
        variant: 'destructive',
      });
    }
  }, [currentIndex, studyCards, toast, refreshDecks]);

  const handleNext = useCallback(() => {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, studyCards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) {
          handleFlip();
        }
      } else if (e.key === 'ArrowRight') {
        if (isFlipped) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'Escape') {
        navigate(`/deck/${id}`);
      } else if (isFlipped) {
        // Rating shortcuts: 1=Again, 2=Hard, 3=Good, 4=Easy
        if (e.key === '1') {
          e.preventDefault();
          handleRate('again');
        } else if (e.key === '2') {
          e.preventDefault();
          handleRate('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          handleRate('good');
        } else if (e.key === '4') {
          e.preventDefault();
          handleRate('easy');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete, isFlipped, handleFlip, handleNext, handlePrevious, handleRate, navigate, id]);

  if (!deck) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Deck not found</h1>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (studyCards.length === 0 && !isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">No cards yet</h1>
          <p className="text-muted-foreground mb-6">
            Add some cards to this deck to start studying.
          </p>
          <Button onClick={() => navigate(`/deck/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deck
          </Button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Trophy Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6"
              style={{ background: 'var(--gradient-success)' }}
            >
              <Trophy className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-2">Well Done!</h1>
            <p className="text-muted-foreground mb-8">
              You've gone through all {studyCards.length} cards in "{deck.title}"
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate(`/deck/${id}`)}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Deck
              </Button>
              <Button 
                variant="default" 
                size="lg"
                onClick={async () => {
                  if (id) {
                    setIsLoading(true);
                    try {
                      const dueCards = await cardService.getDueCards(id);
                      setStudyCards(dueCards);
                      setCurrentIndex(0);
                      setIsFlipped(false);
                      setIsComplete(dueCards.length === 0);
                    } catch (error) {
                      console.error('Error loading cards:', error);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Study Again
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Study Interface
  return (
    <div className="min-h-screen bg-background">
      {/* Study Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/deck/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{deck.title}</span>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {studyCards.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => navigate(`/deck/${id}`)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container py-8 md:py-16">
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading cards...</p>
          </div>
        ) : currentCard ? (
          <StudyCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onRate={handleRate}
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < studyCards.length - 1}
          />
        ) : null}
      </main>
    </div>
  );
}
