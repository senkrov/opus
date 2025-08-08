import React from 'react';
import { Project, Category } from '../types';

interface ProjectCardProps {
  project: Project;
}

const categoryStyles: Record<Category, { bg: string; text: string; border: string }> = {
  [Category.Effort]: { bg: 'bg-blue-400/10', text: 'text-blue-300', border: 'hover:border-blue-500' },
  [Category.Experience]: { bg: 'bg-green-400/10', text: 'text-green-300', border: 'hover:border-green-500' },
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const styles = categoryStyles[project.category];

  return (
    <div className={`bg-gray-900/30 border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:bg-gray-900/80 group ${styles.border}`}>
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
          {project.title}
        </h2>
        <span className={`font-mono text-xs font-semibold rounded-full px-3 py-1 ${styles.bg} ${styles.text}`}>
          {project.tag}
        </span>
      </div>
      <p className="text-gray-400 leading-relaxed">
        {project.description}
      </p>
    </div>
  );
};

export default ProjectCard;