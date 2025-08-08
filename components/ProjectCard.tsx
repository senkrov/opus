import React from 'react';
import { Post, Category } from '../types';

interface ProjectCardProps {
  post: Post;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  isAnyPostExpanded: boolean;
}

const categoryStyles: Record<Category, { bg: string; text: string; border: string; glowHover: string; glowExpanded: string }> = {
  [Category.Effort]: { 
    bg: 'bg-blue-400/10', 
    text: 'text-blue-300', 
    border: 'hover:border-blue-500/50',
    glowHover: 'group-hover:shadow-[0_0_20px_0_rgba(59,130,246,0.3)]',
    glowExpanded: 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]'
  },
  [Category.Experience]: { 
    bg: 'bg-green-400/10', 
    text: 'text-green-300', 
    border: 'hover:border-green-500/50',
    glowHover: 'group-hover:shadow-[0_0_20px_0_rgba(74,222,128,0.3)]',
    glowExpanded: 'shadow-[0_0_30px_-5px_rgba(74,222,128,0.4)]'
  },
};


const ProjectCard: React.FC<ProjectCardProps> = ({ post, isExpanded, onToggleExpand, isAnyPostExpanded }) => {
  const styles = categoryStyles[post.category];
  const uniqueId = `${post.category}-${post.id}`;
  const isDimmed = isAnyPostExpanded && !isExpanded;

  const containerClasses = `
    bg-gray-900/30 border border-gray-800 rounded-xl p-6 
    transition-all duration-500 ease-in-out cursor-pointer group 
    ${styles.border} 
    ${isExpanded ? styles.glowExpanded : `${styles.glowHover} group-hover:-translate-y-1`}
    ${isDimmed ? 'opacity-50 saturate-50 scale-95' : 'opacity-100 saturate-100 scale-100'}
    ${isExpanded ? 'bg-gray-900/80' : 'hover:bg-gray-900/80'}
  `;

  return (
    <div
      className={containerClasses}
      onClick={() => onToggleExpand(uniqueId)}
      aria-expanded={isExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleExpand(uniqueId)}
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
          {post.title}
        </h2>
        <span className={`font-mono text-xs font-semibold rounded-full px-3 py-1 ${styles.bg} ${styles.text} inline-flex items-center`}>
          {post.tag}
        </span>
      </div>
      <p className="text-gray-400 leading-relaxed">
        {post.short}
      </p>

      {/* Expanded Content Wrapper */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${isExpanded ? 'max-h-[1000px] mt-6' : 'max-h-0 mt-0'}
        `}
        aria-hidden={!isExpanded}
      >
        {/* Inner content with fade-in animation */}
        <div
          className={`
            border-t border-gray-700/50 pt-6
            transition-opacity duration-300 ease-in-out
            ${isExpanded ? 'opacity-100 delay-300' : 'opacity-0'}
          `}
        >
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {post.full}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;