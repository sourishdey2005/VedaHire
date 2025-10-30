'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, LoaderCircle, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { runCoverLetterGeneration } from '@/app/actions';
import { downloadTextFile } from '@/lib/download';

const formSchema = z.object({
  userName: z
    .string()
    .min(2, 'Your name must be at least 2 characters.')
    .max(100, 'Your name must be less than 100 characters.'),
  jobRole: z
    .string()
    .min(3, 'Job role must be at least 3 characters.')
    .max(100, 'Job role must be less than 100 characters.'),
  resumeText: z
    .string()
    .min(100, 'Resume text must be at least 100 characters.')
    .max(10000, 'Resume text must be less than 10,000 characters.'),
  jobDescription: z
    .string()
    .min(100, 'Job description must be at least 100 characters.')
    .max(10000, 'Job description must be less than 10,000 characters.'),
});

type GenerationResult = {
  coverLetter: string;
};

export function CoverLetterGenerator() {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      jobRole: '',
      resumeText: '',
      jobDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const generationResult = await runCoverLetterGeneration(values);
      if (generationResult) {
        setResult(generationResult);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'An error occurred during cover letter generation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          AI Cover Letter Generator
        </CardTitle>
        <CardDescription>
          Create a compelling cover letter tailored to your resume and the job
          you're applying for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Job Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Product Manager"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Resume Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full text of your resume here."
                        className="min-h-[250px] md:min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full job description here."
                        className="min-h-[250px] md:min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Mail className="mr-2" />
              )}
              Generate Cover Letter
            </Button>
          </form>
        </Form>

        <div className="mt-8">
          {loading && <Skeleton className="h-96 w-full" />}
          {result && (
            <Card className="bg-secondary/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-headline">
                    Your Generated Cover Letter
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      downloadTextFile(
                        result.coverLetter,
                        'cover-letter.txt'
                      )
                    }
                  >
                    <Download />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={result.coverLetter}
                  className="min-h-[500px] bg-background"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
