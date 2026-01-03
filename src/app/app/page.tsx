"use client";

import { FeatureTabs } from '@/components/feature-tabs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';


export default function AppPage() {
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
      <main className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
            AI-Powered Resume Optimization
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Upload or paste your resume and a job description to get instant analysis, optimization tips, and AI-generated content to land your dream job.
          </p>
        </div>
        <FeatureTabs />
      </main>
    </div>
  );
}
