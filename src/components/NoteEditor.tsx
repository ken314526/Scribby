
import React, { useState, useEffect } from 'react';
import { useNotesStore } from '../store/useNotesStore';
import { TipTapEditor } from './TipTapEditor';
import { Chat, ChatButton } from './Chat';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NoteEditor: React.FC = () => {
  const { notes, currentNoteId, updateNoteTitle, updateNoteContent } = useNotesStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const currentNote = notes.find(note => note.id === currentNoteId);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  useEffect(() => {
    if (currentNoteId && title !== currentNote?.title) {
      const timer = setTimeout(() => {
        updateNoteTitle(currentNoteId, title);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [title, currentNoteId, updateNoteTitle, currentNote?.title]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (currentNoteId) {
      updateNoteContent(currentNoteId, newContent);
    }
  };

  if (!currentNote) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No note selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {!isMobile && (
        <div className="flex justify-end p-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" /> Back to Home
          </Button>
        </div>
      )}
      
      <div className={`max-w-3xl w-full mx-auto px-4 py-2 ${isMobile ? 'pb-20' : 'pb-8'} flex-grow`}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl md:text-2xl font-bold mb-4 border-none shadow-none focus-visible:ring-0 px-0"
          placeholder="Untitled Note"
        />
        
        <TipTapEditor
          content={content}
          onChange={handleContentChange}
          className="bg-editor min-h-[calc(100vh-180px)]"
        />
      </div>
      
      <ChatButton onClick={() => setIsChatOpen(!isChatOpen)} />
      
      {currentNoteId && (
        <Chat
          noteId={currentNoteId}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};
