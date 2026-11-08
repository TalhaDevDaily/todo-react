import { useState } from 'react';
import {
  FiCheckCircle,
  FiCircle,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
  FiClock,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { TAG_OPTIONS } from './TodoInput';

/**
 * ==============================================================================
 * TO-DO ITEM COMPONENT (src/components/TodoItem.jsx)
 * ==============================================================================
 * Represents a single ruled row on the notebook page. Features:
 * - Toggle complete / done with check circle icon
 * - Inline edit mode with title input, tag selector, Save and Cancel icons
 * - Delete task icon button
 * - Detailed // [BACKEND SPOT] documentation for PATCH and DELETE endpoints
 */
export default function TodoItem({ todo, onToggleComplete, onEditTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editTag, setEditTag] = useState(todo.tag);

  // Find pastel colors for current tag
  const tagConfig =
    TAG_OPTIONS.find((t) => t.name.toLowerCase() === (todo.tag || '').toLowerCase()) ||
    TAG_OPTIONS[0];

  // Handle saving the inline edit
  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      toast.warning('Task title cannot be empty!');
      return;
    }

    /**
     * ==========================================================================
     * // [BACKEND SPOT] - Inline Edit / Update Task
     * ==========================================================================
     * HTTP Method : PATCH (or PUT)
     * Endpoint    : /api/todos/:id (e.g. /api/todos/65ecba1234)
     * Headers     :
     *   - Authorization: `Bearer ${localStorage.getItem('todo_auth_token')}`
     *   - Content-Type: `application/json`
     * Request Body:
     *   {
     *     "title": editTitle.trim(),
     *     "tag": editTag
     *   }
     * 
     * Node.js / Express Backend Flow:
     * 1. Route: `router.patch('/todos/:id', authMiddleware, todoController.updateTodo);`
     * 2. Controller retrieves ID:
     *    const { id } = req.params;
     *    const { title, tag } = req.body;
     * 3. Database operation:
     *    const updatedTodo = await Todo.findOneAndUpdate(
     *      { _id: id, user: req.user._id },
     *      { $set: { title, tag } },
     *      { new: true, runValidators: true }
     *    );
     *    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
     *    res.status(200).json(updatedTodo);
     * ==========================================================================
     */
    onEditTodo(todo.id, {
      title: editTitle.trim(),
      tag: editTag,
    });

    setIsEditing(false);
    toast.success('Task updated in your notebook! ✏️');
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditTag(todo.tag);
    setIsEditing(false);
    toast.info('Edit cancelled');
  };

  // Handle toggling complete status
  const handleToggle = () => {
    /**
     * ==========================================================================
     * // [BACKEND SPOT] - Toggle Done Status
     * ==========================================================================
     * HTTP Method : PATCH
     * Endpoint    : /api/todos/:id/toggle (or /api/todos/:id)
     * Request Body: { "completed": !todo.completed }
     * 
     * Node.js / Express Backend Flow:
     * const updated = await Todo.findOneAndUpdate(
     *   { _id: req.params.id, user: req.user._id },
     *   { $set: { completed: !todo.completed } },
     *   { new: true }
     * );
     * ==========================================================================
     */
    onToggleComplete(todo.id);
    if (!todo.completed) {
      toast.success('Task marked as completed! 🎉');
    } else {
      toast.info('Task moved back to active 📝');
    }
  };

  // Handle deleting a task
  const handleDelete = () => {
    /**
     * ==========================================================================
     * // [BACKEND SPOT] - Delete Task
     * ==========================================================================
     * HTTP Method : DELETE
     * Endpoint    : /api/todos/:id (e.g. /api/todos/65ecba1234)
     * Headers     :
     *   - Authorization: `Bearer ${localStorage.getItem('todo_auth_token')}`
     * 
     * Node.js / Express Backend Flow:
     * 1. Route: `router.delete('/todos/:id', authMiddleware, todoController.deleteTodo);`
     * 2. Controller:
     *    const deleted = await Todo.findOneAndDelete({
     *      _id: req.params.id,
     *      user: req.user._id
     *    });
     *    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
     *    res.status(200).json({ message: 'Todo deleted successfully' });
     * ==========================================================================
     */
    onDeleteTodo(todo.id);
    toast.error('Task erased from notebook 🗑️');
  };

  return (
    <div
      className={`
        group relative py-3.5 px-3 sm:px-4 rounded-lg transition-all duration-200
        border-b border-[#EAE0D5]
        flex flex-col sm:flex-row sm:items-center justify-between gap-3
        ${
          todo.completed
            ? 'bg-[#EAE0D5]/20 opacity-75'
            : 'hover:bg-[#FFF3B0]/15'
        }
      `}
    >
      {/* Left side: Checkbox & Title (or inline edit input) */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        {/* Done / Complete Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
          className="mt-0.5 sm:mt-0 text-[#4A403A] hover:text-[#84A98C] transition-colors cursor-pointer flex-shrink-0"
        >
          {todo.completed ? (
            <FiCheckCircle className="w-5 h-5 text-[#84A98C] fill-[#84A98C]/20" />
          ) : (
            <FiCircle className="w-5 h-5 text-[#7A6E65] hover:text-[#84A98C]" />
          )}
        </button>

        {/* Normal Mode vs Inline Edit Mode */}
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-sm bg-white border border-[#EAE0D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A298] font-mono text-[#4A403A]"
              autoFocus
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => setEditTag(tag.name)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${tag.bg} ${tag.text} ${tag.border} ${
                    editTag === tag.name ? 'ring-2 ring-[#4A403A] font-bold' : 'opacity-70'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
            <span
              className={`text-sm sm:text-base break-words font-mono ${
                todo.completed
                  ? 'line-through text-[#9E9289]'
                  : 'text-[#4A403A] font-medium'
              }`}
            >
              {todo.title}
            </span>

            {/* Tag Badge */}
            <span
              className={`inline-block self-start sm:self-auto text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tagConfig.bg} ${tagConfig.text} ${tagConfig.border} flex-shrink-0 shadow-2xs`}
            >
              #{todo.tag}
            </span>
          </div>
        )}
      </div>

      {/* Right side: Action Buttons & Timestamp */}
      <div className="flex items-center justify-between sm:justify-end gap-2 text-xs flex-shrink-0">
        {/* Timestamp */}
        {todo.createdAt && (
          <span className="flex items-center gap-1 text-[11px] text-[#9E9289]">
            <FiClock className="w-3 h-3" />
            <span>{todo.createdAt}</span>
          </span>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              {/* Save Edit Button */}
              <button
                type="button"
                onClick={handleSaveEdit}
                title="Save changes"
                className="p-1.5 rounded-md bg-[#D8E2DC] text-[#4A403A] hover:bg-[#84A98C] hover:text-white transition-colors cursor-pointer"
              >
                <FiCheck className="w-4 h-4 stroke-[2.5]" />
              </button>
              {/* Cancel Edit Button */}
              <button
                type="button"
                onClick={handleCancelEdit}
                title="Cancel editing"
                className="p-1.5 rounded-md bg-[#FFE5D9] text-[#4A403A] hover:bg-[#F4A298] hover:text-white transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4 stroke-[2.5]" />
              </button>
            </>
          ) : (
            <>
              {/* Edit Button */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit task"
                className="p-1.5 rounded-md text-[#7A6E65] hover:text-[#4A403A] hover:bg-[#FFF3B0] transition-all cursor-pointer"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                title="Delete task"
                className="p-1.5 rounded-md text-[#7A6E65] hover:text-[#F4A298] hover:bg-[#FFE5D9] transition-all cursor-pointer"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
