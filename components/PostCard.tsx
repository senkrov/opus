/**
 * @file A component that displays a single post. It handles its own expansion/collapse animation,
 * a mouse-tracking spotlight effect, and the animation for highlighting search results within its content.
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Post, Category } from '../types';
import Highlight from './Highlight';

interface PostCardProps {
  post: Post;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isAnyPostExpanded: boolean;
  highlightQuery: string;
  searchTrigger: { postId: string; query: string } | null;
  onAnimationComplete: () => void;
}

const categoryStyles: Record<Category, { bg: string; text: string; border: string; glowHover: string; glowExpanded: string; spotlightColor: string; markerBg: string; }> = {
  [Category.Effort]: { 
    bg: 'bg-blue-400/10', 
    text: 'text-blue-300', 
    border: 'hover:border-blue-500/50',
    glowHover: 'group-hover:shadow-[0_0_20px_0_rgba(59,130,246,0.3)]',
    glowExpanded: 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]',
    spotlightColor: 'rgba(59, 130, 246, 0.08)',
    markerBg: 'bg-blue-400/20',
  },
  [Category.Experience]: { 
    bg: 'bg-green-400/10', 
    text: 'text-green-300', 
    border: 'hover:border-green-500/50',
    glowHover: 'group-hover:shadow-[0_0_20px_0_rgba(74,222,128,0.3)]',
    glowExpanded: 'shadow-[0_0_30px_-5px_rgba(74,222,128,0.4)]',
    spotlightColor: 'rgba(74, 222, 128, 0.08)',
    markerBg: 'bg-green-400/20',
  },
};

const PostCard: React.FC<PostCardProps> = ({ post, isExpanded, onToggleExpand, isAnyPostExpanded, highlightQuery, searchTrigger, onAnimationComplete }) => {
  const styles = categoryStyles[post.category];
  const isDimmed = isAnyPostExpanded && !isExpanded;
  const cardRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const animationCleanupTimer = useRef<number | null>(null);
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const uniqueId = `${post.category}-${post.id}`;

  /**
   * Renders the 'full' post content, parsing a custom format for styled list items.
   * Format: `[T] Title: Description`
   * [T] -> Marker
   * Title -> Strong text
   * Description -> Regular text
   */
  const renderFullText = (text: string, query?: string) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const listRegex = /^\[(.+?)\]\s*(.*?):\s*(.*)/;

    return lines.map((line, index) => {
      const match = line.match(listRegex);

      if (match) {
        const [, marker, title, description] = match;
        return (
          <div key={index} className="flex items-start gap-4 my-4 last:mb-0 first:mt-0">
            <span className={`flex-shrink-0 ${styles.markerBg} ${styles.text} font-bold font-mono text-xs rounded-md h-6 w-6 flex items-center justify-center mt-1`}>
              {marker}
            </span>
            <div className="flex-grow">
              <strong className="block text-gray-200">
                <Highlight text={title} highlight={query} />
              </strong>
              <p className="text-gray-400 mt-1">
                <Highlight text={description} highlight={query} />
              </p>
            </div>
          </div>
        );
      }

      return (
        <p key={index} className="my-4 last:mb-0 first:mt-0">
          <Highlight text={line} highlight={query} />
        </p>
      );
    });
  };
  
  // This effect manages the "flash" animation on highlighted search terms.
  useLayoutEffect(() => {
    // Shared cleanup logic to cancel any pending animation timeouts.
    const cleanupAnimation = () => {
      if (animationCleanupTimer.current) {
        clearTimeout(animationCleanupTimer.current);
      }
    };

    // Only proceed if this card is the target of a search and is currently expanded.
    if (!isExpanded || !searchTrigger || searchTrigger.postId !== uniqueId) {
      cleanupAnimation();
      return;
    }

    const contentElement = expandedContentRef.current;
    if (!contentElement) return;

    // This function will be called when the expanded content's fade-in transition finishes.
    const onContentVisible = () => {
      if (!cardRef.current) return;

      const highlights = Array.from(cardRef.current.querySelectorAll('.highlight-mark'));
      
      if (highlights.length > 0) {
        (highlights[0] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlights.forEach(h => h.classList.add('flash-animation'));
        
        // After the flash animation completes, remove the class and notify the parent component.
        animationCleanupTimer.current = window.setTimeout(() => {
          highlights.forEach(h => h.classList.remove('flash-animation'));
          onAnimationComplete();
        }, 1500); // Duration must match the keyframe animation.
      } else {
        onAnimationComplete(); // No matches found, so we're done.
      }
    };
    
    // We listen for the 'transitionend' event to reliably trigger the highlight animation
    // *after* the content has faded in, which is more robust than a fixed setTimeout.
    contentElement.addEventListener('transitionend', onContentVisible, { once: true });

    return () => {
      cleanupAnimation();
      contentElement.removeEventListener('transitionend', onContentVisible);
    };
  }, [isExpanded, searchTrigger, uniqueId, onAnimationComplete]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isExpanded) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightStyle({
      opacity: 1,
      background: `radial-gradient(350px circle at ${x}px ${y}px, ${styles.spotlightColor}, transparent 80%)`,
    });
  };

  const handleMouseLeave = () => {
    setSpotlightStyle({ opacity: 0 });
  };

  const containerClasses = `
    relative overflow-hidden
    bg-gray-900/30 border border-gray-800 rounded-xl p-4 md:p-6
    transition-all duration-500 ease-in-out cursor-pointer group 
    ${styles.border} 
    ${isExpanded ? `${styles.glowExpanded} -translate-y-1` : `${styles.glowHover} group-hover:-translate-y-1`}
    ${isDimmed ? 'opacity-50 saturate-50 scale-95' : 'opacity-100 saturate-100 scale-100'}
    ${isExpanded ? 'bg-gray-900/80' : 'hover:bg-gray-900/80'}
  `;

  return (
    <div
      ref={cardRef}
      className={containerClasses}
      onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-expanded={isExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleExpand()}
    >
      <div 
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={spotlightStyle}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
            <Highlight text={post.title} highlight={highlightQuery} />
          </h2>
          <span className={`font-mono text-xs font-semibold rounded-full px-3 py-1 ${styles.bg} ${styles.text} inline-flex items-center flex-shrink-0 ml-4`}>
            {post.tag}
          </span>
        </div>
        <p className="text-gray-400 leading-relaxed">
          <Highlight text={post.short} highlight={highlightQuery} />
        </p>

        <div
          className={`
            transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded ? 'max-h-[1000px] mt-6' : 'max-h-0 mt-0'}
          `}
          aria-hidden={!isExpanded}
        >
          <div
            ref={expandedContentRef}
            className={`
              transition-opacity duration-300 ease-in-out
              ${isExpanded ? 'opacity-100 delay-300' : 'opacity-0'}
            `}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-grow h-[1px] bg-gray-700/50"></div>
              <span className="font-mono text-xs text-gray-500 flex-shrink-0">{post.date}</span>
            </div>
            
            <div className="text-gray-300 leading-relaxed">
                {renderFullText(post.full, highlightQuery)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;