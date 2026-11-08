import { NavLink, useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiLogIn, FiUserPlus, FiHelpCircle, FiLogOut, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

/**
 * ==============================================================================
 * NAVBAR COMPONENT (src/components/Navbar.jsx)
 * ==============================================================================
 * Styled as physical pastel sticky index tabs protruding from the top edge
 * of the spiral notebook paper.
 * 
 * Uses React Router's <NavLink> to provide active state styling.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const currentUserRaw = localStorage.getItem('todo_current_user');
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem('todo_auth_token');
    localStorage.removeItem('todo_current_user');
    toast.info('Logged out from notebook session 📖');
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      label: 'To-Do Tasks',
      icon: <FiCheckSquare className="w-4 h-4" />,
      color: 'bg-[#FFF3B0] text-[#4A403A]', // Butter Yellow
      activeBorder: 'border-b-[#FFFDF9]',
      tabId: 'tasks',
    },
    {
      to: '/login',
      label: 'Login',
      icon: <FiLogIn className="w-4 h-4" />,
      color: 'bg-[#D8E2DC] text-[#4A403A]', // Sage Green
      activeBorder: 'border-b-[#FFFDF9]',
      tabId: 'login',
    },
    {
      to: '/register',
      label: 'Register',
      icon: <FiUserPlus className="w-4 h-4" />,
      color: 'bg-[#FFE5D9] text-[#4A403A]', // Peach
      activeBorder: 'border-b-[#FFFDF9]',
      tabId: 'register',
    },
    {
      to: '/forgot-password',
      label: 'Forgot Pass',
      icon: <FiHelpCircle className="w-4 h-4" />,
      color: 'bg-[#E8DFF5] text-[#4A403A]', // Lavender
      activeBorder: 'border-b-[#FFFDF9]',
      tabId: 'forgot',
    },
  ];

  return (
    <nav className="w-full pt-4 px-4 sm:px-8 flex flex-wrap items-end justify-between gap-3 border-b border-[#EAE0D5] relative z-20">
      {/* Sticky Tabs */}
      <div className="flex flex-wrap items-end gap-1.5 sm:gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `
              relative flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3
              text-xs sm:text-sm font-semibold rounded-t-lg transition-all duration-200
              border-t-2 border-l-2 border-r-2 border-[#4A403A]/15
              shadow-sm
              ${item.color}
              ${
                isActive
                  ? 'translate-y-[1px] shadow-md border-b-2 border-b-[#FFFDF9] z-30 font-bold scale-[1.02] ring-1 ring-[#4A403A]/20'
                  : 'opacity-85 hover:opacity-100 hover:-translate-y-1 z-10'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Status / Quick Logout Pill */}
      {currentUser && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-full bg-[#FFFDF9] border border-[#EAE0D5] shadow-xs text-xs text-[#4A403A]">
          <FiUser className="w-3.5 h-3.5 text-[#F4A298]" />
          <span className="font-medium truncate max-w-[120px]">{currentUser.name}</span>
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-1 p-1 hover:text-red-500 rounded transition-colors"
          >
            <FiLogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </nav>
  );
}
