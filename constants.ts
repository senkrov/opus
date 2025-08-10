import { Category, Post } from './types';

/**
 * The central array of all post data for the portfolio.
 * To add a new post, simply add a new object to this array following the Post interface.
 * The app will automatically render it.
 */
export const POSTS: Post[] = [];

/**
 * Defines the tabs available for filtering posts.
 * The 'key' must correspond to a Category enum or 'all'.
 */
export const TABS = [
    { key: 'all', label: '[ALL]' },
    { key: Category.Effort, label: '[EFFORT]' },
    { key: Category.Experience, label: '[EXPERIENCE]' },
];
