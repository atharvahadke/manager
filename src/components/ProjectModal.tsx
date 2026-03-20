import { useState, useEffect, FormEvent, KeyboardEvent } from 'react';
import { X, Save, Image as ImageIcon, Link2, Github, Tag, Type, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initialData?: Project | null;
}

export function ProjectModal({ isOpen, onClose, onSave, initialData }: ProjectModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    appUrl: '',
    githubUrl: '',
    icon: '🚀',
    tags: [],
    isFavorite: false,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        appUrl: '',
        githubUrl: '',
        icon: '🚀',
        tags: [],
        isFavorite: false,
      });
    }
    setTagInput('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: initialData?.id || uuidv4(),
      name: formData.name || 'Untitled Project',
      description: formData.description || '',
      appUrl: formData.appUrl || '#',
      githubUrl: formData.githubUrl || '#',
      icon: formData.icon || '🚀',
      tags: formData.tags || [],
      isFavorite: formData.isFavorite || false,
      createdAt: initialData?.createdAt || Date.now(),
    };
    onSave(newProject);
    onClose();
  };

  const handleAddTag = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tagToRemove) });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#050505]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  {initialData ? <Save size={20} /> : <Type size={20} />}
                </div>
                {initialData ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-[#111] rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-2 flex flex-col items-center gap-2">
                    <label className="text-sm font-medium text-zinc-400 self-start md:self-center">Icon</label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-16 h-16 text-3xl text-center bg-[#111] border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer text-white"
                        maxLength={2}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-2xl">
                        <ImageIcon size={20} className="text-white" />
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">Emoji</span>
                  </div>

                  <div className="md:col-span-10 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                        <Type size={16} /> Project Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., AI Image Generator"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                        <AlignLeft size={16} /> Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[100px] resize-y"
                        placeholder="Briefly describe what this app does..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                      <Link2 size={16} /> App URL *
                    </label>
                    <input
                      required
                      type="url"
                      value={formData.appUrl}
                      onChange={(e) => setFormData({ ...formData, appUrl: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="https://my-app.run.app"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                      <Github size={16} /> GitHub URL *
                    </label>
                    <input
                      required
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <Tag size={16} /> Tags
                  </label>
                  <div className="bg-[#111] border border-white/10 rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                    {formData.tags?.map((tag) => (
                      <span key={tag} className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-indigo-500/30">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 bg-transparent border-none text-white px-2 py-1 focus:outline-none min-w-[120px]"
                      placeholder="Type and press Enter..."
                    />
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-medium text-zinc-300 hover:bg-[#111] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="project-form"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <Save size={20} />
                {initialData ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
