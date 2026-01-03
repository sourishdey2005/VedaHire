"use client";

import { FeatureTabs } from '@/components/feature-tabs';

export default function AppPage() {
  return (
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
  );
}
