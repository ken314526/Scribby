
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  chatHistory: ChatMessage[];
};

interface NotesState {
  notes: Note[];
  currentNoteId: string | null;
  addNote: () => void;
  updateNoteTitle: (id: string, title: string) => void;
  updateNoteContent: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (id: string) => void;
  addChatMessage: (noteId: string, message: string, sender: 'user' | 'ai') => void;
}

const createDefaultNote = (): Note => ({
  id: Date.now().toString(),
  title: 'Untitled Note',
  content: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  chatHistory: [],
});

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome Note',
    content: '<h1>Welcome to ScribbyAI!</h1><p>This is a sample note to get you started.</p><ul><li>Click on the AI button in the bottom right to start chatting</li><li>Create new notes using the + button in the sidebar</li><li>Edit this note to try out the rich text editor</li></ul>',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    chatHistory: [],
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: '<h2>Team Meeting - May 10, 2025</h2><p>Attendees: John, Sarah, Mike, Lisa</p><h3>Agenda</h3><ol><li>Project updates</li><li>Roadmap review</li><li>Q&A session</li></ol>',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    chatHistory: [],
  },
];

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: initialNotes,
      currentNoteId: initialNotes[0].id,
      
      addNote: () => {
        const newNote = createDefaultNote();
        set((state) => ({
          notes: [newNote, ...state.notes],
          currentNoteId: newNote.id,
        }));
      },
      
      updateNoteTitle: (id, title) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, title, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      
      updateNoteContent: (id, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, content, updatedAt: Date.now() }
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        const { notes, currentNoteId } = get();
        const filteredNotes = notes.filter((note) => note.id !== id);
        
        set({
          notes: filteredNotes,
          currentNoteId:
            currentNoteId === id
              ? filteredNotes.length > 0
                ? filteredNotes[0].id
                : null
              : currentNoteId,
        });
      },
      
      setCurrentNote: (id) => {
        set({ currentNoteId: id });
      },
      
      addChatMessage: (noteId, content, sender) => {
        const message: ChatMessage = {
          id: Date.now().toString(),
          content,
          sender,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  chatHistory: [...note.chatHistory, message],
                }
              : note
          ),
        }));
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);
