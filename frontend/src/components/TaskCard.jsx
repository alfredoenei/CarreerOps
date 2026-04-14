import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MapPin, DollarSign, Briefcase, X, Link as LinkIcon, Clock, Star } from 'lucide-react';

const TaskCard = ({ task, isOverlay, onClick, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const getPriorityStyles = () => {
    switch (task.priority) {
      case 'high': return 'border-l-red-500 shadow-[2px_0_10px_rgba(239,68,68,0.3)]';
      case 'medium': return 'border-l-amber-500 shadow-[2px_0_10px_rgba(245,158,11,0.2)]';
      case 'low': return 'border-l-slate-600 shadow-none';
      default: return 'border-l-transparent shadow-none';
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-800/20 border-2 border-dashed border-gray-700 h-[100px] rounded-2xl"
      />
    );
  }

  // Lógica de Urgencia: Verificar si el seguimiento ya venció (ignora la hora)
  const isOverdue = task.nextFollowUp && (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUpDate = new Date(task.nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate < today;
  })();

  const shouldPulse = task.priority === 'high' && isOverdue;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 border-l-4 ${getPriorityStyles()} ${shouldPulse ? 'animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.35)] ring-1 ring-red-500/20' : ''} p-4 rounded-2xl cursor-grab active:cursor-grabbing hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group relative overflow-hidden flex-shrink-0 ring-1 ring-white/5 ${isOverlay ? 'shadow-2xl border-blue-500/50 scale-105' : ''}`}
    >
      {/* 🗑️ DELETE BUTTON (Hover Only) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-950/90 border border-gray-800 text-gray-500 hover:text-red-500 hover:border-red-500/30 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[100] backdrop-blur-md pointer-events-auto"
      >
        <X size={14} />
      </button>

      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 pointer-events-none" />

      {/* Accent hover glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 pointer-events-none">
        <div className="flex items-start justify-between mb-2 pr-8">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 px-1.5 bg-gray-950/50 rounded-md text-blue-400 border border-white/5 shrink-0">
              <Briefcase size={10} />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase truncate">
              {task.company || 'Empresa'}
            </span>
          </div>

          {/* 🔥 BADGES DEL CRM (Agrupados a la izquierda del botón borrar) */}
          <div className="flex gap-1.5 opacity-70 shrink-0 ml-2">
            {task.isFavorite && (
              <div className="bg-yellow-500/20 text-yellow-400 p-1 rounded-md border border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.4)]" title="Favorito">
                <Star size={10} fill="currentColor" />
              </div>
            )}
            {task.jobUrl && (
              <div className="bg-blue-500/10 text-blue-400 p-1 rounded-md border border-blue-500/20" title="Contiene enlace">
                <LinkIcon size={10} />
              </div>
            )}
            {task.nextFollowUp && (
              <div 
                className={`p-1 rounded-md border transition-all duration-300 ${
                  isOverdue 
                    ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
                title={isOverdue ? "Seguimiento VENCIDO" : "Seguimiento pendiente"}
              >
                <Clock size={10} />
              </div>
            )}
          </div>
        </div>

        <h4 className="text-sm font-black text-white mb-3 line-clamp-1 group-hover:text-blue-300 transition-colors tracking-tight pr-8">
          {task.title}
        </h4>

        <div className="flex flex-wrap gap-2">
          {task.location && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md shadow-sm">
              <MapPin size={9} className="text-blue-400" />
              <span className="text-[9px] font-black text-blue-300 uppercase tracking-tighter">{task.location}</span>
            </div>
          )}
          {task.salary && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md shadow-sm">
              <DollarSign size={9} className="text-emerald-400" />
              <span className="text-[9px] font-black text-emerald-300 uppercase tracking-tighter">{task.salary}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;