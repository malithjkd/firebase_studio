import 'dotenv/config'; // Explicitly load .env variables for the Genkit dev server

// Flows will be imported for their side effects in this file.
import './flows/ideation-chat-flow';
import './flows/generate-problem-statement-flow';
import './flows/generate-solution-statement-flow';
