import { useState, useEffect, useCallback } from 'react';
import { QRItem, QRFormData } from '@/types';
import {
  getQRItemsByUser,
  getPublicQRItems,
  updateQRItem,
  deleteQRItem as deleteQRItemStorage,
  getQRItems,
  createQRItem as createQRItemAPI,
} from '@/services/storage';
import { getImage } from '@/services/database';
import { useAuth } from '@/context/AuthContext';

export const useQRItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<QRItem[]>([]);
  const [publicItems, setPublicItems] = useState<QRItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshItems = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        console.log('[useQRItems] Fetching items for user:', user.id);
        const userItems = await getQRItemsByUser(user.id);
        console.log('[useQRItems] User items received:', userItems);
        setItems(userItems);
      } else {
        console.log('[useQRItems] No user logged in');
        setItems([]);
      }
      const pubItems = await getPublicQRItems();
      console.log('[useQRItems] Public items received:', pubItems);
      setPublicItems(pubItems);
    } catch (error) {
      console.error('Error refreshing items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  const createQRItem = async (formData: QRFormData): Promise<QRItem | null> => {
    if (!user) return null;

    try {
      const newItem = await createQRItemAPI(
        formData.title.trim(),
        formData.description.trim(),
        formData.isPublic,
        formData.image
      );

      await refreshItems();
      return newItem;
    } catch (error) {
      console.error('Error creating QR item:', error);
      return null;
    }
  };

  const editQRItem = async (
    id: string,
    updates: Partial<Pick<QRItem, 'title' | 'description' | 'isPublic'>>,
    newImage?: File
  ): Promise<boolean> => {
    try {
      const allItems = await getQRItems();
      const item = allItems.find(i => i.id === id);
      if (!item) return false;

      const updatedItem: QRItem = {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateQRItem(updatedItem, newImage);

      await refreshItems();
      return true;
    } catch (error) {
      console.error('Error updating QR item:', error);
      return false;
    }
  };

  const removeQRItem = async (id: string): Promise<boolean> => {
    try {
      await deleteQRItemStorage(id);
      await refreshItems();
      return true;
    } catch (error) {
      console.error('Error deleting QR item:', error);
      return false;
    }
  };

  const togglePublic = async (id: string): Promise<boolean> => {
    try {
      const allItems = await getQRItems();
      const item = allItems.find(i => i.id === id);
      if (!item) return false;

      return await editQRItem(id, { isPublic: !item.isPublic });
    } catch (error) {
      console.error('Error toggling public:', error);
      return false;
    }
  };

  const getItemImage = async (imageId: string): Promise<string | null> => {
    return getImage(imageId);
  };

  return {
    items,
    publicItems,
    isLoading,
    createQRItem,
    editQRItem,
    removeQRItem,
    togglePublic,
    getItemImage,
    refreshItems,
  };
};
