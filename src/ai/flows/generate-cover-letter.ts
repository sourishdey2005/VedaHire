// Define the types
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a cover letter tailored to a resume and job description.
 *
 * The flow takes in a resume, job description, and job role, and generates a cover letter.
 * It uses the ai.definePrompt and ai.defineFlow functions from the Genkit library.
 *
 * @exports generateCoverLetter - A function that takes the input data and returns a generated cover letter.
 * @exports GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * @exports GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume.'),
  jobDescription: z
    .string()
    .describe('The job description for the target position.'),
  jobRole: z
    .string()
    .describe('The job role the user is applying for.'),
  userName: z.string().describe('The name of the user applying for the job'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

const generateCoverLetterPrompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert resume and cover letter writer.

  Based on the user's resume, their name, and the job description, write a cover letter tailored to the user and the job description provided.  The cover letter should be professional and highlight the user's strengths that align with the job requirements.

  User Name: {{{userName}}}
  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}

  Job Role:
  {{jobRole}}
  `,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await generateCoverLetterPrompt(input);
    return output!;
  }
);

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}
