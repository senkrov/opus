
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Category } from '../types';
import { TABS } from '../constants';

interface TabsProps {
  activeFilter: Category | 'all';
  onFilterChange: (filter: Category | 'all') => void;
}

const Tabs: React.FC<TabsProps> = ({ activeFilter, onFilterChange }) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const calculateIndicatorStyle = () => {
      const activeTabIndex = TABS.findIndex((tab) => tab.key === activeFilter);
      const activeTabNode = tabsRef.current[activeTabIndex];
      
      if (activeTabNode) {
        setIndicatorStyle({
          left: activeTabNode.offsetLeft,
          width: activeTabNode.offsetWidth,
        });
      }
    };
    
    calculateIndicatorStyle();
    window.addEventListener('resize', calculateIndicatorStyle);

    document.fonts.ready.then(calculateIndicatorStyle);

    return () => window.removeEventListener('resize', calculateIndicatorStyle);

  }, [activeFilter]);

  return (
    <nav 
      ref={containerRef}
      className="relative flex items-center gap-2 sm:gap-6"
    >
      {TABS.map((tab, index) => (
        <button
          key={tab.key}
          ref={(el) => { tabsRef.current[index] = el; }}
          onClick={() => onFilterChange(tab.key as Category | 'all')}
          className={`font-mono text-xs sm:text-sm py-3 whitespace-nowrap transition-colors duration-300 ease-in-out focus:outline-none focus-visible:text-gray-100
            ${
              activeFilter === tab.key
                ? 'text-gray-100'
                : 'text-gray-500 hover:text-gray-300'
            }
          `}
          aria-pressed={activeFilter === tab.key}
        >
          {tab.label}
        </button>
      ))}
       <div
        className="absolute bottom-[-1px] h-[2px] bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      ></div>
    </nav>
  );
};

export default Tabs;
