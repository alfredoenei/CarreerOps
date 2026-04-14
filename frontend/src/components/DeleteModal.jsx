import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-[#0b0e14] border border-gray-800 rounded-[2rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-inner">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
            ¿Eliminar oportunidad?
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Estás a punto de eliminar <span className="text-white font-bold italic">"{taskTitle}"</span>. 
            Esta acción no se puede deshacer y se perderá todo el historial asociado.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={onClose}
              className="py-3.5 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-2xl transition-all border border-gray-700/50"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="py-3.5 px-6 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-red-900/20"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
