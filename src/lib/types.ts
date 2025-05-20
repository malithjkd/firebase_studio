
import { z } from 'zod';

export interface IdeationFormData {
  ideationFormNumber: string;
  date: string; // Or Date if you prefer
  targetPersona: string;
  businessSponsor: string;
  originator: string;
  dascApproval?: string; // Optional
  problemStatement: string;
  solutionStatement: string;
}

export interface Message {
  role: 'user' | 'model'; // Can expand later if needed (e.g., 'system')
  content: string;
}

// Zod schema for Message
export const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

// Schemas and types for ideationChatFlow
export const IdeationChatInputSchema = z.object({
  chatHistory: z.array(MessageSchema).describe('The conversation history so far.'),
});
export type IdeationChatInput = z.infer<typeof IdeationChatInputSchema>;

// Internal schema for the prompt's output, allowing for null
export const InternalPromptOutputSchemaForChat = z.string().nullable().describe('The AI\'s raw response from the prompt, which could be null.');
// Schema for the EXPORTED function's output. It must be a string.
export const IdeationChatOutputSchema = z.string().describe('The AI\'s response to the last user message.');
export type IdeationChatOutput = z.infer<typeof IdeationChatOutputSchema>; // This will be `string`


// Schemas and types for generateProblemStatementFlow
export const GenerateProblemStatementInputSchema = z.object({
  chatHistory: z.array(MessageSchema).describe('The full conversation history discussing the project idea.'),
});
export type GenerateProblemStatementInput = z.infer<typeof GenerateProblemStatementInputSchema>;

export const GenerateProblemStatementOutputSchema = z.object({
    problemStatement: z.string().describe('A concise summary of the core problem the user wants to solve, based on the conversation.')
});
export type GenerateProblemStatementOutput = z.infer<typeof GenerateProblemStatementOutputSchema>;


// Schemas and types for generateSolutionStatementFlow
export const GenerateSolutionStatementInputSchema = z.object({
  chatHistory: z.array(MessageSchema).describe('The full conversation history discussing the project idea, including the problem and potential solutions.'),
});
export type GenerateSolutionStatementInput = z.infer<typeof GenerateSolutionStatementInputSchema>;

export const GenerateSolutionStatementOutputSchema = z.object({
    solutionStatement: z.string().describe('A concise summary of the proposed solution to the identified problem, based on the conversation.')
});
export type GenerateSolutionStatementOutput = z.infer<typeof GenerateSolutionStatementOutputSchema>;
