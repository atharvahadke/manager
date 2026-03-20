import { ExternalLink, Github, Edit2, Trash2, Star, Link2, MoreVertical, GripVertical } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  dragHandleProps?: any;
}

export function ProjectCard({ project, onEdit, onDelete, onToggleFavorite, dragHandleProps }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(project.appUrl);
  };

  const handleOpenBoth = () => {
    window.open(project.appUrl, '_blank');
    window.open(project.githubUrl, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-[#0a0a0a] backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/40 hover:shadow-indigo-500/10 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div 
            {...dragHandleProps}
            className="text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-400 transition-colors hidden group-hover:block absolute -left-2 top-6 p-2"
          >
            <GripVertical size={20} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#111] flex items-center justify-center text-3xl shadow-inner border border-white/5 ml-4 group-hover:ml-6 transition-all">
            {project.icon || '🚀'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-100 line-clamp-1">{project.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {project.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-xs font-medium px-2 py-1 rounded-md bg-[#1a1a1a] text-zinc-300 border border-white/5">
                  {tag}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-[#1a1a1a] text-zinc-400 border border-white/5">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => onToggleFavorite(project.id)}
            className={`p-2 rounded-xl transition-colors ${
              project.isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a1a]'
            }`}
          >
            <Star size={20} fill={project.isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a1a] rounded-xl transition-colors"
            >
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl z-20 py-2 overflow-hidden"
                >
                  <button onClick={() => { onEdit(project); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] hover:text-white flex items-center gap-2">
                    <Edit2 size={16} /> Edit Project
                  </button>
                  <button onClick={() => { handleCopyLink(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] hover:text-white flex items-center gap-2">
                    <Link2 size={16} /> Copy App Link
                  </button>
                  <button onClick={() => { handleOpenBoth(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-[#1a1a1a] hover:text-white flex items-center gap-2">
                    <ExternalLink size={16} /> Open Both
                  </button>
                  <div className="h-px bg-white/10 my-1" />
                  <button onClick={() => { onDelete(project.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2">
                    <Trash2 size={16} /> Delete Project
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-zinc-400 text-sm line-clamp-2 flex-1 mt-2">
        {project.description}
      </p>

      <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
        <a
          href={project.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <ExternalLink size={18} />
          Open App
        </a>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#111] hover:bg-[#1a1a1a] text-zinc-200 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10"
        >
          <Github size={18} />
          GitHub
        </a>
      </div>
    </motion.div>
  );
}
