
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center w-full max-w-5xl mx-auto px-4 py-5 text-gray-400">
      <span className="font-bold text-lg text-white">nev senkrov</span>
      <nav className="ml-auto flex items-center gap-6 text-sm">
        <a href="#" className="hover:text-white transition-colors duration-200">[about]</a>
        <a href="#" className="hover:text-white transition-colors duration-200">[blog]</a>
      </nav>
      <button className="ml-6 text-gray-600 hover:text-white transition-colors duration-200">X</button>
    </header>
  );
};

export default Header;
