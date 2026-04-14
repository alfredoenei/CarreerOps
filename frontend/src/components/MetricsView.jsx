import React from 'react';
import { BarChart3, Search, Ghost } from 'lucide-react';

/**
 * 🎨 THEME_MAP: Solución definitiva para PurgeCSS/Tailwind JIT.
 * Evita la interpolación dinámica de clases para asegurar que el build de producción
 * detecte y mantenga los estilos neón.
 */
const THEME_MAP = {
  blue: {
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500',
    bgGlow: 'bg-blue-500/10',
    bgHover: 'group-hover:bg-blue-500/20',
    text: 'text-blue-400',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]',
    textShadow: '0 0 10px rgba(59,130,246,0.5)',
    rgba: '59, 130, 246'
  },
  orange: {
    border: 'border-orange-500/30',
    hoverBorder: 'hover:border-orange-500',
    bgGlow: 'bg-orange-500/10',
    bgHover: 'group-hover:bg-orange-500/20',
    text: 'text-orange-400',
    shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.1)]',
    textShadow: '0 0 10px rgba(249,115,22,0.5)',
    rgba: '249, 115, 22'
  },
  emerald: {
    border: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500',
    bgGlow: 'bg-emerald-500/10',
    bgHover: 'group-hover:bg-emerald-500/20',
    text: 'text-emerald-400',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    textShadow: '0 0 10px rgba(16,185,129,0.5)',
    rgba: '16, 185, 129'
  },
  red: {
    border: 'border-red-500/30',
    hoverBorder: 'hover:border-red-500',
    bgGlow: 'bg-red-500/10',
    bgHover: 'group-hover:bg-red-500/20',
    text: 'text-red-400',
    shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
    textShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
    rgba: '239, 68, 68'
  },
  yellow: {
    border: 'border-yellow-500/30',
    hoverBorder: 'hover:border-yellow-500',
    bgGlow: 'bg-yellow-500/10',
    bgHover: 'group-hover:bg-yellow-500/20',
    text: 'text-yellow-400',
    shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.1)]',
    textShadow: '0 0 10px rgba(234, 179, 8, 0.5)',
    rgba: '234, 179, 8'
  },
  gray: {
    border: 'border-gray-500/30',
    hoverBorder: 'hover:border-gray-500',
    bgGlow: 'bg-gray-500/10',
    bgHover: 'group-hover:bg-gray-500/20',
    text: 'text-gray-400',
    shadow: 'shadow-[0_0_20px_rgba(107,114,128,0.1)]',
    textShadow: '0 0 10px rgba(107,114,128,0.4)',
    rgba: '107, 114, 128'
  }
};

const MetricsView = ({ columns }) => {
  // 1. Cálculo de métricas base
  const stats = [
    { 
      label: 'Total Postulaciones', 
      value: columns.reduce((acc, c) => acc + c.tasks.length, 0), 
      color: 'blue'
    },
    { 
      label: 'Entrevistas Logradas', 
      value: columns.find(c => c.title === 'Interviewing')?.tasks.length || 0, 
      color: 'orange'
    },
    { 
      label: 'Ofertas Recibidas', 
      value: columns.find(c => c.title === 'Offers' || c.title === 'Results')?.tasks.length || 0, 
      color: 'emerald'
    }
  ];

  // 2. Eficiencia del Funnel
  const efficiency = [
    { 
      label: 'Applied -> Interview', 
      pct: Math.round(((columns.find(c => c.title === 'Interviewing')?.tasks.length || 0) / (columns.find(c => c.title === 'Applied')?.tasks.length || 1)) * 100), 
      color: 'from-blue-600 to-blue-400', 
      glow: 'rgba(59, 130, 246, 0.5)' 
    },
    { 
      label: 'Interview -> Offer', 
      pct: Math.round(((columns.find(c => c.title === 'Offers' || c.title === 'Results')?.tasks.length || 0) / (columns.find(c => c.title === 'Interviewing')?.tasks.length || 1)) * 100), 
      color: 'from-orange-600 to-emerald-500', 
      glow: 'rgba(16, 185, 129, 0.5)' 
    }
  ];

  const apps = columns.find(c => c.title === 'Applied')?.tasks.length || 0;
  const ints = columns.find(c => c.title === 'Interviewing')?.tasks.length || 0;
  const offs = columns.find(c => c.title === 'Offers' || c.title === 'Results')?.tasks.length || 0;
  
  // 3. 🛡️ INTELIGENCIA DE NEGOCIO: GHOSTING DETECTION
  const appliedCol = columns.find(c => c.title === 'Applied');
  const ghostingCount = appliedCol?.tasks.reduce((count, task) => {
    if (!task.appliedAt) return count;
    const appliedDate = new Date(task.appliedAt);
    const msDiff = new Date() - appliedDate;
    const daysDiff = msDiff / (1000 * 60 * 60 * 24);
    return daysDiff > 14 ? count + 1 : count;
  }, 0) || 0;

  // 4. Generación de Smart Tips
  const tips = [];
  
  if (ghostingCount > 0) {
    tips.push({ 
      title: "Ghosting Detectado", 
      text: `Tienes ${ghostingCount} aplicaciones sin respuesta hace más de 14 días. Toca hacer follow-up o archivarlas.`, 
      color: "red" 
    });
  }

  if (apps > 15 && ints === 0) {
    tips.push({ title: "Alta tasa de rebote", text: "Considera revisar tu CV o adaptar más tus postulaciones.", color: "orange" });
  }
  if (apps < 5 && apps > 0) {
    tips.push({ title: "Volumen Crítico", text: "El volumen es bajo. Completa tu bloque de 'Caza Mayor' para aumentar oportunidades.", color: "blue" });
  }
  if (ints > 0 && offs === 0) {
    tips.push({ title: "Falla en Cierre", text: "Estás llegando a la fase técnica. Es hora de apretar con LeetCode y Soft Skills.", color: "emerald" });
  }
  if (apps === 0) {
    tips.push({ title: "Panel Vacío", text: "Comienza a añadir tus postulaciones para ver estadísticas reales.", color: "gray" });
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 px-1">
        <h1 className="text-xl font-black tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          Métricas de Conversión
        </h1>
        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest opacity-70">
          Inteligencia del Funnel CRM
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map(stat => {
          const theme = THEME_MAP[stat.color];
          return (
            <div key={stat.label} className={`bg-gray-900 border ${theme.border} p-5 rounded-2xl relative overflow-hidden group ${theme.hoverBorder} transition-all ${theme.shadow}`}>
              <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bgGlow} blur-[40px] -mr-12 -mt-12 ${theme.bgHover} transition-all duration-700`} />
              <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 relative z-10">{stat.label}</div>
              <div 
                className={`text-4xl font-black text-white relative z-10 tracking-tighter`}
                style={{ textShadow: theme.textShadow }}
              >
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Gráfico de Eficiencia */}
        <div className="bg-gray-900 border border-blue-500/30 rounded-[2rem] p-8 flex items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.05)]">
          <div className="absolute inset-0 bg-blue-500/[0.05] blur-[120px]" />
          <div className="text-center z-10 w-full max-w-sm">
            <BarChart3 size={40} className="mx-auto mb-4 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
            <h2 className="text-lg font-black mb-6 uppercase tracking-tighter text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>Eficiencia del Funnel</h2>
            <div className="space-y-6 text-left">
              {efficiency.map(row => (
                <div key={row.label}>
                  <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-gray-500">
                    <span>{row.label}</span>
                    <span className="text-white">{row.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div 
                      className={`h-full bg-gradient-to-r ${row.color} rounded-full relative`} 
                      style={{ width: `${Math.min(row.pct, 100)}%`, boxShadow: `0 0 15px ${row.glow}` }}
                    >
                      <div className="absolute right-0 top-0 h-full w-4 bg-white/20 blur-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Insights & tips */}
        <div className="bg-gray-950/30 border border-yellow-500/20 rounded-[2rem] p-8 flex flex-col gap-6 backdrop-blur-sm shadow-[0_0_30px_rgba(234,179,8,0.02)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-400 border border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              {ghostingCount > 0 ? <Ghost size={18} className="animate-bounce" /> : <Search size={18} />}
            </div>
            <h2 className="text-lg font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>Smart Insights & Tips</h2>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {tips.length > 0 ? tips.map((tip, i) => {
              const theme = THEME_MAP[tip.color];
              return (
                <div key={i} className={`p-4 bg-gray-900 border ${theme.border} rounded-xl ${theme.shadow} relative overflow-hidden group hover:bg-gray-800/80 transition-all`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 ${theme.bgGlow} blur-[30px] -mr-10 -mt-10 ${theme.bgHover} transition-all`} />
                  <div 
                    className={`text-[10px] font-black uppercase tracking-tighter ${theme.text} mb-1 relative z-10`}
                    style={{ textShadow: theme.textShadow }}
                  >{tip.title}</div>
                  <p className="text-xs text-gray-300 font-bold leading-relaxed relative z-10">{tip.text}</p>
                </div>
              );
            }) : (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <p className="text-xs text-emerald-400 font-black uppercase tracking-widest" style={{ textShadow: '0 0 10px rgba(16,185,129,0.3)' }}>
                  ¡Tu funnel está equilibrado!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsView;
