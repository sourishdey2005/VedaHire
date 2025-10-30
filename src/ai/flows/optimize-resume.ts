'use server';
/**
 * @fileOverview This file defines a Genkit flow for optimizing a resume based on a job description, highlighting missing keywords and skill gaps.
 *
 * - optimizeResume - A function that handles the resume optimization process.
 * - OptimizeResumeInput - The input type for the optimizeResume function.
 * - OptimizeResumeOutput - The return type for the optimizeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to be optimized.'),
  jobDescription: z.string().describe('The job description to optimize the resume for.'),
});
export type OptimizeResumeInput = z.infer<typeof OptimizeResumeInputSchema>;

const OptimizeResumeOutputSchema = z.object({
  optimizedResume: z.string().describe('The optimized resume content with highlighted improvements.'),
  missingKeywords: z.array(z.string()).describe('A list of keywords missing from the resume based on the job description.'),
  skillGaps: z.array(z.string()).describe('A list of skill gaps identified in the resume based on the job description.'),
  atsScoreImprovementSuggestions: z
    .string()
    .describe('Suggestions on how to improve the resume ATS score, formatted as a bulleted list.'),
});
export type OptimizeResumeOutput = z.infer<typeof OptimizeResumeOutputSchema>;

export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizeResumeOutput> {
  return optimizeResumeFlow(input);
}

const optimizeResumePrompt = ai.definePrompt({
  name: 'optimizeResumePrompt',
  input: {schema: OptimizeResumeInputSchema},
  output: {schema: OptimizeResumeOutputSchema},
  prompt: `You are an expert resume optimizer. Analyze the provided resume and job description.

  Your goal is to provide a comprehensive optimization plan.

  1.  **Optimized Resume**: Rewrite the resume to better align with the job description. Incorporate missing keywords naturally and rephrase experience to highlight relevant skills.
  2.  **Missing Keywords**: Identify and list important keywords from the job description that are missing in the resume.
  3.  **Skill Gaps**: Identify and list any skills or qualifications mentioned in the job description that the resume does not cover.
  4.  **ATS Score Improvement Suggestions**: Provide a bulleted list of clear, actionable suggestions on how to improve the resume's ATS score.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}
  `,
});

const optimizeResumeFlow = ai.defineFlow(
  {
    name: 'optimizeResumeFlow',
    inputSchema: OptimizeResumeInputSchema,
    outputSchema: OptimizeResumeOutputSchema,
  },
  async input => {
    const {output} = await optimizeResumePrompt(input);
    return output!;
  }
);
