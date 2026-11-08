import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import router from './routes/AppRouter';
import './index.css';

/**
 * ==============================================================================
 * APPLICATION ENTRY POINT (src/main.jsx)
 * ==============================================================================
 * Mounts:
 * 1. <RouterProvider router={router} /> from React Router (createBrowserRouter)
 * 2. Global <ToastContainer /> from React-Toastify configured with cozy styling
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={2800}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="font-mono text-xs"
    />
  </StrictMode>
);
