'use client';

import type { Playlist, Track } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ListMusic } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PlaylistDisplayProps {
  playlist: Playlist;
}

export function PlaylistDisplay({ playlist }: PlaylistDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden shadow-lg border-2 border-primary/20">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-3xl text-primary">{playlist.name}</CardTitle>
              <CardDescription className="mt-1">{playlist.description}</CardDescription>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
              <a href={playlist.url} target="_blank" rel="noopener noreferrer">
                <PlayCircle className="mr-2 h-5 w-5" />
                Play on Spotify
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
             <ListMusic className="h-5 w-5" />
             <h3 className="font-semibold">Playlist Tracks</h3>
          </div>
          <ul className="space-y-3">
            {playlist.tracks.map((track, index) => (
              <li key={index}>
                <motion.a 
                  href={track.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Image
                    src={track.albumArt}
                    alt={`Album art for ${track.name}`}
                    width={50}
                    height={50}
                    className="rounded-md"
                    data-ai-hint={track['data-ai-hint']}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{track.name}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                </motion.a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
