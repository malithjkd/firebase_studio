
'use server';
/**
 * @fileOverview Generates a concise solution statement based on conversation history.
 *
 * - generateSolutionStatement - Function to extract and summarize the solution.
 */

import {ai} from '@/ai/ai-instance';
import {
  GenerateSolutionStatementInputSchema,
  type GenerateSolutionStatementInput,
  GenerateSolutionStatementOutputSchema,
  type GenerateSolutionStatementOutput
} from '@/lib/types'; // Import schemas and types


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

// Self-import can be removed if dev.ts handles it.
// import './generate-solution-statement-flow';
