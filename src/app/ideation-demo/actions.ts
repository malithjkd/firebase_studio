
'use server';

import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { IdeationFormData } from '@/lib/types';

export async function saveIdeationForm(data: IdeationFormData): Promise<{ success: boolean; message: string }> {
  console.log('Saving Ideation Form Data:', data);

  // Optional: Add server-side validation here if needed

  try {
    const docRef = await addDoc(collection(db, 'ideationForms'), {
      ...data,
      createdAt: serverTimestamp(), // Add a timestamp
    });
    console.log('Ideation form saved with ID:', docRef.id);
    return { success: true, message: 'Ideation form saved successfully!' };
  } catch (error) {
    console.error('Error saving ideation form:', error);
     let errorMessage = 'Could not save the ideation form.';
     if (error instanceof Error) {
       errorMessage += ` Details: ${error.message}`;
     }
    return { success: false, message: errorMessage };
  }
}
