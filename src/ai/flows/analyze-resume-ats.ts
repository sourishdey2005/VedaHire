'use server';

/**
 * @fileOverview Analyzes a resume against a job description to provide an ATS score and identify areas for improvement.
 *
 * - analyzeResumeAts - A function that handles the resume analysis process.
 * - AnalyzeResumeAtsInput - The input type for the analyzeResumeAts function.
 * - AnalyzeResumeAtsOutput - The return type for the analyzeResumeAts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeAtsInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
  jobDescription: z.string().describe('The job description to compare the resume against.'),
});
export type AnalyzeResumeAtsInput = z.infer<typeof AnalyzeResumeAtsInputSchema>;

const AnalyzeResumeAtsOutputSchema = z.object({
  atsScore: z.number().describe('The ATS score of the resume against the job description (0-100).'),
  areasForImprovement: z
    .string()
    .describe(
      'Specific areas for improvement in the resume, formatted as bullet points, to better match the job description.'
    ),
});
export type AnalyzeResumeAtsOutput = z.infer<typeof AnalyzeResumeAtsOutputSchema>;

export async function analyzeResumeAts(input: AnalyzeResumeAtsInput): Promise<AnalyzeResumeAtsOutput> {
  return analyzeResumeAtsFlow(input);
}

const analyzeResumeAtsPrompt = ai.definePrompt({
  name: 'analyzeResumeAtsPrompt',
  input: {schema: AnalyzeResumeAtsInputSchema},
  output: {schema: AnalyzeResumeAtsOutputSchema},
  prompt: `You are an expert ATS analyst. Analyze the resume against the job description.

Provide an ATS score from 0 to 100.
Then, identify specific areas for improvement. Present the areas for improvement as a bulleted list. Each bullet point should be a clear, actionable suggestion.

Resume:
{{{resumeText}}}

Job Description:
{{{jobDescription}}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const analyzeResumeAtsFlow = ai.defineFlow(
  {
    name: 'analyzeResumeAtsFlow',
    inputSchema: AnalyzeResumeAtsInputSchema,
    outputSchema: AnalyzeResumeAtsOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumeAtsPrompt(input);
    return output!;
  }
);
