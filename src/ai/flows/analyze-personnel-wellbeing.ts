'use server';
/**
 * @fileOverview An AI agent for analyzing overall personnel wellbeing.
 *
 * - analyzePersonnelWellbeing - A function that analyzes personnel wellbeing.
 * - AnalyzePersonnelWellbeingInput - The input type for the analyzePersonnelWellbeing function.
 * - AnalyzePersonnelWellbeingOutput - The return type for the analyzePersonnelWellbeing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePersonnelWellbeingInputSchema = z.object({
  leaveRequests: z
    .string()
    .describe('Summary of recent leave requests, including number and duration.'),
  recentActivity: z
    .string()
    .describe('Summary of recent personnel activity, including additions, modifications, and promotions.'),
  otherData: z.string().optional().describe('Any other relevant data.'),
});
export type AnalyzePersonnelWellbeingInput = z.infer<
  typeof AnalyzePersonnelWellbeingInputSchema
>;

const AnalyzePersonnelWellbeingOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the overall personnel wellbeing.'),
  recommendations:
    z.string().describe('Recommendations for improving personnel wellbeing.'),
});
export type AnalyzePersonnelWellbeingOutput = z.infer<
  typeof AnalyzePersonnelWellbeingOutputSchema
>;

export async function analyzePersonnelWellbeing(
  input: AnalyzePersonnelWellbeingInput
): Promise<AnalyzePersonnelWellbeingOutput> {
  return analyzePersonnelWellbeingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePersonnelWellbeingPrompt',
  input: {schema: AnalyzePersonnelWellbeingInputSchema},
  output: {schema: AnalyzePersonnelWellbeingOutputSchema},
  prompt: `You are an AI assistant specializing in human resources.

You are provided with data about personnel, and you will summarize overall personnel wellbeing and provide recommendations for improvement.

Leave Requests: {{{leaveRequests}}}
Recent Activity: {{{recentActivity}}}
Other Data: {{{otherData}}}

Respond in Arabic.
`,
});

const analyzePersonnelWellbeingFlow = ai.defineFlow(
  {
    name: 'analyzePersonnelWellbeingFlow',
    inputSchema: AnalyzePersonnelWellbeingInputSchema,
    outputSchema: AnalyzePersonnelWellbeingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
