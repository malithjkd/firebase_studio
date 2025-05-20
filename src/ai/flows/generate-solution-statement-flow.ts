
'use server';
/**
 * @fileOverview Generates a concise solution statement based on conversation history.
 *
 * - generateSolutionStatement - Function to extract and summarize the solution.
 * - GenerateSolutionStatementInput - Input type.
 * - GenerateSolutionStatementOutput - Output type.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import type { Message } from '@/lib/types';

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const GenerateSolutionStatementInputSchema = z.object({
  chatHistory: z.array(MessageSchema).describe('The full conversation history discussing the project idea, including the problem and potential solutions.'),
});
export type GenerateSolutionStatementInput = z.infer<typeof GenerateSolutionStatementInputSchema>;

const GenerateSolutionStatementOutputSchema = z.object({
    solutionStatement: z.string().describe('A concise summary of the proposed solution to the identified problem, based on the conversation.')
});
export type GenerateSolutionStatementOutput = z.infer<typeof GenerateSolutionStatementOutputSchema>;


export async function generateSolutionStatement(input: GenerateSolutionStatementInput): Promise<GenerateSolutionStatementOutput> {
  return generateSolutionStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSolutionStatementPrompt',
  input: { schema: GenerateSolutionStatementInputSchema },
  output: { schema: GenerateSolutionStatementOutputSchema },
  prompt: `Analyze the following conversation history between a user and an AI assistant. They have discussed a project idea, including the problem and potential solutions. Your task is to identify and extract the core solution being proposed by the user or discussed. Summarize this solution into a concise statement (1-3 sentences). Focus only on the proposed solution.

Conversation History:
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}

Based on this conversation, what is the core solution being proposed or discussed?`,
});


const generateSolutionStatementFlow = ai.defineFlow(
  {
    name: 'generateSolutionStatementFlow',
    inputSchema: GenerateSolutionStatementInputSchema,
    outputSchema: GenerateSolutionStatementOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);


// Add this flow to dev.ts for it to be discoverable
import './generate-solution-statement-flow';
