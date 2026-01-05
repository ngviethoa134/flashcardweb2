import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Edit3, 
  Trash2, 
  Globe, 
  Lock,
  Search,
  MoreVertical,
  Layers,
  Clock,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Header } from '@/components/layout/Header';
import { CreateCardForm } from '@/components/forms/CreateCardForm';
import { EditDeckForm } from '@/components/forms/EditDeckForm';
import { EditCardForm } from '@/components/forms/EditCardForm';
import { useDecks } from '@/contexts/DeckContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/types/flashcard';

export default function DeckView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDeck, getCards, addCard, updateCard, deleteCard, updateDeck, toggleDeckPublic, refreshCards } = useDecks();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditDeckOpen, setIsEditDeckOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  
  const deck = getDeck(id || '');
  const cards = getCards(id || '');

  // Load cards when deck is viewed
  useEffect(() => {
    if (id && deck) {
      refreshCards(id);
    }
  }, [id, deck, refreshCards]);
  
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

  const filteredCards = cards.filter(card => 
    card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.back.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    new: cards.filter(c => c.status === 'new').length,
    learning: cards.filter(c => c.status === 'learning').length,
    review: cards.filter(c => c.status === 'review').length,
    mastered: cards.filter(c => c.status === 'mastered').length,
  };

  const handleAddCard = async (data: { front: string; back: string; tags: string[] }, addAnother: boolean) => {
    try {
      await addCard(deck.id, data);
      await refreshCards(deck.id);
      toast({
        title: 'Card added!',
        description: addAnother ? 'Add another card below.' : 'Your card has been created.',
      });
      if (!addAnother) {
        setIsAddCardOpen(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add card. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditCard = async (data: { front: string; back: string; tags: string[] }) => {
    if (editingCard) {
      try {
        await updateCard(deck.id, editingCard.id, data);
        toast({
          title: 'Card updated!',
          description: 'Your changes have been saved.',
        });
        setEditingCard(null);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update card. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(deck.id, cardId);
      toast({
        title: 'Card deleted',
        description: 'The card has been removed from this deck.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete card. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditDeck = async (data: { title: string; description: string; tags: string[]; isPublic: boolean; category: string }) => {
    try {
      await updateDeck(deck.id, data);
      toast({
        title: 'Deck updated!',
        description: 'Your changes have been saved.',
      });
      setIsEditDeckOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublic = () => {
    toggleDeckPublic(deck.id);
    toast({
      title: deck.isPublic ? 'Deck is now private' : 'Deck is now public',
      description: deck.isPublic 
        ? 'Only you can see this deck.' 
        : 'Anyone can discover and clone this deck.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'learning': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'review': return 'bg-violet-500/10 text-violet-600 border-violet-200';
      case 'mastered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Deck Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {deck.category}
                </Badge>
                <button
                  onClick={handleTogglePublic}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors hover:bg-secondary"
                >
                  {deck.isPublic ? (
                    <>
                      <Globe className="h-3 w-3 text-success" />
                      <span className="text-success">Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Private</span>
                    </>
                  )}
                </button>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{deck.title}</h1>
              <p className="text-muted-foreground">{deck.description || 'No description'}</p>
              
              {deck.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {deck.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate(`/study/${deck.id}`)}
                disabled={cards.length === 0}
              >
                <Play className="h-5 w-5 mr-2" />
                Study Now
              </Button>
              <Button variant="outline" size="lg" onClick={() => setIsEditDeckOpen(true)}>
                <Edit3 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Layers className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.new}</p>
                <p className="text-sm text-muted-foreground">New</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <BookOpen className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.learning}</p>
                <p className="text-sm text-muted-foreground">Learning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Clock className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.review}</p>
                <p className="text-sm text-muted-foreground">Review</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.mastered}</p>
                <p className="text-sm text-muted-foreground">Mastered</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button onClick={() => setIsAddCardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Cards List */}
        {filteredCards.length > 0 ? (
          <div className="space-y-3">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Front</p>
                      <p className="font-medium">{card.front}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Back</p>
                      <p className="text-muted-foreground">{card.back}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getStatusColor(card.status)}`}>
                      {card.status}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingCard(card)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the card and its study progress.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCard(card.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-card rounded-2xl border border-border"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No cards found' : 'No cards yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try a different search term.'
                : 'Add your first card to start learning!'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsAddCardOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Card
              </Button>
            )}
          </motion.div>
        )}
      </main>

      {/* Add Card Modal */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Card</DialogTitle>
          </DialogHeader>
          <CreateCardForm
            onSubmit={handleAddCard}
            onCancel={() => setIsAddCardOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Deck Modal */}
      <Dialog open={isEditDeckOpen} onOpenChange={setIsEditDeckOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Deck</DialogTitle>
          </DialogHeader>
          <EditDeckForm
            deck={deck}
            onSubmit={handleEditDeck}
            onCancel={() => setIsEditDeckOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Card Modal */}
      <Dialog open={!!editingCard} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Card</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <EditCardForm
              card={editingCard}
              onSubmit={handleEditCard}
              onCancel={() => setEditingCard(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
