'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, LoaderCircle, Upload, FileText } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { runContentScoring } from '@/app/actions';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { extractTextFromPDF } from '@/lib/pdf-utils';

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

type ScoreResult = {
  sections: {
    sectionName: string;
    matchScore: number;
    strengths: string;
    weaknesses: string;
    missingKeywords: string[];
  }[];
};

export function ContentScorer() {
  const [result, setResult] = useState<ScoreResult | null>(null);
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
      const scoreResult = await runContentScoring(values);
      if (scoreResult) {
        setResult(scoreResult);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Scoring Failed',
        description:
          'An error occurred during content scoring. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Resume Content Scoring
        </CardTitle>
        <CardDescription>
          Get a detailed, section-by-section score of your resume against the
          job requirements.
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
                      htmlFor="resume-upload-score"
                      className="cursor-pointer"
                    >
                      <Upload className="mr-2" />
                      Upload PDF
                    </label>
                  </Button>
                  <Input
                    id="resume-upload-score"
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
                <Star className="mr-2" />
              )}
              Score My Resume
            </Button>
          </form>
        </Form>

        <div className="mt-8">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {result && (
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Scoring Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {result.sections.map((section, index) => (
                    <AccordionItem
                      value={`item-${index}`}
                      key={index}
                      className="border-b"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-semibold text-lg">
                            {section.sectionName}
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={section.matchScore}
                              className="w-24 h-2"
                            />
                            <span className="text-primary font-bold">
                              {section.matchScore}%
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 bg-background rounded-b-md space-y-4">
                        <div>
                          <h4 className="font-semibold mb-1">Strengths</h4>
                          <p className="text-sm text-muted-foreground">
                            {section.strengths}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Weaknesses</h4>
                          <p className="text-sm text-muted-foreground">
                            {section.weaknesses}
                          </p>
                        </div>
                        {section.missingKeywords.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {section.missingKeywords.map((keyword, i) => (
                                <Badge key={i} variant="secondary">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
