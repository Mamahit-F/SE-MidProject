import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar, PublicFooter } from './PublicNavbar';
export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
