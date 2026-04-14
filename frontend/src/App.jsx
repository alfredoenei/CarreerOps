import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import Board from './components/Board';
import DailyTracker from './components/DailyTracker';
import Auth from './pages/Auth';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import DeleteModal from './components/DeleteModal';
import FavoritesView from './components/FavoritesView';
import MetricsView from './components/MetricsView';
import { AuthContext } from './context/AuthContext';
import { 
  getBoards, 
  getColumnsByBoard, 
  getTasksByBoard, 
  updateTask,
  createTask,
  deleteTask,
} from './services/api';
import { 
  LayoutDashboard, 
  Star, 
  BarChart3, 
  LogOut, 
  User as UserIcon,
  Search
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.5' },
    },
  }),
};

function App() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL STATES
  const [activeTask, setActiveTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // NAVIGATION STATE
  const [currentView, setCurrentView] = useState('tablero');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const boardsRes = await getBoards();
      if (boardsRes.data.length === 0) {
        setBoard(null);
        setColumns([]);
        return;
      }
      const currentBoard = boardsRes.data[0];
      setBoard(currentBoard);
      const [colsRes, tasksRes] = await Promise.all([
        getColumnsByBoard(currentBoard._id),
        getTasksByBoard(currentBoard._id)
      ]);
      const structuredColumns = colsRes.data.map(col => ({
        ...col,
        tasks: tasksRes.data.filter(task => task.columnId === col._id).sort((a,b) => a.position - b.position)
      })).sort((a,b) => a.position - b.position);
      setColumns(structuredColumns);
    } catch (error) {
      toast.error("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const kanbanColumns = useMemo(() => {
    const targetCols = ['Applied', 'Interviewing', 'Offers'];
    return columns.filter(col => targetCols.includes(col.title));
  }, [columns]);


  const handleOpenTaskModal = (task) => setEditingTask(task);

  const handleAddTask = (columnId) => {
    const col = columns.find(c => c._id === columnId);
    setEditingTask({ 
      title: '', 
      company: '', 
      salary: '', 
      location: '', 
      description: '', 
      priority: 'low', 
      columnId, 
      boardId: board?._id, 
      position: col?.tasks?.length || 0 
    });
  };

  const handleSaveTaskDetails = async (data) => {
    try {
      if (data._id) {
        const res = await updateTask(data._id, data);
        setColumns(prev => prev.map(c => ({ ...c, tasks: c.tasks.map(t => t._id === data._id ? res.data : t) })));
      } else {
        const res = await createTask(data);
        setColumns(prev => prev.map(c => c._id === data.columnId ? { ...c, tasks: [...c.tasks, res.data] } : c));
      }
      setEditingTask(null);
      toast.success("Tarea guardada");
    } catch (error) { toast.error("Error al guardar"); }
  };

  const handleDeleteTask = (id, colId) => {
    const col = columns.find(c => c._id === colId);
    const task = col?.tasks.find(t => t._id === id);
    setTaskToDelete({ id, colId, title: task?.title });
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const { id, colId } = taskToDelete;
    try {
      await deleteTask(id);
      setColumns(prev => prev.map(c => c._id === colId ? { ...c, tasks: c.tasks.filter(t => t._id !== id) } : c));
      toast.success("Tarea eliminada");
      setTaskToDelete(null);
    } catch (error) { toast.error("Error"); }
  };

  const handleApplyFromFavorites = async (task) => {
    const appliedCol = columns.find(c => c.title === 'Applied');
    if (!appliedCol) {
      toast.error("No se encontró la columna 'Applied'");
      return;
    }
    const originalColumns = [...columns];
    setColumns(prev => 
      prev.map(c => {
        if (c._id === task.columnId) return { ...c, tasks: c.tasks.filter(t => t._id !== task._id) };
        if (c._id === appliedCol._id) return { ...c, tasks: [...c.tasks, { ...task, columnId: appliedCol._id }] };
        return c;
      })
    );
    setCurrentView('tablero');
    toast.success("¡Postulación iniciada!");
    try {
      await updateTask(task._id, { columnId: appliedCol._id, position: appliedCol.tasks.length });
    } catch (error) {
      setColumns(originalColumns);
      toast.error("Error al sincronizar con el servidor");
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const activeCol = columns.find(c => c.tasks.some(t => t._id === activeId));
    const overCol = columns.find(c => c.tasks.some(t => t._id === overId) || c._id === overId);
    if (!activeCol || !overCol) return;
    try {
      if (activeCol._id === overCol._id) {
        const oldIdx = activeCol.tasks.findIndex(t => t._id === activeId);
        const newIdx = overCol.tasks.findIndex(t => t._id === overId);
        if (oldIdx !== newIdx) {
          setColumns(prev => {
            const idx = prev.findIndex(c => c._id === activeCol._id);
            const n = [...prev];
            n[idx] = { ...prev[idx], tasks: arrayMove(prev[idx].tasks, oldIdx, newIdx) };
            return n;
          });
          updateTask(activeId, { position: newIdx });
        }
      } else {
        setColumns(prev => prev.map(c => {
          if (c._id === activeCol._id) return { ...c, tasks: c.tasks.filter(t => t._id !== activeId) };
          if (c._id === overCol._id) {
            const newTask = activeCol.tasks.find(t => t._id === activeId);
            return { ...c, tasks: [...c.tasks, { ...newTask, columnId: overCol._id }] };
          }
          return c;
        }));
        updateTask(activeId, { columnId: overCol._id, position: overCol.tasks.length });
      }
    } catch (error) { fetchData(); }
  };

  if (authLoading) return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#0b0e14] gap-10">
      <div className="relative animate-pulse flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 border-[6px] border-blue-600 rounded-full border-r-0 rotate-[15deg] flex items-center justify-center relative">
            <div className="absolute -top-4 -right-1">
               <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-emerald-500 mb-[-5px]"></div>
               <div className="w-[8px] h-[30px] bg-gradient-to-t from-blue-600 to-emerald-500 mx-auto rounded-full"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full scale-150" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white">Career<span className="text-blue-500">Ops</span></h1>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-gray-900 rounded-full"></div>
          <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">Optimizando tu próximo paso</p>
      </div>
    </div>
  );

  if (!user) return <><Toaster theme="dark" /><Auth /></>;

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white antialiased">
      <Toaster theme="dark" position="top-right" richColors />
      <nav className="flex items-center justify-between h-[60px] bg-gray-900 border-b border-gray-800 px-6 shrink-0 shadow-lg z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="bg-blue-600 p-1.5 rounded-lg"><LayoutDashboard size={18} className="text-white" /></div>
             <span className="text-lg font-black tracking-tight">Career<span className="text-blue-500">Ops</span></span>
          </div>
          <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700/50 scale-90 origin-left">
            <button onClick={() => setCurrentView('tablero')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'tablero' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}><LayoutDashboard size={16} /> <span className="hidden md:inline">Tablero</span></button>
            <button onClick={() => setCurrentView('favoritos')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'favoritos' ? 'bg-yellow-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}><Star size={16} /> <span className="hidden md:inline">Favoritos</span></button>
            <button onClick={() => setCurrentView('metricas')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'metricas' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}><BarChart3 size={16} /> <span className="hidden md:inline">Métricas</span></button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-800 border-none rounded-full pl-10 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 w-64 transition-all" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700 scale-90">
               <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold">{user.username.charAt(0).toUpperCase()}</div>
               <span className="text-xs font-semibold">{user.username}</span>
            </div>
            <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </nav>

      <div className="flex flex-row flex-1 w-full overflow-hidden">
        <main className="flex-1 min-w-0 overflow-auto bg-[#0b0e14] custom-scrollbar">
           <div className="p-3.5 h-full">
              {currentView === 'tablero' && (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-x-auto pb-4 pt-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <Board 
                        columns={kanbanColumns} 
                        onOpenTaskModal={handleOpenTaskModal} 
                        onAddTask={handleAddTask} 
                        onDeleteTask={handleDeleteTask}
                        onRefresh={fetchData}
                        isLoading={loading}
                      />
                      <DragOverlay dropAnimation={dropAnimationConfig}>{activeTask ? <TaskCard task={activeTask} isOverlay /> : null}</DragOverlay>
                    </DndContext>
                  </div>
                </div>
              )}

              {currentView === 'favoritos' && (
                <FavoritesView 
                  columns={columns} 
                  onOpenTaskModal={handleOpenTaskModal} 
                  onDeleteTask={handleDeleteTask} 
                />
              )}

              {currentView === 'metricas' && <MetricsView columns={columns} />}
           </div>
        </main>
        <aside className="w-[300px] shrink-0 bg-[#12161e] border-l border-gray-800 p-5 overflow-y-auto custom-scrollbar shadow-2xl z-40"><DailyTracker /></aside>
      </div>

      <TaskModal isOpen={!!editingTask} task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveTaskDetails} />
      <DeleteModal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={confirmDeleteTask} taskTitle={taskToDelete?.title} />
    </div>
  );
}

export default App;
