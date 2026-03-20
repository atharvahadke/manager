import { LayoutDashboard, PlusCircle, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: 'dashboard' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'settings') => void;
  onAddProject: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onAddProject }: SidebarProps) {
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-[#050505] border-r border-white/5 h-screen flex flex-col p-4 shrink-0"
    >
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">AI Apps</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-indigo-500/10 text-indigo-400 font-medium'
              : 'text-zinc-400 hover:bg-[#111] hover:text-zinc-200'
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>
        
        <button
          onClick={onAddProject}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-[#111] hover:text-zinc-200 transition-all duration-200"
        >
          <PlusCircle size={20} />
          Add Project
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-indigo-500/10 text-indigo-400 font-medium'
              : 'text-zinc-400 hover:bg-[#111] hover:text-zinc-200'
          }`}
        >
          <Settings size={20} />
          Settings
        </button>
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="px-4 py-3 text-xs text-zinc-500 flex items-center justify-between">
          <span>AI Apps Manager</span>
          <span>v1.0</span>
        </div>
      </div>
    </motion.div>
  );
}
