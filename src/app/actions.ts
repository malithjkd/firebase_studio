'use server';

import type { z } from 'zod';
import { registerSchema } from '@/lib/schema';
import { db } from '@/lib/firebase/config'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore';

type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(data: RegisterInput): Promise<{ success: boolean; message: string }> {
  console.log('Received registration data:', data);

  // Validate data again on the server
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    console.error('Server-side validation failed:', result.error.flatten().fieldErrors);
    return { success: false, message: 'Invalid data received.' };
  }

  // --- Database Interaction ---
  try {
    // Add a new document with a generated id to the 'users' collection
    // IMPORTANT: In a real app, you would use Firebase Authentication to create a user
    // and then potentially store additional profile info here, linked by the user's UID.
    // This example just stores the submitted name and email directly.
    const docRef = await addDoc(collection(db, "users"), {
      name: data.name,
      email: data.email,
      registeredAt: new Date(), // Optional: Timestamp of registration
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, message: 'Registration successful! Your data has been saved.' };

  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    // Provide a more user-friendly error message
    let errorMessage = 'Could not complete registration due to a server error.';
    if (error instanceof Error) {
       // You might want to tailor messages based on specific Firebase error codes
       // e.g., if (error.code === 'permission-denied') { ... }
       console.error("Firestore Error Details:", error.message);
    }
     return { success: false, message: errorMessage };
  }
  // --- End Database Interaction ---

  // // Simulate successful registration (old code)
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  // console.log('User registered successfully (simulated).');
  // return { success: true, message: 'Registration successful! Thank you.' };
}

// Placeholder sign-in action - needs implementation with Firebase Auth
export async function signInUser(formData: FormData): Promise<{ success: boolean; message: string }> {
  'use server';
  console.log('Sign in attempted with:', Object.fromEntries(formData.entries()));
  // TODO: Implement actual sign-in logic using Firebase Authentication
  // e.g., using signInWithEmailAndPassword(auth, email, password)
  await new Promise(res => setTimeout(res, 500)); // Simulate delay
  return { success: false, message: "Sign in functionality not yet connected to database." };
}