import { Category, Post } from './types';

/**
 * The central array of all post data for the portfolio.
 * To add a new post, simply add a new object to this array following the Post interface.
 * The app will automatically render it.
 */
export const POSTS: Post[] = [
  {
    id: 1,
    title: 'Motion',
    short: 'Resolutions suck, no one else cares, just do shit.',
    full: `[>] The Resolution Trap: My resolution this past year was to put a focus on my health. Looking back I feel confident that I elevated that goal in my priorities, but as my focus on it increased the complexity of what being healthy might truly entail to me caused the clarity of the goal to destabilize. Resolutions are binary and result-driven, this is not like me, this is not nature.

[>] Continuing Forward: Health and the scientific effort to further our understanding of how to be healthier human beings remains a focus of mine (now more than ever), but 2026 will not be a year with a resolution attached. I am a being of life and to be alive is to be in motion. I parse life with fingers lust with interest and with an absolute necessity for truth, peeling back layers of complexity in whatever I will. A new year begins.`,
    category: Category.Experience,
    tag: 'UPDATE',
    date: '2026-01-01',
    layoutType: 'prominent',
  }
];

/**
 * Defines the tabs available for filtering posts.
 * The 'key' must correspond to a Category enum or 'all'.
 */
export const TABS = [
    { key: 'all', label: '[ALL]' },
    { key: Category.Effort, label: '[EFFORT]' },
    { key: Category.Experience, label: '[EXPERIENCE]' },
];
