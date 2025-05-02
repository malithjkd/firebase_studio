import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 relative">
       <Button asChild variant="ghost" className="absolute top-4 left-4 sm:top-8 sm:left-8">
         <Link href="/">
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
         </Link>
       </Button>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto">
               <Link href="/signin">
                Sign in
               </Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
