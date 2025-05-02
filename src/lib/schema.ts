import { z } from 'zod';

// Define the possible roles
const userRoles = ["Initiative Originator", "Product owner", "Benefit manager", "Benefit owner", "COE member"] as const;

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }), // Add password field
  role: z.enum(userRoles, { // Add role field with specific options
    errorMap: (issue, ctx) => ({ message: 'Please select a valid role.' }),
  }),
});