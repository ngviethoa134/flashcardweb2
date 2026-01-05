import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Deck } from '@/types/flashcard';

const categories = ['Language', 'Science', 'Technology', 'History', 'Math', 'Other'];

interface EditDeckFormProps {
  deck: Deck;
  onSubmit: (data: { title: string; description: string; tags: string[]; isPublic: boolean; category: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditDeckForm({ deck, onSubmit, onCancel, isLoading }: EditDeckFormProps) {
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description || '');
  const [tags, setTags] = useState<string[]>(deck.tags);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState(deck.category);
  const [isPublic, setIsPublic] = useState(deck.isPublic);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      tags,
      isPublic,
      category,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter deck title"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your deck..."
          rows={3}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (max 5)</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={handleAddTag} disabled={tags.length >= 5}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Public Toggle */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
        <div className="flex items-center gap-3">
          {isPublic ? (
            <Globe className="h-5 w-5 text-success" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">
              {isPublic ? 'Public Deck' : 'Private Deck'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPublic 
                ? 'Anyone can discover and clone this deck' 
                : 'Only you can see this deck'
              }
            </p>
          </div>
        </div>
        <Switch
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim() || isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.form>
  );
}
