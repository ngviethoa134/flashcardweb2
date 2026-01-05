import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Layers,
  Users,
  Copy,
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useDecks } from '@/contexts/DeckContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Deck } from '@/types/flashcard';

const categories = ['All', 'Language', 'Science', 'Technology', 'History', 'Math'];

function PublicDeckCard({ 
  deck, 
  onClone, 
  isAuthenticated 
}: { 
  deck: Deck; 
  onClone: (deck: Deck) => void;
  isAuthenticated: boolean;
}) {
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
      className="group bg-card rounded-2xl border border-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary-glow to-accent opacity-70" />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`text-xs ${getCategoryColor(deck.category)}`}>
                {deck.category}
              </Badge>
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{deck.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {deck.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {deck.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            {deck.cardCount} cards
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {deck.ownerName || 'Anonymous'}
          </span>
        </div>

        {/* Clone Button */}
        <Button 
          className="w-full"
          onClick={() => onClone(deck)}
          disabled={!isAuthenticated}
        >
          <Copy className="h-4 w-4 mr-2" />
          {isAuthenticated ? 'Clone to My Library' : 'Sign in to Clone'}
        </Button>
      </div>
    </motion.div>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getPublicDecks, cloneDeck } = useDecks();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const publicDecks = getPublicDecks();

  const filteredDecks = publicDecks.filter(deck => {
    const matchesSearch = 
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || deck.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleClone = async (deck: Deck) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const clonedDeck = await cloneDeck(deck.id);
      if (clonedDeck) {
        toast({
          title: 'Deck cloned!',
          description: `"${deck.title}" has been added to your library.`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to clone deck. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clone deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Community Decks</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Explore Public Flashcard Decks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and clone flashcard decks created by the community. 
            Start learning instantly with pre-made study materials.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decks by title, description, or tags..."
              className="pl-10 h-12"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 h-12">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-6"
        >
          Showing {filteredDecks.length} deck{filteredDecks.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Decks Grid */}
        {filteredDecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <PublicDeckCard 
                  deck={deck} 
                  onClone={handleClone}
                  isAuthenticated={isAuthenticated}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No decks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </motion.div>
        )}

        {/* CTA for non-authenticated users */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 text-center p-8 rounded-2xl border border-border bg-card"
          >
            <h3 className="text-xl font-semibold mb-2">Ready to start learning?</h3>
            <p className="text-muted-foreground mb-4">
              Sign up to clone decks, create your own, and track your progress.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button variant="hero" onClick={() => navigate('/signup')}>
                Get Started Free
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
