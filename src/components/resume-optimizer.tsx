'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, LoaderCircle, Download, Upload, FileText } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { runResumeOptimization } from '@/app/actions';
import { downloadTextFile } from '@/lib/download';
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

type OptimizationResult = {
  optimizedResume: string;
  missingKeywords: string[];
  skillGaps: string[];
  atsScoreImprovementSuggestions: string;
};

export function ResumeOptimizer() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
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
      const optimizationResult = await runResumeOptimization(values);
      if (optimizationResult) {
        setResult(optimizationResult);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description:
          'An error occurred during resume optimization. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Resume Optimizer
        </CardTitle>
        <CardDescription>
          Get AI-driven suggestions to optimize your resume, highlighting
          missing keywords and skill gaps.
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
                    <label
                      htmlFor="resume-upload-optimize"
                      className="cursor-pointer"
                    >
                      <Upload className="mr-2" />
                      Upload PDF
                    </label>
                  </Button>
                  <Input
                    id="resume-upload-optimize"
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
                <Sparkles className="mr-2" />
              )}
              Optimize My Resume
            </Button>
          </form>
        </Form>

        <div className="mt-8">
          {loading && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Skeleton className="h-96" />
              <div className="space-y-6">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-32" />
              </div>
            </div>
          )}
          {result && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-secondary/50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-headline">
                      Optimized Resume
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        downloadTextFile(
                          result.optimizedResume,
                          'optimized-resume.txt'
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
                    value={result.optimizedResume}
                    className="min-h-[400px] bg-background"
                  />
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-base">
                      Missing Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((keyword, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-accent/20 border-accent/50 text-accent-foreground"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-base">
                      Skill Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.skillGaps.map((skill, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-accent/20 border-accent/50 text-accent-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-base">
                      ATS Score Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {result.atsScoreImprovementSuggestions}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
