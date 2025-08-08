import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import PostCard from './components/PostCard';
import { Category } from './types';
import { POSTS } from './constants';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Trigger load-in animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (postId: string) => {
    setExpandedPostId(currentId => (currentId === postId ? null : postId));
  };

  const handleFilterChange = (filter: Category | 'all') => {
    if (filter === activeFilter) return;
    
    setIsTransitioning(true);
    setExpandedPostId(null);
    
    setTimeout(() => {
      setActiveFilter(filter);
      setIsTransitioning(false);
    }, 100);
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') {
      return POSTS;
    }
    return POSTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-black min-h-screen text-gray-200">
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 via-black to-black">
        <div className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: '100ms' }}>
          <Header />
        </div>
        <main className="flex flex-col items-center w-full px-4">
          <div className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: '200ms' }}>
            <Tabs activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          </div>
          <div className={`w-full max-w-5xl grid grid-cols-1 gap-6 pb-20 transition-opacity duration-100 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {filteredPosts.map((post, index) => {
              const uniqueId = `${post.category}-${post.id}`;
              const isExpanded = expandedPostId === uniqueId;
              const isAnyPostExpanded = !!expandedPostId;
              
              return (
                <div key={uniqueId} className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: `${300 + index * 75}ms` }}>
                  <PostCard
                    post={post}
                    isExpanded={isExpanded}
                    onToggleExpand={handleCardClick}
                    isAnyPostExpanded={isAnyPostExpanded}
                  />
                </div>
              );
            })}
          </div>
        </main>
        <div className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: '500ms' }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;