import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Sparkles, Save, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface CreateCardFormProps {
  onSubmit: (data: { front: string; back: string; tags: string[] }, addAnother: boolean) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateCardForm({ onSubmit, onCancel, isLoading }: CreateCardFormProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (addAnother: boolean) => {
    if (front.trim() && back.trim()) {
      onSubmit({ front: front.trim(), back: back.trim(), tags }, addAnother);
      if (addAnother) {
        setFront('');
        setBack('');
        setTags([]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Front (Question) */}
      <div className="space-y-2">
        <Label htmlFor="front" className="text-sm font-medium flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
            Q
          </span>
          Question (Front) <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Enter the question or term"
          maxLength={500}
          rows={4}
          className="resize-none text-lg"
          required
        />
        <p className="text-xs text-muted-foreground text-right">{front.length}/500</p>
      </div>

      {/* AI Suggestion Button */}
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          disabled={!front.trim()}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Ask AI for Answer
        </Button>
      </div>

      {/* Back (Answer) */}
      <div className="space-y-2">
        <Label htmlFor="back" className="text-sm font-medium flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/10 text-success text-xs font-bold">
            A
          </span>
          Answer (Back) <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Enter the answer or definition"
          maxLength={1000}
          rows={4}
          className="resize-none text-lg"
          required
        />
        <p className="text-xs text-muted-foreground text-right">{back.length}/1000</p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tags (optional)</Label>
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex-1 flex gap-3">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => handleSubmit(true)}
            disabled={!front.trim() || !back.trim() || isLoading}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Save & Add Another
          </Button>
          <Button 
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!front.trim() || !back.trim() || isLoading}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Save & Close
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <p className="text-xs text-muted-foreground text-center">
        <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">Ctrl</kbd>
        +
        <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">Enter</kbd>
        {' '}to save • 
        <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">Ctrl</kbd>
        +
        <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">Shift</kbd>
        +
        <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">Enter</kbd>
        {' '}to save & add another
      </p>
    </motion.div>
  );
}
