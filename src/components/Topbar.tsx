import { Search, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  projectCount: number;
  onAddProject: () => void;
}

export function Topbar({ searchQuery, setSearchQuery, projectCount, onAddProject }: TopbarProps) {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 bg-black/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10"
    >
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input
          type="text"
          placeholder="Search projects by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111]/50 border border-white/10 text-zinc-200 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-6 ml-8">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-sm font-medium">Total Projects:</span>
          <span className="bg-[#111] px-3 py-1 rounded-full text-indigo-400 font-bold text-sm border border-white/10">
            {projectCount}
          </span>
        </div>

        <button
          onClick={onAddProject}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>
    </motion.div>
  );
}
