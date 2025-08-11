'use client';

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
import { Sparkles } from 'lucide-react';

const formSchema = z.object({
  mood: z.string().min(2, {
    message: 'Please tell us a bit more about your mood.',
  }).max(200, { message: 'Your mood description is a bit long!' }),
  language: z.string(),
});

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Any', label: 'Any Language' },
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
}

export function VibeSyncForm({ formAction }: VibeSyncFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      language: 'English',
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">How are you feeling?</CardTitle>
        <CardDescription>
          Describe your mood or drop an emoji. We'll craft the perfect playlist for you.
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
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
