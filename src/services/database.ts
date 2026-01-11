// Image operations are now handled by the backend
// Images are stored on the server and accessed via URLs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper to get auth headers
const getAuthHeaders = () => {
  const sessionId = localStorage.getItem('qr_vault_session');
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
};

// Upload image to server
export const saveImage = async (id: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl || data.imageId;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get image URL (images are now served directly from server)
export const getImage = async (id: string): Promise<string | null> => {
  // Images are now accessed via direct URLs from the server
  // The imageUrl is stored in the QRItem, so this is not needed
  return `${API_BASE_URL}/uploads/${id}`;
};

export const deleteImage = async (id: string): Promise<void> => {
  // Image deletion is handled when deleting a QR item
  // No separate API needed
};

export const getAllImages = async (): Promise<{ id: string; data: string }[]> => {
  // Not needed - images are accessed via URLs
  return [];
};
