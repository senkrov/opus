import React, { useLayoutEffect, useRef } from 'react';
import { Post, Category } from '../types';
import Highlight from './Highlight';

interface PostCardProps {
  post: Post;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isAnyPostExpanded: boolean;
  highlightQuery?: string;
  searchTrigger: { postId: string; query: string } | null;
  onAnimationComplete: () => void;
}

const categoryStyles: Record<Category, { bg: string; text: string; border: string; glowHover: string; glowExpanded: string; spotlightColor: string; }> = {
  [Category.Effort]: { 
    bg: 'bg-blue-400/10', 
    text: 'text-blue-300', 
    border: 'hover:border-blue-500/50',
    glowHover: 'group-hover:shadow-[0_0_20px_0_rgba(59,130,246,0.3)]',
    glowExpanded: 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]',
    spotlightColor: 'rgba(59, 130, 246, 0.08)',
  },
  [Category.Experience]: { 
    bg: 'bg-green-400/10', 
    text: 'text-green-300', 
    border: 'hover:border-green-500/50',
    glowHover: 'group-hover:shadow-[0_0_20px_0_rgba(74,222,128,0.3)]',
    glowExpanded: 'shadow-[0_0_30px_-5px_rgba(74,222,128,0.4)]',
    spotlightColor: 'rgba(74, 222, 128, 0.08)',
  },
};

const createHighlightedHtml = (html: string, highlight: string): string => {
    if (!highlight.trim()) return html.replace(/\n/g, '<br />');

    const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeHighlight = escapeRegExp(highlight.trim());
    const regex = new RegExp(`(${safeHighlight})`, 'gi');

    const finalHtml = html.replace(/\n/g, '<br />');
    // Split by HTML tags to only replace text content, not attributes or tags themselves
    const segments = finalHtml.split(/(<[^>]*>)/g);

    for (let i = 0; i < segments.length; i++) {
        // Only process segments that are not HTML tags (they are at even indices)
        if (i % 2 === 0) {
            segments[i] = segments[i].replace(
                regex,
                `<mark class="highlight-mark bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">$1</mark>`
            );
        }
    }
    return segments.join('');
};

const PostCard: React.FC<PostCardProps> = ({ post, isExpanded, onToggleExpand, isAnyPostExpanded, highlightQuery, searchTrigger, onAnimationComplete }) => {
  const styles = categoryStyles[post.category];
  const isDimmed = isAnyPostExpanded && !isExpanded;
  const cardRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<number | null>(null);
  const [spotlightStyle, setSpotlightStyle] = React.useState<React.CSSProperties>({ opacity: 0 });

  const uniqueId = `${post.category}-${post.id}`;

  useLayoutEffect(() => {
    // Animate highlight if this card is the target and has just expanded
    if (isExpanded && cardRef.current && searchTrigger?.postId === uniqueId) {
        // The expanded content has a 300ms fade-in delay. We must wait for it to become
        // visible before we can trigger the animation on its children.
        animationTimerRef.current = window.setTimeout(() => {
            if (!cardRef.current) return; // Guard against component unmounting

            const highlights = Array.from(cardRef.current.querySelectorAll('.highlight-mark'));
            
            if (highlights.length > 0) {
                const firstHighlight = highlights[0] as HTMLElement;

                // Scroll to the first match
                firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Apply animation class to all matches
                highlights.forEach(h => h.classList.add('flash-animation'));

                // Set a timer to remove the class and signal completion
                animationTimerRef.current = window.setTimeout(() => {
                    highlights.forEach(h => h.classList.remove('flash-animation'));
                    onAnimationComplete();
                }, 1500); // Must be same duration as animation

            } else {
                // If no highlights are found, complete the trigger immediately
                onAnimationComplete();
            }
        }, 350); // A bit longer than the 300ms CSS transition delay
    }
    
    // Cleanup function runs when component unmounts or deps change.
    // This will clear any pending animation triggers.
    return () => {
        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current);
        }
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
      onClick={onToggleExpand}
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
            className={`
              transition-opacity duration-300 ease-in-out
              ${isExpanded ? 'opacity-100 delay-300' : 'opacity-0'}
            `}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-grow h-[1px] bg-gray-700/50"></div>
              <span className="font-mono text-xs text-gray-500 flex-shrink-0">{post.date}</span>
            </div>
            
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: createHighlightedHtml(post.full, highlightQuery || '') }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;