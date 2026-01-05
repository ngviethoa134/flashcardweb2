import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Flame, 
  Edit3, 
  Save, 
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useDecks } from '@/contexts/DeckContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import * as authService from '@/services/auth.service';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { decks } = useDecks();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  // Update form when user changes
  useEffect(() => {
    setDisplayName(user?.displayName || '');
    setBio(user?.bio || '');
  }, [user]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast({
        title: 'Error',
        description: 'Display name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await authService.updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
      });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
      });
      setIsEditing(false);
      // Refresh user data by logging out and back in, or reload
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setBio(user?.bio || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-8"
          style={{ background: 'var(--gradient-subtle)' }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatar} alt={user?.displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {user?.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display Name"
                    className="text-xl font-bold max-w-xs"
                  />
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="max-w-md resize-none"
                    rows={2}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{user?.displayName}</h1>
                  <p className="text-muted-foreground mb-3">
                    {user?.bio || 'No bio yet. Click edit to add one!'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Joined {user?.createdAt ? format(user.createdAt, 'MMMM yyyy') : 'Recently'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Streak & Edit Button */}
            <div className="flex flex-col items-end gap-3">
              {user && user.studyStreak > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'var(--gradient-streak)' }}>
                  <Flame className="h-6 w-6 text-white" />
                  <div className="text-white">
                    <p className="text-xl font-bold leading-none">{user.studyStreak}</p>
                    <p className="text-xs opacity-80">Day Streak</p>
                  </div>
                </div>
              )}
              
              {isEditing ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Your Decks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Your Decks</h2>
          
          {decks.length > 0 ? (
            <div className="space-y-3">
              {decks.slice(0, 5).map((deck) => (
                <div 
                  key={deck.id}
                  onClick={() => navigate(`/deck/${deck.id}`)}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium">{deck.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {deck.cardCount} cards · {deck.isPublic ? 'Public' : 'Private'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">
                      {deck.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No decks yet. Create your first deck to get started!
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
