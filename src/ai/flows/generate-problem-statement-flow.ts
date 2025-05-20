
'use server';
/**
 * @fileOverview Generates a concise problem statement based on conversation history.
 *
 * - generateProblemStatement - Function to extract and summarize the problem.
 */

import {ai} from '@/ai/ai-instance';
import {
  GenerateProblemStatementInputSchema,
  type GenerateProblemStatementInput,
  GenerateProblemStatementOutputSchema,
  type GenerateProblemStatementOutput
} from '@/lib/types'; // Import schemas and types


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

// Self-import can be removed if dev.ts handles it.
// import './generate-problem-statement-flow';
