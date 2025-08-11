'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Camera } from 'lucide-react';
import { Separator } from './ui/separator';

const formSchema = z.object({
  mood: z.string().min(2, {
    message: 'Please tell us a bit more about your mood.',
  }).max(200, { message: 'Your mood description is a bit long!' }),
  language: z.string(),
});

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Any', label: 'Any Language' },
  { value: 'Assamese', label: 'Assamese' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Bodo', label: 'Bodo' },
  { value: 'Dogri', label: 'Dogri' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Kashmiri', label: 'Kashmiri' },
  { value: 'Konkani', label: 'Konkani' },
  { value: 'Maithili', label: 'Maithili' },
  { value: 'Malayalam', label: 'Malayalam' },
  { value: 'Manipuri', label: 'Manipuri' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Nepali', label: 'Nepali' },
  { value: 'Odia', label: 'Odia' },
  { value: 'Punjabi', label: 'Punjabi' },
  { value: 'Sanskrit', label: 'Sanskrit' },
  { value: 'Santali', label: 'Santali' },
  { value: 'Sindhi', label: 'Sindhi' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Japanese', label: 'Japanese' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      <Sparkles className="mr-2 h-5 w-5" />
      {pending ? 'Syncing Your Vibe...' : 'Generate Playlist'}
    </Button>
  );
}

interface VibeSyncFormProps {
  formAction: (formData: FormData) => void;
  onDetectEmotion: () => void;
  detectedMood: string | null;
  isDetecting: boolean;
}

export function VibeSyncForm({ formAction, onDetectEmotion, detectedMood, isDetecting }: VibeSyncFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      language: 'English',
    },
  });

  useEffect(() => {
    if (detectedMood) {
      form.setValue('mood', detectedMood);
    }
  }, [detectedMood, form]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">How are you feeling?</CardTitle>
        <CardDescription>
          Describe your mood, or let us detect it from your camera.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Mood</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Feeling happy and energetic! ☀️"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Music Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map(lang => (
                             <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-card px-2 text-sm text-muted-foreground">OR</span>
                </div>
              </div>

               <Button onClick={onDetectEmotion} type="button" variant="outline" size="lg" className="w-full" disabled={isDetecting}>
                  <Camera className="mr-2 h-5 w-5" />
                  {isDetecting ? 'Analyzing...' : 'Detect Mood from Camera'}
               </Button>
            </div>
            
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
