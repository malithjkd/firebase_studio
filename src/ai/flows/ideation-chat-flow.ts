
'use server';
/**
 * @fileOverview Handles general chat conversation for project ideation.
 *
 * - ideationChat - A function to get an AI response based on chat history.
 * - IdeationChatInput - The input type for the ideationChat function.
 * - IdeationChatOutput - The return type for the ideationChat function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import type { Message } from '@/lib/types'; // Assuming Message type is defined

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const IdeationChatInputSchema = z.object({
  chatHistory: z.array(MessageSchema).describe('The conversation history so far.'),
});
export type IdeationChatInput = z.infer<typeof IdeationChatInputSchema>;

const IdeationChatOutputSchema = z.string().describe('The AI\'s response to the last user message.');
export type IdeationChatOutput = z.infer<typeof IdeationChatOutputSchema>;


export async function ideationChat(input: IdeationChatInput): Promise<IdeationChatOutput> {
  return ideationChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ideationChatPrompt',
  input: { schema: IdeationChatInputSchema },
  output: { schema: IdeationChatOutputSchema },
  prompt: `You are a helpful AI assistant designed to discuss project ideas with a user. Your goal is to understand their project, focusing on the problem they want to solve and their proposed solution. Engage in natural conversation, ask clarifying questions, and help them refine their thoughts. Keep responses concise and relevant to project ideation.

Conversation History:
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}
model:`, // Prompt the model to respond
});


const ideationChatFlow = ai.defineFlow(
  {
    name: 'ideationChatFlow',
    inputSchema: IdeationChatInputSchema,
    outputSchema: IdeationChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

// Add this flow to dev.ts for it to be discoverable
import './ideation-chat-flow';
