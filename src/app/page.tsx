import { Briefcase, Zap, Star, Sparkles, FileText, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LandingPage() {
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
            <Button asChild>
              <Link href="/app">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Land Your Dream Job with an AI-Perfected Resume
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    VedaHire leverages cutting-edge AI to analyze your resume,
                    optimize it for any job, and even generate a tailored cover
                    letter in seconds.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/app">
                      Optimize Your Resume Now
                      <Zap className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <img
                data-ai-hint="resume professional"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                height="600"
                src="https://picsum.photos/seed/1/600/600"
                width="600"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A Smarter Way to Job Hunt
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our suite of AI tools gives you the ultimate advantage in your
                  job search, from initial application to final interview.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <FeatureCard
                icon={<Zap />}
                title="ATS Analysis"
                description="Instantly see how your resume scores against any job description and beat the bots."
              />
              <FeatureCard
                icon={<Star />}
                title="Content Scoring"
                description="Get a detailed, section-by-section breakdown of your resume's strengths and weaknesses."
              />
              <FeatureCard
                icon={<Sparkles />}
                title="AI Resume Optimizer"
                description="Receive concrete suggestions, identify missing keywords, and close skill gaps."
              />
              <FeatureCard
                icon={<FileText />}
                title="Resume Builder"
                description="Generate a brand-new, professional resume from scratch based on your profile and target role."
              />
              <FeatureCard
                icon={<Mail />}
                title="Cover Letter Generator"
                description="Create a compelling, tailored cover letter that perfectly matches your resume and the job."
              />
              <FeatureCard
                icon={<ArrowRight />}
                title="And More..."
                description="Our platform is constantly evolving with new features to help you succeed."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted p-6 md:py-8 w-full">
        <div className="container flex items-center justify-center text-sm text-muted-foreground">
          MADE BY SOURISH DEY
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            {icon}
          </div>
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
