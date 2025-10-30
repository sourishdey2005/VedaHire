'use server';

import {
  analyzeResumeAts,
  type AnalyzeResumeAtsInput,
} from '@/ai/flows/analyze-resume-ats';
import {
  generateCoverLetter,
  type GenerateCoverLetterInput,
} from '@/ai/flows/generate-cover-letter';
import {
  generateResume,
  type GenerateResumeInput,
} from '@/ai/flows/generate-resume';
import {
  optimizeResume,
  type OptimizeResumeInput,
} from '@/ai/flows/optimize-resume';
import {
  scoreResumeContent,
  type ScoreResumeContentInput,
} from '@/ai/flows/score-resume-content';

export async function runAtsAnalysis(input: AnalyzeResumeAtsInput) {
  return await analyzeResumeAts(input);
}

export async function runContentScoring(input: ScoreResumeContentInput) {
  return await scoreResumeContent(input);
}

export async function runResumeOptimization(input: OptimizeResumeInput) {
  return await optimizeResume(input);
}

export async function runResumeGeneration(input: GenerateResumeInput) {
  return await generateResume(input);
}

export async function runCoverLetterGeneration(input: GenerateCoverLetterInput) {
  return await generateCoverLetter(input);
}
