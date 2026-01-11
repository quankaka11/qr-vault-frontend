import { User } from '@/types';
import {
  getSession,
  setSession,
  clearSession,
} from './storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const register = async (data: RegisterData): Promise<AuthResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Registration failed' };
    }

    if (result.sessionId) {
      setSession(result.sessionId);
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const login = async (data: LoginData): Promise<AuthResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Login failed' };
    }

    if (result.sessionId) {
      setSession(result.sessionId);
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const logout = async (): Promise<void> => {
  try {
    const sessionId = getSession();
    if (sessionId) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearSession();
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const sessionId = getSession();
  if (!sessionId) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    if (!response.ok) {
      clearSession();
      return null;
    }

    const result = await response.json();
    return result.user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    clearSession();
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};
