import React, { useState, useRef, useEffect } from 'react';
import { QRItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Globe, Lock, Download } from 'lucide-react';

interface QRCardProps {
  item: QRItem;
  onEdit?: (item: QRItem) => void;
  onDelete?: (item: QRItem) => void;
  onTogglePublic?: (item: QRItem) => void;
  onPreview?: (item: QRItem) => void;
  showActions?: boolean;
  showOwner?: boolean;
  ownerName?: string;
}

export const QRCard: React.FC<QRCardProps> = ({
  item,
  onEdit,
  onDelete,
  onTogglePublic,
  onPreview,
  showActions = false,
  showOwner = false,
  ownerName,
}) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use imageUrl if available, otherwise construct from imageId
    const imageUrl = item.imageUrl || (item.imageId ? `http://localhost:3000/uploads/${item.imageId}` : null);
    setImageData(imageUrl);
    setIsLoading(false);
  }, [item.imageId, item.imageUrl]);

  const handleDownload = () => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `${item.title || 'qr-code'}.png`;
    link.click();
  };

  return (
    <Card 
      ref={cardRef}
      className="qr-grid-item group animate-fade-in cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onPreview?.(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPreview?.(item);
        }
      }}
    >
      <div className="aspect-square relative bg-secondary/30 overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : imageData ? (
          <img
            src={imageData}
            alt={item.title}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Image not found
          </div>
        )}
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-3"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
            {showActions && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={() => onEdit?.(item)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={() => onTogglePublic?.(item)}
                >
                  {item.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 px-3"
                  onClick={() => onDelete?.(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{item.title || 'Untitled'}</h3>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
            )}
            {showOwner && ownerName && (
              <p className="text-xs text-muted-foreground mt-2">
                by {ownerName}
              </p>
            )}
          </div>
          <Badge variant={item.isPublic ? 'default' : 'secondary'} className="shrink-0">
            {item.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
