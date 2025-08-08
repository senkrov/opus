export enum Category {
  Effort = 'effort',
  Experience = 'experience',
}

export interface Post {
  id: number;
  title: string;
  description: string;
  fullContent: string;
  category: Category;
  tag: string;
}