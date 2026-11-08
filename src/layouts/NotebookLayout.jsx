import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiBookOpen, FiTerminal, FiCoffee } from 'react-icons/fi';

/**
 * ==============================================================================
 * NOTEBOOK LAYOUT (src/layouts/NotebookLayout.jsx)
 * ==============================================================================
 * This is the master layout framing the entire application as a cozy physical
 * spiral notebook placed on a warm desk.
 * 
 * Features:
 * - Warm desk background (#F7EFEA)
 * - Cream notebook paper sheet (#FFFDF9)
 * - Left spiral binding rings with punched holes and metallic coils (on desktop)
 * - Raised pastel sticky-note navigation tabs along the top (Navbar)
 * - Red/coral vertical margin line (#F4A298)
 * - Subtle ruled lines (#EAE0D5)
 * - Nested route rendering via React Router's <Outlet />
 */
export default function NotebookLayout() {
  // Generate 16 spiral rings for the left binding edge
  const spiralRings = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-[#F7EFEA] py-6 sm:py-10 px-2 sm:px-6 md:px-10 flex flex-col items-center justify-start text-[#4A403A] font-mono selection:bg-[#FFF3B0] selection:text-[#4A403A]">
      
      {/* Top Desk Branding / Helper Header */}
      <header className="w-full max-w-4xl mb-4 sm:mb-6 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#7A6E65]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-md bg-[#FFF3B0] border border-[#EAD98A] shadow-xs text-[#4A403A]">
            <FiBookOpen className="w-4 h-4" />
          </span>
          <span className="font-semibold text-sm text-[#4A403A]">
            Node.js Backend Dev Log
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-[#D8E2DC] text-[#4A403A] font-medium">
            Class 5 • REST API
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#7A6E65]">
            <FiTerminal className="w-3.5 h-3.5 text-[#F4A298]" />
            <span>Ready for Express Backend</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-[#9E9289]">
            <FiCoffee className="w-3.5 h-3.5" />
            <span>Cozy Mode</span>
          </span>
        </div>
      </header>

      {/* Main Physical Spiral Notebook Frame */}
      <div className="w-full max-w-4xl relative">
        
        {/* Sticky Tabs protruding from the top edge */}
        <Navbar />

        {/* Notebook Cover / Paper Base */}
        <div className="relative bg-[#FFFDF9] rounded-2xl rounded-tl-none border-2 border-[#EAE0D5] notebook-shadow overflow-hidden min-h-[640px] flex">
          
          {/* ================================================================ */}
          {/* DESKTOP SPIRAL BINDING SPINE (Left Edge) */}
          {/* ================================================================ */}
          <aside
            aria-label="Spiral Binding"
            className="hidden md:flex flex-col justify-around items-center w-14 py-8 bg-gradient-to-r from-[#F0E6DE] via-[#F7EFEA] to-[#EAE0D5] border-r border-[#EAE0D5] relative flex-shrink-0 z-10 shadow-inner"
          >
            {spiralRings.map((ring) => (
              <div key={ring} className="relative flex items-center justify-center my-1 group">
                {/* Punched hole in paper */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#4A403A]/25 shadow-inner border border-[#4A403A]/30" />
                
                {/* 3D Metallic Ring Coil */}
                <div
                  className="absolute -left-2 w-7 h-3 rounded-full bg-gradient-to-r from-[#8C827A] via-[#EAE0D5] to-[#736860] shadow-sm transform -rotate-6 border border-[#5C534D]/40 pointer-events-none"
                  style={{
                    boxShadow: '0 2px 3px rgba(74, 64, 58, 0.35), inset 0 1px 0 rgba(255,255,255,0.7)',
                  }}
                />
              </div>
            ))}
          </aside>

          {/* ================================================================ */}
          {/* NOTEBOOK PAGE CONTENT (Ruled paper background) */}
          {/* ================================================================ */}
          <main className="flex-1 p-4 sm:p-8 notebook-ruled-bg relative flex flex-col justify-between">
            
            {/* Red / Coral Vertical Margin Line (Like real school / lab notebook) */}
            <div className="hidden sm:block absolute top-0 bottom-0 left-12 w-[2px] bg-[#F4A298]/60 pointer-events-none z-0" />

            {/* Notebook Content Container (indented to respect margin line on tablet/desktop) */}
            <div className="relative z-10 sm:pl-8 sm:pr-2 flex-1 flex flex-col">
              {/* Top Page Sub-Header */}
              <div className="pb-4 mb-4 border-b border-[#EAE0D5] flex items-center justify-between text-xs text-[#7A6E65]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F4A298]" />
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-[#4A403A]">
                    Subject: Fullstack To-Do Application
                  </span>
                </div>
                <div className="text-[11px] text-[#9E9289]">
                  Date: <span className="underline decoration-[#F4A298] underline-offset-2 font-medium text-[#4A403A]">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Nested Route Outlet */}
              <div className="flex-1">
                <Outlet />
              </div>
            </div>

            {/* Notebook Bottom Page Number & Footer */}
            <footer className="mt-8 pt-4 border-t border-[#EAE0D5] text-[11px] text-[#9E9289] flex flex-wrap items-center justify-between gap-2 relative z-10 sm:pl-8">
              <span>📓 Class-5 NodeJS Homework &bull; Creative IT Institute</span>
              <span className="font-mono text-[#7A6E65]">Page &bull; 01</span>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
