
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import PostCard from './components/PostCard';
import { Category, Post } from './types';
import { POSTS } from './constants';
import { useDebounce } from './hooks/useDebounce';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Trigger load-in animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        // Use the global config for the API base URL
        const baseUrl = window.APP_CONFIG?.API_BASE_URL || '';
        const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        const data: Post[] = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const handleCardClick = (postId: number) => {
    setExpandedPostId(currentId => (currentId === postId ? null : postId));
  };

  const handleFilterChange = (filter: Category | 'all') => {
    if (filter === activeFilter) return;
    
    setIsTransitioning(true);
    setExpandedPostId(null);
    setSearchQuery(''); // Clear search when changing filters
    
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
  
  const postsToDisplay = searchQuery.trim() ? searchResults : filteredPosts;

  const renderPost = (post: Post, index: number) => {
    const isExpanded = expandedPostId === post.id;
    const isAnyPostExpanded = !!expandedPostId;
    
    return (
      <div key={post.id} className={`will-animate ${isLoaded && !searchQuery ? 'animate-in' : ''}`} style={{ animationDelay: `${300 + index * 75}ms` }}>
        <PostCard
          post={post}
          isExpanded={isExpanded}
          onToggleExpand={handleCardClick}
          isAnyPostExpanded={isAnyPostExpanded}
        />
      </div>
    );
  };

  return (
    <div className="bg-[#0D1117] min-h-screen text-gray-200">
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 via-[#0D1117] to-[#0D1117]">
        <div className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: '100ms' }}>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <main className="flex flex-col items-center w-full px-4">
          <div className={`will-animate ${isLoaded ? 'animate-in' : ''}`} style={{ animationDelay: '200ms' }}>
            <Tabs activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          </div>

          <div className={`w-full max-w-5xl pb-20 transition-opacity duration-100 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {isSearching ? (
              <div className="text-center text-gray-400">Searching...</div>
            ) : searchQuery && !postsToDisplay.length ? (
              <div className="text-center text-gray-400">No results found for "{searchQuery}"</div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {postsToDisplay.map(renderPost)}
              </div>
            )}
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
