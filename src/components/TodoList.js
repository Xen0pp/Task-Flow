import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { getSocket } from '../services/socketService';
import { Plus, Search, Calendar as CalendarIcon, AlertCircle, Check, Edit2, Trash2, GripVertical, CheckSquare } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

// Sortable Task Item Component
function SortableTaskItem({ task, onToggle, onEdit, onDelete, onAddSubtask, onToggleSubtask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const handleSave = () => {
    onEdit(task.id, { ...task, text: editText });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        task.completed ? 'opacity-60 scale-[0.98] bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <GripVertical size={16} />
        </div>
        
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900'
          }`}
          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && <Check size={12} />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`${task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'} transition-colors duration-200`}>
                {task.text}
              </p>
              
              <div className="flex items-center space-x-2 mt-2">
                {task.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
                
                {task.category && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                    {task.category}
                  </span>
                )}
                
                {task.tags && task.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
                
                {task.dueDate && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    dueDateStatus === 'overdue' ? 'text-red-600 dark:text-red-400' :
                    dueDateStatus === 'today' ? 'text-orange-600 dark:text-orange-400' :
                    dueDateStatus === 'tomorrow' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    <CalendarIcon size={12} />
                    <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                    {dueDateStatus === 'overdue' && <AlertCircle size={12} />}
                  </div>
                )}
              </div>
              
              {task.subtasks && task.subtasks.length > 0 && (
                <button
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                >
                  {showSubtasks ? 'Hide' : 'Show'} {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
                </button>
              )}
              
              {showSubtasks && task.subtasks && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-2">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggle(subtask.id, true)}
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          subtask.completed
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {subtask.completed && <Check size={10} />}
                      </button>
                      <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {subtask.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState({
    text: '',
    priority: 'medium',
    category: '',
    tags: '',
    dueDate: '',
    recurring: 'none'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {


    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks();
        if (data && data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks.map(t => ({...t, id: t._id})).sort((a, b) => a.order - b.order));
        } else {
          console.warn('Invalid tasks data received:', data);
          setTasks([]);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
        setError('Failed to load tasks. Please try refreshing the page.');
      }
    };

    fetchTasks();

    let socket;
    try {
      socket = getSocket();
      socket.on('task-created', (newTask) => {
        if (newTask && newTask._id) {
          setTasks(prev => [...prev, {...newTask, id: newTask._id}]);
        }
      });
      socket.on('task-updated', (updatedTask) => {
        if (updatedTask && updatedTask._id) {
          setTasks(prev => prev.map(t => t.id === updatedTask._id ? {...updatedTask, id: updatedTask._id} : t));
        }
      });
      socket.on('task-deleted', ({ taskId }) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      });
      socket.on('tasks-reordered', ({ tasks: reorderedTasks }) => {
        if (reorderedTasks && Array.isArray(reorderedTasks)) {
          setTasks(reorderedTasks.map(t => ({...t, id: t._id})).sort((a, b) => a.order - b.order));
        }
      });
    } catch (err) {
      console.error('Failed to initialize socket connection:', err);
      setError('Failed to connect to real-time updates. Some features may not work properly.');
    }

    return () => {
      if (socket) {
        socket.off('task-created');
        socket.off('task-updated');
        socket.off('task-deleted');
        socket.off('tasks-reordered');
      }
    };
  }, []);

  const addTask = async () => {
    if (!newTaskDetails.text.trim()) {
      console.error('Task text cannot be empty.');
      return;
    }
    try {
      const taskData = {
        text: newTaskDetails.text,
        priority: newTaskDetails.priority,
        category: newTaskDetails.category || null,
        tags: newTaskDetails.tags ? newTaskDetails.tags.split(',').map(tag => tag.trim()) : [],
        dueDate: newTaskDetails.dueDate || null,
        recurring: newTaskDetails.recurring,
        createdAt: new Date().toISOString(),
        subtasks: []
      };
      const response = await taskService.createTask(taskData);
      if (response && response.task && response.task._id) {
        setTasks(prevTasks => [...prevTasks, {...response.task, id: response.task._id}]);
      } else {
        console.error('Invalid task creation response:', response);
      }
      setNewTaskDetails({
        text: '',
        priority: 'medium',
        category: '',
        tags: '',
        dueDate: '',
        recurring: 'none'
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      // Optimistic update for better UX
      setTasks(prevTasks =>
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      
      const response = await taskService.toggleTask(taskId);
      if (!response || !response.task || !response.task._id) {
        console.error('Invalid toggle task response:', response);
        throw new Error('Invalid response from server');
      }
      const updatedTask = { ...response.task, id: response.task._id };
      
      // Update with server response
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? updatedTask : task))
      );
      
      // Show success message
      console.log(updatedTask.completed ? 'Task completed! 🎉' : 'Task marked as incomplete');
    } catch (error) {
      console.error('Failed to toggle task. Please try again.', error);
      // Revert optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const editTask = async (taskId, updatedData) => {
    try {
      await taskService.updateTask(taskId, updatedData);
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(item => item.id === active.id);
      const newIndex = tasks.findIndex(item => item.id === over.id);
      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(reorderedTasks);

      try {
        await taskService.reorderTasks(reorderedTasks.map((t, i) => ({ id: t.id, order: i })));
      } catch (err) {
        console.error('Failed to reorder tasks', err);
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCompleted = showCompleted || !task.completed;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
  });

  const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">Something went wrong</p>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 -m-4 md:-m-6 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">To-Do List</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Description
              </label>
              <input
                type="text"
                value={newTaskDetails.text}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter task description..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={newTaskDetails.priority}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={newTaskDetails.category}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Work, Personal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={newTaskDetails.tags}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="urgent, project-A"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={newTaskDetails.dueDate}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={addTask}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Add Task
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show completed</span>
          </label>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <CheckSquare size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {tasks.length === 0 ? 'No tasks yet. Add your first task!' : 'No tasks match your filters.'}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {filteredTasks.map(task => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={editTask}
                  onDelete={deleteTask}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Task Statistics */}
      {tasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {tasks.filter(task => task.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {tasks.filter(task => !task.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
