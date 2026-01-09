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
    full: `
[>] The Resolution Trap: My resolution this past year was to put a focus on my health. Looking back I feel confident that my elevated that goal in my priorities, but as my focus on it increased the complexity of what being healthy might truly entail to me caused the clarity of the goal to destabilize. Resolutions are binary and result-driven, this is not like me, this is not nature.

[>] Continuing Forward: Health and the scientific effort to further our understanding of how to be healthier human beings remains a focus of mine (now more than ever), but 2026 will not be a year with a resolution attached. I am a being of life and to be alive is to be in motion. I parse life with fingers lust with interest and with an absolute necessity for truth, peeling back layers of complexity in whatever I will. A new year begins.

[L] In 2025, I ...: made an effort to push past my comfort zone socaially which greatly boosted my confidence, revisited my hometown after over 5 years away, set new priorities for my short and long term future, did decently at setting aside time to be with my parents (needs improvement), made eating well a focus and stopped drinking alcohol almost entirely, overall did a little bit better at putting myself first`,
    category: Category.Experience,
    tag: 'THOUGHTS',
    date: '2026-01-01',
    layoutType: 'prominent',
  },
  {
    id: 2,
    title: 'Eat Real Food',
    short: 'Seems obvious, but most people are retarded so we flipped it upside down for you.',
    full: `
[IMG]

[>] Pyramid of Hope: Straight out of South Park, the new pyramid actually prioritizes protein-rich whole foods, a hecking miracle if you ask me. It's not perfect, and there's an argument to be made against the gross oversimplifications being suggested (especially the ambiguity toward grains and the lack of focus on legumes), but it's a welcome attempt at improvement in how we look at food as a country.

[>] Expectations: 2026 is poised to be a year of litigation against food companies and the entities defending them, from artificial dyes and heavy metal contaminants to widespread misleading marketing practices and the apparently difficult task of defining what an ultra-processed food is (really though?). But most importantly, I hope it's a year of change in the public opinion of Americans on what "healthy food" truly means and the overall importance of one's diet.

[>] Ease vs. Needs: From neurobiologist Dr. Andrew Huberman's insights on human behavior, I've learned we're beautifully adaptive but also flawed in our default wiring for energy conservation, meaning we favor immediate actions over meaningful ones. This understanding is reflected in the availability of certain types of foods; when you drive down the road you see fast food, when you walk down the aisle at a grocery store you see processed sugary shit. I'm hopeful this has the potential to change, but until then we need to recognize that it takes effort to do what's right. A good diet rarely falls on your plate, you need to go and get it.`,
    category: Category.Experience,
    tag: 'THOUGHT',
    date: '2026-01-08',
    layoutType: 'prominent',
    image: {
      src: '/images/p2_i1.jpg',
      alt: 'Food Pyramid for 2025-2030',
      caption: 'Food Pyramid for 2025-2030'
    }
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
