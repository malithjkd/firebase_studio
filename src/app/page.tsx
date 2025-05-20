
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, BrainCircuit, GanttChartSquare, TestTubeDiagonal } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-background to-blue-50 dark:from-background dark:to-blue-900/30">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Supercharge Your Project Management with AI
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          Leverage the power of Generative AI to streamline workflows, predict outcomes, and manage your projects more effectively than ever before.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button asChild size="lg" className="shadow-md">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-md">
            <Link href="/signin">Sign In</Link>
          </Button>
           <Button asChild size="lg" variant="secondary" className="shadow-md">
              <Link href="/ideation-demo" className="flex items-center gap-2">
                 <TestTubeDiagonal className="h-5 w-5" /> Try Ideation Demo
              </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg text-left transform transition-transform hover:scale-105">
            <CardHeader>
              <Rocket className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Accelerate Planning</CardTitle>
              <CardDescription>Let AI draft initial project plans, task lists, and timelines based on your goals.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow-lg text-left transform transition-transform hover:scale-105">
            <CardHeader>
              <BrainCircuit className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Intelligent Insights</CardTitle>
              <CardDescription>Gain AI-powered insights into risks, resource allocation, and potential bottlenecks.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="shadow-lg text-left transform transition-transform hover:scale-105">
            <CardHeader>
              <GanttChartSquare className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Automated Reporting</CardTitle>
              <CardDescription>Generate project status reports, summaries, and stakeholder updates automatically.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="relative w-full max-w-4xl mx-auto h-64 sm:h-96 rounded-lg overflow-hidden shadow-xl border">
            <Image
                src="https://picsum.photos/1200/600"
                alt="Project Management Dashboard Illustration"
                fill={true} // Changed from layout="fill"
                style={{objectFit: 'cover'}} // Changed from objectFit="cover"
                data-ai-hint="project management dashboard illustration"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold mb-2">Visualize Your Success</h3>
                  <p className="text-md opacity-90">Track progress with intuitive dashboards and AI-driven forecasts.</p>
              </div>
        </div>

      </div>
       <footer className="py-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} AI Project Manager. All rights reserved.
        </footer>
    </main>
  );
}
