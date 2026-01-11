import React, { useEffect } from 'react';
import { QRItem } from '@/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QRPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: QRItem | null;
  imageData: string | null;
  isLoadingImage: boolean;
  ownerName?: string;
}

export const QRPreviewModal: React.FC<QRPreviewModalProps> = ({
  isOpen,
  onClose,
  item,
  imageData,
  isLoadingImage,
  ownerName,
}) => {
  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    if (!imageData || !item) return;
    
    try {
      // Fetch the image from the server
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title || 'qr-code'}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-background border-border shadow-xl">
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6">
            {/* QR Image Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full aspect-square flex items-center justify-center bg-secondary/30 rounded-lg overflow-hidden">
                {isLoadingImage ? (
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : imageData ? (
                  <img
                    src={imageData}
                    alt={item.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">Image not found</p>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={!imageData || isLoadingImage}
                className="w-full mt-4 gap-2"
                variant="default"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </Button>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between">
              {/* Metadata */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground break-words">
                    {item.title || 'Untitled'}
                  </h2>
                </div>

                {/* Visibility Badge */}
                <div className="flex gap-2">
                  <Badge
                    variant={item.isPublic ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-foreground break-words line-clamp-4">
                    {item.description || 'No description provided'}
                  </p>
                </div>

                {/* Author */}
                {ownerName && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Author
                    </h3>
                    <p className="text-sm text-foreground">
                      {ownerName}
                    </p>
                  </div>
                )}

                {/* Created Date */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Created
                  </h3>
                  <p className="text-sm text-foreground">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Close instruction for mobile */}
              <p className="text-xs text-muted-foreground mt-6 md:hidden">
                Click outside or press Esc to close
              </p>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
};
