import React from 'react';
import { RotateCw } from 'lucide-react';
import Column from './Column';

const Board = ({ 
  columns, 
  onOpenTaskModal,
  onAddTask,
  onDeleteTask,
  onRefresh,
  isLoading
}) => {
  // 🔄 AUTO-SYNC: Sincronización proactiva al ganar visibilidad
  React.useEffect(() => {
    const handleSync = () => {
      if (document.visibilityState === 'visible') {
        console.log("🚀 Tablero visible: Sincronizando datos...");
        onRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      document.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [onRefresh]);

  return (
    <div className="h-full flex flex-col">
      {/* 🚀 TABLERO HEADER CON BOTÓN DE SYNC */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h1 className="text-xl font-black tracking-tight">Kanban Board</h1>
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest opacity-70">Enfoque Profunda</p>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/20 hover:border-blue-500 rounded-xl transition-all duration-300 group shadow-[0_0_15px_rgba(37,99,235,0.1)] active:scale-95 disabled:opacity-50"
          title="Sincronizar capturas del Clipper"
        >
          <RotateCw 
            size={16} 
            className={`transition-transform duration-500 group-hover:rotate-180 ${isLoading ? 'animate-spin' : ''}`} 
          />
          <span className="text-xs font-black uppercase tracking-widest">Sincronizar Clipper</span>
        </button>
      </div>

      <div className="flex-1 flex gap-8 min-w-max pb-4 overflow-x-auto custom-scrollbar">
        {columns.map((column) => (
          <Column 
            key={column._id} 
            column={column} 
            tasks={column.tasks} 
            onOpenTaskModal={onOpenTaskModal}
            onAddTask={() => onAddTask(column._id)}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
