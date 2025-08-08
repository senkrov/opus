
export enum Category {
  Effort = 'effort',
  Experience = 'experience',
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: Category;
  tag: string;
}
