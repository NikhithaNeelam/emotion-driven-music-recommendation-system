'use client';

import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import type { Playlist } from '@/lib/types';
import { Header } from '@/components/Header';
import { VibeSyncForm } from '@/components/VibeSyncForm';
import { PlaylistDisplay } from '@/components/PlaylistDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePlaylistAction, detectEmotionAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type View = 'form' | 'camera' | 'loading' | 'playlist';

export default function Home() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [view, setView] = useState<View>('form');
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDetecting, startDetectingTransition] = useTransition();
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (view === 'camera') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
          setView('form');
        }
      };

      getCameraPermission();
      
      // Cleanup function to stop video stream
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [view, toast]);

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
        setView('form');
      } else {
        setPlaylist(result.playlist);
        setView('playlist');
      }
    });
  };

  const handleCaptureAndDetect = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoDataUri = canvas.toDataURL('image/jpeg');

    const formData = new FormData();
    formData.append('photoDataUri', photoDataUri);
    // You might want to get the language from a form field if you keep it on this view
    formData.append('language', 'English'); 

    startDetectingTransition(async () => {
      const result = await detectEmotionAction(null, formData);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Detection Failed',
          description: result.error,
        });
      } else if (result.mood) {
        setDetectedMood(result.mood);
        setView('form');
      }
    });
  }, [toast, startDetectingTransition]);

  const handleReset = () => {
    setPlaylist(null);
    setDetectedMood(null);
    setView('form');
  };
  
  const showForm = view === 'form' && !isPending;
  const showLoader = isPending || isDetecting;
  const showPlaylist = view === 'playlist' && !!playlist && !isPending;
  const showCamera = view === 'camera' && !isDetecting;

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
              <VibeSyncForm 
                formAction={handleFormAction} 
                onDetectEmotion={() => setView('camera')}
                detectedMood={detectedMood}
                isDetecting={isDetecting}
              />
            </motion.div>
          )}
          
          {showCamera && (
             <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
                <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20">
                  <CardContent className="p-4">
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline/>
                      {hasCameraPermission === false && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>
                            Please allow camera access to use this feature.
                          </AlertDescription>
                        </Alert>
                      )}
                    <div className="mt-4 flex justify-center gap-4">
                       <Button variant="outline" onClick={() => setView('form')}>
                         <ArrowLeft className="mr-2"/>
                         Back
                       </Button>
                       <Button onClick={handleCaptureAndDetect} disabled={hasCameraPermission !== true}>
                         <Camera className="mr-2"/>
                         Detect My Mood
                       </Button>
                    </div>
                  </CardContent>
                </Card>
            </motion.div>
          )}

          {showLoader && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <LoadingSpinner />
              <p className="text-muted-foreground">
                {isDetecting ? 'Analyzing your vibe...' : 'Syncing your playlist...'}
              </p>
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
                    <RefreshCw className="mr-2 h-4 w-4" />
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
