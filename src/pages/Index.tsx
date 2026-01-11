import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { QrCode, Shield, Zap, Database, ArrowRight, Globe, Lock } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: '100% Local Storage',
      description: 'All your data stays on your device. No servers, no cloud, complete privacy.',
    },
    {
      icon: Zap,
      title: 'Fast & Offline',
      description: 'Works without internet. Your QR codes are always accessible.',
    },
    {
      icon: Database,
      title: 'Persistent Data',
      description: 'Data survives browser restarts using IndexedDB and localStorage.',
    },
    {
      icon: Lock,
      title: 'Secure Auth',
      description: 'Passwords are hashed locally using bcrypt. Your credentials stay safe.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Manage QR Codes
              <span className="block gradient-text">STC</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Upload, organize, and share QR codes with complete privacy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                <Button size="lg" className="btn-gradient gap-2 px-8">
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" size="lg" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Public Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card-elevated p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="space-y-8">
              {[
                { step: '01', title: 'Create Account', desc: 'Register with a username, email, and password. Credentials are hashed and stored locally.' },
                { step: '02', title: 'Upload QR Codes', desc: 'Add your QR code images with titles and descriptions. Images are stored in IndexedDB.' },
                { step: '03', title: 'Share or Keep Private', desc: 'Mark QR codes as public to share in the gallery, or keep them private.' },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-mono font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="card-glow max-w-3xl mx-auto p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-gradient mb-6">
              <QrCode className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Create your local account in seconds and start managing your QR codes with complete privacy.
            </p>
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button size="lg" className="btn-gradient gap-2">
                {isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="font-medium text-foreground">QRSTC</span>
              </div>
              <p>Created by SuZenith CO.LTD</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
