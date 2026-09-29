import React from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const MobileDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-slide-up">
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar onCloseMobile={onClose} />
      </div>
    </div>
  );
};
