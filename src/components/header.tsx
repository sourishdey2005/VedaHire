import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-card border-b p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://res.cloudinary.com/dodhvvewu/image/upload/v1767441232/vedahire_jeaoal.jpg" alt="VedaHire Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-headline font-semibold text-primary">
            VedaHire
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </header>
  );
}
