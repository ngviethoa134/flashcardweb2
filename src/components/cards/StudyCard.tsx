import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card as CardType, Rating } from '@/types/flashcard';

interface StudyCardProps {
  card: CardType;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRate: (rating: Rating) => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function StudyCard({ card, isFlipped, onFlip, onNext, onPrevious, onRate, hasPrevious, hasNext }: StudyCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Container */}
      <div 
        className="relative w-full aspect-[4/3] cursor-pointer animate-card-flip"
        onClick={onFlip}
      >
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 bg-card rounded-3xl shadow-xl border border-border p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Front
              </div>
              <p className="text-2xl md:text-3xl font-medium leading-relaxed">
                {card.front}
              </p>
              <div className="absolute bottom-6 flex items-center gap-2 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Click or press Space to flip</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 bg-gradient-to-br from-card to-secondary/30 rounded-3xl shadow-xl border border-border p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute top-4 left-4 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                Back
              </div>
              <p className="text-2xl md:text-3xl font-medium leading-relaxed">
                {card.back}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating Buttons (only show when flipped) */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-4 gap-3"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => onRate('again')}
            className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400"
          >
            Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onRate('hard')}
            className="bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-400"
          >
            Hard
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onRate('good')}
            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400"
          >
            Good
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onRate('easy')}
            className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400"
          >
            Easy
          </Button>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex justify-center gap-4"
      >
        <Button 
          size="lg" 
          variant="outline" 
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="min-w-[140px]"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>
        {!isFlipped ? (
          <Button 
            size="lg" 
            variant="hero" 
            onClick={onFlip}
            className="min-w-[140px]"
          >
            Show Answer
          </Button>
        ) : (
          <Button 
            size="lg" 
            variant="hero" 
            onClick={onNext}
            disabled={!hasNext}
            className="min-w-[140px]"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        )}
      </motion.div>

      {/* Keyboard hints */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          {!isFlipped ? (
            <>
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">Space</kbd>
              {' '}to flip
            </>
          ) : (
            <>
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">1</kbd> Again • 
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">2</kbd> Hard • 
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">3</kbd> Good • 
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">4</kbd> Easy
            </>
          )}
        </p>
      </div>
    </div>
  );
}
