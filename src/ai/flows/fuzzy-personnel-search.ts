'use server';
/**
 * @fileOverview Fuzzy personnel search flow.
 *
 * - fuzzyPersonnelSearch - A function that handles the fuzzy search for personnel by name.
 * - FuzzyPersonnelSearchInput - The input type for the fuzzyPersonnelSearch function.
 * - FuzzyPersonnelSearchOutput - The return type for the fuzzyPersonnelSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FuzzyPersonnelSearchInputSchema = z.object({
  partialName: z
    .string()
    .describe('The partial name of the personnel to search for.'),
  personnelList: z.array(z.string()).describe('A list of personnel names to search through'),
});
export type FuzzyPersonnelSearchInput = z.infer<
  typeof FuzzyPersonnelSearchInputSchema
>;

const FuzzyPersonnelSearchOutputSchema = z.array(z.string()).describe(
  'A list of personnel names that fuzzy match the input partial name.'
);
export type FuzzyPersonnelSearchOutput = z.infer<
  typeof FuzzyPersonnelSearchOutputSchema
>;

export async function fuzzyPersonnelSearch(
  input: FuzzyPersonnelSearchInput
): Promise<FuzzyPersonnelSearchOutput> {
  return fuzzyPersonnelSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fuzzyPersonnelSearchPrompt',
  input: {schema: FuzzyPersonnelSearchInputSchema},
  output: {schema: FuzzyPersonnelSearchOutputSchema},
  prompt: `You are an expert in fuzzy matching names.

You are given a partial name and a list of personnel names.

Return a list of personnel names that fuzzy match the partial name.

Partial Name: {{{partialName}}}
Personnel List:
{{#each personnelList}}- {{{this}}}\n{{/each}}`,
});

const fuzzyPersonnelSearchFlow = ai.defineFlow(
  {
    name: 'fuzzyPersonnelSearchFlow',
    inputSchema: FuzzyPersonnelSearchInputSchema,
    outputSchema: FuzzyPersonnelSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
