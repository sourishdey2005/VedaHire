"use client";

import {
  ScanSearch,
  Star,
  Sparkles,
  FileText,
  Mail,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AtsAnalyzer } from '@/components/ats-analyzer';
import { ContentScorer } from '@/components/content-scorer';
import { ResumeOptimizer } from '@/components/resume-optimizer';
import { ResumeGenerator } from '@/components/resume-generator';
import { CoverLetterGenerator } from '@/components/cover-letter-generator';

export function FeatureTabs() {
  const tabTriggers = [
    { value: 'ats', icon: ScanSearch, label: 'ATS Analysis' },
    { value: 'score', icon: Star, label: 'Content Score' },
    { value: 'optimize', icon: Sparkles, label: 'Optimizer' },
    { value: 'generate', icon: FileText, label: 'Resume Builder' },
    { value: 'cover-letter', icon: Mail, label: 'Cover Letter' },
  ];

  return (
    <Tabs defaultValue="ats" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-secondary/80 h-auto flex-wrap">
        {tabTriggers.map(({ value, icon: Icon, label }) => (
          <TabsTrigger key={value} value={value} className="py-2.5">
            <Icon className="mr-2" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="ats" className="mt-6">
        <AtsAnalyzer />
      </TabsContent>
      <TabsContent value="score" className="mt-6">
        <ContentScorer />
      </TabsContent>
      <TabsContent value="optimize" className="mt-6">
        <ResumeOptimizer />
      </TabsContent>
      <TabsContent value="generate" className="mt-6">
        <ResumeGenerator />
      </TabsContent>
      <TabsContent value="cover-letter" className="mt-6">
        <CoverLetterGenerator />
      </TabsContent>
    </Tabs>
  );
}
