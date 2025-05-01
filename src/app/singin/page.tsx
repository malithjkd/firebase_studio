import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { SignInForm } from "@/components/SignInForm"; // Import the new form
  
  export default function SignInPage() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm /> {/* Use the new form */}
          </CardContent>
        </Card>
      </main>
    );
  }