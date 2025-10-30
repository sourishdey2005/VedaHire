'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScanLine, LoaderCircle } from 'lucide-react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { runAtsAnalysis } from '@/app/actions';

const formSchema = z.object({
  resumeText: z
    .string()
    .min(100, 'Resume text must be at least 100 characters.')
    .max(10000, 'Resume text must be less than 10,000 characters.'),
  jobDescription: z
    .string()
    .min(100, 'Job description must be at least 100 characters.')
    .max(10000, 'Job description must be less than 10,000 characters.'),
});

type AnalysisResult = {
  atsScore: number;
  areasForImprovement: string;
};

export function AtsAnalyzer() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
      jobDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const analysisResult = await runAtsAnalysis(values);
      if (analysisResult) {
        setResult(analysisResult);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'An error occurred during the ATS analysis. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          ATS Resume Analysis
        </CardTitle>
        <CardDescription>
          See how your resume stacks up against an Applicant Tracking System for
          a specific job.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <ScanLine className="mr-2" />
              )}
              Analyze Now
            </Button>
          </form>
        </Form>

        <div className="mt-8">
          {loading && (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          )}
          {result && (
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Analysis Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2 items-center">
                      <h4 className="font-semibold">
                        ATS Compatibility Score
                      </h4>
                      <span className="font-bold text-2xl text-primary">
                        {result.atsScore}%
                      </span>
                    </div>
                    <Progress value={result.atsScore} className="w-full h-3" />
                    <FormDescription className="mt-2">
                      This score estimates how well your resume matches the job
                      description for an ATS.
                    </FormDescription>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Areas for Improvement
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap p-4 bg-background rounded-md border">
                      {result.areasForImprovement}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
