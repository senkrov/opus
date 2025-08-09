import React from 'react';
import SearchInput from './SearchInput'; // Assuming App.tsx passes props

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="flex items-center gap-6 w-full max-w-5xl mx-auto px-4 py-5 text-gray-400">
      <span className="font-medium text-lg text-gray-400 flex-shrink-0">nev senkrov</span>
      <div className="flex-grow max-w-lg mx-auto">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      <a 
        href="https://x.com/senkrov" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Visit Nev Senkrov's X profile"
        className="ml-auto text-gray-400 hover:text-white transition-colors duration-200 flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      </a>
    </header>
  );
};

export default Header;