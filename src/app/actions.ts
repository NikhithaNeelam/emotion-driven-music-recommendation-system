'use server';

import { analyzeMood } from '@/ai/flows/analyze-mood';
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
