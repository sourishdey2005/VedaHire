import { Header } from '@/components/header';
import { FeatureTabs } from '@/components/feature-tabs';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
            AI-Powered Resume Optimization
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Upload or paste your resume and a job description to get instant
            analysis, optimization tips, and AI-generated content to land your
            dream job.
          </p>
        </div>
        <FeatureTabs />
      </main>
    </div>
  );
}
