import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Flame,
  Layers,
  Play,
  TrendingUp,
  Clock,
  BookOpen,
  Filter,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { DeckCard } from '@/components/cards/DeckCard';
import { CreateDeckForm } from '@/components/forms/CreateDeckForm';
import { useAuth } from '@/contexts/AuthContext';
import { useDecks } from '@/contexts/DeckContext';
import { useToast } from '@/hooks/use-toast';

const categories = ['All', 'Language', 'Science', 'Technology', 'History', 'Math', 'Other'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { decks, deleteDeck, addDeck } = useDecks();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags from decks
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    decks.forEach(deck => deck.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [decks]);

  const filteredDecks = useMemo(() => {
    return decks.filter(deck => {
      const matchesSearch = 
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || deck.category === selectedCategory;
      
      const matchesTag = !selectedTag || deck.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [decks, searchQuery, selectedCategory, selectedTag]);

  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0);
  const totalDueCards = decks.reduce((sum, deck) => sum + deck.dueCards, 0);
  const totalMastered = decks.reduce((sum, deck) => sum + deck.masteredCards, 0);

  const handleCreateDeck = async (data: {
    title: string;
    description: string;
    tags: string[];
    isPublic: boolean;
    category: string;
  }) => {
    try {
      const newDeck = await addDeck({
        ...data,
        ownerId: user?.id || '',
        ownerName: user?.displayName,
      });
      setIsCreateModalOpen(false);
      toast({
        title: 'Deck created!',
        description: `"${newDeck.title}" is ready. Add some cards to get started.`,
      });
      navigate(`/deck/${newDeck.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDeck = async (id: string) => {
    const deck = decks.find(d => d.id === id);
    try {
      await deleteDeck(id);
      toast({
        title: 'Deck deleted',
        description: `"${deck?.title}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedTag(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedTag !== null || searchQuery !== '';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-8"
          style={{ background: 'var(--gradient-subtle)' }}
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {user?.displayName || 'Learner'}!
                </h1>
                <p className="text-muted-foreground">
                  {totalDueCards > 0 
                    ? `You have ${totalDueCards} cards waiting for review.`
                    : 'Great job! You\'re all caught up on reviews.'
                  }
                </p>
              </div>
              
              {/* Streak Badge */}
              {user && user.studyStreak > 0 && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: 'var(--gradient-streak)' }}>
                  <Flame className="h-8 w-8 text-white" />
                  <div className="text-white">
                    <p className="text-2xl font-bold">{user.studyStreak}</p>
                    <p className="text-sm opacity-80">Day Streak</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{decks.length}</p>
                <p className="text-sm text-muted-foreground">Decks</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCards}</p>
                <p className="text-sm text-muted-foreground">Total Cards</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDueCards}</p>
                <p className="text-sm text-muted-foreground">Due Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMastered}</p>
                <p className="text-sm text-muted-foreground">Mastered</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => setIsCreateModalOpen(true)}
              className="shrink-0"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Deck
            </Button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your decks..."
                className="pl-10 h-12"
              />
            </div>
            
            <div className="flex gap-1 p-1 bg-secondary rounded-lg shrink-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] h-9">
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

            {allTags.length > 0 && (
              <Select value={selectedTag || 'all'} onValueChange={(v) => setSelectedTag(v === 'all' ? null : v)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      #{tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Decks Grid */}
        {filteredDecks.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredDecks.map((deck, index) => (
              <DeckCard 
                key={deck.id} 
                deck={deck} 
                onDelete={handleDeleteDeck}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {hasActiveFilters ? 'No decks found' : 'No decks yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search term.'
                : 'Create your first deck to start learning!'
              }
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Deck
              </Button>
            )}
          </motion.div>
        )}
      </main>

      {/* Create Deck Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Deck</DialogTitle>
          </DialogHeader>
          <CreateDeckForm
            onSubmit={handleCreateDeck}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
