import { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { SettingsModal } from './components/SettingsModal';
import { LockScreen } from './components/LockScreen';
import { useProjects } from './hooks/useProjects';
import { Project } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const DraggableComponent = Draggable as any;

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('isUnlocked') === 'true';
  });
  const { projects, addProject, updateProject, deleteProject, reorderProjects, importProjects } = useProjects();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleUnlock = () => {
    sessionStorage.setItem('isUnlocked', 'true');
    setIsUnlocked(true);
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      updateProject(project);
    } else {
      addProject(project);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      updateProject({ ...project, isFavorite: !project.isFavorite });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (searchQuery) return; // Disable reordering while searching
    reorderProjects(result.source.index, result.destination.index);
  };

  if (!isUnlocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="flex h-screen bg-black text-zinc-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'settings') {
            setIsSettingsModalOpen(true);
            setActiveTab('dashboard'); // Reset tab after opening modal
          }
        }}
        onAddProject={handleAddProject}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          projectCount={projects.length}
          onAddProject={handleAddProject}
        />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-0">
          {projects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-[#111] rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
                <span className="text-5xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No projects yet</h2>
              <p className="text-zinc-400 mb-8">
                Start building your AI apps portfolio by adding your first project. Keep track of all your creations in one place.
              </p>
              <button
                onClick={handleAddProject}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Add Your First Project
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">No projects found matching "{searchQuery}"</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="projects" isDropDisabled={!!searchQuery}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20"
                  >
                    <AnimatePresence>
                      {filteredProjects.map((project, index) => {
                        return (
                          <DraggableComponent
                            key={project.id}
                            draggableId={project.id}
                            index={index}
                            isDragDisabled={!!searchQuery}
                          >
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  zIndex: snapshot.isDragging ? 50 : 1,
                                }}
                              >
                                <ProjectCard
                                  project={project}
                                  onEdit={handleEditProject}
                                  onDelete={deleteProject}
                                  onToggleFavorite={handleToggleFavorite}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </DraggableComponent>
                        );
                      })}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </main>
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        initialData={editingProject}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        projects={projects}
        onImport={importProjects}
        onClearAll={() => importProjects([])}
      />
    </div>
  );
}
