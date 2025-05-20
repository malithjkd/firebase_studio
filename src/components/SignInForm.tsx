//Documents/firebase_studio/src/components/SignInForm.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
//import { useToast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";
import { signInUser } from "@/app/actions";
import { useState } from "react";

// ...existing schema code...
// Define the schema for sign-in
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Basic validation
});

type SignInInput = z.infer<typeof signInSchema>;


export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Call the hook to get the toast function
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInInput) {
    setIsLoading(true);
    console.log("Sign-in attempt:", data); // Log attempt

    try {
      // --- TODO: Implement actual sign-in logic ---
      const result = await signInUser(data); // Call the server action
      // console.log("Sign-in result:", result);

      // --- Placeholder logic ---
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      // const result = { success: true, message: "Sign-in successful (simulated)!" }; // Simulate success
      // const result = { success: false, message: "Invalid credentials (simulated)." }; // Simulate failure
      // --- End Placeholder ---


      if (result.success) {
        toast({ // Now use the toast function obtained from the hook
          title: "Success!",
          description: result.message,
        });
        // TODO: Redirect to a dashboard or home page after successful sign-in
        // e.g., window.location.href = '/dashboard';
      } else {
        toast({ // Use the toast function
          variant: "destructive",
          title: "Sign In Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({ // Use the toast function
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // ...existing form rendering code...
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}