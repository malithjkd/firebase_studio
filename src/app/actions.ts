'use server';

import { z } from 'zod'; // Import z as a value here
import { registerSchema } from '@/lib/schema';
import { db, auth } from '@/lib/firebase/config'; // Import db and the initialized auth instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Import Auth functions

type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(data: RegisterInput): Promise<{ success: boolean; message: string }> {
  console.log('Received registration data:', data);

  // Validate data again on the server
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    console.error('Server-side validation failed:', result.error.flatten().fieldErrors);
    return { success: false, message: 'Invalid data received.' };
  }

  try { // Try to create a user using firebase auth
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;
    // Once the user has been created in firebase auth, try to save it in firestore
    try{
      const docRef = await addDoc(collection(db, "users"), {
        uid: user.uid, // Link to the Auth user
        name: data.name,
        email: data.email, // Store email for convenience (optional)
        role: data.role, // Store the selected role
        registeredAt: new Date(),
      });

      console.log("User created in Auth and profile written to Firestore with ID: ", docRef.id);
      return { success: true, message: 'Registration successful! User created and data saved.' };
    }catch(firestoreError){
       console.error("Error saving data in Firestore: ", firestoreError);
       let errorMessage = 'Registration partially successful! There was a problem saving your additional information.';
        if (firestoreError instanceof Error) {
          console.error("Firestore Error Details:", firestoreError.message);
        }
      return { success: false, message: errorMessage };
    }

  } catch (authError: any) {
    console.error("Error creating user with Firebase Auth: ", authError);
    let errorMessage = 'Could not complete registration.';
    if (authError.code === 'auth/email-already-in-use') {
      errorMessage = 'This email address is already registered.';
    } else if (authError.code === 'auth/weak-password') {
      errorMessage = 'The password is too weak.';
    } else if (authError instanceof Error) {
      console.error("Firebase Auth Error Details:", authError.message);
    }
     return { success: false, message: errorMessage };
  }
}

// Define Sign-in Schema and Action here to avoid conflicts
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // Keep server validation minimal
});

type SignInInput = z.infer<typeof signInSchema>;

export async function signInUser(data: SignInInput): Promise<{ success: boolean; message: string }> {
  console.log('Received sign-in attempt:', data);

  const result = signInSchema.safeParse(data);
  if (!result.success) {
    console.error('Server-side validation failed:', result.error.flatten().fieldErrors);
    return { success: false, message: 'Invalid data received.' };
  }

  try {
    await signInWithEmailAndPassword(auth, data.email, data.password);
    console.log('User signed in successfully with Firebase.');
    return { success: true, message: 'Sign-in successful! Welcome back.' };
  } catch (authError: any) {
    console.error("Error signing in user with Firebase Auth: ", authError);
    let errorMessage = 'Sign-in failed.';
    if (authError.code === 'auth/invalid-login-credentials') {
      errorMessage = 'Invalid email or password.';
    } else if (authError.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    } else if (authError.code === 'auth/user-not-found') {
      errorMessage = 'User not found.';
    } else if (authError instanceof Error) {
      console.error("Firebase Auth Error Details:", authError.message);
    }
    return { success: false, message: errorMessage };
  }
}