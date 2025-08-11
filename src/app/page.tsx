'use client';

import { useState, useTransition } from 'react';
import type { Playlist } from '@/lib/types';
import { Header } from '@/components/Header';
import { VibeSyncForm } from '@/components/VibeSyncForm';
import { PlaylistDisplay } from '@/components/PlaylistDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePlaylistAction } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFormAction = (formData: FormData) => {
    startTransition(async () => {
      const result = await generatePlaylistAction(null, formData);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Oh no! Something went wrong.',
          description: result.error,
        });
        setPlaylist(null);
      } else {
        setPlaylist(result.playlist);
      }
    });
  };

  const handleReset = () => {
    setPlaylist(null);
  };
  
  const showForm = !playlist && !isPending;
  const showLoader = isPending;
  const showPlaylist = !!playlist && !isPending;

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {showForm && (
             <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <VibeSyncForm formAction={handleFormAction} />
            </motion.div>
          )}

          {showLoader && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {showPlaylist && (
            <motion.div
              key="playlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                 <Button variant="ghost" onClick={handleReset}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Create Another Playlist
                 </Button>
              </div>
              <PlaylistDisplay playlist={playlist} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
