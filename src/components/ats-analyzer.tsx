'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScanLine, LoaderCircle, Upload, FileText } from 'lucide-react';
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
import { Input } from './ui/input';
import { extractTextFromPDF } from '@/lib/pdf-utils';

const formSchema = z.object({
  resumeText: z
    .string()
    .min(1, 'Resume text is required.')
    .max(10000, 'Resume text must be less than 10,000 characters.'),
  jobDescription: z
    .string()
    .min(1, 'Job description is required.')
    .max(10000, 'Job description must be less than 10,000 characters.'),
});

type AnalysisResult = {
  atsScore: number;
  areasForImprovement: string;
};

export function AtsAnalyzer() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
      jobDescription: '',
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setFileName(file.name);
        try {
          const text = await extractTextFromPDF(file);
          form.setValue('resumeText', text);
        } catch (error) {
          console.error('Error extracting text from PDF', error);
          toast({
            variant: 'destructive',
            title: 'PDF Parsing Failed',
            description: 'Could not extract text from the uploaded PDF.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF file.',
        });
      }
    }
  };

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
              <div className="space-y-2">
                <FormLabel>Your Resume</FormLabel>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                    <label htmlFor="resume-upload-ats" className="cursor-pointer">
                      <Upload className="mr-2" />
                      Upload PDF
                    </label>
                  </Button>
                  <Input
                    id="resume-upload-ats"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  {fileName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="text-primary" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="resumeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Your Resume Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Or paste the full text of your resume here."
                          className="min-h-[250px] md:min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
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
                    <p className="text-sm mt-2 text-muted-foreground">
                      This score estimates how well your resume matches the job
                      description for an ATS.
                    </p>
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
