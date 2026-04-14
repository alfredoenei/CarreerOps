import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, LayoutDashboard, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Algo salió mal');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0b0e14] overflow-hidden">
      
      {/* ⬅️ PANEL IZQUIERDO (Branding/Inmersión) */}
      <div className="hidden md:flex flex-[1.2] flex-col items-center justify-center bg-gray-950 p-12 relative overflow-hidden text-center">
         {/* Background Elements */}
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent)]" />
         <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.05),transparent)]" />
         
         <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Logo Re-construido */}
            <div className="mb-12">
               <div className="w-24 h-24 border-[6px] border-blue-600 rounded-full border-r-0 rotate-[-15deg] flex items-center justify-center relative translate-x-2">
                  <div className="absolute -top-4 -right-1 rotate-[15deg]">
                     <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-emerald-500 mb-[-5px]"></div>
                     <div className="w-[8px] h-[30px] bg-gradient-to-t from-blue-600 to-emerald-500 mx-auto rounded-full"></div>
                  </div>
               </div>
            </div>

            <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">
              Bienvenido a <span className="text-blue-500 italic">CareerOps</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium max-w-md leading-relaxed">
              Tu próximo <span className="text-emerald-500 font-bold italic">gran paso</span> profesional comienza exactamente aquí.
            </p>

            <div className="mt-12 flex gap-4">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-800" />
               ))}
               <div className="w-12 h-2 rounded-full bg-blue-600" />
            </div>
         </div>
      </div>

      {/* ➡️ PANEL DERECHO (El Formulario) */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0b0e14] relative overflow-hidden">
         {/* Malla Sutil de Fondo */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         
         <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-700">
            <div className="mb-10 text-center md:text-left">
               <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                 {isLogin ? 'Iniciar Sesión' : 'Crear mi Cuenta'}
               </h3>
               <p className="text-gray-500 text-sm font-medium">
                 {isLogin ? 'Accede a tu panel centralizado' : 'Únete a la plataforma de gestión de carrera'}
               </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase ml-1">Usuario</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="username" 
                      placeholder="Nombre de usuario"
                      className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none text-sm"
                      value={username} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Email Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none text-sm"
                    value={email} 
                    onChange={onChange} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Contraseña</label>
                  {isLogin && (
                    <button type="button" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors">¿Olvidaste tu clave?</button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••"
                    className="w-full bg-[#0b0e14] border-2 border-gray-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-700 transition-all outline-none text-sm"
                    value={password} 
                    onChange={onChange} 
                    required 
                    minLength="6"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-2 group mt-8"
              >
                {isLogin ? 'Entrar Ahora' : 'Crear Mi Cuenta'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-800 text-center">
               <p className="text-gray-500 text-sm">
                 {isLogin ? '¿Aún no tienes cuenta?' : '¿Ya eres miembro?'}
                 <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-emerald-500 font-bold ml-2 hover:underline transition-all"
                 >
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                 </button>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Auth;
