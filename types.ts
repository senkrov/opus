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
}