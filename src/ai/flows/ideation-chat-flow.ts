
'use server';
/**
 * @fileOverview Handles general chat conversation for project ideation.
 *
 * - ideationChat - A function to get an AI response based on chat history.
 */

import {ai} from '@/ai/ai-instance';
import {
  IdeationChatInputSchema,
  type IdeationChatInput,
  InternalPromptOutputSchemaForChat,
  type IdeationChatOutput
} from '@/lib/types'; // Import schemas and types from centralized location

const prompt = ai.definePrompt({
  name: 'ideationChatPrompt',
  input: { schema: IdeationChatInputSchema },
  output: { schema: InternalPromptOutputSchemaForChat }, // Use the nullable schema for the prompt's direct output
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
    outputSchema: InternalPromptOutputSchemaForChat, // The flow itself will also output string | null based on the prompt
  },
  async (input) => {
    const {output} = await prompt(input); // `output` here is `string | null` as per InternalPromptOutputSchemaForChat
    return output;
  }
);

// This is the exported function that the application calls.
// It ensures a non-null string is always returned to the frontend.
export async function ideationChat(input: IdeationChatInput): Promise<IdeationChatOutput> {
  const rawOutput = await ideationChatFlow(input); // rawOutput is `string | null`

  if (rawOutput === null) {
    console.warn("Ideation chat flow returned null. Providing a default response to the user.");
    // Return a user-friendly message instead of null
    return "I'm sorry, but I couldn't generate a response at this moment. Please try again or rephrase your message.";
  }
  return rawOutput; // This is a string
}

// This ensures the flow is discoverable by Genkit dev tools, typically imported in dev.ts.
// If dev.ts already imports this file for the ideationChat export, this specific line might be redundant
// but harmless.
// import './ideation-chat-flow'; // Self-import can be removed if dev.ts handles it.
