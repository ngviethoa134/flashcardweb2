import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Globe, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateDeckFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    tags: string[];
    isPublic: boolean;
    category: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = [
  'Language',
  'Science',
  'Technology',
  'History',
  'Math',
  'Arts',
  'Business',
  'Health',
  'Other',
];

export function CreateDeckForm({ onSubmit, onCancel, isLoading }: CreateDeckFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [category, setCategory] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && category) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        tags,
        isPublic,
        category,
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Deck Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Spanish Vocabulary"
          maxLength={100}
          className="h-12"
          required
        />
        <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Category <span className="text-destructive">*</span>
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What will you learn from this deck?"
          maxLength={500}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tags</Label>
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
          <Button type="button" variant="outline" onClick={handleAddTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Visibility */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
        <div className="flex items-center gap-3">
          {isPublic ? (
            <Globe className="h-5 w-5 text-success" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">{isPublic ? 'Public Deck' : 'Private Deck'}</p>
            <p className="text-sm text-muted-foreground">
              {isPublic 
                ? 'Anyone can view and clone this deck'
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
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={!title.trim() || !category || isLoading}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create Deck
        </Button>
      </div>
    </motion.form>
  );
}
