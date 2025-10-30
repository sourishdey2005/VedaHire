import { config } from 'dotenv';
config();

import '@/ai/flows/score-resume-content.ts';
import '@/ai/flows/optimize-resume.ts';
import '@/ai/flows/generate-resume.ts';
import '@/ai/flows/analyze-resume-ats.ts';
import '@/ai/flows/generate-cover-letter.ts';