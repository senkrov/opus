import { Category, Post } from './types';

const LOREM_SHORT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const LOREM_FULL = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const effortPosts: Post[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: 'effort post title',
  short: LOREM_SHORT,
  full: LOREM_FULL,
  category: Category.Effort,
  tag: `EFFORT.${String(i).padStart(3, '0')}`,
  date: 'JANUARY 1 2024',
}));

const experiencePosts: Post[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: 'experience post title',
  short: LOREM_SHORT,
  full: LOREM_FULL,
  category: Category.Experience,
  tag: `EXPERIENCE.${String(i).padStart(3, '0')}`,
  date: 'FEBRUARY 1 2024',
}));

export const POSTS: Post[] = [...effortPosts, ...experiencePosts];

export const TABS = [
    { key: 'all', label: '[ALL]' },
    { key: Category.Effort, label: '[EFFORT]' },
    { key: Category.Experience, label: '[EXPERIENCE]' },
];
