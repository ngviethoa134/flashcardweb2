import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Edit3, 
  Trash2, 
  Clock, 
  Layers,
  Globe,
  Lock,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Deck } from '@/types/flashcard';
import { formatDistanceToNow } from 'date-fns';

interface DeckCardProps {
  deck: Deck;
  onDelete?: (id: string) => void;
  index?: number;
}

export function DeckCard({ deck, onDelete, index = 0 }: DeckCardProps) {
  const navigate = useNavigate();

  const categoryColors: Record<string, string> = {
    Language: 'bg-blue-500/10 text-blue-600 border-blue-200',
    Science: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    Technology: 'bg-violet-500/10 text-violet-600 border-violet-200',
    History: 'bg-amber-500/10 text-amber-600 border-amber-200',
    Math: 'bg-rose-500/10 text-rose-600 border-rose-200',
    default: 'bg-primary/10 text-primary border-primary/20',
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl border border-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Accent gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary opacity-80" />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={`text-xs ${getCategoryColor(deck.category)}`}>
                {deck.category}
              </Badge>
              {deck.isPublic ? (
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <h3 
              className="font-semibold text-lg truncate cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate(`/deck/${deck.id}`)}
            >
              {deck.title}
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => navigate(`/deck/${deck.id}/edit`)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(deck.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
          {deck.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{deck.cardCount}</span>
            <span className="text-muted-foreground">cards</span>
          </div>
          {deck.dueCards > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">{deck.dueCards}</span>
              <span className="text-muted-foreground">due</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Mastered</span>
            <span>{Math.round((deck.masteredCards / Math.max(deck.cardCount, 1)) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(deck.masteredCards / Math.max(deck.cardCount, 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {deck.lastStudied 
              ? `Studied ${formatDistanceToNow(deck.lastStudied, { addSuffix: true })}`
              : 'Not studied yet'
            }
          </span>
          <Button 
            size="sm" 
            onClick={() => navigate(`/study/${deck.id}`)}
            disabled={deck.cardCount === 0}
          >
            <Play className="h-4 w-4 mr-1" />
            Study
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
