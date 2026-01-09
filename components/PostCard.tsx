/**
 * @file A component that displays a single post. It handles its own expansion/collapse animation,
 * a mouse-tracking spotlight effect, and the animation for highlighting search results within its content.
 */
import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
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

const PostCard: React.FC<PostCardProps> = React.memo(({ post, isExpanded, onToggleExpand, isAnyPostExpanded, highlightQuery, searchTrigger, onAnimationComplete }) => {
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
  const renderedFullText = useMemo(() => {
    const text = post.full;
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const listRegex = /^\[(.+?)\]\s*(.*?):\s*(.*)/;

    // Collect all parsed items first to handle grid layout grouping
    const rawItems = lines.map((line) => {
      if (line.trim() === '[IMG]') {
        return { type: 'image' };
      }
      const match = line.match(listRegex);
      if (match) {
        return { type: 'item', marker: match[1], title: match[2], description: match[3], original: line };
      }
      return { type: 'text', content: line };
    });

    // If an image exists but no placeholder is found, default it to the top.
    const items = (post.image && !rawItems.some(item => item.type === 'image'))
      ? [{ type: 'image' }, ...rawItems]
      : rawItems;

    if (post.layoutType === 'grid') {
      const renderedContent: React.ReactNode[] = [];
      let currentGridBatch: React.ReactNode[] = [];

      const flushGridBatch = () => {
        if (currentGridBatch.length > 0) {
          renderedContent.push(
            <div key={`grid-batch-${renderedContent.length}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4">
              {currentGridBatch}
            </div>
          );
          currentGridBatch = [];
        }
      };
      
      items.forEach((item, index) => {
        if (item.type === 'item') {
           currentGridBatch.push(
            <div key={`grid-${index}`} className={`p-3 rounded-lg border ${styles.bg} ${styles.border} border-opacity-20`}>
              <strong className={`block ${styles.text} text-sm mb-1`}>
                <Highlight text={item.title} highlight={highlightQuery} />
              </strong>
              <p className="text-gray-400 text-xs leading-relaxed">
                <Highlight text={item.description} highlight={highlightQuery} />
              </p>
            </div>
           );
        } else {
            // Flush any accumulated grid items before rendering non-grid content
            flushGridBatch();

            if (item.type === 'image' && post.image) {
                renderedContent.push(
                  <div key={`img-${index}`} className="my-6 rounded-lg overflow-hidden border border-gray-700/50 shadow-lg">
                    <img 
                      src={post.image.src} 
                      alt={post.image.alt || post.title} 
                      className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-300" 
                    />
                    {post.image.caption && (
                      <p className="p-2 text-center text-xs text-gray-500 bg-black/20 italic">
                        {post.image.caption}
                      </p>
                    )}
                  </div>
                );
            } else if (item.type === 'text') {
               renderedContent.push(
                <p key={`text-${index}`} className="my-4">
                  <Highlight text={item.content} highlight={highlightQuery} />
                </p>
               );
            }
        }
      });
      
      // Flush any remaining grid items
      flushGridBatch();

      return (
        <div>
           {renderedContent}
        </div>
      );
    }

    return items.map((item, index) => {
      if (item.type === 'image' && post.image) {
        return (
          <div key={index} className="my-8 rounded-lg overflow-hidden border border-gray-700/50 shadow-lg">
            <img 
              src={post.image.src} 
              alt={post.image.alt || post.title} 
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-300" 
            />
            {post.image.caption && (
              <p className="p-2 text-center text-xs text-gray-500 bg-black/20 italic">
                {post.image.caption}
              </p>
            )}
          </div>
        );
      }

      if (item.type === 'item') {
        if (post.layoutType === 'compact') {
           return (
            <div key={index} className="flex items-start gap-3 my-2">
               <div className={`flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full ${styles.bg.replace('/10', '')} ${styles.text}`}></div>
               <div className="text-gray-300">
                 <strong className="text-gray-200 mr-2">
                   <Highlight text={item.title} highlight={highlightQuery} />:
                 </strong>
                 <span className="text-gray-400">
                   <Highlight text={item.description} highlight={highlightQuery} />
                 </span>
               </div>
            </div>
           );
        }
        
        if (post.layoutType === 'classic') {
           return (
            <div key={index} className="my-5 first:mt-2 last:mb-0">
               <strong className="block text-gray-100 text-base font-bold mb-2">
                 <Highlight text={item.title} highlight={highlightQuery} />
               </strong>
               <p className="text-gray-300 leading-relaxed text-sm">
                 <Highlight text={item.description} highlight={highlightQuery} />
               </p>
            </div>
           );
        }

        if (post.layoutType === 'prominent') {
           const isList = item.marker === 'L';

           return (
            <div key={index} className="my-6 first:mt-2 last:mb-0">
               <strong className={`block ${styles.text} text-lg font-bold mb-2`}>
                 <Highlight text={item.title} highlight={highlightQuery} />
               </strong>
               <div className="pl-4 border-l-2 border-gray-700/30">
                 {isList ? (
                   <ul className="list-none space-y-2 mt-2">
                     {item.description.split(',').map((s) => s.trim()).filter((s) => s.length > 0).map((listItem, liIndex) => (
                       <li key={liIndex} className="flex items-start text-gray-300 leading-relaxed">
                         <div className="mr-3 mt-1.5 text-gray-600 flex-shrink-0">
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                             <line x1="5" y1="12" x2="19" y2="12" />
                           </svg>
                         </div>
                         <span><Highlight text={listItem} highlight={highlightQuery} /></span>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <p className="text-gray-300 leading-relaxed">
                     <Highlight text={item.description} highlight={highlightQuery} />
                   </p>
                 )}
               </div>
            </div>
           );
        }
        
        // Default Layout (with deeper indentation)
        return (
          <div key={index} className="flex items-start gap-3 my-4 last:mb-0 first:mt-0">
            <div className={`flex-shrink-0 mt-1.5 ${styles.text}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <div className="flex-grow">
              <strong className="block text-gray-200 text-base">
                <Highlight text={item.title} highlight={highlightQuery} />
              </strong>
              <p className="text-gray-400 mt-1 ml-1 pl-3 border-l-2 border-gray-700/50">
                <Highlight text={item.description} highlight={highlightQuery} />
              </p>
            </div>
          </div>
        );
      }

      return (
        <p key={index} className="my-4 last:mb-0 first:mt-0">
          <Highlight text={item.content} highlight={highlightQuery} />
        </p>
      );
    });
  }, [post.full, post.layoutType, highlightQuery, styles]);
  
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
          <h2 className={`text-lg md:text-xl font-bold ${styles.text} group-hover:text-white transition-colors duration-300`}>
            <Highlight text={post.title} highlight={highlightQuery} />
          </h2>
          <span className={`font-mono text-xs font-semibold rounded-full px-3 py-1 ${styles.bg} ${styles.text} inline-flex items-center flex-shrink-0 ml-4`}>
            {post.tag}
          </span>
        </div>
        
        {post.short && (
          <p className="text-gray-400 leading-relaxed">
            <Highlight text={post.short} highlight={highlightQuery} />
          </p>
        )}

        <div
          className={`
            transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded ? 'max-h-[20000px] mt-6' : 'max-h-0 mt-0'}
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
                {renderedFullText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PostCard;