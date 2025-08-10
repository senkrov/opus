/**
 * @file A powerful command palette for searching posts and executing commands.
 * It features fuzzy search, keyboard navigation, and context-aware result snippets.
 */
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
  onHighlightChange: (query: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, posts, onFilterChange, onPostSelect, onHighlightChange }) => {
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
    const stripPunctuationAndExtraSpace = (str: string) => str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

    return posts
      .map((post): SearchResult | null => {
        const titleMatch = post.title.toLowerCase().includes(lowercasedQuery);
        const shortMatch = post.short.toLowerCase().includes(lowercasedQuery);
        const fullTextForSearch = stripPunctuationAndExtraSpace(post.full);
        const fullMatchIndex = fullTextForSearch.toLowerCase().indexOf(lowercasedQuery);

        if (!titleMatch && !shortMatch && fullMatchIndex === -1) {
          return null;
        }
        
        // If the query matches the title or short description, we don't need a context snippet.
        // If it only matches in the full text, we generate a snippet to show context.
        let contextSnippet: string | undefined = undefined;
        if (fullMatchIndex !== -1 && !titleMatch && !shortMatch) {
          const SNIPPET_LENGTH = 90;
          const queryLen = query.length;
          
          // Center the match in the snippet.
          let start = Math.max(0, fullMatchIndex - Math.floor((SNIPPET_LENGTH - queryLen) / 2));
          let end = Math.min(fullTextForSearch.length, start + SNIPPET_LENGTH);

          // Adjust if we're at the end of the string.
          if (end === fullTextForSearch.length) {
            start = Math.max(0, fullTextForSearch.length - SNIPPET_LENGTH);
          }
          
          let snippet = fullTextForSearch.substring(start, end);
          if (start > 0) snippet = `...${snippet}`;
          if (end < fullTextForSearch.length) snippet = `${snippet}...`;
          
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
      onClose();
    } else {
      onPostSelect(item.post, query);
    }
  }, [onPostSelect, query, onClose]);

  // Effect for handling all keyboard interactions within the palette.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || commandItems.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % commandItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + commandItems.length) % commandItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (commandItems[activeIndex]) {
            handleSelect(commandItems[activeIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commandItems, activeIndex, handleSelect, onClose]);

  // Effect for managing focus and state reset when the palette opens or closes.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);
  
  // Effect to sync the live query with the parent App component for highlighting.
  useEffect(() => {
    onHighlightChange(query);
  }, [query, onHighlightChange]);

  // Reset active index when search results change.
  useEffect(() => {
    setActiveIndex(0);
  }, [commandItems]);

  // Scroll the currently active item into view.
  useEffect(() => {
    resultsRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-[15vh]" role="dialog" aria-modal="true" aria-label="Command Palette">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative z-10 w-[95%] sm:w-full max-w-xl bg-[#161b22] border border-gray-700/80 rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <div className="flex items-center p-4 border-b border-gray-700/80 flex-shrink-0">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts or run a command..."
            className="w-full bg-transparent text-lg text-gray-200 placeholder:text-gray-500 focus:outline-none"
            aria-controls="command-results"
          />
          <button onClick={onClose} className="text-xs font-mono text-gray-500 border border-gray-600 rounded px-2 py-1" aria-label="Close command palette">ESC</button>
        </div>
        
        <div ref={resultsRef} id="command-results" className="max-h-[40vh] overflow-y-auto p-2" role="listbox">
          {commandItems.length > 0 ? (
            commandItems.map((item, index) => {
              const isActive = index === activeIndex;
              const itemKey = item.type === 'action' ? item.id : `${item.post.category}-${item.post.id}`;
              return (
                <div
                  key={itemKey}
                  id={`command-item-${index}`}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${isActive ? 'bg-blue-500/20' : 'hover:bg-gray-700/40'}`}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-gray-200 truncate">
                      <Highlight text={item.type === 'action' ? item.label : item.post.title} highlight={query} />
                    </span>
                    {item.type === 'post' && (
                        <span className="text-sm text-gray-400 mt-1 truncate">
                           <Highlight text={item.contextSnippet ?? item.post.short} highlight={query} />
                        </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-gray-500 flex-shrink-0 ml-4" aria-hidden="true">{item.type === 'action' ? item.category : 'Post'}</span>
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