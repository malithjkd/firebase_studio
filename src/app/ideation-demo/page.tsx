
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IdeationForm } from '@/components/IdeationForm';
import { AiChatInterface } from '@/components/AiChatInterface';
import type { IdeationFormData, Message } from '@/lib/types'; // Assuming types are defined here
import { saveIdeationForm } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Import AI flow functions
import { ideationChat } from '@/ai/flows/ideation-chat-flow';
import { generateProblemStatement } from '@/ai/flows/generate-problem-statement-flow';
import { generateSolutionStatement } from '@/ai/flows/generate-solution-statement-flow';


export default function IdeationDemoPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<IdeationFormData>>({});
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate Ideation Form Number on mount
   useEffect(() => {
    // Avoid hydration mismatch by generating ID only on client
     setFormData(prev => ({
       ...prev,
       ideationFormNumber: `ID-${Date.now().toString().slice(-6)}`
     }));
     // Set initial AI message
     setChatHistory([{ role: 'model', content: 'Hi! Let\'s discuss your project idea. What problem are you trying to solve?' }]);
   }, []);

  const handleFormChange = useCallback((field: keyof IdeationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || isAiLoading) return;

    const newUserMessage: Message = { role: 'user', content: messageContent };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsAiLoading(true);

    try {
      const aiResponse = await ideationChat({ chatHistory: updatedHistory });
      const newAiMessage: Message = { role: 'model', content: aiResponse };
      setChatHistory(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not get response from AI. Please try again.',
      });
       // Add error message to chat
       const errorMessage: Message = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
       setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  }, [chatHistory, isAiLoading, toast]);


  const handleGenerateProblem = useCallback(async () => {
     if (isAiLoading) return;
     setIsAiLoading(true);
      const thinkingMessage: Message = { role: 'model', content: 'Okay, let me try to summarize the problem based on our chat...' };
      setChatHistory(prev => [...prev, thinkingMessage]);

     try {
       const result = await generateProblemStatement({ chatHistory });
       handleFormChange('problemStatement', result.problemStatement);
       const successMessage: Message = { role: 'model', content: `Generated Problem Statement:\n\n${result.problemStatement}\n\nI've updated the form. Does this look right? Let's discuss the potential solution next.` };
       // Replace thinking message with success message
       setChatHistory(prev => [...prev.slice(0, -1), successMessage]);
       toast({ title: 'Success', description: 'Problem statement generated and updated.' });
     } catch (error) {
       console.error('Generate Problem Statement Error:', error);
       toast({
         variant: 'destructive',
         title: 'AI Error',
         description: 'Could not generate problem statement.',
       });
        const errorMessage: Message = { role: 'model', content: 'Sorry, I had trouble generating the problem statement. Could you try rephrasing or providing more details?' };
       // Replace thinking message with error message
       setChatHistory(prev => [...prev.slice(0, -1), errorMessage]);
     } finally {
       setIsAiLoading(false);
     }
   }, [chatHistory, handleFormChange, toast, isAiLoading]);

   const handleGenerateSolution = useCallback(async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
     const thinkingMessage: Message = { role: 'model', content: 'Alright, let me draft a potential solution based on our conversation...' };
     setChatHistory(prev => [...prev, thinkingMessage]);

    try {
      const result = await generateSolutionStatement({ chatHistory });
      handleFormChange('solutionStatement', result.solutionStatement);
      const successMessage: Message = { role: 'model', content: `Generated Solution Statement:\n\n${result.solutionStatement}\n\nI've updated the form with the solution. Feel free to edit it or discuss further!` };
      // Replace thinking message with success message
       setChatHistory(prev => [...prev.slice(0, -1), successMessage]);
      toast({ title: 'Success', description: 'Solution statement generated and updated.' });
    } catch (error) {
      console.error('Generate Solution Statement Error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate solution statement.',
      });
       const errorMessage: Message = { role: 'model', content: 'Sorry, I had trouble generating the solution statement. Could you elaborate on the proposed solution?' };
       // Replace thinking message with error message
       setChatHistory(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  }, [chatHistory, handleFormChange, toast, isAiLoading]);


  const handleSave = async () => {
    // Basic validation check
    if (!formData.targetPersona || !formData.businessSponsor || !formData.originator || !formData.problemStatement || !formData.solutionStatement) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in all required fields before saving.",
        });
        return;
    }

    setIsSaving(true);
    try {
      const result = await saveIdeationForm(formData as IdeationFormData); // Cast as non-partial assuming validation passed
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        // Optionally reset form or navigate away
        // setFormData({});
        // setChatHistory([{ role: 'model', content: 'Let\'s start a new idea!' }]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Saving',
          description: result.message || 'Could not save the form.',
        });
      }
    } catch (error) {
      console.error('Save Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while saving.',
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-8 relative bg-muted/40">
      <Button asChild variant="ghost" className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <h1 className="text-3xl font-bold text-center my-8">Ideation Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Column: Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ideation Form</CardTitle>
          </CardHeader>
          <CardContent>
            <IdeationForm formData={formData} onFormChange={handleFormChange} disabled={isSaving}/>
             <Button
                onClick={handleSave}
                disabled={isSaving || isAiLoading || !formData.problemStatement || !formData.solutionStatement} // Disable if saving, AI working, or statements missing
                className="w-full mt-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Ideation Form'
                )}
              </Button>
          </CardContent>
        </Card>

        {/* Right Column: Chat */}
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle>AI Project Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
             <AiChatInterface
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isAiLoading}
            />
             <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t">
               <Button
                onClick={handleGenerateProblem}
                disabled={isAiLoading || chatHistory.length < 2} // Disable if loading or not enough chat history
                variant="outline"
                size="sm"
                className="flex-1 min-w-[150px]"
              >
                {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Problem Statement
              </Button>
               <Button
                 onClick={handleGenerateSolution}
                 disabled={isAiLoading || !formData.problemStatement || chatHistory.length < 4} // Disable if loading, problem statement missing, or not enough chat history
                 variant="outline"
                 size="sm"
                 className="flex-1 min-w-[150px]"
               >
                 {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 Generate Solution Statement
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
