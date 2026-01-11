import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQRItems } from '@/hooks/useQRItems';
import { QRItem, QRFormData } from '@/types';
import { Header } from '@/components/Header';
import { QRCard } from '@/components/QRCard';
import { QRFormModal } from '@/components/QRFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getImage } from '@/services/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, QrCode, Download, Upload } from 'lucide-react';
import { exportAllData, importData } from '@/services/storage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { items, createQRItem, editQRItem, removeQRItem, togglePublic, isLoading } = useQRItems();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QRItem | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<QRItem | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: QRFormData) => {
    await createQRItem(data);
  };

  const handleEdit = async (data: QRFormData) => {
    if (!editingItem) return;
    await editQRItem(
      editingItem.id,
      { title: data.title, description: data.description, isPublic: data.isPublic },
      data.image || undefined
    );
  };

  const openEditModal = async (item: QRItem) => {
    const image = await getImage(item.imageId);
    setEditingImage(image);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    await removeQRItem(deletingItem.id);
    setDeletingItem(null);
  };

  const handleTogglePublic = async (item: QRItem) => {
    await togglePublic(item.id);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-vault-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        const success = importData(reader.result as string);
        if (success) {
          window.location.reload();
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">My QR Codes</h1>
            <p className="text-muted-foreground">
              Manage your uploaded QR codes
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport} className="gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button 
              className="btn-gradient gap-2" 
              onClick={() => {
                setEditingItem(null);
                setEditingImage(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Upload QR
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your QR codes..."
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
              {searchQuery ? 'No results found' : 'No QR codes yet'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try a different search term' 
                : 'Upload your first QR code to get started'}
            </p>
            {!searchQuery && (
              <Button 
                className="btn-gradient gap-2"
                onClick={() => {
                  setEditingItem(null);
                  setEditingImage(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Upload QR Code
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <QRCard
                key={item.id}
                item={item}
                showActions
                onEdit={openEditModal}
                onDelete={setDeletingItem}
                onTogglePublic={handleTogglePublic}
              />
            ))}
          </div>
        )}
      </main>

      {/* Upload/Edit Modal */}
      <QRFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingItem(null);
            setEditingImage(null);
          }
        }}
        onSubmit={editingItem ? handleEdit : handleCreate}
        editItem={editingItem}
        existingImage={editingImage}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete QR Code?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingItem?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
