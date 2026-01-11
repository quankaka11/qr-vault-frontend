import { User, QRItem } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Session operations (using localStorage for persistent session)
export const getSession = (): string | null => {
  try {
    return localStorage.getItem('qr_vault_session');
  } catch {
    return null;
  }
};

export const setSession = (sessionId: string): void => {
  try {
    localStorage.setItem('qr_vault_session', sessionId);
  } catch (error) {
    console.error('Error saving session', error);
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem('qr_vault_session');
  } catch (error) {
    console.error('Error clearing session', error);
  }
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const sessionId = getSession();
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
};

// User operations - now using backend API
export const getUsers = async (): Promise<User[]> => {
  // This is not exposed in the API - not needed for frontend
  return [];
};

export const saveUsers = async (users: User[]): Promise<void> => {
  // Not needed - backend handles this
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  // Not needed - backend handles validation
  return undefined;
};

export const findUserByUsername = async (username: string): Promise<User | undefined> => {
  // Not needed - backend handles validation
  return undefined;
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}/public`);
    
    if (!response.ok) {
      return undefined;
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return undefined;
  }
};

export const addUser = async (user: User): Promise<void> => {
  // Not needed - use auth.register instead
};

// QR Items operations - now using backend API
export const getQRItems = async (): Promise<QRItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qr-items`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch QR items');
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching QR items:', error);
    return [];
  }
};

export const saveQRItems = async (items: QRItem[]): Promise<void> => {
  // Not needed - use addQRItem, updateQRItem, deleteQRItem instead
};

export const getQRItemsByUser = async (userId: string): Promise<QRItem[]> => {
  const items = await getQRItems();
  return items.filter(item => item.userId === userId);
};

export const getPublicQRItems = async (): Promise<QRItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qr-items/public`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch public QR items');
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching public QR items:', error);
    return [];
  }
};

export const addQRItem = async (item: QRItem): Promise<void> => {
  // This is now handled in the createQRItem function below
};

export const updateQRItem = async (
  updatedItem: QRItem,
  imageFile?: File | null
): Promise<QRItem> => {
  try {
    const formData = new FormData();
    formData.append('title', updatedItem.title);
    formData.append('description', updatedItem.description);
    formData.append('isPublic', String(updatedItem.isPublic));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await fetch(`${API_BASE_URL}/api/qr-items/${updatedItem.id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to update QR item');
    }
    
    const data = await response.json();
    return data.item;
  } catch (error) {
    console.error('Error updating QR item:', error);
    throw error;
  }
};

export const deleteQRItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qr-items/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete QR item');
    }
  } catch (error) {
    console.error('Error deleting QR item:', error);
    throw error;
  }
};

export const getQRItemById = async (id: string): Promise<QRItem | undefined> => {
  const items = await getQRItems();
  return items.find(item => item.id === id);
};

// New function to create QR item with image
export const createQRItem = async (
  title: string,
  description: string,
  isPublic: boolean,
  imageFile: File | null
): Promise<QRItem> => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isPublic', String(isPublic));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await fetch(`${API_BASE_URL}/api/qr-items`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to create QR item');
    }
    
    const data = await response.json();
    return data.item;
  } catch (error) {
    console.error('Error creating QR item:', error);
    throw error;
  }
};

// Export/Import functionality
export const exportAllData = async (): Promise<string> => {
  const data = {
    qrItems: await getQRItems(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

export const importData = async (jsonString: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonString);
    // Import functionality would need to be implemented on backend
    // For now, just validate the data
    if (data.qrItems && Array.isArray(data.qrItems)) {
      return true;
    }
    return false;
  } catch {
    console.error('Error importing data');
    return false;
  }
};
