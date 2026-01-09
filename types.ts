
export enum Category {
  Effort = 'effort',
  Experience = 'experience',
}

export interface Post {
  id: number;
  title: string;
  short: string;
  full: string;
  category: Category;
  tag: string;
  date: string;
  layoutType?: 'default' | 'compact' | 'grid' | 'classic' | 'prominent';
  image?: {
    src: string;
    alt?: string;
    caption?: string;
  };
}