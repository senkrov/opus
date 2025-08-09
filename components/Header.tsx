import React from 'react';
import { Category } from '../types';
import Tabs from './Tabs';

interface HeaderProps {
  onSearchClick: () => void;
  activeFilter: Category | 'all';
  onFilterChange: (filter: Category | 'all') => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick, activeFilter, onFilterChange }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0D1117]/80 backdrop-blur-md">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 text-gray-400 border-b border-gray-800">
          <div className="flex-1 flex justify-start min-w-0">
            <div className="font-mono text-xs cursor-default flex flex-col leading-tight" aria-label="nev senkrov">
              <span className="text-gray-300">nev</span>
              <span className="text-gray-500">senkrov</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center min-w-0 px-2">
            <Tabs activeFilter={activeFilter} onFilterChange={onFilterChange} />
          </div>

          <div className="flex-1 flex justify-end items-center gap-2">
            <button
              onClick={onSearchClick}
              className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              aria-label="Open command palette"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            
            <a 
              href="https://x.com/senkrov" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit Nev Senkrov's X profile"
              className="text-gray-400 hover:text-white transition-colors duration-300 p-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;