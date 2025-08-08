
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import ProjectCard from './components/ProjectCard';
import { Category } from './types';
import { PROJECTS } from './constants';

const PrimaryTechnologies: React.FC = () => (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 mt-8">
        <h3 className="text-sm font-mono text-gray-500 mb-4">[primary technologies]</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-gray-400">
            <span>React / Next.js</span>
            <span>TypeScript</span>
            <span>Tailwind CSS</span>
            <span>Node.js</span>
            <span>WebGL / Three.js</span>
            <span>Figma</span>
            <span>Python</span>
            <span>Google Cloud / Vercel</span>
        </div>
    </section>
);

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return PROJECTS;
    }
    return PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-black min-h-screen text-gray-200 font-sans">
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 via-black to-black">
        <Header />
        <main className="flex flex-col items-center w-full px-4">
          <Tabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <PrimaryTechnologies />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
