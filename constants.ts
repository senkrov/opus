import { Category, Post } from './types';

export const POSTS: Post[] = [
  {
    id: 0,
    title: 'PROJECT OPUS',
    short: 'all the cool kids have personal websites, I wanted one too',
    full: `started conceptualizing with replit, used screenshots to remake the app based on represented styles and additional developed prompts in Google's AI Studio using Gemini 2.5 Pro`,
    category: Category.Effort,
    tag: 'EFFORT.000',
  },
  {
    id: 0,
    title: 'experience 000',
    short: 'experience synopsis',
    full: `full detailed report of the experience

    you can also just use plain text next line to format by text blocks`,
    category: Category.Experience,
    tag: 'EXPERIENCE.000',
  },
];

export const TABS = [
    { key: 'all', label: '[ALL]' },
    { key: Category.Effort, label: '[EFFORT]' },
    { key: Category.Experience, label: '[EXPERIENCE]' },
];
