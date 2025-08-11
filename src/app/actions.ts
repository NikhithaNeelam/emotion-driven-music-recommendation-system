'use server';

import { analyzeMood } from '@/ai/flows/analyze-mood';
import { detectEmotion } from '@/ai/flows/detect-emotion';
import type { Playlist, Track } from '@/lib/types';
import { getPlaylistByVibe } from '@/lib/spotify';
import { z } from 'zod';

const formSchema = z.object({
  mood: z.string().min(2, {
    message: 'Please tell us a bit more about your mood.',
  }),
  language: z.string(),
});

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
    
    const playlist = await getPlaylistByVibe(vibe, language);

    return { playlist, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { playlist: null, error: errorMessage };
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
