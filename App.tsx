/**
 * @file The main application component. It manages the overall state, including filtering, post expansion,
 * and the command palette visibility. It orchestrates the rendering of all major UI sections.
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import CommandPalette from './components/CommandPalette';
import { Category, Post } from './types';
import { POSTS } from './constants';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [highlightQuery, setHighlightQuery] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState<{ postId: string; query: string } | null>(null);

  useEffect(() => {
    // Trigger the main page load-in animation after a short delay.
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Register a global keyboard shortcut (Cmd/Ctrl+K) to toggle the command palette.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCardClick = (postId: string) => {
    setExpandedPostId(currentId => (currentId === postId ? null : postId));
  };

  const handleFilterChange = useCallback((filter: Category | 'all') => {
    if (filter === activeFilter) return;
    
    setIsTransitioning(true);
    setExpandedPostId(null);
    
    // Allow the fade-out transition to complete before changing the filter and fading back in.
    setTimeout(() => {
      setActiveFilter(filter);
      setIsTransitioning(false);
    }, 100);
  }, [activeFilter]);
  
  const handlePostSelect = useCallback((post: Post, query: string) => {
    const uniqueId = `${post.category}-${post.id}`;
    
    setHighlightQuery(query);
    setSearchTrigger({ postId: uniqueId, query });
    setIsPaletteOpen(false);

    // If the selected post is not in the current view, switch to the correct filter.
    if (post.category !== activeFilter && activeFilter !== 'all') {
      handleFilterChange(post.category);
    }

    // A small delay ensures that any filter-change transition has started before we expand the card.
    // This creates a smoother visual flow for the user.
    setTimeout(() => {
      setExpandedPostId(uniqueId);
    }, 150);
  }, [activeFilter, handleFilterChange]);

  const filteredPosts = useMemo(() => {
    // Sort posts by ID descending to show the most recent ones first, then apply the active filter.
    const sortedPosts = [...POSTS].sort((a, b) => b.id - a.id);
    if (activeFilter === 'all') {
      return sortedPosts;
    }
    return sortedPosts.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-[#0D1117] text-gray-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 via-[#0D1117] to-[#0D1117] flex flex-col min-h-screen">
      <div className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: '100ms' }}>
        <Header
          onSearchClick={() => setIsPaletteOpen(true)}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>
      <main 
        className="flex flex-col items-center w-full px-4 flex-grow"
        onClick={() => expandedPostId && setExpandedPostId(null)}
      >
        <div className={`w-full max-w-5xl grid grid-cols-1 gap-6 pt-8 pb-20 transition-opacity duration-100 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => {
                const uniqueId = `${post.category}-${post.id}`;
                const isExpanded = expandedPostId === uniqueId;
                const isAnyPostExpanded = !!expandedPostId;
                
                return (
                  <div id={uniqueId} key={uniqueId} className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: `${300 + index * 50}ms`, scrollMarginTop: '8rem' }}>
                    <PostCard
                      post={post}
                      isExpanded={isExpanded}
                      onToggleExpand={() => handleCardClick(uniqueId)}
                      isAnyPostExpanded={isAnyPostExpanded}
                      highlightQuery={highlightQuery}
                      searchTrigger={searchTrigger}
                      onAnimationComplete={() => setSearchTrigger(null)}
                    />
                  </div>
                );
              })
          ) : (
              <div 
                className="text-center py-16 text-gray-500 font-mono will-animate animate-in" 
                style={{ animationDelay: '300ms' }}
              >
                  [NO MATCHING POSTS FOUND]
              </div>
          )}
        </div>
      </main>
      <Footer />
      <CommandPalette 
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        posts={POSTS}
        onFilterChange={handleFilterChange}
        onPostSelect={handlePostSelect}
        onHighlightChange={setHighlightQuery}
      />
    </div>
  );
};

export default App;