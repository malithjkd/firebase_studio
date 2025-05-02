
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types'; // Assuming types are defined here

interface AiChatInterfaceProps {
  chatHistory: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function AiChatInterface({ chatHistory, onSendMessage, isLoading }: AiChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom when new messages are added or loading state changes
   useEffect(() => {
     if (viewportRef.current) {
       viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
     }
   }, [chatHistory, isLoading]);


  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 mb-4 pr-4" viewportRef={viewportRef}>
         <div className="space-y-4">
            {chatHistory.map((msg, index) => (
                <div
                key={index}
                className={cn(
                    'flex items-start gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
                >
                {msg.role === 'model' && (
                    <Avatar className="h-8 w-8">
                    {/* You can replace with an actual image if you have one */}
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={cn(
                    'max-w-[75%] rounded-lg p-3 text-sm whitespace-pre-wrap break-words', // Ensure text wraps
                    msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                >
                   {/* Basic markdown rendering for newlines */}
                   {msg.content.split('\n').map((line, i) => (
                     <React.Fragment key={i}>
                       {line}
                       {i < msg.content.split('\n').length - 1 && <br />}
                     </React.Fragment>
                   ))}
                 </div>
                {msg.role === 'user' && (
                    <Avatar className="h-8 w-8">
                    {/* You can replace with user's actual avatar later */}
                    <AvatarFallback><User size={18}/></AvatarFallback>
                    </Avatar>
                )}
                </div>
            ))}
           {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
               </Avatar>
               <div className="bg-muted rounded-lg p-3">
                 <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
               </div>
             </div>
           )}
         </div>
      </ScrollArea>

       <div className="flex items-center gap-2">
         <Input
           type="text"
           placeholder="Type your message..."
           value={inputMessage}
           onChange={(e) => setInputMessage(e.target.value)}
           onKeyDown={handleKeyDown}
           disabled={isLoading}
           className="flex-1"
         />
         <Button onClick={handleSend} disabled={isLoading || !inputMessage.trim()} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
         </Button>
      </div>
    </div>
  );
}
