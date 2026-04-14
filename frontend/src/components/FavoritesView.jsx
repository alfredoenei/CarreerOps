import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import TaskCard from './TaskCard';

const FavoritesView = ({ columns, onOpenTaskModal, onDeleteTask }) => {
  // 🛡️ Filtro Global con useMemo: Extraemos todas las tareas favoritas del tablero
  const favoritosTasks = useMemo(() => {
    if (!columns || columns.length === 0) return [];
    return columns.flatMap(col => col.tasks || []).filter(task => task.isFavorite);
  }, [columns]);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6 px-1">
        <h1 className="text-xl font-black tracking-tight">Favoritos</h1>
        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest opacity-70">
          Wishlist de Roles
        </p>
      </div>

      {favoritosTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20 border-2 border-dashed border-gray-800 rounded-[3rem]">
          <Star size={64} className="mb-4" />
          <span className="text-lg font-bold">No hay ofertas destacadas</span>
          <p className="text-xs mt-2 uppercase tracking-[0.2em] font-black">Márcalas con la estrella en LinkedIn o el Dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritosTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onOpenTaskModal(task)}
              onDelete={() => onDeleteTask(task._id, task.columnId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
