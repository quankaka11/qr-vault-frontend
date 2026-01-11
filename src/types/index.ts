export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface QRItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageId: string; // Reference to uploaded image filename
  imageUrl?: string; // Direct URL to the image on server
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface QRFormData {
  title: string;
  description: string;
  isPublic: boolean;
  image: File | null;
}
