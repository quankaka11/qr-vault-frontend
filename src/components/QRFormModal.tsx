import React, { useState, useRef } from 'react';
import { QRItem, QRFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface QRFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: QRFormData) => Promise<void>;
  editItem?: QRItem | null;
  existingImage?: string | null;
}

export const QRFormModal: React.FC<QRFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editItem,
  existingImage,
}) => {
  const [title, setTitle] = useState(editItem?.title || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [isPublic, setIsPublic] = useState(editItem?.isPublic || false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTitle(editItem?.title || '');
      setDescription(editItem?.description || '');
      setIsPublic(editItem?.isPublic || false);
      setImage(null);
      setPreview(existingImage || null);
      setError('');
    }
  }, [open, editItem, existingImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setImage(file);
    setError('');

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!editItem && !image) {
      setError('Please upload a QR code image');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        title,
        description,
        isPublic,
        image,
      });
      onOpenChange(false);
    } catch (err) {
      setError('Failed to save QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(existingImage || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editItem ? 'Edit QR Code' : 'Upload QR Code'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>QR Code Image</Label>
            <div 
              className="relative border-2 border-dashed border-border rounded-lg p-4 transition-colors hover:border-primary/50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto object-contain rounded"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm">Click to upload or drag and drop</p>
                  <p className="text-xs">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your QR code"
              className="input-styled"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="input-styled resize-none"
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="public">Make Public</Label>
              <p className="text-xs text-muted-foreground">
                Public QR codes are visible to everyone
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient" disabled={isLoading}>
              {isLoading ? 'Saving...' : editItem ? 'Save Changes' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
