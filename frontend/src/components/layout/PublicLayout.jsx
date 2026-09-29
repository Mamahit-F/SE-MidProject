import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar, PublicFooter } from './PublicNavbar';
import { DemoAccountBanner } from '../ui/DemoAccountBanner';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DemoAccountBanner />
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
