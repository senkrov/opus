import { Category, Post } from './types';

export const POSTS: Post[] = [
  {
    id: 0,
    title: 'title',
    short: 'short of it',
    full: `everything else`,
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