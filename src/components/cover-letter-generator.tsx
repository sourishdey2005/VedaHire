'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, LoaderCircle, Download, Upload, FileText } from 'lucide-react';
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
import { downloadPdf } from '@/lib/download';
import { extractTextFromPDF } from '@/lib/pdf-utils';

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
    .min(1, 'Resume text is required.')
    .max(10000, 'Resume text must be less than 10,000 characters.'),
  jobDescription: z
    .string()
    .min(1, 'Job description is required.')
    .max(10000, 'Job description must be less than 10,000 characters.'),
});

type GenerationResult = {
  coverLetter: string;
};

export function CoverLetterGenerator() {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
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
              <div className="space-y-2">
                <FormLabel>Your Resume</FormLabel>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                    <label
                      htmlFor="resume-upload-cl"
                      className="cursor-pointer"
                    >
                      <Upload className="mr-2" />
                      Upload PDF
                    </label>
                  </Button>
                  <Input
                    id="resume-upload-cl"
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
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadPdf(
                        result.coverLetter,
                        'cover-letter.pdf'
                      )
                    }
                  >
                    <Download className="mr-2"/>
                    Download PDF
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
