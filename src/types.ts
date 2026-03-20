export interface Project {
  id: string;
  name: string;
  description: string;
  appUrl: string;
  githubUrl: string;
  icon: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
}
