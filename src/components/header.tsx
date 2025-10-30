import { Briefcase } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b p-4 shadow-sm">
      <div className="container mx-auto flex items-center gap-3">
        <Briefcase className="text-primary" size={28} />
        <h1 className="text-2xl font-headline font-semibold text-primary">
          VedaHire
        </h1>
      </div>
    </header>
  );
}
