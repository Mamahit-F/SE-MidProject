import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileDrawer } from './MobileDrawer';
import { DemoAccountBanner } from '../ui/DemoAccountBanner';

export const AppLayout = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* SDLC Fast Switcher Top Banner */}
      <DemoAccountBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile, visible lg:) */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Slide-in Drawer */}
        <MobileDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Navbar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
