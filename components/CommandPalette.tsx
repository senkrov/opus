import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Post, Category } from '../types';
import Highlight from './Highlight';

type Action = {
  type: 'action';
  id: string;
  label: string;
  category: 'Navigation' | 'Filter';
  perform: () => void;
};

type SearchResult = {
  type: 'post';
  post: Post;
  contextSnippet?: string;
};

type CommandItem = Action | SearchResult;

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onFilterChange: (filter: Category | 'all') => void;
  onPostSelect: (post: Post, query: string) => void;
  onSearchChange: (query: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, posts, onFilterChange, onPostSelect, onSearchChange }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const actions = useMemo<Action[]>(() => [
    { type: 'action', id: 'filter-all', label: '[Filter by: ALL]', category: 'Filter', perform: () => onFilterChange('all') },
    { type: 'action', id: 'filter-effort', label: '[Filter by: EFFORT]', category: 'Filter', perform: () => onFilterChange(Category.Effort) },
    { type: 'action', id: 'filter-experience', label: '[Filter by: EXPERIENCE]', category: 'Filter', perform: () => onFilterChange(Category.Experience) },
    { type: 'action', id: 'nav-x', label: '[Navigate to: X Profile]', category: 'Navigation', perform: () => window.open('https://x.com/senkrov', '_blank') },
  ], [onFilterChange]);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!query) return [];
    
    const lowercasedQuery = query.toLowerCase();
    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');

    return posts
      .map((post): SearchResult | null => {
        const titleMatch = post.title.toLowerCase().includes(lowercasedQuery);
        const shortMatch = post.short.toLowerCase().includes(lowercasedQuery);
        const fullText = stripHtml(post.full);
        const fullMatchIndex = fullText.toLowerCase().indexOf(lowercasedQuery);

        if (!titleMatch && !shortMatch && fullMatchIndex === -1) {
          return null; // No match anywhere in this post
        }

        let contextSnippet: string | undefined = undefined;
        // If match is only in the 'full' content, generate a centered snippet
        if (fullMatchIndex !== -1 && !titleMatch && !shortMatch) {
          const SNIPPET_TARGET_LENGTH = 90; // Aim for a snippet of this length
          const queryLen = query.length;

          // Attempt to center the match in the snippet
          let startIndex = Math.max(0, fullMatchIndex - Math.floor((SNIPPET_TARGET_LENGTH - queryLen) / 2));
          let endIndex = Math.min(fullText.length, startIndex + SNIPPET_TARGET_LENGTH);

          // If the snippet is at the very end of the text, shift it left to ensure it's full
          if (endIndex === fullText.length) {
            startIndex = Math.max(0, fullText.length - SNIPPET_TARGET_LENGTH);
          }
          
          let snippet = fullText.substring(startIndex, endIndex);

          // Add ellipses if the snippet doesn't represent the full text edges
          if (startIndex > 0) {
            snippet = `...${snippet}`;
          }
          if (endIndex < fullText.length) {
            snippet = `${snippet}...`;
          }
          
          contextSnippet = snippet;
        }
        
        return { type: 'post' as const, post, contextSnippet };
      })
      .filter((item): item is SearchResult => item !== null);

  }, [query, posts]);

  const commandItems = useMemo<CommandItem[]>(() => {
    const filteredActions = actions.filter(action => action.label.toLowerCase().includes(query.toLowerCase()));
    return [...filteredActions, ...searchResults];
  }, [actions, searchResults, query]);

  const handleSelect = useCallback((item: CommandItem) => {
    if (item.type === 'action') {
      item.perform();
    } else {
      onPostSelect(item.post, query);
    }
    // `onPostSelect` now handles closing the palette in App.tsx
  }, [onPostSelect, query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || commandItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % commandItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + commandItems.length) % commandItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (commandItems[activeIndex]) {
          handleSelect(commandItems[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commandItems, activeIndex, handleSelect, onClose]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      // Reset internal state on close
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Keep parent informed of live query changes
    onSearchChange(query);
  }, [query, onSearchChange]);

  useEffect(() => {
    // Reset index when items change
    setActiveIndex(0);
  }, [commandItems]);

  useEffect(() => {
    // Scroll active item into view
    if (activeIndex >= 0) {
      const activeElement = resultsRef.current?.children[activeIndex];
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-[15vh]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Palette */}
      <div className="relative z-10 w-[95%] sm:w-full max-w-xl bg-[#161b22] border border-gray-700/80 rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <div className="flex items-center p-4 border-b border-gray-700/80 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts or run a command..."
            className="w-full bg-transparent text-lg text-gray-200 placeholder:text-gray-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-xs font-mono text-gray-500 border border-gray-600 rounded px-2 py-1">ESC</button>
        </div>
        
        <div ref={resultsRef} className="max-h-[40vh] overflow-y-auto p-2">
          {commandItems.length > 0 ? (
            commandItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.type === 'action' ? item.id : `${item.post.category}-${item.post.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${isActive ? 'bg-blue-500/20' : 'hover:bg-gray-700/40'}`}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-gray-200 truncate">
                      {item.type === 'action' ? (
                        item.label
                      ) : (
                        <Highlight text={item.post.title} highlight={query} />
                      )}
                    </span>
                    {item.type === 'post' && (
                        <span className="text-sm text-gray-400 mt-1 truncate">
                           <Highlight text={item.contextSnippet ?? item.post.short} highlight={query} />
                        </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-gray-500 flex-shrink-0 ml-4">{item.type === 'action' ? item.category : 'Post'}</span>
                </div>
              );
            })
          ) : (
            <div className="text-center p-8 text-gray-500 font-mono">
              [NO RESULTS]
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;