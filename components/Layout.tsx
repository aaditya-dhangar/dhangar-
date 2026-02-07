
import React from 'react';
import { BookOpen, BarChart3, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => onTabChange('IDLE')}>
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">StudySmart</span>
        </div>
        <nav className="flex items-center gap-1">
          <button 
            onClick={() => onTabChange('IDLE')}
            className={`p-2 rounded-full transition-colors ${activeTab === 'IDLE' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <PlusCircle className="w-6 h-6" />
          </button>
          <button 
            onClick={() => onTabChange('DASHBOARD')}
            className={`p-2 rounded-full transition-colors ${activeTab === 'DASHBOARD' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <BarChart3 className="w-6 h-6" />
          </button>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="py-6 border-t border-gray-100 text-center text-xs text-gray-400">
        Created by Aaditya Dhangar AI
      </footer>
    </div>
  );
};
