import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotebookLayout from '../layouts/NotebookLayout';
import TodoHomePage from '../pages/TodoHomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

/**
 * ==============================================================================
 * APPLICATION ROUTER (src/routes/AppRouter.jsx)
 * ==============================================================================
 * Configured using React Router's modern data router API: `createBrowserRouter`.
 * 
 * 🎓 JUNIOR DEVELOPER ARCHITECTURE GUIDE:
 * ------------------------------------------------------------------------------
 * In React Router v6.4+ / v7, `createBrowserRouter` allows declarative route
 * definition. Here, we use a single root layout route (<NotebookLayout />)
 * which provides the spiral notebook borders, paper texture, and top navigation
 * tabs to every page.
 * 
 * The <Outlet /> inside NotebookLayout dynamically renders whichever child
 * route matches the current URL path:
 * 
 *     NotebookLayout (Shared Spiral Notebook frame + Navbar)
 *     ├── /                  -> <TodoHomePage />
 *     ├── /login             -> <LoginPage />
 *     ├── /register          -> <RegisterPage />
 *     ├── /forgot-password   -> <ForgotPasswordPage />
 *     └── * (any other path) -> Redirects back to "/"
 * 
 * ==============================================================================
 * // [BACKEND SPOT] - Protected Routes & Express Auth Middleware Comparison
 * ==============================================================================
 * Frontend vs Backend Security Comparison:
 * 
 * 1. FRONTEND ROUTE PROTECTION:
 *    On the client side, you can check if `localStorage.getItem('todo_auth_token')`
 *    exists. If missing, you redirect the user to `/login`.
 *    (Note: Client-side route guarding is for UX only, not actual data security!)
 * 
 * 2. BACKEND ROUTE PROTECTION (Express.js):
 *    In your upcoming Node.js backend, real security happens inside Express middleware:
 * 
 *    ```javascript
 *    // middleware/auth.js
 *    const jwt = require('jsonwebtoken');
 * 
 *    const authMiddleware = (req, res, next) => {
 *      const authHeader = req.headers.authorization;
 *      if (!authHeader || !authHeader.startsWith('Bearer ')) {
 *        return res.status(401).json({ message: 'No authorization token provided' });
 *      }
 * 
 *      const token = authHeader.split(' ')[1];
 *      try {
 *        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 *        req.user = decoded; // attaches { id, email } to req object
 *        next(); // proceeds to controller
 *      } catch (err) {
 *        return res.status(403).json({ message: 'Token is invalid or expired' });
 *      }
 *    };
 * 
 *    // routes/todoRoutes.js
 *    router.get('/todos', authMiddleware, getTodos);
 *    router.post('/todos', authMiddleware, createTodo);
 *    router.patch('/todos/:id', authMiddleware, updateTodo);
 *    router.delete('/todos/:id', authMiddleware, deleteTodo);
 *    ```
 * ==============================================================================
 */

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NotebookLayout />,
    children: [
      {
        index: true,
        element: <TodoHomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        // 404 Catch-all: Fall back safely to homepage
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
