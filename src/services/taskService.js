import api from './api';

const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

const reorderTasks = async (tasks) => {
  const response = await api.put('/tasks/reorder', { tasks });
  return response.data;
};

const toggleTask = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/toggle`);
  return response.data;
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  toggleTask,
};

export default taskService;
