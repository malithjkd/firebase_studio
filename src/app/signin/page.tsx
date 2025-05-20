import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signInUser } from "@/app/actions"; // Import the updated action


export default function SignInPage() {
  // Basic client-side validation or state management can be added here if needed

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 relative">
       <Button asChild variant="ghost" className="absolute top-4 left-4 sm:top-8 sm:left-8">
         <Link href="/">
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
         </Link>
       </Button>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Use the server action directly */}
          <form action={signInUser} className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email here" required />
             </div>
             <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter password here" required />
             </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
             {/* Consider adding a section to display form submission status/errors */}
          </form>
           <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto">
               <Link href="/signup">
                Sign up
               </Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}