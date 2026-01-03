"use client";

import { FeatureTabs } from '@/components/feature-tabs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { get, set } from '@/lib/indexedDb';

export default function AppPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState('');

  useEffect(() => {
    // Check if a username is already stored in IndexedDB
    get<string>('username').then(storedUsername => {
      if (storedUsername) {
        setUsername(storedUsername);
      }
    });
  }, []);

  const handleSetUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      await set('username', inputUsername.trim());
      setUsername(inputUsername.trim());
    }
  };

  const handleResetUsername = async () => {
    await set('username', '');
    setUsername(null);
    setInputUsername('');
  };

  // If username is not set, show the welcome/username setup screen
  if (username === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Link href="/" className="flex items-center gap-3">
              <Briefcase className="text-primary" size={28} />
              <span className="text-2xl font-headline font-semibold text-primary">
                VedaHire
              </span>
            </Link>
            <nav className="ml-auto flex items-center gap-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-headline text-primary">Welcome!</h1>
              <p className="text-muted-foreground">Please set a username to get started.</p>
            </div>
            <form onSubmit={handleSetUsername} className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter your username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="w-full">Get Started</Button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // If username is set, show the main application
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-3">
            <Briefcase className="text-primary" size={28} />
            <span className="text-2xl font-headline font-semibold text-primary">
              VedaHire
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Button onClick={handleResetUsername} variant="outline">
                Reset Username
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
            AI-Powered Resume Optimization
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Welcome, {username}! Upload or paste your resume to get started.
          </p>
        </div>
        <FeatureTabs />
      </main>
    </div>
  );
}
