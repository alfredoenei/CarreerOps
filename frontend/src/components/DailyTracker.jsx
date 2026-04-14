import React, { useState, useEffect } from 'react';
import { Flame, Target, Users, Wrench, CheckCircle2, Settings, Save, X } from 'lucide-react';
import { getHabitsProgress, toggleHabit as toggleHabitApi, updateDailyGoals as updateDailyGoalsApi } from '../services/api';
import { toast } from 'sonner';

const DailyTracker = () => {
  const [habits, setHabits] = useState([
    { habitId: 1, text: 'Enviar 3 CVs adaptados', icon: <Target size={18} />, completed: false, label: 'Caza Mayor' },
    { habitId: 2, text: 'Contactar a 2 Recruiters', icon: <Users size={18} />, completed: false, label: 'Networking' },
    { habitId: 3, text: 'LeetCode o Portfolio', icon: <Wrench size={18} />, completed: false, label: 'Mantenimiento' }
  ]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editHabits, setEditHabits] = useState([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await getHabitsProgress();
      const dbHabits = res.data.habits;
      
      // REGLA DE ORO: Los datos de la nube SOBREESCRIBEN los valores locales
      if (dbHabits && dbHabits.length > 0) {
        setHabits(prev => prev.map(h => {
          const dbHabit = dbHabits.find(dbH => dbH.habitId === h.habitId);
          if (dbHabit) {
             return { 
               ...h, 
               completed: dbHabit.completed,
               label: dbHabit.label || h.label,
               text: dbHabit.text || h.text
             };
          }
          return h;
        }));
      }
      setStreak(res.data.streak || 0);
    } catch (error) {
      console.error("Error al cargar progreso diario", error);
      toast.error("Error de conexión con la nube");
    } finally {
      // Solo desactivamos loading cuando tenemos una respuesta definitiva (éxito o error)
      setLoading(false);
    }
  };

  const handleToggle = async (habitId) => {
    // CAPTURAMOS EL ESTADO PREVIO: Para poder revertir en caso de error (Rollback)
    const previousHabits = [...habits];

    // OPTIMISTIC UPDATE: Cambiamos la UI inmediatamente
    setHabits(prev => prev.map(h => 
      h.habitId === habitId ? { ...h, completed: !h.completed } : h
    ));

    try {
      // API CALL (CLOUD-FIRST PERSISTENCE)
      const res = await toggleHabitApi(habitId);
      
      // SICNRO OPCIONAL: Si el servidor devuelve una racha actualizada, la aplicamos
      if (res.data && typeof res.data.streak !== 'undefined') {
        setStreak(res.data.streak);
      }
    } catch (error) {
      console.error("Error al sincronizar toggle:", error);
      toast.error("Error de sincronización. Revirtiendo...");
      
      // STATE ROLLBACK: Si la nube falla, la UI debe volver a la realidad
      setHabits(previousHabits);
    }
  };

  const startEditing = () => {
    setEditHabits(habits.map(h => ({ ...h })));
    setIsEditingGoals(true);
  };

  const handleInputChange = (habitId, field, value) => {
    setEditHabits(prev => prev.map(h => 
      h.habitId === habitId ? { ...h, [field]: value } : h
    ));
  };

  const handleSaveGoals = async () => {
    const previousHabits = [...habits];
    
    // Limpiamos el payload para evitar objetos circulares (iconos de React)
    const cleanGoals = editHabits.map(({ habitId, label, text }) => ({
      habitId,
      label,
      text
    }));

    // OPTIMISTIC UPDATE
    setHabits(editHabits);
    setIsEditingGoals(false);
    
    try {
      // API CALL (CLOUD-FIRST PERSISTENCE)
      await updateDailyGoalsApi(cleanGoals);
      toast.success("Objetivos sincronizados con la nube");
    } catch (error) {
      console.error("Error al guardar metas:", error);
      toast.error("Error de sincronización. Revirtiendo...");
      setHabits(previousHabits);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4 pt-4 opacity-50">Cargando Tracker...</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* 🔥 STREAK CARD (NEON ORANGE) */}
      <div className="bg-[#1a202a] border border-orange-500/50 p-5 rounded-[1.5rem] relative overflow-hidden group shadow-[0_0_25px_rgba(249,115,22,0.15)] backdrop-blur-sm">
         <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.12] via-transparent to-transparent pointer-none" />
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/30 blur-[50px] -mr-16 -mt-16 group-hover:bg-orange-500/40 transition-all duration-700" />
         
         <div className="flex justify-between items-center relative z-10">
            <div>
               <div className="text-[9px] font-black tracking-[0.25em] text-orange-400 uppercase mb-2 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">Racha de Enfoque</div>
               <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(249,115,22,0.4)' }}>{streak}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Días</span>
               </div>
            </div>
            <div className={`p-3 bg-orange-500/20 rounded-2xl text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-500/40 ${streak > 0 ? 'animate-pulse' : ''}`}>
               <Flame size={24} className={streak > 0 ? 'fill-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : ''} />
            </div>
         </div>
      </div>

      {/* 📋 HABITS LIST (NEON EMERALD) */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-2 text-[9px] font-black tracking-[0.25em] text-gray-500 uppercase">
            <div className="flex items-center gap-2">
               <span>Bloques Diarios</span>
               <button 
                  onClick={isEditingGoals ? () => setIsEditingGoals(false) : startEditing}
                  className="p-1 hover:text-white transition-colors"
               >
                  {isEditingGoals ? <X size={14} /> : <Settings size={14} className="hover:rotate-45 transition-transform" /> }
               </button>
            </div>
            {!isEditingGoals && (
               <div className="text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  {habits.filter(h => h.completed).length}/{habits.length}
               </div>
            )}
         </div>

         <div className="flex flex-col gap-2.5">
            {isEditingGoals ? (
               <>
                  <div className="space-y-3">
                     {editHabits.map((habit) => (
                        <div key={habit.habitId} className="bg-gray-900/60 border border-gray-800 p-4 rounded-2xl space-y-2">
                           <input 
                              type="text" 
                              value={habit.label} 
                              onChange={(e) => handleInputChange(habit.habitId, 'label', e.target.value)}
                              placeholder="Título de la meta"
                              className="bg-transparent border-b border-gray-800 text-emerald-400 text-xs font-black uppercase w-full focus:outline-none focus:border-emerald-500 transition-colors py-1"
                           />
                           <input 
                              type="text" 
                              value={habit.text} 
                              onChange={(e) => handleInputChange(habit.habitId, 'text', e.target.value)}
                              placeholder="Descripción"
                              className="bg-transparent border-none text-gray-400 text-[10px] font-bold w-full focus:outline-none py-1"
                           />
                        </div>
                     ))}
                  </div>
                  <button 
                     onClick={handleSaveGoals}
                     className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-lg shadow-blue-900/20"
                  >
                     <Save size={14} /> Guardar Objetivos
                  </button>
               </>
            ) : (
               habits.map((habit) => (
                  <button 
                    key={habit.habitId} 
                    onClick={() => handleToggle(habit.habitId)}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-500 text-left group relative overflow-hidden ${habit.completed ? 'bg-emerald-500/[0.08] border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30' : 'bg-gray-950/40 border-gray-800 hover:border-blue-500/40 hover:bg-gray-900/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-sm'}`}
                  >
                    <div className={`p-2.5 rounded-xl transition-all duration-500 shadow-lg ${habit.completed ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' : 'bg-gray-900 text-gray-500 group-hover:text-blue-400 group-hover:bg-gray-800 border border-white/5 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}>
                       {habit.completed ? <CheckCircle2 size={16} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" /> : <div className="scale-90">{habit.icon}</div>}
                    </div>
                    <div className="flex-grow z-10">
                       <div className={`text-[11px] font-black mb-0.5 transition-colors duration-500 tracking-tight ${habit.completed ? 'text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 'text-gray-200'}`}>{habit.label}</div>
                       <div className="text-[9px] text-gray-500 leading-tight font-bold uppercase tracking-wider line-clamp-1">{habit.text}</div>
                    </div>
                    {habit.completed && (
                       <div className="absolute right-0 top-0 h-full w-[3px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                    )}
                  </button>
                ))
            )}
         </div>
      </div>

      <div className="p-3 bg-blue-500/[0.03] border border-dashed border-blue-500/10 rounded-xl">
         <p className="text-[9px] text-blue-400/80 font-bold leading-relaxed italic text-center uppercase tracking-tight">
            "La constancia es la diferencia entre el éxito y el deseo."
         </p>
      </div>
    </div>
  );
};

export default DailyTracker;
