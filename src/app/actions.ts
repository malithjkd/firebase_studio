'use server';

import { z } from 'zod'; // Import z as a value here
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


// registerUser end

// singin start
// Remove the duplicate import: import { z } from 'zod';

// --- Add Sign-in Schema and Action ---
const signInSchema = z.object({ // Now z.object works correctly
  email: z.string().email(),
  password: z.string().min(1), // Keep server validation minimal if client does more
});

type SignInInput = z.infer<typeof signInSchema>; // z.infer also works

export async function signInUser(data: SignInInput): Promise<{ success: boolean; message: string }> {
  console.log('Received sign-in attempt:', data);

  // Validate data on the server
  const result = signInSchema.safeParse(data);
  if (!result.success) {
    console.error('Server-side validation failed:', result.error.flatten().fieldErrors);
    return { success: false, message: 'Invalid data received.' };
  }

  // --- TODO: Implement actual authentication logic here ---
  // Example: Check credentials against a database or Firebase Auth
  // const user = await findUserByEmail(data.email);
  // if (!user || !await checkPassword(user.passwordHash, data.password)) {
  //   return { success: false, message: 'Invalid email or password.' };
  // }
  // --- End TODO ---


  // Simulate successful sign-in for now
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  console.log('User signed in successfully (simulated).');
  return { success: true, message: 'Sign-in successful! Welcome back.' };

  // Simulate failed sign-in
  // console.log('Sign-in failed (simulated).');
  // return { success: false, message: 'Invalid email or password.' };
}
// --- End Sign-in Schema and Action ---