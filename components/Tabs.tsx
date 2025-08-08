import React, { useState, useRef, useLayoutEffect } from 'react';
import { Category } from '../types';
import { TABS } from '../constants';

interface TabsProps {
  activeFilter: Category | 'all';
  onFilterChange: (filter: Category | 'all') => void;
}

const pillColorClasses: Record<Category | 'all', string> = {
  all: 'bg-white',
  [Category.Effort]: 'bg-blue-500',
  [Category.Experience]: 'bg-green-500',
};

const hoverTextClasses: Record<Category | 'all', string> = {
    all: 'hover:text-white',
    [Category.Effort]: 'hover:text-blue-400',
    [Category.Experience]: 'hover:text-green-400',
}

const Tabs: React.FC<TabsProps> = ({ activeFilter, onFilterChange }) => {
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const calculatePillStyle = () => {
      const activeTabIndex = TABS.findIndex((tab) => tab.key === activeFilter);
      const activeTabNode = tabsRef.current[activeTabIndex];
      
      if (activeTabNode) {
        setPillStyle({
          left: activeTabNode.offsetLeft,
          width: activeTabNode.offsetWidth,
        });
      }
    };
    
    calculatePillStyle();

    // Recalculate when fonts are ready to fix initial render issue
    document.fonts.ready.then(calculatePillStyle);

  }, [activeFilter]);

  return (
    <nav 
      ref={containerRef}
      className="relative flex items-center gap-1 mb-8 bg-gray-900/50 border border-gray-700/50 rounded-full p-1.5 backdrop-blur-sm"
    >
      <div
        className={`absolute top-1.5 bottom-1.5 rounded-full shadow-lg transition-all duration-300 ease-in-out ${pillColorClasses[activeFilter]}`}
        style={pillStyle}
      ></div>

      {TABS.map((tab, index) => (
        <button
          key={tab.key}
          ref={(el) => { tabsRef.current[index] = el; }}
          onClick={() => onFilterChange(tab.key as Category | 'all')}
          className={`relative z-10 font-mono text-sm rounded-full px-5 py-2 transition-colors duration-300 ease-in-out focus:outline-none inline-flex items-center 
            ${
              activeFilter === tab.key
                ? 'text-black font-medium'
                : `text-gray-400 ${hoverTextClasses[tab.key]}`
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;