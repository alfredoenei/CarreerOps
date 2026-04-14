import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { SendHorizontal, MessageSquare, Trophy, Plus, MoreHorizontal } from 'lucide-react';

const Column = ({ 
  column, 
  tasks, 
  onOpenTaskModal,
  onAddTask,
  onDeleteTask
}) => {
  const { setNodeRef } = useDroppable({
    id: column._id,
    data: {
      type: 'Column',
      column,
    },
  });

  const taskIds = tasks.map((t) => t._id);

  const getHeaderIcon = () => {
    switch (column.title) {
      case 'Applied': return <SendHorizontal size={18} className="text-blue-500" />;
      case 'Interviewing': return <MessageSquare size={18} className="text-orange-500" />;
      case 'Offers':
      case 'Results': return <Trophy size={18} className="text-emerald-500" />;
      default: return null;
    }
  };

  const getAccentColor = () => {
    switch (column.title) {
      case 'Applied': return 'border-blue-500/20 shadow-blue-500/5';
      case 'Interviewing': return 'border-orange-500/20 shadow-orange-500/5';
      case 'Offers':
      case 'Results': return 'border-emerald-500/20 shadow-emerald-500/5';
      default: return 'border-gray-800 shadow-none';
    }
  };

  return (
    <div className={`w-[300px] flex flex-col h-full bg-gray-950/40 rounded-[2rem] border transition-all duration-300 ${getAccentColor()} backdrop-blur-sm`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="p-1.5 bg-gray-900 rounded-lg border border-white/5">
             {getHeaderIcon()}
           </div>
           <div>
              <h3 className="text-xs font-black text-white tracking-tight">{column.title}</h3>
              <div className="flex items-center gap-1.5">
                 <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{tasks.length} Procesos</span>
              </div>
           </div>
        </div>
        <button className="text-gray-600 hover:text-white transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 px-3 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 min-h-[120px] pb-4"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onClick={() => onOpenTaskModal(task)}
              onDelete={() => onDeleteTask(task._id, column._id)}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-3">
        <button 
          onClick={onAddTask}
          className="w-full py-2.5 flex items-center justify-center gap-2 border border-dashed border-gray-800 rounded-xl text-gray-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 group"
        >
          <Plus size={14} className="group-hover:scale-110 transition-transform" /> 
          <span className="text-[9px] font-black uppercase tracking-widest">Añadir Tarea</span>
        </button>
      </div>
    </div>
  );
};

export default Column;
