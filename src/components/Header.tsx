import { Music2 } from 'lucide-react';

export function Header() {
  return (
    <header className="py-8">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-4">
          <Music2 className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            VibeSync
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Your mood, your music, instantly synced.
        </p>
      </div>
    </header>
  );
}
