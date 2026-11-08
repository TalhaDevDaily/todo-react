import { useState, useEffect } from 'react';
import TodoInput from '../components/TodoInput';
import TodoItem from '../components/TodoItem';
import { FiFilter, FiRotateCcw, FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * ==============================================================================
 * INITIAL REALISTIC NODE.JS LEARNING TASKS
 * ==============================================================================
 * Pre-populating these so the notebook looks alive and educates the student on
 * the upcoming backend topics right away.
 */
const DEFAULT_TASKS = [
  {
    id: 'seed-1',
    title: 'Initialize Express app & configure cors and express.json()',
    tag: 'Backend',
    completed: true,
    createdAt: '09:30 AM',
  },
  {
    id: 'seed-2',
    title: 'Study REST API status codes (200, 201, 400, 401, 404, 500)',
    tag: 'Study',
    completed: true,
    createdAt: '10:15 AM',
  },
  {
    id: 'seed-3',
    title: 'Implement JWT authentication & bcrypt password hashing',
    tag: 'Backend',
    completed: false,
    createdAt: '11:00 AM',
  },
  {
    id: 'seed-4',
    title: 'Set up MongoDB connection using Mongoose models & schemas',
    tag: 'Urgent',
    completed: false,
    createdAt: '11:45 AM',
  },
];

export default function TodoHomePage() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todo_items_list');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Active' | 'Done'

  // Persist todos to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem('todo_items_list', JSON.stringify(todos));
  }, [todos]);

  /**
   * ============================================================================
   * // [BACKEND SPOT] - Fetch All Todos on Component Mount
   * ============================================================================
   * When your Node.js backend is ready, replace this localStorage hook with a real
   * fetch to GET /api/todos using api.getTodos().
   * 
   * Example:
   * useEffect(() => {
   *   async function loadBackendTodos() {
   *     try {
   *       const data = await api.getTodos();
   *       if (data) setTodos(data);
   *     } catch (err) {
   *       toast.error(`Backend Error: ${err.message}`);
   *     }
   *   }
   *   loadBackendTodos();
   * }, []);
   * ============================================================================
   */

  // Add new task
  const handleAddTodo = async ({ title, tag }) => {
    /**
     * // [BACKEND SPOT]: POST /api/todos
     * Node.js Endpoint: app.post('/api/todos', authMiddleware, createTodoController);
     * Send: { title, tag }
     */
    try {
      const createdItem = await api.createTodo({ title, tag });
      setTodos([createdItem, ...todos]);
      toast.success(`Task added to notebook! ✍️ (#${tag})`);
    } catch (err) {
      toast.error(err.message || 'Failed to add task');
    }
  };

  // Toggle task complete status
  const handleToggleComplete = async (id) => {
    /**
     * // [BACKEND SPOT]: PATCH /api/todos/:id
     * Node.js Endpoint: app.patch('/api/todos/:id', authMiddleware, updateTodoController);
     * Send: { completed: !currentStatus }
     */
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    try {
      await api.updateTodo(id, { completed: !target.completed });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Inline edit task
  const handleEditTodo = async (id, updatedFields) => {
    /**
     * // [BACKEND SPOT]: PATCH /api/todos/:id
     * Node.js Endpoint: app.patch('/api/todos/:id', authMiddleware, updateTodoController);
     * Send: { title: updatedFields.title, tag: updatedFields.tag }
     */
    try {
      await api.updateTodo(id, updatedFields);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedFields } : todo
        )
      );
    } catch (err) {
      toast.error(err.message || 'Failed to save edits');
    }
  };

  // Delete task
  const handleDeleteTodo = async (id) => {
    /**
     * // [BACKEND SPOT]: DELETE /api/todos/:id
     * Node.js Endpoint: app.delete('/api/todos/:id', authMiddleware, deleteTodoController);
     */
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  // Reset sample tasks
  const handleResetSampleTasks = () => {
    setTodos(DEFAULT_TASKS);
    toast.info('Sample learning tasks restored! 🔄');
  };

  // Filter calculation
  const totalCount = todos.length;
  const activeCount = todos.filter((t) => !t.completed).length;
  const doneCount = todos.filter((t) => t.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === 'Active') return !todo.completed;
    if (activeFilter === 'Done') return todo.completed;
    return true; // 'All'
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE0D5] pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#4A403A] tracking-tight flex items-center gap-2">
            <span>Daily Dev Log &amp; Tasks</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#FFF3B0] text-[#4A403A] border border-[#EAD98A]">
              Interactive
            </span>
          </h1>
          <p className="text-xs text-[#7A6E65] mt-1">
            Write down your daily learning milestones and track completion.
          </p>
        </div>

        {/* Restore Sample Tasks Shortcut */}
        <button
          onClick={handleResetSampleTasks}
          title="Restore sample Node.js tasks"
          className="self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-[#FFFDF9] border border-[#EAE0D5] text-[#7A6E65] hover:text-[#4A403A] hover:bg-[#F7EFEA] transition-all cursor-pointer shadow-2xs"
        >
          <FiRotateCcw className="w-3 h-3 text-[#F4A298]" />
          <span>Reset Sample Tasks</span>
        </button>
      </div>

      {/* Top Input Form */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* Filter Tabs & Counters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 text-xs">
          <FiFilter className="w-3.5 h-3.5 text-[#F4A298]" />
          <span className="font-semibold text-[#7A6E65]">Filter:</span>

          {/* All Filter Pill */}
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              activeFilter === 'All'
                ? 'bg-[#4A403A] text-white border-[#4A403A] shadow-xs'
                : 'bg-[#FFFDF9] text-[#7A6E65] border-[#EAE0D5] hover:border-[#4A403A]/40'
            }`}
          >
            All <span className="opacity-75">({totalCount})</span>
          </button>

          {/* Active Filter Pill */}
          <button
            onClick={() => setActiveFilter('Active')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              activeFilter === 'Active'
                ? 'bg-[#E8DFF5] text-[#4A403A] border-[#D5C6EB] font-bold shadow-xs'
                : 'bg-[#FFFDF9] text-[#7A6E65] border-[#EAE0D5] hover:border-[#4A403A]/40'
            }`}
          >
            Active <span className="opacity-75">({activeCount})</span>
          </button>

          {/* Done Filter Pill */}
          <button
            onClick={() => setActiveFilter('Done')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              activeFilter === 'Done'
                ? 'bg-[#D8E2DC] text-[#4A403A] border-[#B8C8BF] font-bold shadow-xs'
                : 'bg-[#FFFDF9] text-[#7A6E65] border-[#EAE0D5] hover:border-[#4A403A]/40'
            }`}
          >
            Done <span className="opacity-75">({doneCount})</span>
          </button>
        </div>

        {/* Completion Progress Badge */}
        <div className="text-xs text-[#7A6E65] bg-[#F7EFEA] px-3 py-1 rounded-full border border-[#EAE0D5]">
          <span>Progress: </span>
          <span className="font-bold text-[#4A403A]">
            {totalCount === 0 ? '0%' : `${Math.round((doneCount / totalCount) * 100)}%`}
          </span>
        </div>
      </div>

      {/* List of To-Do Items on the Ruled Paper */}
      <div className="divide-y divide-[#EAE0D5] rounded-xl border border-[#EAE0D5] bg-[#FFFDF9]/90 shadow-2xs overflow-hidden">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEditTodo={handleEditTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          ))
        ) : (
          <div className="py-12 px-4 text-center">
            <p className="text-3xl mb-2">✍️</p>
            <h3 className="text-sm font-semibold text-[#4A403A]">
              Notebook page is clean!
            </h3>
            <p className="text-xs text-[#9E9289] mt-1 max-w-sm mx-auto">
              {activeFilter === 'All'
                ? 'You have no tasks in your notebook yet. Use the form above to add your first Node.js learning goal.'
                : `No tasks match the "${activeFilter}" filter.`}
            </p>
          </div>
        )}
      </div>

      {/* Backend Integration Note Card */}
      <div className="mt-8 p-4 rounded-xl bg-[#FFF3B0]/30 border border-[#FFF3B0] text-xs text-[#7A6E65] space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-[#4A403A]">
          <FiLayers className="w-4 h-4 text-[#F4A298]" />
          <span>Node.js Backend Integration Guide (Class 5):</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          This frontend stores data in your browser's <code className="bg-white/80 px-1 py-0.5 rounded border border-[#EAE0D5]">localStorage</code>. When you start your Express server on <code className="bg-white/80 px-1 py-0.5 rounded border border-[#EAE0D5]">http://localhost:5000</code>, open <code className="bg-white/80 px-1 py-0.5 rounded border border-[#EAE0D5]">src/services/api.js</code> to connect your real MongoDB database!
        </p>
      </div>

    </div>
  );
}
