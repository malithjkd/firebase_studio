
'use server';

import type { z } from 'zod';
import { registerSchema } from '@/lib/schema';
import { db } from '@/lib/firebase/config'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore';
// IMPORTANT: Import Firebase Auth functions for real user creation
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// const auth = getAuth(); // Initialize Auth if not done in config

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
    // --- !!! IMPORTANT SECURITY WARNING !!! ---
    // In a real application, NEVER store the password directly in Firestore.
    // Use Firebase Authentication's `createUserWithEmailAndPassword` method.
    // It handles password hashing and secure storage automatically.
    // Example (requires Firebase Auth setup):
    /*
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Now store additional profile data in Firestore, linking by user.uid
      const docRef = await addDoc(collection(db, "users"), {
        uid: user.uid, // Link to the Auth user
        name: data.name,
        email: data.email, // Store email for convenience (optional)
        role: data.role,  // Store the selected role
        registeredAt: new Date(),
      });

      console.log("User created in Auth and profile written to Firestore with ID: ", docRef.id);
      return { success: true, message: 'Registration successful! User created and data saved.' };

    } catch (authError: any) {
      console.error("Error creating user with Firebase Auth: ", authError);
      // Provide specific error messages based on authError.code
      let errorMessage = 'Could not complete registration.';
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already registered.';
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      }
      return { success: false, message: errorMessage };
    }
    */
    // --- End Real Auth Example ---

    // --- Current Simplified Example (Stores role, NOT password) ---
    const docRef = await addDoc(collection(db, "users"), {
      name: data.name,
      email: data.email,
      role: data.role, // Store the selected role
      registeredAt: new Date(), // Optional: Timestamp of registration
      // DO NOT STORE data.password here directly!
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, message: 'Registration successful! Your data has been saved (excluding password for security demo).' };
    // --- End Simplified Example ---


  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    let errorMessage = 'Could not complete registration due to a server error.';
    if (error instanceof Error) {
       console.error("Firestore Error Details:", error.message);
    }
     return { success: false, message: errorMessage };
  }
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
