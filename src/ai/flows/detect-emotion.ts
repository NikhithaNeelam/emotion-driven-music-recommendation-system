'use server';

/**
 * @fileOverview Detects user emotion from a facial image.
 *
 * - detectEmotion - A function that analyzes an image and returns the detected emotion.
 * - DetectEmotionInput - The input type for the detectEmotion function.
 * - DetectEmotionOutput - The return type for the detectEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectEmotionInput = z.infer<typeof DetectEmotionInputSchema>;

const DetectEmotionOutputSchema = z.object({
  emotion: z.string().describe('The detected emotion from the face in the image (e.g., Happy, Sad, Surprised).'),
});
export type DetectEmotionOutput = z.infer<typeof DetectEmotionOutputSchema>;

export async function detectEmotion(input: DetectEmotionInput): Promise<DetectEmotionOutput> {
  return detectEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEmotionPrompt',
  input: {schema: DetectEmotionInputSchema},
  output: {schema: DetectEmotionOutputSchema},
  prompt: `You are an expert in analyzing human emotions from facial expressions. Analyze the provided image and describe the person's dominant emotion in a single word.

Photo: {{media url=photoDataUri}}
`,
});

const detectEmotionFlow = ai.defineFlow(
  {
    name: 'detectEmotionFlow',
    inputSchema: DetectEmotionInputSchema,
    outputSchema: DetectEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
