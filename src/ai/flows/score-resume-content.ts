'use server';

/**
 * @fileOverview A resume content scoring AI agent.
 *
 * - scoreResumeContent - A function that handles the resume content scoring process.
 * - ScoreResumeContentInput - The input type for the scoreResumeContent function.
 * - ScoreResumeContentOutput - The return type for the scoreResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreResumeContentInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
  jobDescription: z.string().describe('The job description to match the resume against.'),
});
export type ScoreResumeContentInput = z.infer<typeof ScoreResumeContentInputSchema>;

const ScoreResumeContentOutputSchema = z.object({
  sections: z
    .array(
      z.object({
        sectionName: z.string().describe('The name of the resume section.'),
        matchScore: z.number().describe('The match score for the section (0-100).'),
        strengths: z.string().describe('Strengths of the section, formatted as a bulleted list.'),
        weaknesses: z.string().describe('Weaknesses of the section, formatted as a bulleted list.'),
        missingKeywords: z.array(z.string()).describe('Keywords missing from the section.'),
      })
    )
    .describe('An array of scored resume sections.'),
});
export type ScoreResumeContentOutput = z.infer<typeof ScoreResumeContentOutputSchema>;

export async function scoreResumeContent(input: ScoreResumeContentInput): Promise<ScoreResumeContentOutput> {
  return scoreResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreResumeContentPrompt',
  input: {schema: ScoreResumeContentInputSchema},
  output: {schema: ScoreResumeContentOutputSchema},
  prompt: `You are an expert resume content scorer. Given a resume and a job description, you will score each section of the resume based on how well it matches the job description.

For each resume section (e.g., Summary, Experience, Education, Skills):
1.  Provide a match score (0-100).
2.  List the strengths as a bulleted list.
3.  List the weaknesses as a bulleted list.
4.  List any important missing keywords from the job description.

Format the strengths and weaknesses as clear, concise bullet points.

Resume:
{{{resumeText}}}

Job Description:
{{{jobDescription}}}`,
});

const scoreResumeContentFlow = ai.defineFlow(
  {
    name: 'scoreResumeContentFlow',
    inputSchema: ScoreResumeContentInputSchema,
    outputSchema: ScoreResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
