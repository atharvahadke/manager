import { X, Download, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { useRef, ChangeEvent } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onImport: (projects: Project[]) => void;
  onClearAll: () => void;
}

export function SettingsModal({ isOpen, onClose, projects, onImport, onClearAll }: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ai-apps-manager-backup.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedProjects = JSON.parse(content);
        if (Array.isArray(importedProjects)) {
          // Basic validation
          const isValid = importedProjects.every(p => p.id && p.name && p.appUrl && p.githubUrl);
          if (isValid) {
            onImport(importedProjects);
            alert('Projects imported successfully!');
            onClose();
          } else {
            alert('Invalid backup file format.');
          }
        }
      } catch (error) {
        console.error('Error importing projects:', error);
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL projects? This action cannot be undone.')) {
      onClearAll();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#050505]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-[#111] rounded-xl transition-colors"
              >
                {<X size={24} />}
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-zinc-200">Data Management</h3>
                
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-between p-4 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                      <Download size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Export Backup</div>
                      <div className="text-xs text-zinc-500">Save your projects to a JSON file</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-between p-4 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                      <Upload size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Import Backup</div>
                      <div className="text-xs text-zinc-500">Restore projects from a JSON file</div>
                    </div>
                  </div>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImport}
                  accept=".json"
                  className="hidden"
                />

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleClearAll}
                    className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3 text-red-400 group-hover:text-red-300">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <Trash2 size={20} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Clear All Data</div>
                        <div className="text-xs text-red-500/70">Permanently delete all projects</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
