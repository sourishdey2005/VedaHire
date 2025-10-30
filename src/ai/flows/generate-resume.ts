'use server';
/**
 * @fileOverview A resume generator AI agent.
 *
 * - generateResume - A function that handles the resume generation process.
 * - GenerateResumeInput - The input type for the generateResume function.
 * - GenerateResumeOutput - The return type for the generateResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeInputSchema = z.object({
  profileDetails: z.string().describe('The user profile details including experience, skills, and education.'),
  jobRole: z.string().describe('The selected job role for tailoring the resume.'),
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

const GenerateResumeOutputSchema = z.object({
  resume: z.string().describe('The generated resume content.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are an expert resume writer. Generate a complete and professional resume based on the following user profile and job role.

User Profile:
{{{profileDetails}}}

Job Role:
{{{jobRole}}}

Ensure the resume is:
- Well-structured with clear sections (e.g., Summary, Experience, Education, Skills).
- Highlights relevant skills and experience tailored to the specified job role.
- Uses action verbs and quantifiable achievements.
- Is formatted cleanly for readability and is ATS-friendly.
`,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
