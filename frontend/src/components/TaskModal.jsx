import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, AlertCircle, Save, Briefcase, MapPin, DollarSign,
  Link as LinkIcon, FileText, Calendar, Clock, AlignLeft, Star
} from 'lucide-react';

const TaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    salary: '',
    location: '',
    description: '',
    priority: 'low',
    tags: [],
    // 🚀 NUEVOS CAMPOS DEL CRM
    jobUrl: '',
    resumeUsed: '',
    appliedAt: '',
    nextFollowUp: '',
    interviewNotes: '',
    isFavorite: false
  });

  // HELPER: Formatea fechas para que sean compatibles con <input type="date" />
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        company: task.company || '',
        salary: task.salary || '',
        location: task.location || '',
        description: task.description || '',
        priority: task.priority || 'low',
        tags: task.tags || [],
        jobUrl: task.jobUrl || '',
        resumeUsed: task.resumeUsed || '',
        // Sanitización de fechas para persistencia en el input
        appliedAt: formatDateForInput(task.appliedAt),
        nextFollowUp: formatDateForInput(task.nextFollowUp),
        interviewNotes: task.interviewNotes || '',
        isFavorite: task.isFavorite || false
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave({ ...task, ...formData });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        onClick={onClose}
      >
        <motion.div
          className="bg-[#151b23] border border-gray-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/10 flex flex-col max-h-[90vh]"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40">
                <Briefcase size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Centro de Comando</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gestión de Oferta</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                className={`p-2.5 rounded-xl border-2 transition-all ${formData.isFavorite ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-gray-800 text-gray-600 hover:text-gray-400 hover:border-gray-700'}`}
                title={formData.isFavorite ? "Quitar de favoritos" : "Marcar como favorito"}
              >
                <motion.div
                  animate={{ scale: formData.isFavorite ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Star size={20} fill={formData.isFavorite ? "currentColor" : "none"} />
                </motion.div>
              </button>
              <button
                className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Formulario con Scroll Interno */}
          <form onSubmit={handleSubmit} className="overflow-y-auto px-8 pb-8 space-y-8 custom-scrollbar">

            {/* SECCIÓN 1: DATOS DE LA OFERTA */}
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-500" /> Detalles del Rol
                </h3>
              </div>

              {/* Puesto */}
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Puesto / Cargo *</label>
                <input
                  type="text"
                  className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl p-4 text-white placeholder:text-gray-700 transition-all outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Senior Full-Stack Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Empresa</label>
                  <div className="relative">
                    <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="text"
                      className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Ej: TECH CORP"
                    />
                  </div>
                </div>

                {/* Link de la Oferta */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">URL de la Oferta</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="url"
                      className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-4 text-blue-400 placeholder:text-gray-700 transition-all outline-none"
                      value={formData.jobUrl}
                      onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Rango Salarial</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="text"
                      className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="Ej: $110k-$130k"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Ubicación</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="text"
                      className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ej: Remote, Hybrid..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: ESTRATEGIA Y SEGUIMIENTO */}
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-2 pt-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" /> Estrategia & Seguimiento
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CV Usado */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Versión de CV</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="text"
                      className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-amber-500/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none"
                      value={formData.resumeUsed}
                      onChange={(e) => setFormData({ ...formData, resumeUsed: e.target.value })}
                      placeholder="Ej: Frontend_CV_v3.pdf"
                    />
                  </div>
                </div>

                {/* Prioridad */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Prioridad</label>
                  <div className="flex gap-2 bg-[#0b0e14] p-1.5 rounded-2xl border-2 border-gray-800 h-[56px]">
                    {[
                      { id: 'low', label: 'Baja' },
                      { id: 'medium', label: 'Media' },
                      { id: 'high', label: 'Alta' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.priority === p.id ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-600 hover:text-gray-400'}`}
                        onClick={() => setFormData({ ...formData, priority: p.id })}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fecha Aplicación */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Fecha de Aplicación</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="date"
                      className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-amber-500/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none [color-scheme:dark]"
                      value={formData.appliedAt}
                      onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
                    />
                  </div>
                </div>

                {/* Próximo Follow-Up */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-amber-500/70 uppercase ml-1">Alerta Follow-up</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="date"
                      className="w-full bg-[#0b0e14] border-2 border-amber-500/30 focus:border-amber-500 rounded-2xl pl-12 pr-4 py-4 text-amber-400 placeholder:text-gray-700 transition-all outline-none [color-scheme:dark]"
                      value={formData.nextFollowUp}
                      onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Notas de Entrevista */}
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Notas / Preparación Técnica</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 text-gray-600" size={16} />
                  <textarea
                    className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-amber-500/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none min-h-[120px] resize-y custom-scrollbar"
                    value={formData.interviewNotes}
                    onChange={(e) => setFormData({ ...formData, interviewNotes: e.target.value })}
                    placeholder="Ej: Investigar su stack tech, repasar algoritmo de grafos, preguntar por cultura remota..."
                  />
                </div>
              </div>

            </div>

            {/* Footer Fijo Resiliente */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-4 border-t border-gray-800 shrink-0 sticky bottom-0 bg-[#151b23] pb-2">
              <button
                type="button"
                className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-bold rounded-2xl transition-all"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-[1.5] py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-3 group whitespace-nowrap"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform shrink-0" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;