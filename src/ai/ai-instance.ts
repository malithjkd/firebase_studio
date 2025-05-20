// src/ai/ai-instance.ts
import dotenv from 'dotenv';
//require('dotenv').config();


// STEP 2: Add your console.log statement HERE
console.log("--- Inside src/ai/ai-instance.ts ---");
console.log("started");
console.log("------------------------------------");


import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
