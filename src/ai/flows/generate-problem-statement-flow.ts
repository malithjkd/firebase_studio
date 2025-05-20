
'use server';
/**
 * @fileOverview Generates a concise problem statement based on conversation history.
 *
 * - generateProblemStatement - Function to extract and summarize the problem.
 * - GenerateProblemStatementInput - Input type.
 * - GenerateProblemStatementOutput - Output type.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import type { Message } from '@/lib/types';

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const GenerateProblemStatementInputSchema = z.object({
  chatHistory: z.array(MessageSchema).describe('The full conversation history discussing the project idea.'),
});
export type GenerateProblemStatementInput = z.infer<typeof GenerateProblemStatementInputSchema>;

const GenerateProblemStatementOutputSchema = z.object({
    problemStatement: z.string().describe('A concise summary of the core problem the user wants to solve, based on the conversation.')
});
export type GenerateProblemStatementOutput = z.infer<typeof GenerateProblemStatementOutputSchema>;


export async function generateProblemStatement(input: GenerateProblemStatementInput): Promise<GenerateProblemStatementOutput> {
  return generateProblemStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProblemStatementPrompt',
  input: { schema: GenerateProblemStatementInputSchema },
  output: { schema: GenerateProblemStatementOutputSchema },
  prompt: `Analyze the following conversation history between a user and an AI assistant discussing a project idea. Your task is to identify and extract the core problem the user is trying to address. Summarize this problem into a concise statement (1-3 sentences). Focus only on the problem itself, not the solution yet.

Conversation History:
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}

Based on this conversation, what is the core problem being discussed?`,
});


const generateProblemStatementFlow = ai.defineFlow(
  {
    name: 'generateProblemStatementFlow',
    inputSchema: GenerateProblemStatementInputSchema,
    outputSchema: GenerateProblemStatementOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

// Add this flow to dev.ts for it to be discoverable
import './generate-problem-statement-flow';
