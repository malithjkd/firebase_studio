'use server';

import type { z } from 'zod';
import { registerSchema } from '@/lib/schema';
import { db } from '@/lib/firebase/config'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Import Auth functions
type SigninInput = { email: string, password: string};
  
const auth = getAuth(); // Initialize Firebase Auth

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
  // --- End Database Interaction ---

  // // Simulate successful registration (old code)
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  // console.log('User registered successfully (simulated).');
  // return { success: true, message: 'Registration successful! Thank you.' };
}


export async function signInUser(data: SigninInput): Promise<{ success: boolean; message: string }> {
  'use server';
  console.log('Sign in attempted with:', data);
  try {
    await signInWithEmailAndPassword(auth, data.email, data.password);
    return { success: true, message: "Sign in successful." };

  } catch (authError: any) {
      console.error("Error signing in user: ", authError);
      let errorMessage = 'Sign in failed.';
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
