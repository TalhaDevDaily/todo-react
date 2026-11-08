import { useState } from 'react';
import { FiPlus, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';

/**
 * ==============================================================================
 * TO-DO INPUT COMPONENT (src/components/TodoInput.jsx)
 * ==============================================================================
 * Renders the top task input form on the notebook page, complete with a cozy
 * notebook-lined input field, a pastel category tag selector, and an Add button.
 */

// Available pastel tag options
// eslint-disable-next-line react-refresh/only-export-components
export const TAG_OPTIONS = [
  { name: 'Backend', bg: 'bg-[#E8DFF5]', text: 'text-[#4A403A]', border: 'border-[#D5C6EB]' }, // Lavender
  { name: 'Study', bg: 'bg-[#D8E2DC]', text: 'text-[#4A403A]', border: 'border-[#B8C8BF]' },   // Sage Green
  { name: 'Daily', bg: 'bg-[#FFF3B0]', text: 'text-[#4A403A]', border: 'border-[#EAD98A]' },   // Butter Yellow
  { name: 'Urgent', bg: 'bg-[#FFE5D9]', text: 'text-[#4A403A]', border: 'border-[#F8C1AD]' },  // Peach
];

export default function TodoInput({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState('Backend');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side empty input validation
    if (!title.trim()) {
      toast.warning('Please write a task title first! ✍️');
      return;
    }

    /**
     * ==========================================================================
     * // [BACKEND SPOT] - Create To-Do Item
     * ==========================================================================
     * HTTP Method : POST
     * Endpoint    : /api/todos
     * Headers     :
     *   - Authorization: `Bearer ${localStorage.getItem('todo_auth_token')}`
     *   - Content-Type: `application/json`
     * Request Body (JSON) :
     *   {
     *     "title": title.trim(),
     *     "tag": selectedTag
     *   }
     * 
     * Node.js / Express Backend Flow:
     * 1. Route: `router.post('/todos', authMiddleware, todoController.createTodo);`
     * 2. Server validation:
     *    const { title, tag } = req.body;
     *    if (!title) return res.status(400).json({ error: 'Title is required' });
     * 3. Database document creation (Mongoose):
     *    const newTodo = await Todo.create({
     *      title,
     *      tag: tag || 'Daily',
     *      completed: false,
     *      user: req.user._id // extracted from verified JWT by authMiddleware
     *    });
     * 4. Response:
     *    res.status(201).json(newTodo);
     * ==========================================================================
     */

    onAddTodo({
      title: title.trim(),
      tag: selectedTag,
    });

    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-5 rounded-xl bg-[#FFFDF9] border border-[#EAE0D5] shadow-sm mb-6 relative overflow-hidden transition-all duration-200 hover:shadow-md"
    >
      {/* Decorative top ribbon accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFF3B0] via-[#D8E2DC] to-[#FFE5D9]" />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Task Input Box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write a new task in your notebook... (e.g., 'Master Express routing')"
            className="w-full pl-3.5 pr-4 py-2.5 text-sm sm:text-base bg-[#F7EFEA]/40 text-[#4A403A] placeholder-[#9E9289] rounded-lg border border-[#EAE0D5] focus:outline-none focus:ring-2 focus:ring-[#F4A298] focus:bg-[#FFFDF9] transition-all font-mono"
          />
        </div>

        {/* Add Task Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A403A] text-[#FFFDF9] hover:bg-[#382F2A] active:scale-95 text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
        >
          <FiPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Pastel Tag Selector */}
      <div className="mt-3.5 pt-3 border-t border-[#EAE0D5]/70 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#7A6E65] flex items-center gap-1.5 mr-1">
          <FiTag className="w-3.5 h-3.5 text-[#F4A298]" /> Tag:
        </span>
        {TAG_OPTIONS.map((tag) => {
          const isSelected = selectedTag === tag.name;
          return (
            <button
              key={tag.name}
              type="button"
              onClick={() => setSelectedTag(tag.name)}
              className={`
                text-xs font-medium px-3 py-1 rounded-full border transition-all cursor-pointer
                ${tag.bg} ${tag.text} ${tag.border}
                ${
                  isSelected
                    ? 'ring-2 ring-[#4A403A] shadow-xs font-bold scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-102'
                }
              `}
            >
              #{tag.name}
            </button>
          );
        })}
      </div>
    </form>
  );
}
