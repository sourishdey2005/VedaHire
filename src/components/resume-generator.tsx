'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, LoaderCircle, Download } from 'lucide-react';
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
import { runResumeGeneration } from '@/app/actions';
import { downloadPdf } from '@/lib/download';

const formSchema = z.object({
  profileDetails: z
    .string()
    .min(100, 'Profile details must be at least 100 characters.')
    .max(10000, 'Profile details must be less than 10,000 characters.'),
  jobRole: z
    .string()
    .min(3, 'Job role must be at least 3 characters.')
    .max(100, 'Job role must be less than 100 characters.'),
});

type GenerationResult = {
  resume: string;
};

export function ResumeGenerator() {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileDetails: '',
      jobRole: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const generationResult = await runResumeGeneration(values);
      if (generationResult) {
        setResult(generationResult);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'An error occurred during resume generation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          AI Resume Builder
        </CardTitle>
        <CardDescription>
          Generate a new, professional resume based on your profile details and
          a selected job role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Profile Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide details about your work experience, education, skills, projects, etc."
                      className="min-h-[250px]"
                      {...field}
                    />
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
                      placeholder="e.g., Senior Software Engineer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <FileText className="mr-2" />
              )}
              Generate Resume
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
                    Your Generated Resume
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadPdf(result.resume, 'generated-resume.pdf')
                    }
                  >
                    <Download className="mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={result.resume}
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
