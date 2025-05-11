
import React from 'react';
import { useNotesStore } from '../store/useNotesStore';
import { cn } from '@/lib/utils';
import { Plus, Trash, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { notes, currentNoteId, addNote, setCurrentNote, deleteNote } = useNotesStore();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddNote = () => {
    addNote();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleNoteClick = (noteId: string) => {
    setCurrentNote(noteId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const goToHome = () => {
    navigate('/');
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 border-r border-border bg-sidebar h-full flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h1 className="font-semibold text-lg">Notes</h1>
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleAddNote} title="New Note">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-grow">
        <div className="p-2">
          {isMobile && (
            <>
              <div 
                className="flex items-center gap-2 p-3 rounded-md mb-1 cursor-pointer hover:bg-sidebar-accent transition-colors"
                onClick={goToHome}
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </div>
              
              <div 
                className="flex items-center gap-2 p-3 rounded-md mb-3 cursor-pointer hover:bg-sidebar-accent transition-colors"
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">New Note</span>
              </div>
              
              <Separator className="mb-3" />
            </>
          )}
          
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "group flex flex-col p-3 rounded-md mb-1 cursor-pointer hover:bg-sidebar-accent transition-colors",
                currentNoteId === note.id && "bg-sidebar-accent"
              )}
              onClick={() => handleNoteClick(note.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{note.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  title="Delete Note"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatDate(note.updatedAt)}
              </span>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <p>No notes yet</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleAddNote}>
                Create one
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
