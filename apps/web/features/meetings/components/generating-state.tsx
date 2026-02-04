'use client';

import { Sparkles, Loader2 } from 'lucide-react';


interface GeneratingStateProps {
  variant?: 'summary' | 'action-items';
}

export function GeneratingState({ variant = 'summary' }: GeneratingStateProps) {
  const content = variant === 'summary'
    ? {
      title: 'Generating Summary',
      description: 'AI is analyzing your meeting transcript...',
    }
    : {
      title: 'Extracting Action Items',
      description: 'AI is identifying tasks from your meeting...',
    };

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-[calc(100dvh-240px)]">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
        <div className="relative size-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <Sparkles className="size-7 text-primary animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-primary" />
          <h3 className="text-lg font-medium">{content.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{content.description}</p>
      </div>

      <div className="flex gap-2 mt-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="size-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
