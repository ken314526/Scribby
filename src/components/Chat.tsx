
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/aiService';
import { useNotesStore, ChatMessage } from '../store/useNotesStore';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Chat: React.FC<ChatProps> = ({ noteId, isOpen, onClose }) => {
  const { notes, addChatMessage } = useNotesStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const currentNote = notes.find(note => note.id === noteId);
  const chatHistory = currentNote?.chatHistory || [];

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;
    
    const message = inputValue.trim();
    addChatMessage(noteId, message, 'user');
    setInputValue('');
    setIsLoading(true);
    
    try {
      const aiResponse = await getAIResponse(message);
      addChatMessage(noteId, aiResponse, 'ai');
    } catch (error) {
      console.error('Error getting AI response:', error);
      addChatMessage(noteId, 'Sorry, I encountered an error. Please try again.', 'ai');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-8 w-80 sm:w-96 bg-card border border-border rounded-t-lg shadow-lg transition-transform duration-300 z-50",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between p-3 bg-muted/30 border-b border-border rounded-t-lg">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          <span className="font-medium">AI Assistant</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-72">
        <ScrollArea className="h-full p-3" ref={scrollAreaRef}>
          {chatHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-4">
              <div className="text-muted-foreground">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Ask me anything about your note!</p>
                <p className="text-xs mt-1">I can help you organize, brainstorm, or summarize.</p>
              </div>
            </div>
          ) : (
            chatHistory.map((message: ChatMessage) => (
              <div
                key={message.id}
                className={cn(
                  "mb-3 max-w-[85%] p-3 rounded-lg",
                  message.sender === 'user'
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-1 text-muted-foreground mb-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </ScrollArea>
      </div>
      
      <div className="p-3 border-t border-border">
        <div className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="pr-10 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 bottom-2"
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full h-12 w-12 fixed bottom-6 right-8 shadow-md bg-background hover:bg-accent border-2"
      onClick={onClick}
    >
      <Bot className="h-6 w-6" />
    </Button>
  );
};
