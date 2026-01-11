import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { QrCode, LogOut, User, Globe, LayoutGrid } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg btn-gradient flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            QR<span className="gradient-text">STC</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {/* <Link to="/gallery">
            <Button 
              variant={isActive('/gallery') ? 'secondary' : 'ghost'} 
              size="sm"
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              Public Gallery
            </Button>
          </Link> */}
          {isAuthenticated && (
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? 'secondary' : 'ghost'} 
                size="sm"
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                My QR Codes
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="btn-gradient">Create Account</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
