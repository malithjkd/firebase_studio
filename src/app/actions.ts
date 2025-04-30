'use server';

import type { z } from 'zod';
import { registerSchema } from '@/lib/schema';

type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(data: RegisterInput): Promise<{ success: boolean; message: string }> {
  // Simulate backend processing/API call
  console.log('Received registration data:', data);

  // Validate data again on the server (optional, as Zod does it on client)
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    console.error('Server-side validation failed:', result.error.flatten().fieldErrors);
    return { success: false, message: 'Invalid data received.' };
  }

  // Simulate successful registration
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

  console.log('User registered successfully (simulated).');
  return { success: true, message: 'Registration successful! Thank you.' };
}
