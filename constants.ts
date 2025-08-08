
import { Category, Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Kinetic Typography Engine',
    description: 'A performant rendering engine for complex text animations using WebGL and shaders, focusing on fluid motion and high frame rates.',
    category: Category.Effort,
    tag: 'EFFORT.001',
  },
  {
    id: 2,
    title: 'Lead Frontend at Acme Corp',
    description: 'Led the development of a large-scale e-commerce platform, improving conversion rates by 20% through performance optimization and UX redesign.',
    category: Category.Experience,
    tag: 'EXPERIENCE.001',
  },
  {
    id: 3,
    title: 'Generative Art Installation',
    description: 'An interactive museum piece that creates evolving visuals based on ambient sound and visitor movement, built with Processing and WebSockets.',
    category: Category.Experience,
    tag: 'EXPERIENCE.002',
  },
  {
    id: 4,
    title: 'Decentralized Identity Protocol',
    description: 'An open-source exploration into blockchain for self-sovereign identity management and secure, user-controlled data sharing.',
    category: Category.Effort,
    tag: 'EFFORT.003',
  },
  {
    id: 5,
    title: 'Real-time Data Visualization',
    description: 'A dashboard for visualizing high-frequency trading data, providing actionable insights with sub-second latency using D3.js.',
    category: Category.Effort,
    tag: 'EFFORT.002',
  },
  {
    id: 6,
    title: 'UI/UX for Quantum Computing',
    description: 'Designed and implemented intuitive interfaces for a complex quantum circuit simulation platform, making it accessible to researchers.',
    category: Category.Experience,
    tag: 'EXPERIENCE.004',
  },
];

export const TABS = [
    { key: 'all', label: '[ALL]' },
    { key: Category.Effort, label: '[EFFORT]' },
    { key: Category.Experience, label: '[EXPERIENCE]' },
];
