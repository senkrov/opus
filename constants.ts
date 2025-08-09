import { Category, Post } from './types';

export const POSTS: Post[] = [
  {
    id: 1,
    title: 'PROJECT OPUS',
    short: 'all the cool kids have personal websites, I wanted one too',
    full: `I started this project to create a personal website, drawing inspiration from various designs and leveraging AI to accelerate development.

My process involved:
<ul class="mt-2">
  <li class="flex items-start"><span class="text-blue-400 font-bold mr-4 shrink-0">–</span><span>Conceptualizing and prototyping initial layouts using Replit.</span></li>
  <li class="flex items-start"><span class="text-blue-400 font-bold mr-4 shrink-0">–</span><span>Developing component logic and structure with prompts for Google's Gemini 2.5 Pro.</span></li>
  <li class="flex items-start"><span class="text-blue-400 font-bold mr-4 shrink-0">–</span><span>Utilizing Grok 4 to learn and implement a GitHub Actions workflow for deployment.</span></li>
</ul>`,
    category: Category.Effort,
    tag: 'EFFORT.000',
    date: 'AUGUST 8 2025',
  },
  {
    id: 2,
    title: 'experience 000',
    short: 'experience descriptor',
    full: `full detailed report of the experience

    you can also just use plain text next line to format by text blocks btw

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

    - nev`,
    category: Category.Experience,
    tag: 'EXPERIENCE.000',
    date: 'APRIL 15 2024',
  },
];

export const TABS = [
    { key: 'all', label: '[ALL]' },
    { key: Category.Effort, label: '[EFFORT]' },
    { key: Category.Experience, label: '[EXPERIENCE]' },
];