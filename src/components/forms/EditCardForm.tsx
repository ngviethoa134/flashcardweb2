import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card } from '@/types/flashcard';

interface EditCardFormProps {
  card: Card;
  onSubmit: (data: { front: string; back: string; tags: string[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditCardForm({ card, onSubmit, onCancel, isLoading }: EditCardFormProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [tags, setTags] = useState<string[]>(card.tags);
  const [tagInput, setTagInput] = useState('');

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
    if (!front.trim() || !back.trim()) return;
    
    onSubmit({
      front: front.trim(),
      back: back.trim(),
      tags,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Front */}
      <div className="space-y-2">
        <Label htmlFor="front">Front (Question)</Label>
        <Textarea
          id="front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Enter the question or term..."
          rows={3}
          required
        />
      </div>

      {/* Back */}
      <div className="space-y-2">
        <Label htmlFor="back">Back (Answer)</Label>
        <Textarea
          id="back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Enter the answer or definition..."
          rows={3}
          required
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (optional)</Label>
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

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={!front.trim() || !back.trim() || isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.form>
  );
}
