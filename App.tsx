import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import PostCard from './components/PostCard';
import { Category } from './types';
import { POSTS } from './constants';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const handleCardClick = (postId: string) => {
    setExpandedPostId(currentId => (currentId === postId ? null : postId));
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') {
      return POSTS;
    }
    return POSTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-black min-h-screen text-gray-200 font-sans">
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 via-black to-black">
        <Header />
        <main className="flex flex-col items-center w-full px-4">
          <Tabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <div className="w-full max-w-5xl grid grid-cols-1 gap-6 pb-20">
            {filteredPosts.map((post) => {
              const uniqueId = `${post.category}-${post.id}`;
              return (
                <PostCard
                  key={uniqueId}
                  post={post}
                  isExpanded={expandedPostId === uniqueId}
                  onToggleExpand={handleCardClick}
                />
              );
            })}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;