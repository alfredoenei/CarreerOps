import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const api = axios.create({
  baseURL: API_BASE_URL, // Usamos la URL centralizada (fallback al proxy)
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * INTERCEPTOR DE PETICIONES
 * Garantiza que cada llamada lleve el token actualizado del localStorage.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Soportamos ambos estándares para máxima compatibilidad con el backend
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * INTERCEPTOR DE RESPUESTAS
 * Captura errores 401 (Token expirado/inválido) y limpia el estado.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Autorización denegada. El token ha expirado o es inválido.");
      localStorage.removeItem('token');
      // Dispatch global event for React context
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

// Endpoints de configuración de usuario/metas
export const getBoards = () => api.get('/boards');
export const getBoardById = (id) => api.get(`/boards/${id}`);
export const createBoard = (data) => api.post('/boards', data);

// Columnas
export const getColumnsByBoard = (boardId) => api.get(`/columns/board/${boardId}`);
export const createColumn = (data) => api.post('/columns', data);
export const updateColumn = (id, data) => api.put(`/columns/${id}`, data);
export const deleteColumn = (id) => api.delete(`/columns/${id}`);

// Tareas
export const getTasksByBoard = (boardId) => api.get(`/tasks/board/${boardId}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const clearTasks = (columnId) => api.delete(`/tasks/clear/${columnId}`);

// Hábitos (Daily Tracker)
export const getHabitsProgress = () => api.get('/habits');
export const toggleHabit = (habitId) => api.post('/habits/toggle', { habitId });
export const updateDailyGoals = (goals) => api.put('/user/goals', { goals });

export default api;
