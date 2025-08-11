'use server';

import { analyzeMood } from '@/ai/flows/analyze-mood';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import type { Playlist, Track } from '@/lib/types';
import { z } from 'zod';

const formSchema = z.object({
  mood: z.string().min(2, {
    message: 'Please tell us a bit more about your mood.',
  }),
  language: z.string(),
});

const mockPlaylists: Record<string, Track[]> = {
  upbeat: [
    { name: 'Happy', artist: 'Pharrell Williams', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "concert music" },
    { name: 'Dont Stop Me Now', artist: 'Queen', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "celebration party" },
    { name: 'Walking on Sunshine', artist: 'Katrina & The Waves', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "beach summer" },
  ],
  energetic: [
    { name: 'Thunderstruck', artist: 'AC/DC', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "lightning storm" },
    { name: 'Eye of the Tiger', artist: 'Survivor', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "running motivation" },
    { name: 'Seven Nation Army', artist: 'The White Stripes', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "stadium crowd" },
  ],
  relaxing: [
    { name: 'Weightless', artist: 'Marconi Union', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "spa meditation" },
    { name: 'Clair de Lune', artist: 'Claude Debussy', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "moon night" },
    { name: 'Watermark', artist: 'Enya', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "ocean waves" },
  ],
  somber: [
    { name: 'Hurt', artist: 'Johnny Cash', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "old guitar" },
    { name: 'Sound of Silence', artist: 'Disturbed', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "dark room" },
    { name: 'Everybody Hurts', artist: 'R.E.M.', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "rainy window" },
  ],
  happy: [
    { name: 'Happy', artist: 'Pharrell Williams', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'concert music' },
    { name: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'city dance' },
    { name: 'Good as Hell', artist: 'Lizzo', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'fashion show' },
  ],
  sad: [
    { name: 'Someone Like You', artist: 'Adele', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'rainy window' },
    { name: 'Fix You', artist: 'Coldplay', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'starry night' },
    { name: 'Hallelujah', artist: 'Leonard Cohen', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'empty church' },
  ],
  surprised: [
    { name: 'Bohemian Rhapsody', artist: 'Queen', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'abstract art' },
    { name: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'neon city' },
    { name: 'This Is America', artist: 'Childish Gambino', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': 'street art' },
  ],
  default: [
    { name: 'Bohemian Rhapsody', artist: 'Queen', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "abstract art" },
    { name: 'Stairway to Heaven', artist: 'Led Zeppelin', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "misty forest" },
    { name: 'Like a Rolling Stone', artist: 'Bob Dylan', albumArt: 'https://placehold.co/100x100.png', url: '#', 'data-ai-hint': "vintage road" },
  ],
};

async function getSpotifyPlaylist(vibe: string, language: string): Promise<Playlist> {
  // In a real app, you would use the Spotify API here.
  // For this demo, we'll return a mock playlist.
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

  const vibeKey = vibe.toLowerCase().split(' ')[0];
  const tracks = mockPlaylists[vibeKey] || mockPlaylists.default;

  return {
    name: `${vibe} Vibe (${language})`,
    description: `A playlist for when you're feeling ${vibe.toLowerCase()}.`,
    url: '#',
    tracks: tracks,
  };
}

export async function generatePlaylistAction(
  prevState: any,
  formData: FormData
): Promise<{
  playlist: Playlist | null;
  error: string | null;
  mood?: string;
}> {
  try {
    const validatedFields = formSchema.safeParse({
      mood: formData.get('mood'),
      language: formData.get('language'),
    });

    if (!validatedFields.success) {
      return {
        playlist: null,
        error: validatedFields.error.flatten().fieldErrors.mood?.[0] || 'Invalid input.',
      };
    }
    
    const { mood, language } = validatedFields.data;

    const moodAnalysis = await analyzeMood({ mood, language });
    const vibe = moodAnalysis.vibe;

    if (!vibe) {
      return { playlist: null, error: 'Could not determine the vibe from your mood. Please try being more descriptive.' };
    }
    
    const playlist = await getSpotifyPlaylist(vibe, language);

    return { playlist, error: null };
  } catch (error) {
    console.error(error);
    return { playlist: null, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function detectEmotionAction(
  prevState: any,
  formData: FormData
): Promise<{
  playlist: null;
  error: string | null;
  mood: string | null;
}> {
  try {
    const photoDataUri = formData.get('photoDataUri') as string;
    const language = formData.get('language') as string;

    if (!photoDataUri) {
      return { playlist: null, error: 'No photo provided.', mood: null };
    }

    const emotionResult = await detectEmotion({ photoDataUri });
    const mood = emotionResult.emotion;
    
    if (!mood) {
      return { playlist: null, error: 'Could not detect emotion.', mood: null };
    }

    return { playlist: null, error: null, mood };
  } catch(error) {
    console.error(error);
    return { playlist: null, error: 'An unexpected error occurred during emotion detection.', mood: null };
  }
}
