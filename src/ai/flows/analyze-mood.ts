// This file uses server-side code.
'use server';

/**
 * @fileOverview Analyzes user mood and determines the appropriate musical vibe.
 *
 * - analyzeMood - A function that analyzes the mood and returns a musical vibe.
 * - MoodAnalysisInput - The input type for the analyzeMood function.
 * - MoodAnalysisOutput - The return type for the analyzeMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodAnalysisInputSchema = z.object({
  mood: z.string().describe('The user\'s mood, expressed in text or emoji.'),
  language: z.string().describe('The user\'s preferred music language.'),
});
export type MoodAnalysisInput = z.infer<typeof MoodAnalysisInputSchema>;

const MoodAnalysisOutputSchema = z.object({
  vibe: z.string().describe('An appropriate music genre or vibe from Spotify based on the mood (e.g., "upbeat dance", "chill study beats", "sad indie", "empowering rock").'),
});
export type MoodAnalysisOutput = z.infer<typeof MoodAnalysisOutputSchema>;

export async function analyzeMood(input: MoodAnalysisInput): Promise<MoodAnalysisOutput> {
  return analyzeMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodAnalysisPrompt',
  input: {schema: MoodAnalysisInputSchema},
  output: {schema: MoodAnalysisOutputSchema},
  prompt: `You are a music expert. Analyze the user's mood and determine the best musical vibe for them, taking into account their language preference.

Mood: {{{mood}}}
Language Preference: {{{language}}}

Respond with a short, descriptive search query (2-3 words) that would find a good playlist on Spotify. For example: "feel good pop", "sad rap", "upbeat workout", "chill ambient", "summer indie".
`, 
});

const analyzeMoodFlow = ai.defineFlow(
  {
    name: 'analyzeMoodFlow',
    inputSchema: MoodAnalysisInputSchema,
    outputSchema: MoodAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
