import { useState } from 'react';
import { Project } from '../types';
import initialData from '../data/projects.json';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(initialData as Project[]);

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const reorderProjects = (startIndex: number, endIndex: number) => {
    setProjects((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const importProjects = (importedProjects: Project[]) => {
    setProjects(importedProjects);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    importProjects,
  };
}
