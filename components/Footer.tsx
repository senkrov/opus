/**
 * @file The site-wide footer component.
 */
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D1117]">
      <div className="w-full max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center">
          <div className="flex-grow h-[1px] bg-gray-700/50"></div>
          <span className="font-mono text-xs text-gray-600 ml-4">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
