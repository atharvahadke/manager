import { useState, useEffect, useCallback } from 'react';
import { Lock, Delete, ScanFace } from 'lucide-react';
import { motion } from 'motion/react';

const CORRECT_PIN = '1234';

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, onUnlock]);

  const handleNumberClick = useCallback((num: string) => {
    setPin(prev => {
      if (prev.length < 4) {
        setError(false);
        return prev + num;
      }
      return prev;
    });
  }, []);

  const handleDelete = useCallback(() => {
    setPin(prev => {
      setError(false);
      return prev.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (error) return; // Ignore input during error animation
      
      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [error, handleNumberClick, handleDelete]);

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 font-sans text-zinc-200 relative overflow-hidden">
      {/* Hidden Bypass Button */}
      <button 
        onClick={onUnlock}
        className="absolute top-0 right-0 w-16 h-16 opacity-0 hover:opacity-5 transition-opacity bg-white z-50 cursor-pointer"
        aria-label="Bypass lock"
      />

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center z-10"
      >
        <div className="w-16 h-16 bg-[#111] border border-white/5 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
          <Lock size={28} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Restricted Access
        </h1>
        <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase mb-12">
          Enter Security Pin
        </p>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                pin.length > index 
                  ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                  : 'bg-[#222]'
              } ${error ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="w-[72px] h-[72px] rounded-full bg-[#111] hover:bg-[#1a1a1a] border border-white/5 text-2xl font-medium text-white flex items-center justify-center transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
          
          <button
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors active:scale-95"
          >
            <ScanFace size={24} strokeWidth={1.5} />
          </button>
          
          <button
            onClick={() => handleNumberClick('0')}
            className="w-[72px] h-[72px] rounded-full bg-[#111] hover:bg-[#1a1a1a] border border-white/5 text-2xl font-medium text-white flex items-center justify-center transition-all active:scale-95"
          >
            0
          </button>
          
          <button
            onClick={handleDelete}
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors active:scale-95"
          >
            <Delete size={24} strokeWidth={1.5} />
          </button>
        </div>

      </motion.div>
      
      <div className="absolute bottom-8 text-[10px] tracking-[0.2em] text-zinc-600 uppercase">
        Secure Vault v2.0
      </div>
    </div>
  );
}
