
import React, { useState } from 'react';
import { useNotesStore } from '../store/useNotesStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Grid2X2, LayoutList } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { notes, addNote, setCurrentNote } = useNotesStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getExcerpt = (content: string) => {
    const plainText = content.replace(/<[^>]+>/g, ' ').trim();
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  };

  const handleNoteClick = (noteId: string) => {
    setCurrentNote(noteId);
    navigate('/editor');
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Notes</h1>
        
        <div className="flex items-center gap-2">
          <div className="bg-muted/30 p-1 rounded-md flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-background' : ''}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-background' : ''}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={addNote} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Note
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-medium text-muted-foreground mb-4">No notes yet</h2>
          <Button onClick={addNote} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create your first note
          </Button>
        </div>
      ) : (
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {notes.map((note) => (
            <Card 
              key={note.id} 
              className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                viewMode === 'list' && "flex flex-col md:flex-row"
              )}
              onClick={() => handleNoteClick(note.id)}
            >
              <div className={viewMode === 'list' ? 'flex-1' : ''}>
                <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
                  <CardTitle className="truncate">{note.title}</CardTitle>
                  <CardDescription>
                    {formatDate(note.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className={viewMode === 'list' ? 'pt-0' : ''}>
                  <p className={cn(
                    "text-muted-foreground text-sm",
                    viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-3'
                  )}>
                    {getExcerpt(note.content) || "No content yet"}
                  </p>
                </CardContent>
              </div>
              {viewMode === 'list' && !isMobile && (
                <CardFooter className="border-l">
                  <div className="text-xs text-muted-foreground">
                    {note.chatHistory.length > 0 
                      ? `${note.chatHistory.length} message${note.chatHistory.length > 1 ? 's' : ''}` 
                      : 'No messages'}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
