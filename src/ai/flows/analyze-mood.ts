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
  vibe: z.string().describe('The appropriate musical vibe based on the mood.'),
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

Respond with a single word or short phrase describing the musical vibe. For example: Energetic, Relaxing, Upbeat, Somber.
`, // Removed Handlebars helper
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
