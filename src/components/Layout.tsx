
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { NoteEditor } from './NoteEditor';
import { useNotesStore } from '../store/useNotesStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Menu, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Layout: React.FC = () => {
  const { notes } = useNotesStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <div className="flex h-screen overflow-hidden flex-col">
      {isMobile && (
        <div className="h-14 border-b flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Note Editor</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div 
          className={`${isMobile 
            ? `fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
            : 'relative'
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSidebarOpen(false)} 
          />
        )}
        
        <main className="flex-1 overflow-auto">
          <NoteEditor />
        </main>
      </div>
    </div>
  );
};
