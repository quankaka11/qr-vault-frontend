import React, { useState, useEffect } from 'react';
import { useQRItems } from '@/hooks/useQRItems';
import { QRItem } from '@/types';
import { Header } from '@/components/Header';
import { QRCard } from '@/components/QRCard';
import { QRPreviewModal } from '@/components/QRPreviewModal';
import { Input } from '@/components/ui/input';
import { findUserById } from '@/services/storage';
import { getImage } from '@/services/database';
import { Search, Globe, QrCode } from 'lucide-react';

const Gallery: React.FC = () => {
  const { publicItems, isLoading } = useQRItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<QRItem | null>(null);
  const [previewImageData, setPreviewImageData] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    // Load usernames for all public items
    const loadUsernames = async () => {
      const names: Record<string, string> = {};

      // Create array of unique user IDs
      const uniqueUserIds = [...new Set(publicItems.map(item => item.userId))];

      // Fetch all usernames in parallel
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const user = await findUserById(userId);
          names[userId] = user?.username || 'Unknown';
        })
      );

      setUsernames(names);
    };

    if (publicItems.length > 0) {
      loadUsernames();
    }
  }, [publicItems]);

  const handlePreviewClick = async (item: QRItem) => {
    setSelectedItem(item);
    setIsLoadingPreview(true);
    try {
      // Use imageUrl directly from item (Cloudinary URL)
      const imageData = item.imageUrl || null;
      setPreviewImageData(imageData);
    } catch (error) {
      console.error('Error loading preview image:', error);
      setPreviewImageData(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setPreviewImageData(null);
  };

  const filteredItems = publicItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-gradient mb-4">
            <Globe className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Public Gallery</h1>
          <p className="text-muted-foreground mt-2">
            Browse QR codes shared by the community
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search public QR codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-styled pl-10"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
              <QrCode className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-2">
              {searchQuery ? 'No results found' : 'No public QR codes yet'}
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Try a different search term'
                : 'Be the first to share a QR code with the community!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <QRCard
                key={item.id}
                item={item}
                showOwner
                ownerName={usernames[item.userId]}
                onPreview={handlePreviewClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <QRPreviewModal
        isOpen={selectedItem !== null}
        onClose={handleCloseModal}
        item={selectedItem}
        imageData={previewImageData}
        isLoadingImage={isLoadingPreview}
        ownerName={selectedItem ? usernames[selectedItem.userId] : undefined}
      />
    </div>
  );
};

export default Gallery;
