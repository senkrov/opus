import { Category, Post } from './types';

export const POSTS: Post[] = [
  {
    id: 0,
    title: 'PROJECT OPUS',
    short: 'all the cool kids have personal websites, I wanted one too',
    full: `started conceptualizing with replit, used screenshots to remake the app based on represented styles and additionally developed prompts in Google's AI Studio using Gemini 2.5 Pro

    for managing my server while deploying multiple services I also employed the help of Grok 4 which pleasantly resulted in it teaching me about GitHub's actions workflow helper`,
    category: Category.Effort,
    tag: 'EFFORT.000',
  },
  {
    id: 0,
    title: 'experience 000',
    short: 'experience desciptor',
    full: `full detailed report of the experience

    you can also just use plain text next line to format by text blocks btw

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    category: Category.Experience,
    tag: 'EXPERIENCE.000',
  },
];

export const TABS = [
    { key: 'all', label: '[ALL]' },
    { key: Category.Effort, label: '[EFFORT]' },
    { key: Category.Experience, label: '[EXPERIENCE]' },
];
